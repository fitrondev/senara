import type { SessionAuthObject } from "@clerk/backend";

import type { Database } from "@senara/db";

export type ClerkSessionMetadata = {
  role?:
    | "user"
    | "reseller"
    | "admin"
    | "superadmin"
    | "USER"
    | "RESELLER"
    | "ADMIN"
    | "SUPERADMIN";
};

export type Context = {
  auth:
    | (Pick<SessionAuthObject, "userId"> & {
        sessionClaims?: {
          metadata?: ClerkSessionMetadata;
        } | null;
      })
    | null;
  db: Database;
};
