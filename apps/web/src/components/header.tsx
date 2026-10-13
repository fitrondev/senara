import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";

import { HeaderAuth } from "./header-auth";
import { MobileNavSheet } from "./mobile-nav-sheet";
import { ModeToggle } from "./mode-toggle";

import type { Route } from "next";

// Vercel Best Practice: Hoist static arrays/objects to module level
const NAV_LINKS = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/#template", label: "Template" },
  { href: "/harga", label: "Harga" },
  { href: "/panduan", label: "Panduan" },
  { href: "/reseller", label: "Reseller" },
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90 sm:gap-2.5"
        >
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs sm:size-9">
            <Sparkles className="size-4 sm:size-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Senara
            </span>
            <Badge
              variant="secondary"
              className="hidden px-2 py-0 text-[10px] font-semibold tracking-wider uppercase sm:inline-flex"
            >
              Undangan
            </Badge>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href as Route}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Action Controls, Auth & Mobile Drawer */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <ModeToggle />
          <HeaderAuth />
          <MobileNavSheet />
        </div>
      </div>
    </header>
  );
}
