import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookHeart,
  CreditCard,
  FolderKanban,
  LayoutGrid,
  Palette,
  Receipt,
  Send,
  Settings,
  Store,
  TicketPercent,
  Users,
  Wand2,
} from "lucide-react";

export type RoleType = "USER" | "RESELLER" | "ADMIN" | "SUPERADMIN";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface RoleNavigationConfig {
  roleBadgeText: string;
  quickCreateTitle: string;
  quickCreateHref: string;
  primaryNav: readonly NavItem[];
  secondaryNav: readonly NavItem[];
}

export const ROLE_NAVIGATION: Record<RoleType, RoleNavigationConfig> = {
  USER: {
    roleBadgeText: "USER",
    quickCreateTitle: "Buat Undangan Baru",
    quickCreateHref: "/dashboard/templates",
    primaryNav: [
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
        title: "Tamu & Kirim WA",
        href: "/dashboard/guests",
        icon: Send,
      },
      {
        title: "RSVP & Buku Tamu",
        href: "/dashboard/rsvp",
        icon: BookHeart,
      },
      {
        title: "Statistik Tamu",
        href: "/dashboard/stats",
        icon: BarChart3,
      },
    ],
    secondaryNav: [
      {
        title: "Tagihan & Paket",
        href: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        title: "Pengaturan Akun",
        href: "/dashboard/account",
        icon: Settings,
      },
    ],
  },

  RESELLER: {
    roleBadgeText: "RESELLER",
    quickCreateTitle: "Buat Undangan Klien",
    quickCreateHref: "/dashboard/templates",
    primaryNav: [
      {
        title: "Workspace Reseller",
        href: "/dashboard/reseller",
        icon: Store,
      },
      {
        title: "Proyek Undangan Klien",
        href: "/dashboard",
        icon: LayoutGrid,
      },
      {
        title: "Katalog Template Klien",
        href: "/dashboard/templates",
        icon: Palette,
      },
      {
        title: "Tamu & Broadcast WA",
        href: "/dashboard/guests",
        icon: Send,
      },
      {
        title: "RSVP & Buku Tamu Klien",
        href: "/dashboard/rsvp",
        icon: BookHeart,
      },
    ],
    secondaryNav: [
      {
        title: "Statistik Kunjungan",
        href: "/dashboard/stats",
        icon: BarChart3,
      },
      {
        title: "Riwayat Tagihan",
        href: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        title: "Pengaturan Akun Mitra",
        href: "/dashboard/account",
        icon: Settings,
      },
    ],
  },

  ADMIN: {
    roleBadgeText: "ADMIN OPERASIONAL",
    quickCreateTitle: "Verifikasi Pembayaran",
    quickCreateHref: "/dashboard/orders",
    primaryNav: [
      {
        title: "Overview Admin",
        href: "/dashboard",
        icon: LayoutGrid,
      },
      {
        title: "Cek Pembayaran & Order",
        href: "/dashboard/orders",
        icon: Receipt,
      },
      {
        title: "Kelola Semua Undangan",
        href: "/dashboard/invitations",
        icon: FolderKanban,
      },
      {
        title: "Template Generator",
        href: "/dashboard/template-generator",
        icon: Wand2,
      },
      {
        title: "Master Template",
        href: "/dashboard/master-templates",
        icon: Palette,
      },
    ],
    secondaryNav: [
      {
        title: "Pengaturan Akun Admin",
        href: "/dashboard/account",
        icon: Settings,
      },
    ],
  },

  SUPERADMIN: {
    roleBadgeText: "SUPERADMIN",
    quickCreateTitle: "Kelola User & Role",
    quickCreateHref: "/dashboard/users",
    primaryNav: [
      {
        title: "Dashboard Super Admin",
        href: "/dashboard",
        icon: LayoutGrid,
      },
      {
        title: "Kelola User, Role & Mitra",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Kelola Kupon Promo",
        href: "/dashboard/coupons",
        icon: TicketPercent,
      },
      {
        title: "Cek Pembayaran & Order",
        href: "/dashboard/orders",
        icon: Receipt,
      },
      {
        title: "Kelola Semua Undangan",
        href: "/dashboard/invitations",
        icon: FolderKanban,
      },
      {
        title: "Template Generator",
        href: "/dashboard/template-generator",
        icon: Wand2,
      },
      {
        title: "Master Template",
        href: "/dashboard/master-templates",
        icon: Palette,
      },
    ],
    secondaryNav: [
      {
        title: "Workspace Reseller",
        href: "/dashboard/reseller",
        icon: Store,
      },
      {
        title: "Pilih Template",
        href: "/dashboard/templates",
        icon: Palette,
      },
      {
        title: "Tamu & Kirim WA",
        href: "/dashboard/guests",
        icon: Send,
      },
      {
        title: "RSVP & Buku Tamu",
        href: "/dashboard/rsvp",
        icon: BookHeart,
      },
      {
        title: "Statistik Tamu",
        href: "/dashboard/stats",
        icon: BarChart3,
      },
      {
        title: "Tagihan & Paket",
        href: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        title: "Pengaturan Akun",
        href: "/dashboard/account",
        icon: Settings,
      },
    ],
  },
};

