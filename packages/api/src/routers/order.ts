import type { Database, Prisma } from "@senara/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const BASE_PUBLISH_PRICE = 29000;

export const ADDON_CATALOG = {
  STATS: {
    id: "STATS",
    name: "Statistik Tamu Per-Individu",
    price: 5000,
  },
  PRIVATE_MODE: {
    id: "PRIVATE_MODE",
    name: "Mode Privat & Kunci Perangkat HP",
    price: 15000,
  },
} as const;

export type AddonKey = keyof typeof ADDON_CATALOG;

const BUILTIN_PROMOS: Record<
  string,
  {
    description: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minOrderAmount: number;
  }
> = {
  HEMAT10: {
    description: "Diskon 10% Spesial Pernikahan",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 20000,
  },
  SENARA10: {
    description: "Potongan Langsung Rp 10.000",
    discountType: "FIXED",
    discountValue: 10000,
    minOrderAmount: 29000,
  },
  SENARABUNDLE: {
    description: "Promo Bundling Add-On Rp 5.000",
    discountType: "FIXED",
    discountValue: 5000,
    minOrderAmount: 15000,
  },
};

async function computeCouponDiscount(
  db: Database,
  rawCode: string,
  subtotal: number
): Promise<{
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
  fromDbId: string | null;
}> {
  const code = rawCode.trim().toUpperCase();
  const dbCoupon = await db.coupon.findUnique({
    where: { code },
  });

  if (dbCoupon) {
    if (!dbCoupon.isActive) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Kode promo ini sudah tidak aktif.",
      });
    }
    if (dbCoupon.expiresAt && new Date(dbCoupon.expiresAt) < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Kode promo ini sudah melewati masa berlaku.",
      });
    }
    if (dbCoupon.maxUses !== null && dbCoupon.usedCount >= dbCoupon.maxUses) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Kuota pemakaian kode promo ini sudah habis.",
      });
    }
    const minOrder = Number(dbCoupon.minOrderAmount);
    if (subtotal < minOrder) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Kode promo "${code}" membutuhkan minimum transaksi Rp ${minOrder.toLocaleString("id-ID")}.`,
      });
    }

    const discountValue = Number(dbCoupon.discountValue);
    const rawDiscount =
      dbCoupon.discountType === "PERCENTAGE"
        ? Math.round((subtotal * discountValue) / 100)
        : discountValue;
    const discountAmount = Math.min(subtotal, Math.max(0, rawDiscount));

    return {
      code,
      description: dbCoupon.description || `Promo ${code}`,
      discountType: dbCoupon.discountType,
      discountValue,
      discountAmount,
      fromDbId: dbCoupon.id,
    };
  }

  const builtin = BUILTIN_PROMOS[code];
  if (!builtin) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Kode promo "${code}" tidak ditemukan. Coba gunakan HEMAT10 atau SENARA15.`,
    });
  }

  if (subtotal < builtin.minOrderAmount) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Kode promo "${code}" membutuhkan minimum transaksi Rp ${builtin.minOrderAmount.toLocaleString("id-ID")}.`,
    });
  }

  const rawDiscount =
    builtin.discountType === "PERCENTAGE"
      ? Math.round((subtotal * builtin.discountValue) / 100)
      : builtin.discountValue;
  const discountAmount = Math.min(subtotal, Math.max(0, rawDiscount));

  return {
    code,
    description: builtin.description,
    discountType: builtin.discountType,
    discountValue: builtin.discountValue,
    discountAmount,
    fromDbId: null,
  };
}

export const orderRouter = router({
  validateCoupon: protectedProcedure
    .input(
      z.object({
        code: z.string().min(1),
        subtotal: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await computeCouponDiscount(
        ctx.db,
        input.code,
        input.subtotal
      );

      return {
        valid: true,
        code: result.code,
        description: result.description,
        discountType: result.discountType,
        discountValue: result.discountValue,
        discountAmount: result.discountAmount,
        finalAmount: Math.max(0, input.subtotal - result.discountAmount),
      };
    }),

  createOrder: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        tier: z.enum(["FREE", "PREMIUM"]).default("PREMIUM"),
        includeBasePublish: z.boolean().default(true),
        addons: z
          .array(z.enum(["STATS", "PRIVATE_MODE"]))
          .default([]),
        couponCode: z.string().optional(),
        paymentMethod: z.enum(["QRIS", "MANUAL_TRANSFER"]).default("QRIS"),
        proofImageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
        select: {
          id: true,
          title: true,
          packageTier: true,
          enabledAddons: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }

      const uniqueAddons = Array.from(new Set(input.addons));
      const addonsTotal = uniqueAddons.reduce(
        (acc, key) => acc + ADDON_CATALOG[key].price,
        0
      );
      const baseAmount =
        input.includeBasePublish && input.tier === "PREMIUM"
          ? BASE_PUBLISH_PRICE
          : 0;
      const subtotal = baseAmount + addonsTotal;

      let discountAmount = 0;
      let appliedCouponCode: string | null = null;
      let dbCouponId: string | null = null;

      if (input.couponCode && input.couponCode.trim().length > 0 && subtotal > 0) {
        const couponRes = await computeCouponDiscount(
          ctx.db,
          input.couponCode,
          subtotal
        );
        discountAmount = couponRes.discountAmount;
        appliedCouponCode = couponRes.code;
        dbCouponId = couponRes.fromDbId;
      }

      const finalAmount = Math.max(0, subtotal - discountAmount);
      const orderNumber = `INV-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const isInstantFree = finalAmount === 0;
      const gateway =
        input.paymentMethod === "QRIS" ? "MIDTRANS" : "MANUAL_TRANSFER";
      const paymentType =
        input.paymentMethod === "QRIS" ? "qris" : "bank_transfer";

      const order = await ctx.db.order.create({
        data: {
          orderNumber,
          userId: ctx.auth.userId,
          invitationId: input.invitationId,
          tier: input.tier,
          amount: finalAmount,
          discountAmount,
          couponCode: appliedCouponCode,
          addons: uniqueAddons as unknown as Prisma.InputJsonValue,
          status: isInstantFree ? "PAID" : "PENDING",
          payment: {
            create: {
              gateway,
              paymentType,
              paymentStatus: isInstantFree
                ? "settlement"
                : input.proofImageUrl
                  ? "waiting_verification"
                  : "pending",
              proofImageUrl: input.proofImageUrl || null,
              paidAt: isInstantFree ? new Date() : null,
            },
          },
        },
        include: {
          payment: true,
        },
      });

      if (dbCouponId) {
        await ctx.db.coupon.update({
          where: { id: dbCouponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      if (isInstantFree) {
        const existingAddons = Array.isArray(invitation.enabledAddons)
          ? (invitation.enabledAddons as string[])
          : [];
        const mergedAddons = Array.from(
          new Set([...existingAddons, ...uniqueAddons])
        );
        await ctx.db.invitation.update({
          where: { id: invitation.id },
          data: {
            packageTier: "PREMIUM",
            status: "PUBLISHED",
            publishedAt: new Date(),
            enabledAddons: mergedAddons as unknown as Prisma.InputJsonValue,
            ...(mergedAddons.includes("PRIVATE_MODE")
              ? { isPrivateMode: true }
              : {}),
          },
        });
      }

      const snapToken = `SNAP-TOKEN-${order.id.slice(0, 8)}`;
      const redirectUrl = `https://app.midtrans.com/snap/v2/vtweb/${snapToken}`;

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        subtotal,
        discountAmount,
        amount: Number(order.amount),
        tier: order.tier,
        addons: uniqueAddons,
        paymentMethod: input.paymentMethod,
        status: order.status,
        snapToken,
        redirectUrl,
      };
    }),

  uploadPaymentProof: protectedProcedure
    .input(
      z.object({
        orderId: z.string().min(1),
        proofImageUrl: z.string().min(5, "Bukti transfer tidak boleh kosong"),
        senderNote: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          id: input.orderId,
          userId: ctx.auth.userId,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pesanan tidak ditemukan.",
        });
      }

      const updated = await ctx.db.paymentTransaction.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          gateway: "MANUAL_TRANSFER",
          paymentType: "bank_transfer",
          paymentStatus: "waiting_verification",
          proofImageUrl: input.proofImageUrl,
          adminNote: input.senderNote || "Menunggu verifikasi bukti transfer",
        },
        update: {
          gateway: "MANUAL_TRANSFER",
          paymentType: "bank_transfer",
          paymentStatus: "waiting_verification",
          proofImageUrl: input.proofImageUrl,
          ...(input.senderNote ? { adminNote: input.senderNote } : {}),
        },
      });

      return {
        orderId: order.id,
        paymentStatus: updated.paymentStatus,
        proofImageUrl: updated.proofImageUrl,
      };
    }),

  checkPaymentStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string().min(1),
        simulateSettlement: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          id: input.orderId,
          userId: ctx.auth.userId,
        },
        include: {
          payment: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pesanan tidak ditemukan.",
        });
      }

      if (order.status === "PAID") {
        return {
          orderId: order.id,
          status: "PAID" as const,
          message: "Pembayaran telah terkonfirmasi Lunas.",
        };
      }

      // Jika metode QRIS dan disimulasikan settlement / webhook diterima
      if (
        input.simulateSettlement &&
        order.payment?.gateway !== "MANUAL_TRANSFER"
      ) {
        await ctx.db.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            payment: {
              upsert: {
                create: {
                  gateway: "MIDTRANS",
                  paymentType: "qris",
                  paymentStatus: "settlement",
                  paidAt: new Date(),
                },
                update: {
                  paymentStatus: "settlement",
                  paidAt: new Date(),
                },
              },
            },
          },
        });

        if (order.invitationId) {
          const inv = await ctx.db.invitation.findUnique({
            where: { id: order.invitationId },
            select: { enabledAddons: true },
          });
          const currentAddons = Array.isArray(inv?.enabledAddons)
            ? (inv.enabledAddons as string[])
            : [];
          const orderAddons = Array.isArray(order.addons)
            ? (order.addons as string[])
            : [];
          const mergedAddons = Array.from(
            new Set([...currentAddons, ...orderAddons])
          );

          await ctx.db.invitation.update({
            where: { id: order.invitationId },
            data: {
              packageTier: "PREMIUM",
              status: "PUBLISHED",
              publishedAt: new Date(),
              enabledAddons: mergedAddons as unknown as Prisma.InputJsonValue,
              ...(mergedAddons.includes("PRIVATE_MODE")
                ? { isPrivateMode: true }
                : {}),
            },
          });
        }

        return {
          orderId: order.id,
          status: "PAID" as const,
          message:
            "Pembayaran QRIS berhasil diverifikasi! Undangan & Add-On Anda kini aktif.",
        };
      }

      return {
        orderId: order.id,
        status: order.status,
        message:
          order.payment?.gateway === "MANUAL_TRANSFER"
            ? "Bukti transfer Anda sedang dalam antrean verifikasi Super Admin."
            : "Menunggu pembayaran QRIS diselesaikan.",
      };
    }),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      include: {
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      invitationId: order.invitationId,
      tier: order.tier,
      amount: Number(order.amount),
      discountAmount: Number(order.discountAmount),
      couponCode: order.couponCode,
      addons: Array.isArray(order.addons)
        ? (order.addons as string[])
        : [],
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      payment: order.payment
        ? {
            id: order.payment.id,
            gateway: order.payment.gateway,
            paymentType: order.payment.paymentType,
            paymentStatus: order.payment.paymentStatus,
            proofImageUrl: order.payment.proofImageUrl,
            adminNote: order.payment.adminNote,
            paidAt: order.payment.paidAt,
          }
        : null,
    }));
  }),
});
