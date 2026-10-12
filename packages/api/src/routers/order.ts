import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

export const orderRouter = router({
  createOrder: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        tier: z.enum(["FREE", "PREMIUM"]).default("PREMIUM"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validasi kepemilikan undangan (IDOR Protection)
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }

      const amount = input.tier === "PREMIUM" ? 49000 : 0;
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      // Buat pesanan di basis data
      const order = await ctx.db.order.create({
        data: {
          orderNumber,
          userId: ctx.auth.userId,
          tier: input.tier,
          amount,
          status: amount === 0 ? "PAID" : "PENDING",
        },
      });

      // Token snap mock atau simulasi transaksi
      const snapToken = `SNAP-TOKEN-${order.id.slice(0, 8)}`;
      const redirectUrl = `https://app.midtrans.com/snap/v2/vtweb/${snapToken}`;

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: Number(order.amount),
        tier: order.tier,
        snapToken,
        redirectUrl,
      };
    }),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.order.findMany({
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
  }),
});
