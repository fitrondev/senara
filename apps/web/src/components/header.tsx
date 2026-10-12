import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";

import { HeaderAuth } from "./header-auth";
import { ModeToggle } from "./mode-toggle";

// Vercel Best Practice: Hoist static arrays/objects to module level
const NAV_LINKS = [
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#template", label: "Template" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="size-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xl tracking-tight text-foreground">
              Senara
            </span>
            <Badge variant="secondary" className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0">
              Undangan
            </Badge>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Action Controls & Authentication */}
        <div className="flex items-center gap-2.5">
          <ModeToggle />
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
