import { type Prisma } from "@senara/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import { assertInvitationOwnership } from "../utils/invitation-guard";

// Skema validasi terperinci untuk 8 tipe konten "Seksi Kustom"
export const titleContentSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong"),
  align: z.enum(["left", "center", "right"]).optional(),
  fontSize: z.string().optional(),
});

export const textContentSchema = z.object({
  text: z.string().min(1, "Teks tidak boleh kosong"),
  align: z.enum(["left", "center", "right"]).optional(),
});

export const photoContentSchema = z.object({
  imageUrl: z.string().min(1, "URL foto wajib diisi"),
  caption: z.string().optional(),
  aspectRatio: z.string().optional(),
});

export const videoContentSchema = z.object({
  videoUrl: z.string().min(1, "URL video wajib diisi"),
  posterUrl: z.string().optional(),
  isMuted: z.boolean().optional(),
});

export const buttonContentSchema = z.object({
  label: z.string().min(1, "Label tombol wajib diisi"),
  url: z.string().min(1, "URL tautan tombol wajib diisi"),
  style: z.enum(["solid", "outline"]).optional(),
  openNewTab: z.boolean().optional(),
});

export const linkContentSchema = z.object({
  label: z.string().min(1, "Label tautan wajib diisi"),
  url: z.string().min(1, "URL tautan wajib diisi"),
});

export const youtubeContentSchema = z.object({
  youtubeUrl: z.string().min(1, "URL video YouTube wajib diisi"),
  autoPlay: z.boolean().optional(),
});

