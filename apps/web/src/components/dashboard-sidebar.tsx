"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  Crown,
  ExternalLink,
  Headphones,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Store,
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

import {
  ROLE_NAVIGATION,
  type RoleType,
} from "@/components/dashboard/role-navigation";
import { trpc } from "@/utils/trpc";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { isMobile, setOpenMobile } = useSidebar();

  const { data: access } = useQuery(trpc.admin.checkAccess.queryOptions());

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

  const navConfig = ROLE_NAVIGATION[effectiveRole];

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
              render={<Link href="/dashboard" onClick={handleCloseMobile} />}
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-foreground/80 text-foreground">
                {effectiveRole === "SUPERADMIN" ? (
                  <Crown className="size-3 text-amber-500" />
                ) : effectiveRole === "ADMIN" ? (
                  <ShieldCheck className="size-3 text-blue-500" />
                ) : effectiveRole === "RESELLER" ? (
                  <Store className="size-3 text-emerald-600" />
                ) : (
                  <Sparkles className="size-3" />
                )}
              </div>
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                {effectiveRole === "RESELLER" && access?.resellerBrandName
                  ? access.resellerBrandName
                  : "Senara Inc."}
              </span>
              {effectiveRole === "SUPERADMIN" ? (
                <Badge className="ml-auto h-4 bg-amber-500 px-1.5 text-[9px] font-bold text-amber-950">
                  SUPERADMIN
                </Badge>
              ) : effectiveRole === "ADMIN" ? (
                <Badge className="ml-auto h-4 bg-blue-600 px-1.5 text-[9px] font-bold text-white">
                  ADMIN
                </Badge>
              ) : effectiveRole === "RESELLER" ? (
                <Badge className="ml-auto h-4 bg-emerald-600 px-1.5 text-[9px] font-bold text-white">
                  RESELLER
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="ml-auto h-4 px-1.5 text-[9px] font-medium"
                >
                  USER
                </Badge>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-2">
        {/* Grup Utama sesuai Role */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {effectiveRole === "SUPERADMIN"
              ? "Menu Utama Super Admin"
              : effectiveRole === "ADMIN"
                ? "Menu Operasional Admin"
                : effectiveRole === "RESELLER"
                  ? "Menu Mitra Reseller"
                  : "Menu Utama Pengguna"}
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  render={
                    <Link
                      href={navConfig.quickCreateHref as Route}
                      onClick={handleCloseMobile}
                    />
                  }
                  tooltip={navConfig.quickCreateTitle}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground h-9 min-w-8 rounded-full px-3.5 py-2 font-medium shadow-xs duration-200 ease-linear"
                >
                  <PlusCircle className="size-4 shrink-0" />
                  <span>{navConfig.quickCreateTitle}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu>
              {navConfig.primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
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

        {/* Grup Kedua sesuai Role */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>
            {effectiveRole === "SUPERADMIN"
              ? "Akses Seluruh Fitur Website"
              : effectiveRole === "ADMIN"
                ? "Akun & Preferensi"
                : effectiveRole === "RESELLER"
                  ? "Performa & Akun Mitra"
                  : "Fitur Lanjutan & Akun"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navConfig.secondaryNav.map((item) => {
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
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {effectiveRole === "USER" || effectiveRole === "RESELLER" ? (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <a
                        href="https://wa.me/628123456789?text=Halo%20Admin%20Senara,%20saya%20butuh%20bantuan"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleCloseMobile}
                      />
                    }
                    tooltip="Konsultasi / CS"
                  >
                    <Headphones className="size-4" />
                    <span>
                      {effectiveRole === "RESELLER"
                        ? "Dukungan Prioritas Mitra"
                        : "Konsultasi / CS"}
                    </span>
                    <ExternalLink className="ml-auto size-3 opacity-60" />
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
                  {user?.fullName ?? user?.username ?? "Pengguna"}
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
