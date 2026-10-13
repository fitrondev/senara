"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import { Separator } from "@senara/ui/components/separator";
import { SidebarTrigger } from "@senara/ui/components/sidebar";

import { CreditBalanceBadge } from "@/components/credit-balance-badge";
import { ModeToggle } from "@/components/mode-toggle";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Ruang Kerja",
  "/dashboard/templates": "Pilih Template",
  "/dashboard/guests": "Tamu & Kirim WA",
  "/dashboard/rsvp": "RSVP & Buku Tamu",
  "/dashboard/stats": "Statistik Tamu",
  "/dashboard/reseller": "Workspace & Top-Up Kredit Reseller",
  "/dashboard/billing": "Tagihan & Pesanan",
  "/dashboard/account": "Pengaturan Akun",
  "/dashboard/orders": "Cek Pembayaran & Verifikasi Order",
  "/dashboard/invitations": "Kelola Semua Undangan",
  "/dashboard/master-templates": "Master Template Desain",
  "/dashboard/users": "Kelola User, Role & Saldo Kredit",
  "/dashboard/coupons": "Kelola Kupon Promo",
};

function resolvePageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }
  if (pathname.startsWith("/dashboard/guests/")) {
    return "Ruang Kerja Tamu & WhatsApp";
  }
  if (pathname.startsWith("/dashboard/stats/")) {
    return "Statistik Kunjungan Tamu";
  }
  return "Dashboard";
}

export function DashboardHeader() {
  const pathname = usePathname();
  const pageTitle = resolvePageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur-xs transition-[width,height] ease-linear lg:px-6">
      <div className="flex min-w-0 items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 my-auto h-4 data-[orientation=vertical]:self-auto"
        />
        <h1 className="truncate text-sm font-medium text-foreground">
          {pageTitle}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          render={<Link href={"/dashboard/templates" as Route} />}
          size="xs"
          className="gap-1.5 rounded-full px-3 md:hidden"
        >
          <PlusCircle className="size-3.5" />
          <span>Buat</span>
        </Button>
        <CreditBalanceBadge />
        <ModeToggle />
      </div>
    </header>
  );
}

