import { INITIAL_TEMPLATES } from "@senara/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const templateRouter = router({
  getAll: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          isPremium: z.boolean().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      // Auto-sync INITIAL_TEMPLATES jika belum lengkap di DB
      const existingCount = await ctx.db.template.count();
      if (existingCount < INITIAL_TEMPLATES.length) {
        await Promise.all(
          INITIAL_TEMPLATES.map((tpl) =>
            ctx.db.template.upsert({
              where: { slug: tpl.slug },
              update: {
                previewUrl: tpl.previewUrl,
                tags: tpl.tags,
              },
              create: {
                slug: tpl.slug,
                name: tpl.name,
                category: tpl.category,
                thumbnail: tpl.thumbnail,
                previewUrl: tpl.previewUrl,
                isPremium: tpl.isPremium,
                price: tpl.price,
                isActive: tpl.isActive,
                tags: tpl.tags,
                defaultSections: tpl.defaultSections,
              },
            })
          )
        );
      }

      const category = input?.category;
      const isPremium = input?.isPremium;
      const search = input?.search;

      const templates = await ctx.db.template.findMany({
        where: {
          isActive: true,
          status: "PUBLISHED",
          ...(category ? { category } : {}),
          ...(typeof isPremium === "boolean" ? { isPremium } : {}),
          ...(search ? { name: { contains: search } } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return templates.map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        category: t.category,
        thumbnail: t.thumbnail,
        previewUrl: t.previewUrl,
        isPremium: t.isPremium,
        price: Number(t.price),
        isActive: t.isActive,
        tags: Array.isArray(t.tags)
          ? t.tags.filter((item): item is string => typeof item === "string")
          : [],
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }));
    }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      let template = await ctx.db.template.findUnique({
        where: {
          slug: input.slug,
        },
      });

      if (!template) {
        const seedMatch = INITIAL_TEMPLATES.find(
          (t) =>
            t.slug === input.slug ||
            (input.slug === "kartu-pos" && t.slug === "kartu-pos-vintage")
        );
        if (seedMatch) {
          template = await ctx.db.template.upsert({
            where: { slug: seedMatch.slug },
            update: {},
            create: {
              slug: seedMatch.slug,
              name: seedMatch.name,
              category: seedMatch.category,
              thumbnail: seedMatch.thumbnail,
              previewUrl: seedMatch.previewUrl,
              isPremium: seedMatch.isPremium,
              price: seedMatch.price,
              isActive: seedMatch.isActive,
              tags: seedMatch.tags,
              defaultSections: seedMatch.defaultSections,
            },
          });
        }
      }

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Template "${input.slug}" tidak ditemukan.`,
        });
      }

      return {
        id: template.id,
        slug: template.slug,
        name: template.name,
        category: template.category,
        thumbnail: template.thumbnail,
        previewUrl: template.previewUrl,
        isPremium: template.isPremium,
        price: Number(template.price),
        isActive: template.isActive,
        tags: Array.isArray(template.tags)
          ? tFilterStrings(template.tags)
          : [],
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      };
    }),
});

function tFilterStrings(arr: unknown[]): string[] {
  return arr.filter((item): item is string => typeof item === "string");
}
