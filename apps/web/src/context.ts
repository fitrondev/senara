import type { NextRequest } from "next/server";

import { createClerkClient } from "@clerk/backend";

import type { Context as ApiContext } from "@senara/api/context";

import { ENV } from "./env.server";
import { db } from "./services";

type ClerkContextAuth = ApiContext["auth"];

function toClerkContextAuth(auth: ClerkContextAuth): ClerkContextAuth {
  return auth ? { userId: auth.userId } : null;
}

const clerkClient = createClerkClient({
  secretKey: ENV.CLERK_SECRET_KEY,
  publishableKey: ENV.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

async function authenticateClerkRequest(
  request: Request
): Promise<ClerkContextAuth> {
  const requestState = await clerkClient.authenticateRequest(request, {
    authorizedParties: [ENV.CORS_ORIGIN],
  });
  return toClerkContextAuth(requestState.toAuth());
}

export async function createContext(req: NextRequest): Promise<ApiContext> {
  const clerkAuth = await authenticateClerkRequest(req);
  return {
    db,
    auth: clerkAuth,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
