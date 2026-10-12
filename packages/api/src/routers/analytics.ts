import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../index";

export const analyticsRouter = router({
  recordView: publicProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        deviceType: z.string().optional(),
        browser: z.string().optional(),
        city: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pageViewStat.create({
        data: {
          invitationId: input.invitationId,
          deviceType: input.deviceType ?? "mobile",
          browser: input.browser ?? "unknown",
          city: input.city ?? null,
        },
      });
    }),

  getStats: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      // Validasi kepemilikan undangan (IDOR Protection)
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      const totalViews = await ctx.db.pageViewStat.count({
        where: { invitationId: input.invitationId },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayViews = await ctx.db.pageViewStat.count({
        where: {
          invitationId: input.invitationId,
          viewedAt: {
            gte: today,
          },
        },
      });

      // Ringkasan Tipe Perangkat
      const mobileViews = await ctx.db.pageViewStat.count({
        where: {
          invitationId: input.invitationId,
          deviceType: "mobile",
        },
      });

      const desktopViews = await ctx.db.pageViewStat.count({
        where: {
          invitationId: input.invitationId,
          deviceType: "desktop",
        },
      });

      // Ringkasan Kehadiran RSVP
      const rsvpAttending = await ctx.db.rSVPResponse.count({
        where: {
          invitationId: input.invitationId,
          attendance: "ATTENDING",
        },
      });

      const rsvpNotAttending = await ctx.db.rSVPResponse.count({
        where: {
          invitationId: input.invitationId,
          attendance: "NOT_ATTENDING",
        },
      });

      const rsvpUncertain = await ctx.db.rSVPResponse.count({
        where: {
          invitationId: input.invitationId,
          attendance: "UNCERTAIN",
        },
      });

      const totalRsvp = rsvpAttending + rsvpNotAttending + rsvpUncertain;

      return {
        invitation,
        totalViews,
        todayViews,
        devices: {
          mobile: mobileViews,
          desktop: desktopViews,
          other: Math.max(0, totalViews - mobileViews - desktopViews),
        },
        rsvp: {
          attending: rsvpAttending,
          notAttending: rsvpNotAttending,
          uncertain: rsvpUncertain,
          total: totalRsvp,
        },
      };
    }),
});

