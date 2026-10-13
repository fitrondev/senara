import { NextResponse } from "next/server";

import { db } from "@/services";

interface BeaconPayload {
  invitationId?: string;
  guestId?: string;
  guestName?: string;
  deviceType?: string;
  browser?: string;
  deviceFingerprint?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BeaconPayload;
    const invitationId = body.invitationId?.trim();
    if (!invitationId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    let resolvedGuestId = body.guestId?.trim() || null;
    let resolvedGuestName = body.guestName?.trim() || null;

    if (resolvedGuestId || resolvedGuestName) {
      const guest = await db.guest.findFirst({
        where: {
          invitationId,
          ...(resolvedGuestId
            ? { OR: [{ id: resolvedGuestId }, { customSlug: resolvedGuestId }] }
            : { name: resolvedGuestName ?? undefined }),
        },
      });

      if (guest) {
        resolvedGuestId = guest.id;
        resolvedGuestName = guest.name;

        const currentFingerprints = Array.isArray(guest.deviceFingerprints)
          ? (guest.deviceFingerprints as string[])
          : [];
        const nextFingerprints =
          body.deviceFingerprint &&
          !guest.isGroupLink &&
          !currentFingerprints.includes(body.deviceFingerprint)
            ? [...currentFingerprints, body.deviceFingerprint]
            : currentFingerprints;

        await db.guest.update({
          where: { id: guest.id },
          data: {
            viewCount: { increment: 1 },
            lastViewedAt: new Date(),
            deviceFingerprints: nextFingerprints,
          },
        });
      }
    }

    await db.pageViewStat.create({
      data: {
        invitationId,
        guestId: resolvedGuestId,
        guestName: resolvedGuestName,
        deviceType: body.deviceType ?? "mobile",
        browser: body.browser ?? "unknown",
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

