import { auth } from "@clerk/nextjs/server";

import type { Roles } from "../../types/globals";
import { db } from "../services";

export const checkRole = async (role: Roles): Promise<boolean> => {
  const { userId, sessionClaims } = await auth();
  const claimRole = sessionClaims?.metadata?.role?.toLowerCase() as
    | Roles
    | undefined;

  if (claimRole === role) {
    return true;
  }

  // Superadmin inherits admin access
  if (role === "admin" && claimRole === "superadmin") {
    return true;
  }

  if (userId) {
    const dbUser = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (role === "superadmin" && dbUser?.role === "SUPERADMIN") {
      return true;
    }
    if (
      role === "admin" &&
      (dbUser?.role === "ADMIN" || dbUser?.role === "SUPERADMIN")
    ) {
      return true;
    }
    if (role === "reseller" && dbUser?.role === "RESELLER") {
      return true;
    }
    if (role === "user" && dbUser?.role === "USER") {
      return true;
    }
  }

  return false;
};
