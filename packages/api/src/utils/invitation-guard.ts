import type { Database, Prisma } from "@senara/db";
import { TRPCError } from "@trpc/server";

/**
 * Deep module for validating user ownership of an invitation.
 * Replaces repetitive IDOR verification queries across API routers with a clean,
 * consistent, and strongly-typed assertion interface.
 */
export async function assertInvitationOwnership<
  TSelect extends Prisma.InvitationSelect,
>(
  db: Database,
  invitationId: string,
  userId: string,
  select: TSelect
): Promise<Prisma.InvitationGetPayload<{ select: TSelect }>>;

export async function assertInvitationOwnership(
  db: Database,
  invitationId: string,
  userId: string
): Promise<Prisma.InvitationGetPayload<true>>;

export async function assertInvitationOwnership<
  TSelect extends Prisma.InvitationSelect,
>(
  db: Database,
  invitationId: string,
  userId: string,
  select?: TSelect
) {
  const invitation = select
    ? await db.invitation.findFirst({
        where: { id: invitationId, userId },
        select,
      })
    : await db.invitation.findFirst({
        where: { id: invitationId, userId },
      });

  if (!invitation) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
    });
  }

  return invitation;
}
