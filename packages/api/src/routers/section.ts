import { type Prisma } from "@senara/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

export const sectionRouter = router({
  reorderAndToggle: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        sections: z.array(
          z.object({
            id: z.string().min(1),
            sortOrder: z.number().int().min(0),
            isVisible: z.boolean(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validasi kepemilikan undangan (IDOR Protection)
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      // Jalankan pembaruan urutan dan status tampil section
      await ctx.db.$transaction(
        input.sections.map((section) =>
          ctx.db.invitationSection.updateMany({
            where: {
              id: section.id,
              invitationId: input.invitationId,
            },
            data: {
              sortOrder: section.sortOrder,
              isVisible: section.isVisible,
            },
          })
        )
      );

      return {
        success: true,
        updatedCount: input.sections.length,
      };
    }),

  updateContent: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        invitationId: z.string().min(1),
        title: z.string().optional(),
        dataPayload: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki hak akses.",
        });
      }

      const updated = await ctx.db.invitationSection.update({
        where: {
          id: input.id,
        },
        data: {
          ...(input.title !== undefined ? { title: input.title } : {}),
          ...(input.dataPayload !== undefined
            ? { dataPayload: input.dataPayload as Prisma.InputJsonValue }
            : {}),
        },
      });

      return updated;
    }),
});

