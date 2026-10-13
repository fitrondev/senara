import { TRPCError, initTRPC } from "@trpc/server";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export type AppRole = "USER" | "RESELLER" | "ADMIN" | "SUPERADMIN";

export function normalizeClerkRole(clerkRole?: string | null): AppRole | null {
  if (!clerkRole) return null;
  const upper = clerkRole.toUpperCase();
  if (
    upper === "USER" ||
    upper === "RESELLER" ||
    upper === "ADMIN" ||
    upper === "SUPERADMIN"
  ) {
    return upper;
  }
  return null;
}

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  const userId = ctx.auth?.userId;
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No Clerk userId",
    });
  }
  return next({
    ctx: {
      ...ctx,
      auth: {
        userId,
        sessionClaims: ctx.auth?.sessionClaims ?? null,
      },
    },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const userId = ctx.auth.userId;
  const clerkDbRole = normalizeClerkRole(ctx.auth.sessionClaims?.metadata?.role);

  let user = await ctx.db.user.findUnique({
    where: { id: userId },
  });

  const adminCount = await ctx.db.user.count({
    where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
  });

  if (!user) {
    const initialRole: AppRole =
      clerkDbRole ?? (adminCount === 0 ? "SUPERADMIN" : "USER");
    user = await ctx.db.user.create({
      data: {
        id: userId,
        email: `${userId}@user.senara.local`,
        name: "Super Admin Senara",
        role: initialRole,
      },
    });
  } else if (clerkDbRole && user.role !== clerkDbRole) {
    user = await ctx.db.user.update({
      where: { id: userId },
      data: { role: clerkDbRole },
    });
  } else if (
    user.role !== "ADMIN" &&
    user.role !== "SUPERADMIN" &&
    adminCount === 0
  ) {
    user = await ctx.db.user.update({
      where: { id: userId },
      data: { role: "SUPERADMIN" },
    });
  }

  const isAllowedAdmin =
    user.role === "ADMIN" ||
    user.role === "SUPERADMIN" ||
    clerkDbRole === "ADMIN" ||
    clerkDbRole === "SUPERADMIN";

  if (!isAllowedAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "Akses ditolak. Halaman ini hanya untuk Admin & Super Admin Senara.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      adminUser: user,
    },
  });
});

export const superAdminProcedure = adminProcedure.use(({ ctx, next }) => {
  const clerkDbRole = normalizeClerkRole(ctx.auth.sessionClaims?.metadata?.role);
  const isSuperAdmin =
    ctx.adminUser.role === "SUPERADMIN" || clerkDbRole === "SUPERADMIN";

  if (!isSuperAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "Akses ditolak. Tindakan ini memerlukan otoritas SUPERADMIN.",
    });
  }

  return next({ ctx });
});

