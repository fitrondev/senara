import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

/**
 * Sanitasi string masukan dari tag HTML, entitas berbahaya, dan URI berbahaya (XSS prevention)
 */
function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Hapus seluruh markup tag HTML
    .replace(/javascript:/gi, "") // Cegah protokol skrip berbahaya
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export const rsvpRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        guestId: z.string().optional(),
        guestName: z.string().min(1, "Nama wajib diisi").max(100),
        attendance: z.enum(["ATTENDING", "NOT_ATTENDING", "UNCERTAIN"]),
        guestCount: z.number().int().min(1, "Minimal 1 orang").max(20, "Maksimal 20 orang").default(1),
        message: z.string().max(1000, "Ucapan maksimal 1000 karakter").optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: { id: input.invitationId },
        select: { id: true, status: true },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan.",
        });
      }

      const cleanGuestName = sanitizeText(input.guestName);
      const cleanMessage = input.message ? sanitizeText(input.message) : null;

      let resolvedGuestId = input.guestId ?? null;
      if (!resolvedGuestId) {
        const matchedGuest = await ctx.db.guest.findFirst({
          where: {
            invitationId: input.invitationId,
            name: input.guestName.trim(),
          },
          select: { id: true },
        });
        if (matchedGuest) {
          resolvedGuestId = matchedGuest.id;
        }
      }

      const response = await ctx.db.rSVPResponse.create({
        data: {
          invitationId: input.invitationId,
          guestId: resolvedGuestId,
          guestName: cleanGuestName,
          attendance: input.attendance,
          guestCount: input.guestCount,
          message: cleanMessage,
        },
      });

      return {
        success: true,
        id: response.id,
      };
    }),

  listByInvitation: publicProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        limit: z.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { invitationId, limit, cursor } = input;

      const items = await ctx.db.rSVPResponse.findMany({
        where: {
          invitationId,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getStats: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
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

      const [total, attending, notAttending, uncertain, guestCountSum] = await Promise.all([
        ctx.db.rSVPResponse.count({
          where: { invitationId: input.invitationId },
        }),
        ctx.db.rSVPResponse.count({
          where: { invitationId: input.invitationId, attendance: "ATTENDING" },
        }),
        ctx.db.rSVPResponse.count({
          where: { invitationId: input.invitationId, attendance: "NOT_ATTENDING" },
        }),
        ctx.db.rSVPResponse.count({
          where: { invitationId: input.invitationId, attendance: "UNCERTAIN" },
        }),
        ctx.db.rSVPResponse.aggregate({
          where: { invitationId: input.invitationId, attendance: "ATTENDING" },
          _sum: { guestCount: true },
        }),
      ]);

      return {
        totalResponses: total,
        attendingCount: attending,
        notAttendingCount: notAttending,
        uncertainCount: uncertain,
        totalAttendingGuests: guestCountSum._sum.guestCount ?? 0,
      };
    }),
});
