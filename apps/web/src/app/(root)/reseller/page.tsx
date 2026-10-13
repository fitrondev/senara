import type { Route } from "next";
import Link from "next/link";
import {
  Award,
  Check,
  Crown,
  Infinity as InfinityIcon,
  Link2,
  Sparkles,
  Store,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";

import { ResellerProfitCalculator } from "@/components/marketing/reseller-profit-calculator";
import { CREDIT_PACKAGES } from "@/components/reseller/reseller-constants";
import { formatCurrency } from "@/lib/format";

const RESELLER_PILLARS = [
  {
    icon: Store,
    title: "100% White-Label Merek Sendiri",
    desc: "Ganti footer 'Senara Invitation Platform' pada seluruh undangan klien dengan nama brand dan logo bisnis Anda sendiri.",
  },
  {
    icon: Link2,
    title: "Fitur 'Tautan Formulir Klien'",
    desc: "Kirim satu tautan formulir khusus ke klien via WhatsApp. Klien melengkapi sendiri nama mempelai, jadwal, dan lokasi—otomatis jadi draf siap edit!",
  },
  {
    icon: InfinityIcon,
    title: "Kredit Tanpa Masa Hangus",
    desc: "1 kredit = Rp 1.000. Cukup 5 kredit untuk membuat 1 undangan premium langsung aktif. Saldo berlaku selamanya dan tidak pernah hangus.",
  },
] as const;

export default function ResellerPublicPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:gap-16 sm:px-6 sm:py-16">
      {/* 1. Hero Header */}
      <section className="flex flex-col items-center gap-3.5 text-center sm:gap-4">
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/5 text-primary gap-1.5 px-3 py-1 text-[11px] sm:text-xs"
        >
          <Award className="size-3.5 shrink-0" />
          <span>Program Kemitraan & Reseller White-Label</span>
        </Badge>
        <h1 className="text-foreground max-w-3xl font-serif text-2xl leading-snug font-bold tracking-tight sm:text-3xl md:text-4xl">
          Miliki Bisnis Undangan Digital dengan Merek Anda Sendiri
        </h1>
        <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed sm:text-sm md:text-base">
          Tanpa biaya sewa server bulanan, tanpa perlu coding. Gunakan mesin
          editor Senara, pasang merek Anda sendiri, dan nikmati margin
          keuntungan hingga <strong className="text-foreground">80%+</strong>{" "}
          per pesanan.
        </p>
        <div className="mt-2 flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
          <Button
            render={<Link href={"/dashboard/reseller" as Route} />}
            className="w-full gap-2 sm:w-auto"
          >
            <Sparkles className="size-4" />
            <span>Buka Dashboard Reseller</span>
          </Button>
          <Button
            render={<Link href={"/harga" as Route} />}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Lihat Harga Satuan
          </Button>
        </div>
      </section>

      {/* 2. 3 Keunggulan Utama Reseller */}
      <section className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {RESELLER_PILLARS.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="space-y-3 p-5 sm:p-6">
              <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
                <Icon className="size-5" />
              </div>
              <h3 className="text-foreground text-base font-bold">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {item.desc}
              </p>
            </Card>
          );
        })}
      </section>

      {/* 3. Kalkulator Interaktif "Hitung Untungmu" */}
      <section>
        <ResellerProfitCalculator />
      </section>

      {/* 4. Tabel Harga Paket Kredit (1, 5, 10, 20, 50 Kredit) */}
      <section className="space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant="secondary" className="text-xs">
            Saldo Berlaku Selamanya
          </Badge>
          <h2 className="text-foreground font-serif text-2xl font-bold sm:text-3xl">
            Tabel Harga Paket Kredit Reseller
          </h2>
          <p className="text-muted-foreground max-w-xl text-xs sm:text-sm">
            Sistem kredit transparan: 1 Kredit = Rp 1.000. Setiap pembuatan
            undangan premium reseller membutuhkan 5 kredit (modal hanya Rp 5.000
            per undangan).
          </p>
        </div>

        <div className="bg-card overflow-hidden rounded-2xl border shadow-xs">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="pl-5 text-xs uppercase">
                  Paket Kredit
                </TableHead>
                <TableHead className="text-xs uppercase">
                  Harga per Kredit
                </TableHead>
                <TableHead className="text-xs uppercase">
                  Total Harga Paket
                </TableHead>
                <TableHead className="text-xs uppercase">Cocok Untuk</TableHead>
                <TableHead className="pr-5 text-right text-xs uppercase">
                  Kapasitas Undangan
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CREDIT_PACKAGES.map((pkg) => (
                <TableRow key={pkg.credits} className="hover:bg-muted/20">
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-xs font-bold">
                        {pkg.name}
                      </span>
                      {"isPopular" in pkg && pkg.isPopular ? (
                        <Badge className="bg-primary text-primary-foreground gap-1 text-[10px]">
                          <Crown className="size-2.5 text-amber-300" />
                          <span>Terlaris</span>
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-primary text-xs font-bold">
                    {formatCurrency(pkg.pricePerCredit)} / kredit
                  </TableCell>
                  <TableCell className="text-foreground font-mono text-xs font-semibold">
                    {formatCurrency(pkg.totalPrice)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {pkg.recommendedFor}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Badge
                      variant="default"
                      className="bg-emerald-600 text-[10px] text-white"
                    >
                      {pkg.discountBadge}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-muted/20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {[
              "Bebas masa aktif kredit (Tidak pernah hangus)",
              "Gratis fitur White-Label Merek & Logo",
              "Gratis fitur Tautan Formulir Klien tanpa batas",
            ].map((item) => (
              <span
                key={item}
                className="text-foreground flex items-center gap-1.5 font-medium"
              >
                <Check className="size-4 text-emerald-600" />
                <span>{item}</span>
              </span>
            ))}
          </div>

          <Button
            render={<Link href={"/dashboard/reseller" as Route} />}
            size="sm"
            className="gap-1.5 text-xs"
          >
            <span>Mulai Jadi Reseller</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
