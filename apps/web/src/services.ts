import { createPrismaClient, type Database } from "@senara/db";

import { ENV } from "./env.server";

const globalForPrisma = globalThis as unknown as {
  db: Database | undefined;
};

export const db = globalForPrisma.db ?? createPrismaClient(ENV);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
