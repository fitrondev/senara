"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";

import { Button } from "@senara/ui/components/button";

import type { RoleType } from "@/components/dashboard/role-navigation";
import { trpc } from "@/utils/trpc";

export default function SuperAdminRoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const { data: access, isLoading } = useQuery(
    trpc.admin.checkAccess.queryOptions()
  );

  const clerkRole = (
    user?.publicMetadata?.role as string | undefined
  )?.toUpperCase();

  const effectiveRole: RoleType =
    access?.role ??
    (clerkRole === "SUPERADMIN" ||
    clerkRole === "ADMIN" ||
    clerkRole === "RESELLER"
      ? clerkRole
      : "USER");

  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-7 animate-spin text-amber-500" />
        <p className="text-xs font-medium text-muted-foreground">
          Memverifikasi otoritas Super Admin...
        </p>
      </div>
    );
  }

  if (effectiveRole !== "SUPERADMIN") {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-2xl bg-destructive/10 p-4 text-destructive">
          <ShieldAlert className="size-9" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight">
            Akses Khusus Super Admin
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Halaman pengelolaan User, Role & Kupon Promo ini hanya dapat diakses
            oleh akun dengan otoritas tertinggi{" "}
            <strong className="text-foreground">SUPERADMIN</strong>.
          </p>
        </div>
        <Button
          render={<Link href={"/dashboard" as Route} />}
          size="sm"
          className="gap-1.5"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Dashboard</span>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

