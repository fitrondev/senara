import type { WebhookEvent } from "@clerk/backend";

import prisma from "@senara/db";

type ProcessResult = {
  status: "processed" | "duplicate";
};

type ProcessInput = {
  event: WebhookEvent;
  svix_id: string | null;
};

type WebhookPayloadInput = Parameters<
  typeof prisma.clerk_webhook_event.create
>[0]["data"]["payload"];

function parse_clerk_id(event: WebhookEvent): string | null {
  if (event.data && typeof event.data === "object" && "id" in event.data) {
    const maybe_id = (event.data as { id?: unknown }).id;

    return typeof maybe_id === "string" ? maybe_id : null;
  }

  return null;
}

function build_svix_id(event: WebhookEvent, svix_id: string | null): string {
  if (svix_id) {
    return svix_id;
  }

  const fallback_clerk_id = parse_clerk_id(event) ?? "unknown";

  return `${event.type}:${fallback_clerk_id}:${Date.now()}`;
}

function is_unique_violation(error: unknown): error is { code: string } {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

async function sync_user_profile(event: WebhookEvent) {
  if (event.type === "user.created" || event.type === "user.updated") {
    const user_data = event.data;

    const email = user_data.email_addresses?.[0]?.email_address ?? null;

    await prisma.user_profile.upsert({
      where: {
        clerk_user_id: user_data.id,
      },

      update: {
        email,
        first_name: user_data.first_name,
        last_name: user_data.last_name,
        username: user_data.username,
        image_url: user_data.image_url,
        last_event_at: new Date(),
        deleted_at: null,
      },

      create: {
        clerk_user_id: user_data.id,
        email,
        first_name: user_data.first_name,
        last_name: user_data.last_name,
        username: user_data.username,
        image_url: user_data.image_url,
        last_event_at: new Date(),
      },
    });

    return;
  }

  if (event.type === "user.deleted") {
    if (!event.data.id) {
      return;
    }

    await prisma.user_profile.updateMany({
      where: {
        clerk_user_id: event.data.id,
      },

      data: {
        deleted_at: new Date(),
        last_event_at: new Date(),
      },
    });
  }
}

export async function process_clerk_webhook_event({
  event,
  svix_id,
}: ProcessInput): Promise<ProcessResult> {
  const resolved_svix_id = build_svix_id(event, svix_id);

  const payload = JSON.parse(JSON.stringify(event.data)) as WebhookPayloadInput;

  const clerk_id = parse_clerk_id(event);

  try {
    await prisma.clerk_webhook_event.create({
      data: {
        svix_id: resolved_svix_id,
        event_type: event.type,
        clerk_id,
        payload,
      },
    });
  } catch (error) {
    if (is_unique_violation(error)) {
      return {
        status: "duplicate",
      };
    }

    throw error;
  }

  await sync_user_profile(event);

  return {
    status: "processed",
  };
}
