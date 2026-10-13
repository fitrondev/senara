"use client";

import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShieldAlert } from "lucide-react";

import { Button } from "@senara/ui/components/button";

import { AdminCouponsView } from "@/components/admin/views/admin-coupons-view";
import { trpc } from "@/utils/trpc";

export default function AdminCouponsPage() {
  const { data: access, isLoading } = useQuery(
    trpc.admin.checkAccess.queryOptions()
  );

  if (isLoading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!access?.isSuperAdmin) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-3 p-6 text-center">
        <ShieldAlert className="size-8 text-destructive" />
        <p className="text-sm font-semibold">Khusus Super Admin</p>
        <p className="text-xs text-muted-foreground">
          Pengelolaan kupon promo hanya dapat diakses oleh Super Admin.
        </p>
        <Button size="sm" render={<Link href={"/admin" as Route} />}>
          Kembali ke Overview Admin
        </Button>
      </div>
    );
  }

  return <AdminCouponsView />;
}
