"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import {
  ArrowRight,
  Award,
  BookOpen,
  CreditCard,
  LayoutGrid,
  Menu,
  Palette,
  Sparkles,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@senara/ui/components/sheet";

const MOBILE_NAV_ITEMS = [
  {
    href: "/#fitur",
    label: "Fitur Unggulan",
    description: "Live WYSIWYG editor, musik autoplay & RSVP",
    icon: Sparkles,
  },
  {
    href: "/#template",
    label: "Katalog Template",
    description: "Koleksi desain pernikahan, ultah & khitanan",
    icon: Palette,
  },
  {
    href: "/harga",
    label: "Harga & Paket",
    description: "Coba gratis draf, bayar saat siap sebar",
    icon: CreditCard,
  },
  {
    href: "/panduan",
    label: "Panduan & Teks WA",
    description: "Tutorial 5 menit & contoh kalimat undangan",
    icon: BookOpen,
  },
  {
    href: "/reseller",
    label: "Program Reseller",
    description: "White-label merek sendiri & kalkulator cuan",
    icon: Award,
  },
] as const;

export function MobileNavSheet() {
  const [open, setOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            className="md:hidden"
            aria-label="Buka menu navigasi"
          />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>

      <SheetContent side="right" className=" flex w-[85vw] max-w-xs flex-col p-0">
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="size-4" />
            </div>
            <span className="font-serif text-base font-bold tracking-tight">
              Senara
            </span>
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[9px] font-semibold tracking-wider uppercase"
            >
              Undangan
            </Badge>
          </SheetTitle>
          <SheetDescription className="text-[11px]">
            Platform undangan digital interaktif modern.
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        <SheetFooter className="border-t bg-muted/20 p-4">
          {!isLoaded || isSignedIn ? (
            <Button
              size="default"
              className="w-full gap-2 text-xs font-semibold"
              onClick={() => setOpen(false)}
              render={<Link href="/dashboard" />}
            >
              <LayoutGrid className="size-4" />
              <span>Buka Dashboard Saya</span>
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <SignUpButton mode="modal">
                <Button
                  size="default"
                  className="w-full gap-1.5 text-xs font-semibold shadow-xs"
                  onClick={() => setOpen(false)}
                >
                  <span>Daftar & Mulai Gratis</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full text-xs font-medium"
                  onClick={() => setOpen(false)}
                >
                  Masuk ke Akun
                </Button>
              </SignInButton>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

