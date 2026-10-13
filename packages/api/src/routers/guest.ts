import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

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
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
        select: { id: true },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      const items = await ctx.db.guest.findMany({
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
          },
        },
        orderBy: [{ isGroupLink: "desc" }, { name: "asc" }],
      });

      return items.map((g) => ({
        ...g,
        deviceFingerprints: Array.isArray(g.deviceFingerprints)
          ? (g.deviceFingerprints as string[])
          : [],
      }));
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
              isGroupLink: z.boolean().optional(),
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
        select: { id: true },
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
          category: g.category?.trim() ?? (g.isGroupLink ? "Grup" : null),
          customSlug: g.customSlug?.trim() ?? null,
          isGroupLink: g.isGroupLink ?? false,
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
        isGroupLink: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
        select: { id: true },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      const updated = await ctx.db.guest.update({
        where: {
          id: input.id,
        },
        data: {
          ...(input.name ? { name: input.name.trim() } : {}),
          ...(input.phone !== undefined ? { phone: input.phone?.trim() ?? null } : {}),
          ...(input.category !== undefined ? { category: input.category?.trim() ?? null } : {}),
          ...(input.customSlug !== undefined ? { customSlug: input.customSlug?.trim() ?? null } : {}),
          ...(typeof input.isGroupLink === "boolean" ? { isGroupLink: input.isGroupLink } : {}),
        },
      });

      return {
        ...updated,
        deviceFingerprints: Array.isArray(updated.deviceFingerprints)
          ? (updated.deviceFingerprints as string[])
          : [],
      };
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
        select: { id: true },
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
        select: { id: true },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      const updated = await ctx.db.guest.update({
        where: {
          id: input.id,
        },
        data: {
          isSentWa: input.isSentWa,
          sentWaAt: input.isSentWa ? new Date() : null,
        },
      });

      return {
        ...updated,
        deviceFingerprints: Array.isArray(updated.deviceFingerprints)
          ? (updated.deviceFingerprints as string[])
          : [],
      };
    }),

  resetDevices: protectedProcedure
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
        select: { id: true },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      const updated = await ctx.db.guest.update({
        where: {
          id: input.id,
        },
        data: {
          deviceFingerprints: [],
        },
      });

      return {
        ...updated,
        deviceFingerprints: [] as string[],
      };
    }),

  resolvePublicGuest: publicProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        guestCode: z.string().optional(),
        guestName: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.guestCode) {
        const byCode = await ctx.db.guest.findFirst({
          where: {
            invitationId: input.invitationId,
            OR: [{ id: input.guestCode }, { customSlug: input.guestCode }],
          },
          select: {
            id: true,
            name: true,
            category: true,
            isGroupLink: true,
            viewCount: true,
          },
        });
        if (byCode) return byCode;
      }

      if (input.guestName) {
        const byName = await ctx.db.guest.findFirst({
          where: {
            invitationId: input.invitationId,
            name: input.guestName.trim(),
          },
          select: {
            id: true,
            name: true,
            category: true,
            isGroupLink: true,
            viewCount: true,
          },
        });
        if (byName) return byName;
      }

      return null;
    }),
});
