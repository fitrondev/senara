import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";

// Vercel Best Practice: Hoist static arrays/objects to module level
const FOOTER_NAV = {
  features: [
    { label: "Visual Canvas Editor", href: "/#fitur" },
    { label: "Fitur Layout Kustom", href: "/#fitur" },
    { label: "Personalisasi Tamu", href: "/#fitur" },
    { label: "Amplop Digital & QRIS", href: "/#fitur" },
    { label: "RSVP & Ucapan Real-Time", href: "/#fitur" },
  ],
  links: [
    { label: "Koleksi Template", href: "/#template" },
    { label: "Paket Harga & Add-On", href: "/harga" },
    { label: "Panduan & Contoh Teks", href: "/panduan" },
    { label: "Program Reseller White-Label", href: "/reseller" },
  ],
  legal: [
    { label: "Tanya Jawab (FAQ)", href: "/#faq" },
    { label: "Kebijakan Privasi", href: "/panduan" },
    { label: "Hubungi Dukungan", href: "https://wa.me/6281234567890" },
  ],
} as const;

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 text-muted-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Kolom 1: Profil Brand */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Sparkles className="size-4.5" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                Senara
              </span>
              <Badge
                variant="secondary"
                className="px-1.5 py-0 text-[9px] font-semibold uppercase"
              >
                SaaS
              </Badge>
            </Link>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Platform pembuatan website undangan pernikahan interaktif modern
              dengan live WYSIWYG editor, musik autoplay mulus, dan manajemen
              tamu terintegrasi.
            </p>
          </div>

          {/* Kolom 2: Fitur Utama */}
          <div className="flex flex-col gap-2.5 lg:col-span-3">
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Fitur Unggulan
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {FOOTER_NAV.features.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Navigasi */}
          <div className="flex flex-col gap-2.5 lg:col-span-3">
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Jelajahi
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {FOOTER_NAV.links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Bantuan & Legal */}
          <div className="flex flex-col gap-2.5 lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Bantuan
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {FOOTER_NAV.legal.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Garis Pemisah & Hak Cipta */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-center text-xs sm:mt-12 sm:flex-row sm:text-left">
          <p>© 2026 Senara. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Dibuat dengan</span>
            <Heart className="size-3 fill-rose-500 text-rose-500" />
            <span>untuk mengabadikan hari bahagia Anda</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

