import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  normalizeClerkRole,
  protectedProcedure,
  router,
  type AppRole,
} from "../trpc";

export const adminRouter = router({
  // Cek status role pengguna saat ini (USER | RESELLER | ADMIN | SUPERADMIN)
  checkAccess: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    const clerkDbRole = normalizeClerkRole(
      ctx.auth.sessionClaims?.metadata?.role
    );

    let user = await ctx.db.user.findUnique({
      where: { id: userId },
    });

    const adminCount = await ctx.db.user.count({
      where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
    });

    if (!user) {
      const initialRole: AppRole =
        clerkDbRole ?? (adminCount === 0 ? "SUPERADMIN" : "USER");
      user = await ctx.db.user.create({
        data: {
          id: userId,
          email: `${userId}@user.senara.local`,
          name: "Pengguna Senara",
          role: initialRole,
        },
      });
    } else if (clerkDbRole && user.role !== clerkDbRole) {
      user = await ctx.db.user.update({
        where: { id: userId },
        data: { role: clerkDbRole },
      });
    } else if (
      user.role !== "ADMIN" &&
      user.role !== "SUPERADMIN" &&
      adminCount === 0
    ) {
      user = await ctx.db.user.update({
        where: { id: userId },
        data: { role: "SUPERADMIN" },
      });
    }

    const effectiveRole: AppRole = clerkDbRole ?? user.role;

    return {
      isAdmin: effectiveRole === "ADMIN" || effectiveRole === "SUPERADMIN",
      isSuperAdmin: effectiveRole === "SUPERADMIN",
      isReseller: effectiveRole === "RESELLER",
      role: effectiveRole,
      clerkRole: ctx.auth.sessionClaims?.metadata?.role ?? null,
      creditBalance: user.creditBalance,
      resellerBrandName: user.resellerBrandName,
    };
  }),

  // 10.2 — Dashboard Metrik Global Super Admin
  getDashboardMetrics: adminProcedure.query(async ({ ctx }) => {
    const [
      totalUsers,
      totalTemplates,
      activeTemplates,
      invitations,
      orders,
      totalGuests,
      totalRsvps,
      totalCoupons,
    ] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.template.count(),
      ctx.db.template.count({ where: { isActive: true } }),
      ctx.db.invitation.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          packageTier: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          template: {
            select: {
              name: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      ctx.db.order.findMany({
        select: {
          id: true,
          orderNumber: true,
          userId: true,
          tier: true,
          amount: true,
          discountAmount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      ctx.db.guest.count(),
      ctx.db.rSVPResponse.count(),
      ctx.db.coupon.count({ where: { isActive: true } }),
    ]);

    const totalInvitations = invitations.length;
    const publishedCount = invitations.filter((i) => i.status === "PUBLISHED").length;
    const draftCount = invitations.filter((i) => i.status === "DRAFT").length;
    const premiumCount = invitations.filter((i) => i.packageTier === "PREMIUM").length;

    const paidOrders = orders.filter((o) => o.status === "PAID");
    const pendingOrders = orders.filter((o) => o.status === "PENDING");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.amount), 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = paidOrders
      .filter((o) => new Date(o.createdAt) >= startOfMonth)
      .reduce((sum, o) => sum + Number(o.amount), 0);

    const conversionRate =
      totalInvitations > 0
        ? Math.round((publishedCount / totalInvitations) * 100)
        : 0;

    return {
      totalUsers,
      totalTemplates,
      activeTemplates,
      totalInvitations,
      publishedCount,
      draftCount,
      premiumCount,
      totalGuests,
      totalRsvps,
      totalCoupons,
      totalOrders: orders.length,
      paidOrdersCount: paidOrders.length,
      pendingOrdersCount: pendingOrders.length,
      totalRevenue,
      monthlyRevenue,
      conversionRate,
      recentOrders: orders.slice(0, 8).map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        userId: o.userId,
        tier: o.tier,
        amount: Number(o.amount),
        discountAmount: Number(o.discountAmount),
        status: o.status,
        createdAt: o.createdAt,
        user: o.user,
      })),
      recentInvitations: invitations.slice(0, 6).map((inv) => ({
        id: inv.id,
        title: inv.title,
        slug: inv.slug,
        status: inv.status,
        packageTier: inv.packageTier,
        createdAt: inv.createdAt,
        user: inv.user,
        template: inv.template,
      })),
    };
  }),

  // 10.3 — Master Template & Kategori Manager
  listTemplates: adminProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.template.findMany({
      include: {
        _count: {
          select: {
            invitations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return templates.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      category: t.category as "WEDDING" | "BIRTHDAY" | "KHITANAN",
      thumbnail: t.thumbnail,
      previewUrl: t.previewUrl,
      isPremium: t.isPremium,
      price: Number(t.price),
      isActive: t.isActive,
      tags: Array.isArray(t.tags)
        ? t.tags.filter((item): item is string => typeof item === "string")
        : [],
      createdAt: t.createdAt,
      _count: {
        invitations: t._count.invitations,
      },
    }));
  }),

  upsertTemplate: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        slug: z
          .string()
          .min(2)
          .max(60)
          .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
        name: z.string().min(2).max(100),
        category: z.enum(["WEDDING", "BIRTHDAY", "KHITANAN"]),
        thumbnail: z.string().url("URL thumbnail harus valid"),
        previewUrl: z.string().optional(),
        isPremium: z.boolean().default(false),
        price: z.number().min(0).default(29000),
        isActive: z.boolean().default(true),
        tags: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const defaultSections = [
        { sectionKey: "hero", title: "Sampul", sortOrder: 0, isVisible: true, isLocked: true },
        { sectionKey: "quote", title: "Kutipan & Doa", sortOrder: 1, isVisible: true, isLocked: false },
        { sectionKey: "couple", title: "Profil Utama", sortOrder: 2, isVisible: true, isLocked: true },
        { sectionKey: "event", title: "Rangkaian Acara", sortOrder: 3, isVisible: true, isLocked: false },
        { sectionKey: "love-story", title: "Perjalanan Cerita", sortOrder: 4, isVisible: true, isLocked: false },
        { sectionKey: "gallery", title: "Galeri Foto", sortOrder: 5, isVisible: true, isLocked: false },
        { sectionKey: "gift", title: "Tanda Kasih", sortOrder: 6, isVisible: true, isLocked: false },
        { sectionKey: "rsvp", title: "Buku Tamu & RSVP", sortOrder: 7, isVisible: true, isLocked: false },
        { sectionKey: "closing", title: "Penutup", sortOrder: 8, isVisible: true, isLocked: true },
      ];

      if (input.id) {
        const updated = await ctx.db.template.update({
          where: { id: input.id },
          data: {
            slug: input.slug,
            name: input.name,
            category: input.category,
            thumbnail: input.thumbnail,
            previewUrl: input.previewUrl || `/preview/${input.slug}`,
            isPremium: input.isPremium,
            price: input.price,
            isActive: input.isActive,
            tags: input.tags,
          },
        });
        return { id: updated.id, slug: updated.slug };
      }

      const created = await ctx.db.template.create({
        data: {
          slug: input.slug,
          name: input.name,
          category: input.category,
          thumbnail: input.thumbnail,
          previewUrl: input.previewUrl || `/preview/${input.slug}`,
          isPremium: input.isPremium,
          price: input.price,
          isActive: input.isActive,
          tags: input.tags,
          defaultSections,
        },
      });
      return { id: created.id, slug: created.slug };
    }),

  toggleTemplateActive: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.template.update({
        where: { id: input.id },
        data: { isActive: input.isActive },
      });
      return { id: updated.id, isActive: updated.isActive };
    }),

  deleteTemplate: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const usedCount = await ctx.db.invitation.count({
        where: { templateId: input.id },
      });
      if (usedCount > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Template ini sedang dipakai oleh ${usedCount} undangan. Nonaktifkan saja statusnya agar tidak merusak undangan pengguna.`,
        });
      }
      await ctx.db.template.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // 10.4 — Manajemen Transaksi & Verifikasi Bukti Transfer
  listOrders: adminProcedure
    .input(
      z
        .object({
          status: z.enum(["ALL", "PENDING", "PAID", "FAILED", "EXPIRED", "REFUNDED"]).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const statusFilter =
        input?.status && input.status !== "ALL" ? input.status : undefined;

      const orders = await ctx.db.order.findMany({
        where: statusFilter ? { status: statusFilter } : undefined,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        invoiceNumber: o.orderNumber,
        userId: o.userId,
        invitationId: o.invitationId,
        tier: o.tier,
        packageTier: o.tier,
        amount: Number(o.amount),
        couponCode: o.couponCode,
        discountAmount: Number(o.discountAmount),
        status: o.status,
        createdAt: o.createdAt,
        user: o.user,
        payment: o.payment
          ? {
              id: o.payment.id,
              gateway: o.payment.gateway,
              paymentType: o.payment.paymentType,
              paymentStatus: o.payment.paymentStatus,
              proofImageUrl: o.payment.proofImageUrl,
              adminNote: o.payment.adminNote,
              paidAt: o.payment.paidAt,
            }
          : null,
      }));
    }),

  reviewOrderPayment: adminProcedure
    .input(
      z.object({
        orderId: z.string().min(1),
        action: z.enum(["APPROVE", "REJECT"]),
        adminNote: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
        include: { payment: true },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pesanan tidak ditemukan.",
        });
      }

      const newStatus = input.action === "APPROVE" ? "PAID" : "FAILED";

      const updatedOrder = await ctx.db.order.update({
        where: { id: order.id },
        data: {
          status: newStatus,
          payment: {
            upsert: {
              create: {
                gateway: "MANUAL_TRANSFER",
                paymentType: "bank_transfer",
                paymentStatus: input.action === "APPROVE" ? "settlement" : "deny",
                adminNote: input.adminNote,
                paidAt: input.action === "APPROVE" ? new Date() : null,
              },
              update: {
                paymentStatus: input.action === "APPROVE" ? "settlement" : "deny",
                adminNote: input.adminNote,
                paidAt: input.action === "APPROVE" ? new Date() : null,
              },
            },
          },
        },
      });

      // Jika disetujui (APPROVE), otomatis upgrade undangan milik user menjadi PREMIUM & PUBLISHED beserta Add-On
      if (input.action === "APPROVE") {
        const orderAddons = Array.isArray(order.addons)
          ? (order.addons as string[])
          : [];
        const targetInvitation = order.invitationId
          ? await ctx.db.invitation.findUnique({
              where: { id: order.invitationId },
              select: { id: true, enabledAddons: true },
            })
          : await ctx.db.invitation.findFirst({
              where: { userId: order.userId },
              orderBy: { updatedAt: "desc" },
              select: { id: true, enabledAddons: true },
            });

        if (targetInvitation) {
          const currentAddons = Array.isArray(targetInvitation.enabledAddons)
            ? (targetInvitation.enabledAddons as string[])
            : [];
          const mergedAddons = Array.from(
            new Set([...currentAddons, ...orderAddons])
          );

          await ctx.db.invitation.update({
            where: { id: targetInvitation.id },
            data: {
              packageTier: "PREMIUM",
              status: "PUBLISHED",
              publishedAt: new Date(),
              enabledAddons: mergedAddons,
              ...(mergedAddons.includes("PRIVATE_MODE")
                ? { isPrivateMode: true }
                : {}),
            },
          });
        }
      }

      return { id: updatedOrder.id, status: updatedOrder.status };
    }),

  // 10.4 — Manajemen Kupon Promo
  listCoupons: adminProcedure.query(async ({ ctx }) => {
    const coupons = await ctx.db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return coupons.map((c) => ({
      id: c.id,
      code: c.code,
      description: c.description,
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      minOrderAmount: Number(c.minOrderAmount),
      maxUses: c.maxUses,
      usedCount: c.usedCount,
      isActive: c.isActive,
      expiresAt: c.expiresAt,
      createdAt: c.createdAt,
    }));
  }),

  upsertCoupon: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        code: z
          .string()
          .min(3)
          .max(30)
          .transform((val) => val.toUpperCase().trim()),
        description: z.string().optional(),
        discountType: z.enum(["FIXED", "PERCENTAGE"]),
        discountValue: z.number().positive(),
        minOrderAmount: z.number().min(0).default(0),
        maxUses: z.number().int().positive().nullable().optional(),
        isActive: z.boolean().default(true),
        expiresAt: z.coerce.date().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        const updated = await ctx.db.coupon.update({
          where: { id: input.id },
          data: {
            code: input.code,
            description: input.description,
            discountType: input.discountType,
            discountValue: input.discountValue,
            minOrderAmount: input.minOrderAmount,
            maxUses: input.maxUses ?? null,
            isActive: input.isActive,
            expiresAt: input.expiresAt ?? null,
          },
        });
        return { id: updated.id, code: updated.code };
      }

      const created = await ctx.db.coupon.create({
        data: {
          code: input.code,
          description: input.description,
          discountType: input.discountType,
          discountValue: input.discountValue,
          minOrderAmount: input.minOrderAmount,
          maxUses: input.maxUses ?? null,
          isActive: input.isActive,
          expiresAt: input.expiresAt ?? null,
        },
      });
      return { id: created.id, code: created.code };
    }),

  toggleCouponActive: adminProcedure
    .input(z.object({ id: z.string().min(1), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.coupon.update({
        where: { id: input.id },
        data: { isActive: input.isActive },
      });
      return { id: updated.id, isActive: updated.isActive };
    }),

  deleteCoupon: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.coupon.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // 10.5 — Manajemen Pengguna & Kredit Reseller
  listUsers: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      include: {
        _count: {
          select: {
            invitations: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      creditBalance: u.creditBalance,
      resellerBrandName: u.resellerBrandName,
      createdAt: u.createdAt,
      _count: {
        invitations: u._count.invitations,
        orders: u._count.orders,
      },
    }));
  }),

  updateUserRoleAndCredits: adminProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        role: z.enum(["USER", "RESELLER", "ADMIN", "SUPERADMIN"]).optional(),
        creditBalance: z.number().int().min(0).optional(),
        resellerBrandName: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          ...(input.role ? { role: input.role } : {}),
          ...(typeof input.creditBalance === "number"
            ? { creditBalance: input.creditBalance }
            : {}),
          ...(input.resellerBrandName !== undefined
            ? { resellerBrandName: input.resellerBrandName }
            : {}),
        },
      });
      return { id: updated.id, role: updated.role, creditBalance: updated.creditBalance };
    }),

  // 10.5 — Moderasi Undangan Publik
  listAllInvitations: adminProcedure.query(async ({ ctx }) => {
    const invitations = await ctx.db.invitation.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        packageTier: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        _count: {
          select: {
            guests: true,
            rsvps: true,
            stats: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      title: inv.title,
      slug: inv.slug,
      status: inv.status,
      packageTier: inv.packageTier,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
      user: inv.user,
      template: inv.template,
      _count: {
        guests: inv._count.guests,
        rsvps: inv._count.rsvps,
        stats: inv._count.stats,
      },
    }));
  }),

  moderateInvitation: adminProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        status: z.enum(["DRAFT", "PUBLISHED", "EXPIRED", "ARCHIVED"]).optional(),
        packageTier: z.enum(["FREE", "PREMIUM"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.invitation.update({
        where: { id: input.invitationId },
        data: {
          ...(input.status ? { status: input.status } : {}),
          ...(input.packageTier ? { packageTier: input.packageTier } : {}),
          ...(input.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        },
      });
      return { id: updated.id, status: updated.status, packageTier: updated.packageTier };
    }),

  deleteInvitationAdmin: adminProcedure
    .input(z.object({ invitationId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.invitation.delete({
        where: { id: input.invitationId },
      });
      return { success: true };
    }),
});
