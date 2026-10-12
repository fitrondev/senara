import { INITIAL_TEMPLATES, type Prisma } from "@senara/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../index";

export const invitationRouter = router({
  getMyInvitations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.invitation.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        userId: true,
        templateId: true,
        title: true,
        slug: true,
        status: true,
        packageTier: true,
        eventDate: true,
        coverImageUrl: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        template: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            thumbnail: true,
            isPremium: true,
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
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        select: {
          id: true,
          userId: true,
          templateId: true,
          title: true,
          slug: true,
          status: true,
          packageTier: true,
          eventDate: true,
          themeConfig: true,
          musicUrl: true,
          musicTitle: true,
          isMusicAutoplay: true,
          coverImageUrl: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          template: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              thumbnail: true,
              isPremium: true,
            },
          },
          sections: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              sectionKey: true,
              title: true,
              sortOrder: true,
              isVisible: true,
              isLocked: true,
            },
          },
          customContents: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              slotId: true,
              type: true,
              content: true,
              sortOrder: true,
              isVisible: true,
            },
          },
          schedules: {
            orderBy: {
              date: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              title: true,
              date: true,
              startTime: true,
              endTime: true,
              timezone: true,
              venueName: true,
              address: true,
              mapsUrl: true,
              latitude: true,
              longitude: true,
            },
          },
          bankAccounts: {
            select: {
              id: true,
              invitationId: true,
              bankName: true,
              accountNo: true,
              accountName: true,
              qrisImageUrl: true,
            },
          },
          galleries: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              mediaUrl: true,
              mediaType: true,
              caption: true,
              sortOrder: true,
            },
          },
          loveStories: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              yearOrDate: true,
              title: true,
              story: true,
              imageUrl: true,
              sortOrder: true,
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
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      return {
        ...invitation,
        themeConfig: (invitation.themeConfig as Record<string, unknown> | null) ?? null,
      };
    }),

  getBySlugPublic: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          eventDate: true,
          coverImageUrl: true,
          musicUrl: true,
          themeConfig: true,
          status: true,
          templateId: true,
          template: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              thumbnail: true,
              isPremium: true,
            },
          },
          sections: {
            where: {
              isVisible: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              sectionKey: true,
              title: true,
              sortOrder: true,
              isVisible: true,
              isLocked: true,
            },
          },
          customContents: {
            where: {
              isVisible: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              slotId: true,
              type: true,
              content: true,
              sortOrder: true,
              isVisible: true,
            },
          },
          schedules: {
            orderBy: {
              date: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              title: true,
              date: true,
              startTime: true,
              endTime: true,
              timezone: true,
              venueName: true,
              address: true,
              mapsUrl: true,
              latitude: true,
              longitude: true,
            },
          },
          bankAccounts: {
            select: {
              id: true,
              invitationId: true,
              bankName: true,
              accountNo: true,
              accountName: true,
              qrisImageUrl: true,
            },
          },
          galleries: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              mediaUrl: true,
              mediaType: true,
              caption: true,
              sortOrder: true,
            },
          },
          loveStories: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              invitationId: true,
              yearOrDate: true,
              title: true,
              story: true,
              imageUrl: true,
              sortOrder: true,
            },
          },
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Undangan dengan slug "${input.slug}" tidak ditemukan.`,
        });
      }

      return {
        ...invitation,
        themeConfig: (invitation.themeConfig as Record<string, unknown> | null) ?? null,
      };
    }),

  createFromTemplate: protectedProcedure
    .input(
      z.object({
        templateId: z.string().min(1),
        title: z.string().min(1, "Judul undangan tidak boleh kosong").max(100),
        slug: z
          .string()
          .min(3, "Slug minimal 3 karakter")
          .max(60, "Slug maksimal 60 karakter")
          .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan strip (-)"),
        eventDate: z.coerce.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.template.findUnique({
        where: { id: input.templateId },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template yang dipilih tidak ditemukan.",
        });
      }

      const existingSlug = await ctx.db.invitation.findUnique({
        where: { slug: input.slug },
      });

      if (existingSlug) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Tautan URL "${input.slug}" sudah digunakan. Silakan gunakan nama tautan lain.`,
        });
      }

      // Pastikan User profile ada di database lokal
      await ctx.db.user.upsert({
        where: { id: ctx.auth.userId },
        update: {},
        create: {
          id: ctx.auth.userId,
          email: `${ctx.auth.userId}@user.senara.local`,
          name: "Pengguna Senara",
        },
      });

      const templatePreset = INITIAL_TEMPLATES.find((t) => t.slug === template.slug);
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

      return ctx.db.invitation.create({
        data: {
          userId: ctx.auth.userId,
          templateId: template.id,
          title: input.title,
          slug: input.slug,
          eventDate: input.eventDate,
          status: "DRAFT",
          packageTier: "FREE",
          sections: {
            create: defaultSections.map((s) => ({
              sectionKey: s.sectionKey,
              title: s.title,
              sortOrder: s.sortOrder,
              isVisible: s.isVisible,
              isLocked: s.isLocked,
            })),
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          templateId: true,
          status: true,
        },
      });
    }),

  updateMetadata: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1).max(100).optional(),
        slug: z
          .string()
          .min(3)
          .max(60)
          .regex(/^[a-z0-9-]+$/)
          .optional(),
        eventDate: z.coerce.date().nullish(),
        status: z.enum(["DRAFT", "PUBLISHED", "EXPIRED", "ARCHIVED"]).optional(),
        packageTier: z.enum(["FREE", "PREMIUM"]).optional(),
        themeConfig: z.record(z.string(), z.unknown()).nullish(),
        musicUrl: z.string().nullish(),
        musicTitle: z.string().nullish(),
        isMusicAutoplay: z.boolean().optional(),
        coverImageUrl: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.invitation.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }

      if (input.slug && input.slug !== existing.slug) {
        const slugConflict = await ctx.db.invitation.findUnique({
          where: { slug: input.slug },
        });

        if (slugConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Tautan URL "${input.slug}" sudah digunakan oleh undangan lain.`,
          });
        }
      }

      return ctx.db.invitation.update({
        where: { id: input.id },
        data: {
          ...(input.title ? { title: input.title } : {}),
          ...(input.slug ? { slug: input.slug } : {}),
          ...(input.eventDate !== undefined ? { eventDate: input.eventDate } : {}),
          ...(input.status
            ? {
                status: input.status,
                ...(input.status === "PUBLISHED" && !existing.publishedAt ? { publishedAt: new Date() } : {}),
              }
            : {}),
          ...(input.packageTier ? { packageTier: input.packageTier } : {}),
          ...(input.themeConfig !== undefined
            ? { themeConfig: (input.themeConfig as Prisma.InputJsonValue) ?? null }
            : {}),
          ...(input.musicUrl !== undefined ? { musicUrl: input.musicUrl } : {}),
          ...(input.musicTitle !== undefined ? { musicTitle: input.musicTitle } : {}),
          ...(typeof input.isMusicAutoplay === "boolean" ? { isMusicAutoplay: input.isMusicAutoplay } : {}),
          ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          packageTier: true,
          eventDate: true,
          musicUrl: true,
          musicTitle: true,
          isMusicAutoplay: true,
          coverImageUrl: true,
          publishedAt: true,
          updatedAt: true,
        },
      });
    }),

  duplicate: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const source = await ctx.db.invitation.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        include: {
          sections: true,
          customContents: true,
          schedules: true,
          bankAccounts: true,
          galleries: true,
          loveStories: true,
        },
      });

      if (!source) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan sumber tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const duplicateSlug = `${source.slug.slice(0, 50)}-copy-${randomSuffix}`;

      return ctx.db.invitation.create({
        data: {
          userId: ctx.auth.userId,
          templateId: source.templateId,
          title: `${source.title} (Salinan)`,
          slug: duplicateSlug,
          status: "DRAFT",
          packageTier: "FREE",
          eventDate: source.eventDate,
          themeConfig: (source.themeConfig as Prisma.InputJsonValue) ?? undefined,
          musicUrl: source.musicUrl,
          musicTitle: source.musicTitle,
          isMusicAutoplay: source.isMusicAutoplay,
          coverImageUrl: source.coverImageUrl,
          sections: {
            create: source.sections.map((s) => ({
              sectionKey: s.sectionKey,
              title: s.title,
              sortOrder: s.sortOrder,
              isVisible: s.isVisible,
              isLocked: s.isLocked,
              dataPayload: (s.dataPayload as Prisma.InputJsonValue) ?? undefined,
            })),
          },
          customContents: {
            create: source.customContents.map((c) => ({
              slotId: c.slotId,
              type: c.type,
              sortOrder: c.sortOrder,
              content: c.content as Prisma.InputJsonValue,
              isVisible: c.isVisible,
            })),
          },
          schedules: {
            create: source.schedules.map((sc) => ({
              title: sc.title,
              date: sc.date,
              startTime: sc.startTime,
              endTime: sc.endTime,
              timezone: sc.timezone,
              venueName: sc.venueName,
              address: sc.address,
              mapsUrl: sc.mapsUrl,
              latitude: sc.latitude,
              longitude: sc.longitude,
            })),
          },
          bankAccounts: {
            create: source.bankAccounts.map((b) => ({
              bankName: b.bankName,
              accountNo: b.accountNo,
              accountName: b.accountName,
              qrisImageUrl: b.qrisImageUrl,
            })),
          },
          galleries: {
            create: source.galleries.map((g) => ({
              mediaUrl: g.mediaUrl,
              mediaType: g.mediaType,
              caption: g.caption,
              sortOrder: g.sortOrder,
            })),
          },
          loveStories: {
            create: source.loveStories.map((l) => ({
              yearOrDate: l.yearOrDate,
              title: l.title,
              story: l.story,
              imageUrl: l.imageUrl,
              sortOrder: l.sortOrder,
            })),
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.invitation.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      await ctx.db.invitation.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        id: input.id,
      };
    }),
});

