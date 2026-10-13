import { INITIAL_TEMPLATES, type Prisma } from "@senara/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const CREDIT_COST_PER_INVITATION = 5;
export const PRICE_PER_CREDIT = 1000;

const CREDIT_BUNDLE_PRICES: Record<number, number> = {
  5: 5000,
  25: 25000,
  50: 50000,
  100: 100000,
  250: 250000,
};

function generateSlugCandidate(a: string, b: string): string {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  const base = `${clean(a)}-${clean(b)}`.slice(0, 48);
  return `${base || "undangan"}-${suffix}`;
}

export const resellerRouter = router({
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.upsert({
      where: { id: ctx.auth.userId },
      update: {},
      create: {
        id: ctx.auth.userId,
        email: `${ctx.auth.userId}@user.senara.local`,
        name: "Mitra Reseller Senara",
      },
      select: {
        id: true,
        name: true,
        email: true,
        creditBalance: true,
        resellerBrandName: true,
        resellerLogoUrl: true,
      },
    });

    const [intakeLinks, templates, invitations] = await Promise.all([
      ctx.db.clientIntakeLink.findMany({
        where: { resellerId: ctx.auth.userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          token: true,
          clientName: true,
          clientPhone: true,
          templateId: true,
          status: true,
          createdInvitationId: true,
          submittedAt: true,
          createdAt: true,
          template: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true,
            },
          },
        },
      }),
      ctx.db.template.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          thumbnail: true,
        },
      }),
      ctx.db.invitation.findMany({
        where: { userId: ctx.auth.userId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          packageTier: true,
          eventDate: true,
          createdAt: true,
          template: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      user,
      intakeLinks,
      templates,
      invitations,
    };
  }),

  updateBranding: protectedProcedure
    .input(
      z.object({
        resellerBrandName: z.string().trim().max(80).nullish(),
        resellerLogoUrl: z.string().trim().max(500).nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.auth.userId },
        data: {
          resellerBrandName: input.resellerBrandName || null,
          resellerLogoUrl: input.resellerLogoUrl || null,
        },
        select: {
          id: true,
          resellerBrandName: true,
          resellerLogoUrl: true,
        },
      });
    }),

  getMyCredit: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.auth.userId },
      select: { creditBalance: true, role: true },
    });
    return {
      creditBalance: user?.creditBalance ?? 0,
      role: user?.role ?? "USER",
    };
  }),

  topUpCredits: protectedProcedure
    .input(
      z.object({
        credits: z.number().int().min(5, "Minimal top-up 5 kredit"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const amount = CREDIT_BUNDLE_PRICES[input.credits] ?? input.credits * PRICE_PER_CREDIT;
      const orderNumber = `RSL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

      const [updatedUser] = await ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: ctx.auth.userId },
          data: {
            creditBalance: {
              increment: input.credits,
            },
          },
          select: {
            id: true,
            creditBalance: true,
          },
        }),
        ctx.db.order.create({
          data: {
            orderNumber,
            userId: ctx.auth.userId,
            tier: "PREMIUM",
            amount,
            status: "PAID",
            addons: [`RESELLER_CREDIT_${input.credits}`] as unknown as Prisma.InputJsonValue,
            payment: {
              create: {
                gateway: "MANUAL_TRANSFER",
                paymentType: "reseller_credit_bundle",
                paymentStatus: "PAID",
                paidAt: new Date(),
                adminNote: `Top-up Paket ${input.credits} Kredit Reseller (Rp ${amount})`,
              },
            },
          },
        }),
      ]);

      return updatedUser;
    }),

  publishWithCredit: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [user, invitation] = await Promise.all([
        ctx.db.user.findUnique({
          where: { id: ctx.auth.userId },
          select: { creditBalance: true },
        }),
        ctx.db.invitation.findFirst({
          where: { id: input.invitationId, userId: ctx.auth.userId },
          select: { id: true, status: true, title: true, packageTier: true },
        }),
      ]);

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan.",
        });
      }

      if (invitation.status === "PUBLISHED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan ini sudah berstatus Terbit (PUBLISHED).",
        });
      }

      // Jika undangan sudah berstatus PREMIUM, tidak perlu memotong kredit lagi
      if (invitation.packageTier === "PREMIUM") {
        const updatedInvitation = await ctx.db.invitation.update({
          where: { id: invitation.id },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
          },
        });

        return {
          creditBalance: user?.creditBalance ?? 0,
          invitation: updatedInvitation,
        };
      }

      if (!user || user.creditBalance < CREDIT_COST_PER_INVITATION) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Saldo kredit reseller tidak mencukupi. Dibutuhkan ${CREDIT_COST_PER_INVITATION} kredit (Rp 5.000). Silakan isi ulang paket kredit terlebih dahulu.`,
        });
      }

      const [updatedUser, updatedInvitation] = await ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: ctx.auth.userId },
          data: {
            creditBalance: {
              decrement: CREDIT_COST_PER_INVITATION,
            },
          },
          select: {
            creditBalance: true,
          },
        }),
        ctx.db.invitation.update({
          where: { id: invitation.id },
          data: {
            status: "PUBLISHED",
            packageTier: "PREMIUM",
            publishedAt: new Date(),
            enabledAddons: [
              "STATS",
              "PRIVATE_MODE",
            ] as unknown as Prisma.InputJsonValue,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
          },
        }),
      ]);

      return {
        creditBalance: updatedUser.creditBalance,
        invitation: updatedInvitation,
      };
    }),

  createIntakeLink: protectedProcedure
    .input(
      z.object({
        clientName: z.string().trim().min(1, "Nama klien wajib diisi").max(100),
        clientPhone: z.string().trim().max(30).optional(),
        templateId: z.string().min(1, "Template wajib dipilih"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.template.findUnique({
        where: { id: input.templateId },
        select: { id: true },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template tidak ditemukan.",
        });
      }

      const token = `form-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

      return ctx.db.clientIntakeLink.create({
        data: {
          token,
          resellerId: ctx.auth.userId,
          clientName: input.clientName,
          clientPhone: input.clientPhone || null,
          templateId: template.id,
          status: "PENDING",
        },
        select: {
          id: true,
          token: true,
          clientName: true,
          status: true,
        },
      });
    }),

  deleteIntakeLink: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.clientIntakeLink.findFirst({
        where: {
          id: input.id,
          resellerId: ctx.auth.userId,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tautan formulir klien tidak ditemukan.",
        });
      }

      return ctx.db.clientIntakeLink.delete({
        where: { id: existing.id },
        select: { id: true },
      });
    }),

  getIntakeByToken: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const intake = await ctx.db.clientIntakeLink.findUnique({
        where: { token: input.token },
        select: {
          id: true,
          token: true,
          clientName: true,
          status: true,
          createdInvitationId: true,
          submittedAt: true,
          reseller: {
            select: {
              name: true,
              resellerBrandName: true,
              resellerLogoUrl: true,
            },
          },
          template: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              thumbnail: true,
            },
          },
        },
      });

      if (!intake) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tautan formulir klien tidak ditemukan atau sudah tidak berlaku.",
        });
      }

      let createdSlug: string | null = null;
      if (intake.createdInvitationId) {
        const inv = await ctx.db.invitation.findUnique({
          where: { id: intake.createdInvitationId },
          select: { slug: true },
        });
        createdSlug = inv?.slug ?? null;
      }

      return {
        ...intake,
        createdSlug,
      };
    }),

  submitIntakeForm: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
        brideNickname: z.string().trim().min(1, "Nama panggilan mempelai wanita wajib diisi"),
        brideFullName: z.string().trim().min(1, "Nama lengkap mempelai wanita wajib diisi"),
        brideParents: z.string().trim().min(1, "Nama orang tua mempelai wanita wajib diisi"),
        groomNickname: z.string().trim().min(1, "Nama panggilan mempelai pria wajib diisi"),
        groomFullName: z.string().trim().min(1, "Nama lengkap mempelai pria wajib diisi"),
        groomParents: z.string().trim().min(1, "Nama orang tua mempelai pria wajib diisi"),
        eventDate: z.string().min(1, "Tanggal acara wajib diisi"),
        akadTime: z.string().trim().min(1, "Waktu akad/acara utama wajib diisi"),
        resepsiTime: z.string().trim().optional(),
        venueName: z.string().trim().min(1, "Nama gedung/lokasi wajib diisi"),
        venueAddress: z.string().trim().min(1, "Alamat lengkap wajib diisi"),
        mapsUrl: z.string().trim().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const intake = await ctx.db.clientIntakeLink.findUnique({
        where: { token: input.token },
        include: {
          template: true,
        },
      });

      if (!intake) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tautan formulir tidak ditemukan.",
        });
      }

      if (intake.status === "SUBMITTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Formulir ini sudah pernah dikirim sebelumnya.",
        });
      }

      const title = `${input.brideNickname} & ${input.groomNickname}`;
      const slug = generateSlugCandidate(input.brideNickname, input.groomNickname);
      const parsedDate = new Date(input.eventDate);
      const validEventDate = Number.isNaN(parsedDate.getTime())
        ? new Date("2026-10-24T08:00:00Z")
        : parsedDate;

      const templatePreset = INITIAL_TEMPLATES.find(
        (t) => t.slug === intake.template.slug
      );
      const defaultSections = templatePreset?.defaultSections ?? [
        { sectionKey: "hero", title: "Sampul", sortOrder: 0, isVisible: true, isLocked: true },
        { sectionKey: "quote", title: "Untaian Doa", sortOrder: 1, isVisible: true, isLocked: false },
        { sectionKey: "couple", title: "Mempelai", sortOrder: 2, isVisible: true, isLocked: true },
        { sectionKey: "event", title: "Rangkaian Acara", sortOrder: 3, isVisible: true, isLocked: false },
        { sectionKey: "love-story", title: "Cerita Cinta", sortOrder: 4, isVisible: true, isLocked: false },
        { sectionKey: "gallery", title: "Galeri Foto", sortOrder: 5, isVisible: true, isLocked: false },
        { sectionKey: "gift", title: "Amplop Digital", sortOrder: 6, isVisible: true, isLocked: false },
        { sectionKey: "rsvp", title: "Buku Tamu & RSVP", sortOrder: 7, isVisible: true, isLocked: false },
        { sectionKey: "closing", title: "Penutup", sortOrder: 8, isVisible: true, isLocked: true },
      ];

      const initialThemeConfig = {
        palette: {
          primary: "#5c4238",
          background: "#faf6f0",
          accent: "#8c6553",
        },
        typography: {
          headingFont: "Libre Baskerville, serif",
          bodyFont: "Quicksand, sans-serif",
        },
        withPhotos: true,
        fields: {
          title,
          person1Name: input.brideFullName,
          person1Parents: input.brideParents,
          person2Name: input.groomFullName,
          person2Parents: input.groomParents,
        },
      };

      const schedulesToCreate = [
        {
          title: "Akad Nikah / Acara Utama",
          date: validEventDate,
          startTime: input.akadTime,
          endTime: "Selesai",
          timezone: "WIB",
          venueName: input.venueName,
          address: input.venueAddress,
          mapsUrl: input.mapsUrl || null,
        },
      ];

      if (input.resepsiTime) {
        schedulesToCreate.push({
          title: "Resepsi Pernikahan",
          date: validEventDate,
          startTime: input.resepsiTime,
          endTime: "Selesai",
          timezone: "WIB",
          venueName: input.venueName,
          address: input.venueAddress,
          mapsUrl: input.mapsUrl || null,
        });
      }

      const resellerUser = await ctx.db.user.findUnique({
        where: { id: intake.resellerId },
        select: { creditBalance: true },
      });

      const hasEnoughCredit = (resellerUser?.creditBalance ?? 0) >= CREDIT_COST_PER_INVITATION;
      if (hasEnoughCredit) {
        await ctx.db.user.update({
          where: { id: intake.resellerId },
          data: { creditBalance: { decrement: CREDIT_COST_PER_INVITATION } },
        });
      }

      const packageTier = hasEnoughCredit ? "PREMIUM" : "FREE";
      const status = hasEnoughCredit ? "PUBLISHED" : "DRAFT";
      const publishedAt = hasEnoughCredit ? new Date() : null;
      const enabledAddons = hasEnoughCredit
        ? ["STATS", "PRIVATE_MODE"]
        : [];

      const createdInvitation = await ctx.db.invitation.create({
        data: {
          userId: intake.resellerId,
          templateId: intake.templateId,
          title,
          slug,
          eventDate: validEventDate,
          status,
          publishedAt,
          packageTier,
          enabledAddons: enabledAddons as unknown as Prisma.InputJsonValue,
          themeConfig: initialThemeConfig as unknown as Prisma.InputJsonValue,
          sections: {
            create: defaultSections.map((s) => ({
              sectionKey: s.sectionKey,
              title: s.title,
              sortOrder: s.sortOrder,
              isVisible: s.isVisible,
              isLocked: s.isLocked,
            })),
          },
          schedules: {
            create: schedulesToCreate,
          },
        },
        select: {
          id: true,
          slug: true,
          title: true,
        },
      });

      await ctx.db.clientIntakeLink.update({
        where: { id: intake.id },
        data: {
          status: "SUBMITTED",
          createdInvitationId: createdInvitation.id,
          submittedAt: new Date(),
        },
      });

      return createdInvitation;
    }),
});

