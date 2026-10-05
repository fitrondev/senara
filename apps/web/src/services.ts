import { createPrismaClient } from "@senara/db";

import { ENV } from "./env.server";

export const db = createPrismaClient(ENV);
