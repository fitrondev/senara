import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";

// Vercel Best Practice: Hoist static arrays/objects to module level
const FOOTER_NAV = {
  features: [
    { label: "Visual Canvas Editor", href: "#fitur" },
    { label: "Fitur Isian Kamu", href: "#fitur" },
    { label: "Personalisasi Tamu", href: "#fitur" },
    { label: "Amplop Digital & QRIS", href: "#fitur" },
    { label: "RSVP & Ucapan Real-Time", href: "#fitur" },
  ],
  links: [
    { label: "Koleksi Template", href: "#template" },
    { label: "Paket Harga", href: "#harga" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "Tanya Jawab (FAQ)", href: "#faq" },
  ],
  legal: [
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Hubungi Dukungan", href: "https://wa.me/6281234567890" },
  ],
} as const;

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 text-muted-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Kolom 1: Profil Brand */}
          <div className="md:col-span-1 lg:col-span-1.5 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Sparkles className="size-4.5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Senara
              </span>
              <Badge variant="secondary" className="text-[9px] uppercase font-semibold px-1 py-0">
                SaaS
              </Badge>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs text-muted-foreground mt-1">
              Platform pembuatan website undangan pernikahan interaktif modern dengan live WYSIWYG editor, musik autoplay mulus, dan manajemen tamu terintegrasi.
            </p>
          </div>

          {/* Kolom 2: Fitur Utama */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Fitur Unggulan
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {FOOTER_NAV.features.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Navigasi */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Jelajahi
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {FOOTER_NAV.links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Bantuan & Legal */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Bantuan
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {FOOTER_NAV.legal.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Garis Pemisah & Hak Cipta */}
        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Senara. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Dibuat dengan</span>
            <Heart className="size-3 text-rose-500 fill-rose-500" />
            <span>untuk mengabadikan hari bahagia Anda</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

