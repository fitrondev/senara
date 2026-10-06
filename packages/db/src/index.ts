import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "../prisma/generated/client";
import type { DatabaseConfig } from "./config";

export function createPrismaClient(env: DatabaseConfig) {
  const databaseUrl: string = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing or undefined in environment configuration."
    );
  }
  const url: URL = new URL(databaseUrl);
  const connectionConfig = {
    host: url.hostname,
    port: parseInt(url.port || "3306", 10),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
  };

  const adapter = new PrismaMariaDb(connectionConfig);
  return new PrismaClient({ adapter });
}

export type Database = ReturnType<typeof createPrismaClient>;
