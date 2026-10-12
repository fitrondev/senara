import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

export const guestRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        search: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
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
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      return ctx.db.guest.findMany({
        where: {
          invitationId: input.invitationId,
          ...(input.category ? { category: input.category } : {}),
          ...(input.search ? { name: { contains: input.search } } : {}),
        },
        include: {
          rsvps: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    }),

  batchCreate: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        guests: z
          .array(
            z.object({
              name: z.string().min(1, "Nama tamu wajib diisi").max(100),
              phone: z.string().max(30).optional(),
              category: z.string().max(50).optional(),
              customSlug: z.string().max(100).optional(),
            })
          )
          .min(1, "Minimal 1 data tamu diperlukan"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      await ctx.db.guest.createMany({
        data: input.guests.map((g) => ({
          invitationId: input.invitationId,
          name: g.name.trim(),
          phone: g.phone?.trim() ?? null,
          category: g.category?.trim() ?? null,
          customSlug: g.customSlug?.trim() ?? null,
        })),
      });

      return {
        success: true,
        count: input.guests.length,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        invitationId: z.string().min(1),
        name: z.string().min(1).max(100).optional(),
        phone: z.string().max(30).nullish(),
        category: z.string().max(50).nullish(),
        customSlug: z.string().max(100).nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      return ctx.db.guest.update({
        where: {
          id: input.id,
        },
        data: {
          ...(input.name ? { name: input.name.trim() } : {}),
          ...(input.phone !== undefined ? { phone: input.phone?.trim() ?? null } : {}),
          ...(input.category !== undefined ? { category: input.category?.trim() ?? null } : {}),
          ...(input.customSlug !== undefined ? { customSlug: input.customSlug?.trim() ?? null } : {}),
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        invitationId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      await ctx.db.guest.deleteMany({
        where: {
          id: input.id,
          invitationId: input.invitationId,
        },
      });

      return {
        success: true,
        id: input.id,
      };
    }),

  updateStatusSent: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        invitationId: z.string().min(1),
        isSentWa: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      return ctx.db.guest.update({
        where: {
          id: input.id,
        },
        data: {
          isSentWa: input.isSentWa,
          sentWaAt: input.isSentWa ? new Date() : null,
        },
      });
    }),
});

