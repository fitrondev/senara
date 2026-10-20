import { INITIAL_TEMPLATES, type Prisma } from "@senara/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const invitationRouter = router({
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

  getMyInvitations: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.auth.userId },
      select: { role: true },
    });
    const isReseller =
      user?.role === "RESELLER" ||
      ctx.auth.sessionClaims?.metadata?.role?.toLowerCase() === "reseller";

    if (isReseller) {
      await ctx.db.invitation.updateMany({
        where: {
          userId: ctx.auth.userId,
          OR: [
            { packageTier: "FREE" },
            { status: "DRAFT" },
          ],
        },
        data: {
          packageTier: "PREMIUM",
          status: "PUBLISHED",
          publishedAt: new Date(),
          enabledAddons: ["STATS", "PRIVATE_MODE"],
        },
      });
    }

    const items = await ctx.db.invitation.findMany({
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
        themeConfig: true,
        isPrivateMode: true,
        maxDevicesPerGuest: true,
        enabledAddons: true,
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

    return items.map((item) => {
      const normalizedTheme =
        (item.themeConfig as Record<string, unknown> | null) ?? null;
      const isSlugLocked = Boolean(
        item.publishedAt ||
          item.status === "PUBLISHED" ||
          normalizedTheme?.previewSharedAt
      );
      return {
        ...item,
        themeConfig: normalizedTheme,
        isSlugLocked,
        enabledAddons: Array.isArray(item.enabledAddons)
          ? (item.enabledAddons as string[])
          : [],
      };
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
          isPrivateMode: true,
          maxDevicesPerGuest: true,
          enabledAddons: true,
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

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.auth.userId },
        select: { role: true },
      });
      const isReseller =
        user?.role === "RESELLER" ||
        ctx.auth.sessionClaims?.metadata?.role?.toLowerCase() === "reseller";

      if (isReseller) {
        return {
          ...invitation,
          packageTier: "PREMIUM" as const,
          status: (invitation.status === "ARCHIVED"
            ? "ARCHIVED"
            : "PUBLISHED") as typeof invitation.status,
          themeConfig:
            (invitation.themeConfig as Record<string, unknown> | null) ?? null,
          enabledAddons: ["STATS", "PRIVATE_MODE"],
        };
      }

      return {
        ...invitation,
        themeConfig: (invitation.themeConfig as Record<string, unknown> | null) ?? null,
        enabledAddons: Array.isArray(invitation.enabledAddons)
          ? (invitation.enabledAddons as string[])
          : [],
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
          isPrivateMode: true,
          maxDevicesPerGuest: true,
          enabledAddons: true,
          templateId: true,
          user: {
            select: {
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
        enabledAddons: Array.isArray(invitation.enabledAddons)
          ? (invitation.enabledAddons as string[])
          : [],
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
      const user = await ctx.db.user.upsert({
        where: { id: ctx.auth.userId },
        update: {},
        create: {
          id: ctx.auth.userId,
          email: `${ctx.auth.userId}@user.senara.local`,
          name: "Pengguna Senara",
        },
        select: {
          id: true,
          role: true,
          creditBalance: true,
        },
      });

      const isReseller =
        user.role === "RESELLER" ||
        ctx.auth.sessionClaims?.metadata?.role?.toLowerCase() === "reseller";

      if (isReseller) {
        if (user.creditBalance < 5) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: `Saldo kredit tidak mencukupi untuk membuat undangan reseller (membutuhkan 5 kredit = Rp 5.000). Saldo saat ini: ${user.creditBalance} kredit. Silakan isi ulang kredit terlebih dahulu di dashboard reseller.`,
          });
        }

        // Potong 5 kredit untuk reseller saat membuat undangan
        await ctx.db.user.update({
          where: { id: ctx.auth.userId },
          data: {
            creditBalance: {
              decrement: 5,
            },
          },
        });
      }

      const packageTier = isReseller ? "PREMIUM" : "FREE";
      const status = isReseller ? "PUBLISHED" : "DRAFT";
      const publishedAt = isReseller ? new Date() : null;
      const enabledAddons = isReseller
        ? ["STATS", "PRIVATE_MODE"]
        : [];

      const templatePreset = INITIAL_TEMPLATES.find((t) => t.slug === template.slug);
      const rawSections =
        (Array.isArray(template.defaultSections) && template.defaultSections.length > 0
          ? (template.defaultSections as Array<{
              sectionKey: string;
              title?: string;
              sortOrder?: number;
              isVisible?: boolean;
              isLocked?: boolean;
            }>)
          : null) ??
        templatePreset?.defaultSections ?? [
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

      const initialTheme = {
        ...((template.themeConfig as Record<string, unknown>) || {}),
        fields: {
          ...(((template.themeConfig as Record<string, unknown>)?.fields as Record<string, string>) || {}),
          ...((template.defaultFields as Record<string, string>) || {}),
          title: input.title,
        },
      };

      const customContentsList = Array.isArray(template.defaultCustomContents)
        ? (template.defaultCustomContents as Array<{
            slotId: string;
            type: "TITLE" | "TEXT" | "PHOTO" | "VIDEO" | "BUTTON" | "LINK" | "YOUTUBE" | "MAP";
            content: Record<string, unknown>;
            sortOrder?: number;
            isVisible?: boolean;
          }>)
        : [];

      return ctx.db.invitation.create({
        data: {
          userId: ctx.auth.userId,
          templateId: template.id,
          title: input.title,
          slug: input.slug,
          eventDate: input.eventDate,
          status,
          publishedAt,
          packageTier,
          enabledAddons: enabledAddons as unknown as Prisma.InputJsonValue,
          themeConfig: initialTheme as unknown as Prisma.InputJsonValue,
          sections: {
            create: rawSections.map((s, idx) => ({
              sectionKey: s.sectionKey,
              title: s.title ?? s.sectionKey,
              sortOrder: s.sortOrder ?? idx,
              isVisible: s.isVisible ?? true,
              isLocked: s.isLocked ?? false,
            })),
          },
          ...(customContentsList.length > 0
            ? {
                customContents: {
                  create: customContentsList.map((c, idx) => ({
                    slotId: c.slotId,
                    type: c.type,
                    sortOrder: c.sortOrder ?? idx,
                    content: c.content as Prisma.InputJsonValue,
                    isVisible: c.isVisible ?? true,
                  })),
                },
              }
            : {}),
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
        isPrivateMode: z.boolean().optional(),
        maxDevicesPerGuest: z.number().int().min(1).max(10).optional(),
        enabledAddons: z.array(z.string()).optional(),
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
        const existingTheme =
          (existing.themeConfig as Record<string, unknown> | null) ?? null;
        const isSlugLocked = Boolean(
          existing.publishedAt ||
            existing.status === "PUBLISHED" ||
            existingTheme?.previewSharedAt
        );

        if (isSlugLocked) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message:
              "Alamat tautan (slug) sudah dikunci karena undangan pernah diterbitkan atau tautan pratinjau telah dibagikan.",
          });
        }

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

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.auth.userId },
        select: { role: true },
      });
      const isReseller =
        user?.role === "RESELLER" ||
        ctx.auth.sessionClaims?.metadata?.role?.toLowerCase() === "reseller";

      const packageTierData = isReseller
        ? "PREMIUM"
        : input.packageTier
          ? input.packageTier
          : undefined;

      const enabledAddonsData = isReseller
        ? (["STATS", "PRIVATE_MODE"] as unknown as Prisma.InputJsonValue)
        : input.enabledAddons !== undefined
          ? (input.enabledAddons as Prisma.InputJsonValue)
          : undefined;

      const updated = await ctx.db.invitation.update({
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
          ...(packageTierData ? { packageTier: packageTierData } : {}),
          ...(input.themeConfig !== undefined
            ? { themeConfig: (input.themeConfig as Prisma.InputJsonValue) ?? null }
            : {}),
          ...(input.musicUrl !== undefined ? { musicUrl: input.musicUrl } : {}),
          ...(input.musicTitle !== undefined ? { musicTitle: input.musicTitle } : {}),
          ...(typeof input.isMusicAutoplay === "boolean" ? { isMusicAutoplay: input.isMusicAutoplay } : {}),
          ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
          ...(typeof input.isPrivateMode === "boolean" ? { isPrivateMode: input.isPrivateMode } : {}),
          ...(typeof input.maxDevicesPerGuest === "number" ? { maxDevicesPerGuest: input.maxDevicesPerGuest } : {}),
          ...(enabledAddonsData !== undefined
            ? { enabledAddons: enabledAddonsData }
            : {}),
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
          isPrivateMode: true,
          maxDevicesPerGuest: true,
          enabledAddons: true,
          publishedAt: true,
          updatedAt: true,
        },
      });

      return {
        ...updated,
        enabledAddons: Array.isArray(updated.enabledAddons)
          ? (updated.enabledAddons as string[])
          : [],
      };
    }),

  verifyGuestDevice: publicProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        guestCode: z.string().optional(),
        guestName: z.string().optional(),
        deviceFingerprint: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: { id: input.invitationId },
        select: {
          id: true,
          isPrivateMode: true,
          maxDevicesPerGuest: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan.",
        });
      }

      let guest = null;
      if (input.guestCode) {
        guest = await ctx.db.guest.findFirst({
          where: {
            invitationId: input.invitationId,
            OR: [{ id: input.guestCode }, { customSlug: input.guestCode }],
          },
        });
      }
      if (!guest && input.guestName) {
        guest = await ctx.db.guest.findFirst({
          where: {
            invitationId: input.invitationId,
            name: input.guestName.trim(),
          },
        });
      }

      if (invitation.isPrivateMode && !guest) {
        return {
          allowed: false as const,
          reason: "PRIVATE_LOCKED" as const,
          maxDevices: invitation.maxDevicesPerGuest,
          guestId: null,
          guestName: null,
          isGroupLink: false,
        };
      }

      if (!guest) {
        return {
          allowed: true as const,
          reason: "PUBLIC_ALLOWED" as const,
          maxDevices: invitation.maxDevicesPerGuest,
          guestId: null,
          guestName: input.guestName ?? null,
          isGroupLink: false,
        };
      }

      const currentFingerprints = Array.isArray(guest.deviceFingerprints)
        ? (guest.deviceFingerprints as string[])
        : [];

      const isKnownDevice = currentFingerprints.includes(input.deviceFingerprint);

      if (
        invitation.isPrivateMode &&
        !guest.isGroupLink &&
        !isKnownDevice &&
        currentFingerprints.length >= invitation.maxDevicesPerGuest
      ) {
        return {
          allowed: false as const,
          reason: "DEVICE_LIMIT_REACHED" as const,
          maxDevices: invitation.maxDevicesPerGuest,
          guestId: guest.id,
          guestName: guest.name,
          isGroupLink: guest.isGroupLink,
        };
      }

      if (!guest.isGroupLink && !isKnownDevice) {
        await ctx.db.guest.update({
          where: { id: guest.id },
          data: {
            deviceFingerprints: [...currentFingerprints, input.deviceFingerprint],
          },
        });
      }

      return {
        allowed: true as const,
        reason: "GUEST_VERIFIED" as const,
        maxDevices: invitation.maxDevicesPerGuest,
        guestId: guest.id,
        guestName: guest.name,
        isGroupLink: guest.isGroupLink,
      };
    }),

  updateLoveStories: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        stories: z.array(
          z.object({
            id: z.string().optional(),
            yearOrDate: z.string().min(1).max(100),
            title: z.string().min(1).max(150),
            story: z.string().min(1),
            imageUrl: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }

      await ctx.db.$transaction(async (tx) => {
        await tx.loveStory.deleteMany({
          where: { invitationId: input.invitationId },
        });

        if (input.stories.length > 0) {
          await tx.loveStory.createMany({
            data: input.stories.map((s, idx) => ({
              invitationId: input.invitationId,
              yearOrDate: s.yearOrDate,
              title: s.title,
              story: s.story,
              imageUrl: s.imageUrl ?? null,
              sortOrder: idx,
            })),
          });
        }
      });

      const updatedStories = await ctx.db.loveStory.findMany({
        where: { invitationId: input.invitationId },
        orderBy: { sortOrder: "asc" },
      });

      return updatedStories;
    }),

  updateGalleries: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        galleries: z.array(
          z.object({
            id: z.string().optional(),
            mediaUrl: z.string().min(1),
            mediaType: z.string().default("IMAGE"),
            caption: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }

      await ctx.db.$transaction(async (tx) => {
        await tx.galleryMedia.deleteMany({
          where: { invitationId: input.invitationId },
        });

        if (input.galleries.length > 0) {
          await tx.galleryMedia.createMany({
            data: input.galleries.map((g, idx) => ({
              invitationId: input.invitationId,
              mediaUrl: g.mediaUrl,
              mediaType: g.mediaType || "IMAGE",
              caption: g.caption ?? null,
              sortOrder: idx,
            })),
          });
        }
      });

      const updatedGalleries = await ctx.db.galleryMedia.findMany({
        where: { invitationId: input.invitationId },
        orderBy: { sortOrder: "asc" },
      });

      return updatedGalleries;
    }),

  changeTemplate: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        newTemplateId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }

      const targetTemplate = await ctx.db.template.findUnique({
        where: { id: input.newTemplateId },
      });

      if (!targetTemplate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template tujuan tidak ditemukan.",
        });
      }

      const updated = await ctx.db.invitation.update({
        where: { id: input.invitationId },
        data: {
          templateId: targetTemplate.id,
        },
        select: {
          id: true,
          templateId: true,
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
        },
      });

      return updated;
    }),

  checkLastUpdated: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const inv = await ctx.db.invitation.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        select: {
          id: true,
          updatedAt: true,
        },
      });
      return inv ? { id: inv.id, updatedAt: inv.updatedAt } : null;
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

  markPreviewShared: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
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
          message: "Undangan tidak ditemukan.",
        });
      }

      const currentTheme =
        (existing.themeConfig as Record<string, unknown> | null) ?? {};
      const nextTheme = {
        ...currentTheme,
        previewSharedAt:
          currentTheme.previewSharedAt ?? new Date().toISOString(),
      };

      await ctx.db.invitation.update({
        where: { id: existing.id },
        data: {
          themeConfig: nextTheme as Prisma.InputJsonValue,
        },
      });

      return {
        id: existing.id,
        slug: existing.slug,
        isSlugLocked: true,
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        confirmText: z.string().optional(),
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

      const requiresStrictConfirm =
        existing.packageTier === "PREMIUM" ||
        existing.status === "PUBLISHED" ||
        Boolean(existing.publishedAt);

      if (
        requiresStrictConfirm &&
        input.confirmText?.trim().toUpperCase() !== "HAPUS"
      ) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            'Ketik kata "HAPUS" untuk mengonfirmasi penghapusan undangan yang sudah diterbitkan atau berbayar.',
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

