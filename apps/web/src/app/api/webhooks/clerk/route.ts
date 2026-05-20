export const runtime = "nodejs";

import { headers } from "next/headers";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";
import { process_clerk_webhook_event } from "@senara/api";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");

    return Response.json(
      {
        success: false,
        error: "Missing webhook secret",
      },
      { status: 500 },
    );
  }

  const headers_list = await headers();

  const svix_id = headers_list.get("svix-id");
  const svix_timestamp = headers_list.get("svix-timestamp");
  const svix_signature = headers_list.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json(
      {
        success: false,
        error: "Missing svix headers",
      },
      { status: 400 },
    );
  }

  const payload = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;

  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    console.log("WEBHOOK HIT");
    console.log("EVENT:", event.type);
  } catch (error) {
    console.error("Webhook verification failed:", error);

    return Response.json(
      {
        success: false,
        error: "Invalid webhook signature",
      },
      { status: 400 },
    );
  }

  try {
    const result = await process_clerk_webhook_event({
      event,
      svix_id,
    });

    return Response.json(
      {
        success: true,
        status: result.status,
        type: event.type,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook processing failed:", error);

    return Response.json(
      {
        success: false,
        error: "Webhook processing failed",
      },
      { status: 500 },
    );
  }
}
