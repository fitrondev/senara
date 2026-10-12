"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  BarChart3,
  BookHeart,
  CreditCard,
  ExternalLink,
  Headphones,
  LayoutGrid,
  Palette,
  Send,
  Settings,
  Sparkles,
} from "lucide-react";

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
  SidebarRail,
  SidebarSeparator,
} from "@senara/ui/components/sidebar";
import { Skeleton } from "@senara/ui/components/skeleton";

import { ModeToggle } from "@/components/mode-toggle";

// Vercel Best Practice: Hoist static configuration arrays outside component render
const MAIN_NAV_ITEMS = [
  {
    title: "Undangan Saya",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Pilih Template",
    href: "/dashboard/templates",
    icon: Palette,
  },
  {
    title: "Kirim WhatsApp",
    href: "/dashboard/guests",
    icon: Send,
  },
  {
    title: "RSVP & Buku Tamu",
    href: "/dashboard/rsvp",
    icon: BookHeart,
  },
  {
    title: "Statistik Kunjungan",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Tagihan & Pesanan",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Pengaturan Akun",
    href: "/dashboard/account",
    icon: Settings,
  },
] as const;

const SUPPORT_NAV_ITEMS = [
  {
    title: "Konsultasi / CS",
    href: "https://wa.me/628123456789?text=Halo%20Admin%20Senara,%20saya%20butuh%20bantuan",
    icon: Headphones,
    isExternal: true,
  },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
        >
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-semibold tracking-tight text-sm">Senara</span>
            <span className="text-muted-foreground text-xs">Undangan Digital</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href as Route} />}
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

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Bantuan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SUPPORT_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                      tooltip={item.title}
                    >
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                      <ExternalLink className="ml-auto size-3 opacity-60" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:hidden">
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
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-medium">
                    {user?.fullName ?? user?.username ?? "Pengguna"}
                  </span>
                  <span className="text-muted-foreground truncate text-[11px]">
                    {user?.primaryEmailAddress?.emailAddress ?? ""}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <ModeToggle />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
