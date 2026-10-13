"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

import { db } from "@/services";
import { checkRole } from "@/utils/roles";

export interface ClerkRbacUserItem {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string;
  role: string | null;
}

function mapClerkRoleToPrismaRole(
  role: string
): "USER" | "RESELLER" | "ADMIN" | "SUPERADMIN" {
  const normalized = role.toLowerCase();
  if (normalized === "superadmin") return "SUPERADMIN";
  if (normalized === "admin") return "ADMIN";
  if (normalized === "reseller") return "RESELLER";
  return "USER";
}

export async function setRole(formData: FormData) {
  const isSuperAdmin = await checkRole("superadmin");

  if (!isSuperAdmin) {
    return {
      ok: false,
      message: "Hanya Super Admin yang berwenang mengubah role pengguna.",
    };
  }

  const targetUserId = formData.get("id") as string;
  const targetRole = (formData.get("role") as string)?.toLowerCase();

  if (!targetUserId || !targetRole) {
    return { ok: false, message: "Missing user ID or role" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: { role: targetRole },
    });

    const primaryEmail =
      res.emailAddresses.find((e) => e.id === res.primaryEmailAddressId)
        ?.emailAddress ?? `${targetUserId}@user.senara.local`;
    const fullName =
      [res.firstName, res.lastName].filter(Boolean).join(" ") ||
      "Pengguna Senara";

    const prismaRole = mapClerkRoleToPrismaRole(targetRole);

    // Sinkronkan 4 jenis role ke tabel User di Prisma database
    await db.user.upsert({
      where: { id: targetUserId },
      update: {
        role: prismaRole,
      },
      create: {
        id: targetUserId,
        email: primaryEmail,
        name: fullName,
        role: prismaRole,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/users");
    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return { ok: true, message: res.publicMetadata };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Failed to update role",
    };
  }
}

export async function removeRole(formData: FormData) {
  const isSuperAdmin = await checkRole("superadmin");

  if (!isSuperAdmin) {
    return {
      ok: false,
      message: "Hanya Super Admin yang berwenang mengubah role pengguna.",
    };
  }

  const targetUserId = formData.get("id") as string;
  if (!targetUserId) {
    return { ok: false, message: "Missing user ID" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: { role: "user" },
    });

    await db.user.updateMany({
      where: { id: targetUserId },
      data: { role: "USER" },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/users");
    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return { ok: true, message: res.publicMetadata };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Failed to remove role",
    };
  }
}

export async function searchClerkUsers(
  query: string
): Promise<ClerkRbacUserItem[]> {
  const isSuperAdmin = await checkRole("superadmin");
  if (!isSuperAdmin) {
    return [];
  }

  const client = await clerkClient();
  const trimmed = query.trim();

  const response = await client.users.getUserList(
    trimmed ? { query: trimmed, limit: 20 } : { limit: 20 }
  );

  return response.data.map((u) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    emailAddress:
      u.emailAddresses.find((email) => email.id === u.primaryEmailAddressId)
        ?.emailAddress ?? "",
    role: (u.publicMetadata?.role as string | undefined) ?? "user",
  }));
}

export async function createClerkUser(formData: FormData): Promise<{
  ok: boolean;
  message: string;
  userId?: string;
}> {
  const isSuperAdmin = await checkRole("superadmin");

  if (!isSuperAdmin) {
    return {
      ok: false,
      message: "Hanya Super Admin yang berwenang membuat pengguna baru.",
    };
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim() || undefined;
  const targetRole = ((formData.get("role") as string) || "user").toLowerCase();
  const creditBalance = Math.max(0, Number(formData.get("creditBalance")) || 0);
  const resellerBrandName =
    (formData.get("resellerBrandName") as string)?.trim() || null;

  if (!email || !password || !firstName) {
    return {
      ok: false,
      message: "Nama depan, email, dan kata sandi wajib diisi.",
    };
  }

  if (password.length < 8) {
    return {
      ok: false,
      message: "Kata sandi minimal 8 karakter.",
    };
  }

  const client = await clerkClient();

  try {
    const clerkUser = await client.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      publicMetadata: {
        role: targetRole,
      },
    });

    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const prismaRole = mapClerkRoleToPrismaRole(targetRole);

    await db.user.upsert({
      where: { id: clerkUser.id },
      update: {
        email,
        name: fullName,
        role: prismaRole,
        creditBalance,
        resellerBrandName,
      },
      create: {
        id: clerkUser.id,
        email,
        name: fullName,
        role: prismaRole,
        creditBalance,
        resellerBrandName,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/users");
    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return {
      ok: true,
      message: `Pengguna ${fullName} (${email}) berhasil didaftarkan dengan role ${prismaRole}!`,
      userId: clerkUser.id,
    };
  } catch (err: unknown) {
    let errorMessage = "Gagal membuat pengguna di Clerk.";
    if (
      err &&
      typeof err === "object" &&
      "errors" in err &&
      Array.isArray((err as { errors: unknown[] }).errors)
    ) {
      const firstError = (
        err as { errors: Array<{ message?: string; longMessage?: string }> }
      ).errors[0];
      errorMessage =
        firstError?.longMessage || firstError?.message || errorMessage;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    return {
      ok: false,
      message: errorMessage,
    };
  }
}

