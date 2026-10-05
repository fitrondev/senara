import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "../prisma/generated/client";
import type { DatabaseConfig } from "./config";

export function createPrismaClient(env: DatabaseConfig) {
  const databaseUrl: string = env.DATABASE_URL;
  const url: URL = new URL(databaseUrl);
  const connectionConfig = {
    host: url.hostname,
    port: parseInt(url.port || "3306"),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  };

  const adapter = new PrismaMariaDb(connectionConfig);
  return new PrismaClient({ adapter });
}

export type Database = ReturnType<typeof createPrismaClient>;
