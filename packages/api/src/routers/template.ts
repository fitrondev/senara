import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../index";

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
      const category = input?.category;
      const isPremium = input?.isPremium;
      const search = input?.search;

      return ctx.db.template.findMany({
        where: {
          isActive: true,
          ...(category ? { category } : {}),
          ...(typeof isPremium === "boolean" ? { isPremium } : {}),
          ...(search ? { name: { contains: search } } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const template = await ctx.db.template.findUnique({
        where: {
          slug: input.slug,
        },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Template "${input.slug}" tidak ditemukan.`,
        });
      }

      return template;
    }),
});

