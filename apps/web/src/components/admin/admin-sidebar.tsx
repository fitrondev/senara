"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Crown,
  FolderKanban,
  LayoutDashboard,
  Palette,
  PlusCircle,
  Receipt,
  Shield,
  Store,
  TicketPercent,
  Users,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@senara/ui/components/sidebar";
import { Skeleton } from "@senara/ui/components/skeleton";

import { trpc } from "@/utils/trpc";

// 1. Menu Operasional Harian (Tampil untuk ADMIN & SUPERADMIN)
const OPERATIONAL_ADMIN_NAV = [
  {
    title: "Ringkasan Platform",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Master Template",
    href: "/admin/templates",
    icon: Palette,
  },
  {
    title: "Pesanan & Verifikasi",
    href: "/admin/orders",
    icon: Receipt,
  },
  {
    title: "Moderasi Undangan",
    href: "/admin/invitations",
    icon: FolderKanban,
  },
] as const;

// 2. Menu Otoritas Penuh (Khusus SUPERADMIN)
const SUPERADMIN_ONLY_NAV = [
  {
    title: "Pengguna, 4 Role & Reseller",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Kupon & Diskon Promo",
    href: "/admin/coupons",
    icon: TicketPercent,
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { isMobile, setOpenMobile } = useSidebar();

  const { data: access } = useQuery(trpc.admin.checkAccess.queryOptions());

  const clerkRole = (
    user?.publicMetadata?.role as string | undefined
  )?.toUpperCase();

  const isSuperAdmin =
    access?.isSuperAdmin ||
    access?.role === "SUPERADMIN" ||
    clerkRole === "SUPERADMIN";

  const handleCloseMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader className="pt-3 pb-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link href={"/admin" as Route} onClick={handleCloseMobile} />
              }
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-foreground/80 text-foreground">
                {isSuperAdmin ? (
                  <Crown className="size-3 text-amber-500" />
                ) : (
                  <Shield className="size-3 text-primary" />
                )}
              </div>
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                Senara Admin
              </span>
              {isSuperAdmin ? (
                <Badge className="ml-auto h-4 bg-amber-500 px-1.5 text-[9px] font-bold text-amber-950">
                  SUPERADMIN
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="ml-auto h-4 px-1.5 text-[9px] font-bold"
                >
                  ADMIN
                </Badge>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-2">
        {/* Grup 1: Operasional Harian (ADMIN & SUPERADMIN) */}
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  render={
                    <Link
                      href={
                        (isSuperAdmin
                          ? "/admin/templates"
                          : "/admin/orders") as Route
                      }
                      onClick={handleCloseMobile}
                    />
                  }
                  tooltip={
                    isSuperAdmin
                      ? "Kelola Master Template"
                      : "Verifikasi Bukti Transfer"
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground h-9 min-w-8 rounded-full px-3.5 py-2 font-medium shadow-xs duration-200 ease-linear"
                >
                  <PlusCircle className="size-4 shrink-0" />
                  <span>
                    {isSuperAdmin ? "Tambah Template" : "Verifikasi Pesanan"}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu>
              {OPERATIONAL_ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.href as Route}
                          onClick={handleCloseMobile}
                        />
                      }
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Grup 2: Otoritas Super Admin (Khusus SUPERADMIN) */}
        {isSuperAdmin ? (
          <SidebarGroup>
            <SidebarGroupLabel>Otoritas Super Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SUPERADMIN_ONLY_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={
                          <Link
                            href={item.href as Route}
                            onClick={handleCloseMobile}
                          />
                        }
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Icon className="size-4 text-amber-500" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {/* Grup 3: Pintasan Ruang Kerja */}
        <SidebarGroup>
          <SidebarGroupLabel>Pintasan Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href={"/dashboard" as Route}
                      onClick={handleCloseMobile}
                    />
                  }
                  tooltip="Kembali ke Dashboard User"
                >
                  <ArrowLeft className="size-4" />
                  <span>Dashboard Pengguna</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isSuperAdmin ? (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link
                        href={"/dashboard/reseller" as Route}
                        onClick={handleCloseMobile}
                      />
                    }
                    tooltip="Buka Workspace Reseller"
                  >
                    <Store className="size-4" />
                    <span>Workspace Reseller</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-sidebar-accent/60">
          {!isLoaded ? (
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-28" />
              </div>
            </div>
          ) : (
            <>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8",
                  },
                }}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-medium text-foreground">
                  {user?.fullName ?? user?.username ?? "Admin Senara"}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </span>
              </div>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
