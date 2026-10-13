"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import type { RoleType } from "@/components/dashboard/role-navigation";
import { AdminDashboardView } from "@/components/dashboard/views/admin-dashboard-view";
import { ResellerDashboardView } from "@/components/dashboard/views/reseller-dashboard-view";
import { SuperAdminDashboardView } from "@/components/dashboard/views/superadmin-dashboard-view";
import { UserDashboardView } from "@/components/dashboard/views/user-dashboard-view";
import { trpc } from "@/utils/trpc";

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { data: access, isLoading: isAccessLoading } = useQuery(
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

  if (!isUserLoaded || isAccessLoading) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground">
          Menyiapkan ruang kerja sesuai role Anda...
        </p>
      </div>
    );
  }

  if (effectiveRole === "SUPERADMIN") {
    return <SuperAdminDashboardView />;
  }

  if (effectiveRole === "ADMIN") {
    return <AdminDashboardView />;
  }

  if (effectiveRole === "RESELLER") {
    return <ResellerDashboardView />;
  }

  return <UserDashboardView />;
}