export const mapContentSchema = z.object({
  locationName: z.string().min(1, "Nama lokasi wajib diisi"),
  address: z.string().optional(),
  mapsUrl: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

function validateContentPayload(type: string, content: Record<string, unknown>) {
  switch (type) {
    case "TITLE":
      return titleContentSchema.parse(content);
    case "TEXT":
      return textContentSchema.parse(content);
    case "PHOTO":
      return photoContentSchema.parse(content);
    case "VIDEO":
      return videoContentSchema.parse(content);
    case "BUTTON":
      return buttonContentSchema.parse(content);
    case "LINK":
      return linkContentSchema.parse(content);
    case "YOUTUBE":
      return youtubeContentSchema.parse(content);
    case "MAP":
      return mapContentSchema.parse(content);
    default:
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Tipe konten "${type}" tidak didukung.`,
      });
  }
}

export const customContentRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        slotId: z.string().min(1),
        type: z.enum(["TITLE", "TEXT", "PHOTO", "VIDEO", "BUTTON", "LINK", "YOUTUBE", "MAP"]),
        content: z.record(z.string(), z.unknown()),
        sortOrder: z.number().int().optional(),
        isVisible: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validasi kepemilikan undangan (IDOR Protection)
      await assertInvitationOwnership(ctx.db, input.invitationId, ctx.auth.userId);

      // Validasi struktur payload berdasarkan tipe konten
      const validatedPayload = validateContentPayload(input.type, input.content);

      // Tentukan sortOrder berikutnya di dalam slot yang sama jika tidak ditentukan
      let targetOrder = input.sortOrder;
      if (typeof targetOrder !== "number") {
        const lastItem = await ctx.db.invitationCustomContent.findFirst({
          where: {
            invitationId: input.invitationId,
            slotId: input.slotId,
          },
          orderBy: {
            sortOrder: "desc",
          },
        });
        targetOrder = lastItem ? lastItem.sortOrder + 1 : 0;
      }

      const created = await ctx.db.invitationCustomContent.create({
        data: {
          invitationId: input.invitationId,
          slotId: input.slotId,
          type: input.type,
          sortOrder: targetOrder,
          content: validatedPayload as Prisma.InputJsonValue,
          isVisible: input.isVisible,
        },
        select: {
          id: true,
          invitationId: true,
          slotId: true,
          type: true,
          sortOrder: true,
          isVisible: true,
        },
      });

      return {
        ...created,
        content: validatedPayload,
      };
    }),

  addBatch: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        slotId: z.string().min(1),
        items: z.array(
          z.object({
            type: z.enum([
              "TITLE",
              "TEXT",
              "PHOTO",
              "VIDEO",
              "BUTTON",
              "LINK",
              "YOUTUBE",
              "MAP",
            ]),
            content: z.record(z.string(), z.unknown()),
            isVisible: z.boolean().default(true),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validasi kepemilikan undangan (IDOR Protection)
      await assertInvitationOwnership(ctx.db, input.invitationId, ctx.auth.userId);

      if (input.items.length === 0) {
        return [];
      }

      // Ambil sortOrder terakhir pada slot yang dituju
      const lastItem = await ctx.db.invitationCustomContent.findFirst({
        where: {
          invitationId: input.invitationId,
          slotId: input.slotId,
        },
        orderBy: {
          sortOrder: "desc",
        },
      });
      const baseOrder = lastItem ? lastItem.sortOrder + 1 : 0;

      // Jalankan dalam $transaction agar atomik
      const createdItems = await ctx.db.$transaction(
        input.items.map((item, idx) => {
          const validatedPayload = validateContentPayload(
            item.type,
            item.content
          );
          return ctx.db.invitationCustomContent.create({
            data: {
              invitationId: input.invitationId,
              slotId: input.slotId,
              type: item.type,
              sortOrder: baseOrder + idx,
              content: validatedPayload as Prisma.InputJsonValue,
              isVisible: item.isVisible ?? true,
            },
            select: {
              id: true,
              invitationId: true,
              slotId: true,
              type: true,
              sortOrder: true,
              isVisible: true,
            },
          });
        })
      );

      return createdItems;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        invitationId: z.string().min(1),
        content: z.record(z.string(), z.unknown()).optional(),
        isVisible: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
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
          message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }

      const existingItem = await ctx.db.invitationCustomContent.findFirst({
        where: {
          id: input.id,
          invitationId: input.invitationId,
        },
      });

      if (!existingItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blok seksi kustom tidak ditemukan.",
        });
      }

      let validatedPayload: Record<string, unknown> | undefined;
      if (input.content) {
        validatedPayload = validateContentPayload(existingItem.type, input.content);
      }

      const updated = await ctx.db.invitationCustomContent.update({
        where: {
          id: input.id,
        },
        data: {
          ...(validatedPayload ? { content: validatedPayload as Prisma.InputJsonValue } : {}),
          ...(typeof input.isVisible === "boolean" ? { isVisible: input.isVisible } : {}),
          ...(typeof input.sortOrder === "number" ? { sortOrder: input.sortOrder } : {}),
        },
        select: {
          id: true,
          invitationId: true,
          slotId: true,
          type: true,
          sortOrder: true,
          isVisible: true,
        },
      });

      return {
        ...updated,
        content: validatedPayload ?? (existingItem.content as Record<string, unknown>),
      };
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        slotId: z.string().min(1),
        items: z.array(
          z.object({
            id: z.string().min(1),
            sortOrder: z.number().int().min(0),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertInvitationOwnership(ctx.db, input.invitationId, ctx.auth.userId);

      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.invitationCustomContent.updateMany({
            where: {
              id: item.id,
              invitationId: input.invitationId,
              slotId: input.slotId,
            },
            data: {
              sortOrder: item.sortOrder,
            },
          })
        )
      );

      return {
        success: true,
        reorderedCount: input.items.length,
      };
    }),

  deleteItem: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        invitationId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertInvitationOwnership(ctx.db, input.invitationId, ctx.auth.userId);

      await ctx.db.invitationCustomContent.deleteMany({
        where: {
          id: input.id,
          invitationId: input.invitationId,
        },
      });

      return {
        success: true,
        id: input.id,
      };
    }),

  deleteSlot: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().min(1),
        slotId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertInvitationOwnership(ctx.db, input.invitationId, ctx.auth.userId);

      const deleted = await ctx.db.invitationCustomContent.deleteMany({
        where: {
          invitationId: input.invitationId,
          slotId: input.slotId,
        },
      });

      return {
        success: true,
        deletedCount: deleted.count,
      };
    }),
});

