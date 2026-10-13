import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const analyticsRouter = router({
  recordView: publicProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        guestId: z.string().optional(),
        guestName: z.string().optional(),
        deviceType: z.string().optional(),
        browser: z.string().optional(),
        city: z.string().optional(),
        deviceFingerprint: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let resolvedGuestId = input.guestId ?? null;
      let resolvedGuestName = input.guestName?.trim() ?? null;

      if (resolvedGuestId || resolvedGuestName) {
        const guest = await ctx.db.guest.findFirst({
          where: {
            invitationId: input.invitationId,
            ...(resolvedGuestId
              ? {
                  OR: [
                    { id: resolvedGuestId },
                    { customSlug: resolvedGuestId },
                  ],
                }
              : { name: resolvedGuestName ?? undefined }),
          },
        });

        if (guest) {
          resolvedGuestId = guest.id;
          resolvedGuestName = guest.name;

          const currentFingerprints = Array.isArray(guest.deviceFingerprints)
            ? (guest.deviceFingerprints as string[])
            : [];
          const nextFingerprints =
            input.deviceFingerprint &&
            !guest.isGroupLink &&
            !currentFingerprints.includes(input.deviceFingerprint)
              ? [...currentFingerprints, input.deviceFingerprint]
              : currentFingerprints;

          await ctx.db.guest.update({
            where: { id: guest.id },
            data: {
              viewCount: { increment: 1 },
              lastViewedAt: new Date(),
              deviceFingerprints: nextFingerprints,
            },
          });
        }
      }

      return ctx.db.pageViewStat.create({
        data: {
          invitationId: input.invitationId,
          guestId: resolvedGuestId,
          guestName: resolvedGuestName,
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
          packageTier: true,
          isPrivateMode: true,
          maxDevicesPerGuest: true,
          enabledAddons: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      // Vercel Best Practice (async-parallel): Run all independent count & list queries in parallel
      const [
        totalViews,
        todayViews,
        liveVisitorsCount,
        mobileViews,
        desktopViews,
        rsvpAttending,
        rsvpNotAttending,
        rsvpUncertain,
        guests,
        generalViews,
      ] = await Promise.all([
        ctx.db.pageViewStat.count({
          where: { invitationId: input.invitationId },
        }),
        ctx.db.pageViewStat.count({
          where: {
            invitationId: input.invitationId,
            viewedAt: { gte: today },
          },
        }),
        ctx.db.pageViewStat.count({
          where: {
            invitationId: input.invitationId,
            viewedAt: { gte: thirtyMinutesAgo },
          },
        }),
        ctx.db.pageViewStat.count({
          where: {
            invitationId: input.invitationId,
            deviceType: "mobile",
          },
        }),
        ctx.db.pageViewStat.count({
          where: {
            invitationId: input.invitationId,
            deviceType: "desktop",
          },
        }),
        ctx.db.rSVPResponse.count({
          where: {
            invitationId: input.invitationId,
            attendance: "ATTENDING",
          },
        }),
        ctx.db.rSVPResponse.count({
          where: {
            invitationId: input.invitationId,
            attendance: "NOT_ATTENDING",
          },
        }),
        ctx.db.rSVPResponse.count({
          where: {
            invitationId: input.invitationId,
            attendance: "UNCERTAIN",
          },
        }),
        ctx.db.guest.findMany({
          where: { invitationId: input.invitationId },
          include: {
            rsvps: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
          orderBy: [{ viewCount: "desc" }, { name: "asc" }],
        }),
        ctx.db.pageViewStat.findMany({
          where: {
            invitationId: input.invitationId,
            guestId: null,
          },
          orderBy: { viewedAt: "desc" },
          take: 50,
        }),
      ]);

      const totalRsvp = rsvpAttending + rsvpNotAttending + rsvpUncertain;

      return {
        invitation: {
          ...invitation,
          enabledAddons: Array.isArray(invitation.enabledAddons)
            ? (invitation.enabledAddons as string[])
            : [],
        },
        totalViews,
        todayViews,
        liveVisitorsCount,
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
        guests: guests.map((g) => ({
          ...g,
          deviceFingerprints: Array.isArray(g.deviceFingerprints)
            ? (g.deviceFingerprints as string[])
            : [],
        })),
        generalViews,
      };
    }),
});
