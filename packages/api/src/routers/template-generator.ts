import { INITIAL_TEMPLATES, type Prisma } from "@senara/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, superAdminProcedure } from "../trpc";

export const templateGeneratorRouter = router({
  /**
   * Mengambil seluruh daftar template untuk Super Admin:
   * mencakup DRAFT, PUBLISHED, dan ARCHIVED dengan filter pencarian, kategori, dan status.
   */
  listTemplates: superAdminProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          category: z.string().optional(),
          status: z.enum(["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const search = input?.search?.trim();
      const category = input?.category && input.category !== "ALL" ? input.category : undefined;
      const status = input?.status && input.status !== "ALL" ? input.status : undefined;

      const templates = await ctx.db.template.findMany({
        where: {
          ...(category ? { category } : {}),
          ...(status ? { status } : {}),
          ...(search
            ? {
                OR: [
                  { name: { contains: search } },
                  { slug: { contains: search } },
                ],
              }
            : {}),
        },
        include: {
          _count: {
            select: {
              invitations: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return templates.map((tpl) => ({
        id: tpl.id,
        slug: tpl.slug,
        name: tpl.name,
        description: tpl.description ?? null,
        category: tpl.category,
        thumbnail: tpl.thumbnail,
        previewUrl: tpl.previewUrl ?? `/template/${tpl.slug}`,
        isPremium: tpl.isPremium,
        price: Number(tpl.price),
        isActive: tpl.isActive,
        status: (tpl.status as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "PUBLISHED",
        tags: Array.isArray(tpl.tags)
          ? tpl.tags.filter((item): item is string => typeof item === "string")
          : [],
        defaultSectionsCount: Array.isArray(tpl.defaultSections)
          ? tpl.defaultSections.length
          : 0,
        invitationsCount: tpl._count.invitations,
        createdBy: tpl.createdBy ?? null,
        createdAt: tpl.createdAt,
        updatedAt: tpl.updatedAt,
      }));
    }),

  /**
   * Mengambil detail lengkap template untuk editor generator.
   */
  getById: superAdminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const template = await ctx.db.template.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              invitations: true,
            },
          },
        },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template tidak ditemukan.",
        });
      }

      return {
        id: template.id,
        slug: template.slug,
        name: template.name,
        description: template.description ?? "",
        category: template.category,
        thumbnail: template.thumbnail,
        previewUrl: template.previewUrl ?? `/template/${template.slug}`,
        isPremium: template.isPremium,
        price: Number(template.price),
        isActive: template.isActive,
        status:
          (template.status as "DRAFT" | "PUBLISHED" | "ARCHIVED") ||
          "PUBLISHED",
        tags: Array.isArray(template.tags)
          ? template.tags.filter((t): t is string => typeof t === "string")
          : [],
        defaultSections: Array.isArray(template.defaultSections)
          ? (template.defaultSections as Array<Record<string, unknown>>)
          : [],
        themeConfig:
          (template.themeConfig as Record<string, unknown> | null) ?? null,
        defaultFields:
          (template.defaultFields as Record<string, string> | null) ?? {},
        defaultCustomContents: Array.isArray(template.defaultCustomContents)
          ? (template.defaultCustomContents as Array<Record<string, unknown>>)
          : [],
        invitationsCount: template._count.invitations,
        createdBy: template.createdBy ?? null,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      };
    }),

  /**
   * Membuat draft template baru.
   */
  create: superAdminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nama template wajib diisi"),
        slug: z.string().min(1, "Slug template wajib diisi"),
        description: z.string().optional(),
        category: z.enum(["WEDDING", "BIRTHDAY", "KHITANAN"]).default("WEDDING"),
        thumbnail: z.string().optional(),
        previewUrl: z.string().optional(),
        isPremium: z.boolean().default(false),
        price: z.number().default(0),
        tags: z.array(z.string()).default([]),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
        basePresetSlug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Periksa keunikan slug
      const existing = await ctx.db.template.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Slug "${input.slug}" sudah digunakan oleh template lain. Gunakan slug yang unik.`,
        });
      }

      // Ambil default sections & theme jika memilih base preset
      const basePreset = INITIAL_TEMPLATES.find(
        (t) => t.slug === (input.basePresetSlug || "kartu-pos-vintage")
      );

      const defaultSections = basePreset?.defaultSections ?? [
        { sectionKey: "hero", title: "Sampul", sortOrder: 0, isVisible: true, isLocked: true },
        { sectionKey: "quote", title: "Untaian Doa", sortOrder: 1, isVisible: true, isLocked: false },
        { sectionKey: "couple", title: "Mempelai", sortOrder: 2, isVisible: true, isLocked: true },
        { sectionKey: "event", title: "Rangkaian Acara", sortOrder: 3, isVisible: true, isLocked: false },
        { sectionKey: "love-story", title: "Cerita Perjalanan", sortOrder: 4, isVisible: true, isLocked: false },
        { sectionKey: "gallery", title: "Galeri Foto", sortOrder: 5, isVisible: true, isLocked: false },
        { sectionKey: "gift", title: "Amplop Digital", sortOrder: 6, isVisible: true, isLocked: false },
        { sectionKey: "rsvp", title: "Buku Tamu & RSVP", sortOrder: 7, isVisible: true, isLocked: false },
        { sectionKey: "closing", title: "Penutup", sortOrder: 8, isVisible: true, isLocked: true },
      ];

      const created = await ctx.db.template.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description ?? "",
          category: input.category,
          thumbnail:
            input.thumbnail ||
            basePreset?.thumbnail ||
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          previewUrl: input.previewUrl || `/template/${input.slug}`,
          isPremium: input.isPremium,
          price: input.price,
          isActive: input.status === "PUBLISHED",
          status: input.status,
          tags: input.tags as unknown as Prisma.InputJsonValue,
          defaultSections: defaultSections as unknown as Prisma.InputJsonValue,
          themeConfig: (input.basePresetSlug
            ? { basePresetSlug: input.basePresetSlug }
            : {}) as unknown as Prisma.InputJsonValue,
          createdBy: ctx.adminUser.id,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          isActive: true,
        },
      });

      return created;
    }),

  /**
   * Menyimpan pembaruan konfigurasi desain dan metadata template dari Generator Editor.
   */
  updateConfig: superAdminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        category: z.string().optional(),
        thumbnail: z.string().optional(),
        previewUrl: z.string().optional().nullable(),
        isPremium: z.boolean().optional(),
        price: z.number().optional(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
        tags: z.array(z.string()).optional(),
        defaultSections: z.array(z.record(z.string(), z.unknown())).optional(),
        themeConfig: z.record(z.string(), z.unknown()).optional(),
        defaultFields: z.record(z.string(), z.string()).optional(),
        defaultCustomContents: z
          .array(z.record(z.string(), z.unknown()))
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.template.findUnique({
        where: { id: input.id },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template tidak ditemukan.",
        });
      }

      if (input.slug && input.slug !== template.slug) {
        const slugExists = await ctx.db.template.findFirst({
          where: {
            slug: input.slug,
            NOT: { id: input.id },
          },
        });
        if (slugExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Slug "${input.slug}" sudah digunakan oleh template lain.`,
          });
        }
      }

      const updateData: Prisma.TemplateUpdateInput = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail;
      if (input.previewUrl !== undefined) updateData.previewUrl = input.previewUrl;
      if (input.isPremium !== undefined) updateData.isPremium = input.isPremium;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.status !== undefined) {
        updateData.status = input.status;
        updateData.isActive = input.status === "PUBLISHED";
      }
      if (input.tags !== undefined) {
        updateData.tags = input.tags as unknown as Prisma.InputJsonValue;
      }
      if (input.defaultSections !== undefined) {
        updateData.defaultSections = input.defaultSections as unknown as Prisma.InputJsonValue;
      }
      if (input.themeConfig !== undefined) {
        updateData.themeConfig = input.themeConfig as unknown as Prisma.InputJsonValue;
      }
      if (input.defaultFields !== undefined) {
        updateData.defaultFields = input.defaultFields as unknown as Prisma.InputJsonValue;
      }
      if (input.defaultCustomContents !== undefined) {
        updateData.defaultCustomContents = input.defaultCustomContents as unknown as Prisma.InputJsonValue;
      }

      const updated = await ctx.db.template.update({
        where: { id: input.id },
        data: updateData,
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          isActive: true,
          updatedAt: true,
        },
      });

      return updated;
    }),

  /**
   * Menggandakan (Duplicate) template yang ada menjadi draf baru.
   */
  duplicate: superAdminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const source = await ctx.db.template.findUnique({
        where: { id: input.id },
      });

      if (!source) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template sumber tidak ditemukan.",
        });
      }

      const baseSlug = `${source.slug}-salinan-${Date.now().toString(36)}`;
      const newName = `${source.name} (Salinan)`;

      const cloned = await ctx.db.template.create({
        data: {
          name: newName,
          slug: baseSlug,
          description: source.description,
          category: source.category,
          thumbnail: source.thumbnail,
          previewUrl: `/template/${baseSlug}`,
          isPremium: source.isPremium,
          price: source.price,
          isActive: false,
          status: "DRAFT",
          tags: source.tags as Prisma.InputJsonValue,
          defaultSections: source.defaultSections as Prisma.InputJsonValue,
          themeConfig: source.themeConfig as Prisma.InputJsonValue,
          defaultFields: source.defaultFields as Prisma.InputJsonValue,
          defaultCustomContents: source.defaultCustomContents as Prisma.InputJsonValue,
          createdBy: ctx.adminUser.id,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          isActive: true,
        },
      });

      return cloned;
    }),

  /**
   * Mempublikasikan template (status = PUBLISHED, isActive = true).
   */
  publish: superAdminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.template.findUnique({
        where: { id: input.id },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template tidak ditemukan.",
        });
      }

      if (!template.thumbnail) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Template wajib memiliki foto thumbnail sebelum dipublikasikan.",
        });
      }

      const updated = await ctx.db.template.update({
        where: { id: input.id },
        data: {
          status: "PUBLISHED",
          isActive: true,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          isActive: true,
        },
      });

      return updated;
    }),

  /**
   * Mengarsipkan template (status = ARCHIVED, isActive = false).
   */
  archive: superAdminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.template.update({
        where: { id: input.id },
        data: {
          status: "ARCHIVED",
          isActive: false,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          isActive: true,
        },
      });

      return updated;
    }),

  /**
   * Menghapus template secara permanen (hanya jika belum ada undangan pengguna yang memakainya).
   */
  delete: superAdminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.template.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { invitations: true },
          },
        },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template tidak ditemukan.",
        });
      }

      if (template._count.invitations > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Template ini sudah digunakan oleh ${template._count.invitations} undangan pengguna. Silakan gunakan opsi 'Arsipkan' untuk menjaga integritas data undangan.`,
        });
      }

      await ctx.db.template.delete({
        where: { id: input.id },
      });

      return { success: true, id: input.id };
    }),
});
