"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Crown,
  Loader2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Separator } from "@senara/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@senara/ui/components/sidebar";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { trpc } from "@/utils/trpc";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { data: access, isLoading } = useQuery(
    trpc.admin.checkAccess.queryOptions()
  );

  const clerkMetadataRole = (
    user?.publicMetadata?.role as string | undefined
  )?.toLowerCase();
  const hasClerkAdminRole =
    clerkMetadataRole === "admin" || clerkMetadataRole === "superadmin";
  const isSuperAdmin =
    Boolean(access?.isSuperAdmin) || clerkMetadataRole === "superadmin";

  if (!isClerkLoaded || isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-amber-500" />
        <p className="text-muted-foreground text-xs font-medium">
          Memverifikasi hak akses Admin / Super Admin (RBAC)...
        </p>
      </div>
    );
  }

  if (!access?.isAdmin && !hasClerkAdminRole) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="bg-destructive/10 text-destructive rounded-2xl p-4">
          <ShieldAlert className="size-10" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h1 className="text-xl font-bold tracking-tight">
            Akses Terbatas — Admin & Super Admin
          </h1>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Halaman ini dilindungi oleh Role-Based Access Control (RBAC) dan
            hanya dapat diakses oleh pengguna dengan role <code>admin</code>{" "}
            atau <code>superadmin</code> pada Clerk <code>publicMetadata</code>{" "}
            atau database sistem.
          </p>
        </div>
        <Button
          render={<Link href={"/" as Route} />}
          size="sm"
          className="gap-1.5"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Beranda</span>
        </Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear lg:px-6">
          <div className="flex min-w-0 items-center gap-1 lg:gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 my-auto h-4 data-[orientation=vertical]:self-auto"
            />
            <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
              {isSuperAdmin ? (
                <Crown className="size-4 shrink-0 text-amber-500" />
              ) : (
                <ShieldCheck className="size-4 shrink-0 text-blue-500" />
              )}
              <span className="truncate">Panel Administrasi Platform</span>
              {isSuperAdmin ? (
                <Badge className="hidden bg-amber-500 text-[10px] text-amber-950 sm:inline-flex">
                  Super Admin
                </Badge>
              ) : (
                <Badge className="hidden bg-blue-600 text-[10px] text-white sm:inline-flex">
                  Admin Operasional
                </Badge>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              render={<Link href={"/dashboard" as Route} />}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Ruang Kerja User</span>
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
