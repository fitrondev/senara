import type { Route } from "next";
import Link from "next/link";
import {
  CalendarClock,
  Check,
  Crown,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";

import {
  ADDON_ITEMS,
  DISTRIBUTION_TIMELINE,
  PRINT_VS_DIGITAL_ROWS,
} from "@/components/marketing/pricing-comparison-data";
import { formatCurrency } from "@/lib/format";

export default function HargaPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:gap-16 sm:px-6 sm:py-16">
      {/* 1. Hero Header */}
      <section className="flex flex-col items-center gap-3.5 text-center sm:gap-4">
        <Badge
          variant="outline"
          className="gap-1.5 border-primary/30 bg-primary/5 px-3 py-1 text-primary text-[11px] sm:text-xs"
        >
          <Sparkles className="size-3.5 shrink-0" />
          <span>Harga Transparan · Sekali Bayar Tanpa Langganan</span>
        </Badge>
        <h1 className="max-w-3xl font-serif font-bold text-2xl leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Coba Gratis Sepuasnya, Bayar Hanya Saat Siap Sebar
        </h1>
        <p className="max-w-2xl text-muted-foreground text-xs leading-relaxed sm:text-sm md:text-base">
          Desain dan edit undangan pernikahan, ulang tahun, atau khitanan Anda
          tanpa batas waktu draf. Terbitkan kapan saja mulai dari{" "}
          <strong className="text-foreground">Rp 29.000</strong> per undangan.
        </p>
      </section>

      {/* 2. Kartu Perbandingan Coba Gratis (Rp 0) vs Terbit Per Undangan (Rp 29.000) */}
      <section className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-between border-border p-5 shadow-xs sm:p-6">
          <div className="space-y-4">
            <CardHeader className="p-0">
              <Badge variant="secondary" className="w-fit text-xs">
                Mode Eksplorasi
              </Badge>
              <CardTitle className="mt-2 font-serif text-xl sm:text-2xl">
                Coba Gratis (Draf)
              </CardTitle>
              <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
                <span className="font-bold text-2xl whitespace-nowrap text-foreground sm:text-3xl">
                  Rp 0
                </span>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  / tanpa batas waktu draf
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5 p-0 pt-4 text-xs">
              {[
                "Akses penuh kanvas editor WYSIWYG interaktif",
                "Bebas ganti tema & pasangan font kurasi tanpa hilang data",
                "Coba fitur Foto / Tanpa Foto & fokus zoom foto",
                "Modal edit teks & warna kaya format (bold, heading, swatch)",
                "Uji coba fitur modular 'Layout Kustom' & musik latar",
                "Bagikan link pratinjau ke pasangan untuk dicek bersama",
                "Watermark draf saat pratinjau dibuka",
                "Dapat di-upgrade ke Premium kapan saja saat siap disebar",
              ].map((feat) => (
                <div key={feat} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span className="text-foreground/90">{feat}</span>
                </div>
              ))}
            </CardContent>
          </div>

          <CardFooter className="p-0 pt-6">
            <Button
              render={<Link href={"/dashboard/templates" as Route} />}
              variant="outline"
              className="w-full"
            >
              Mulai Desain Gratis Sekarang
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative flex flex-col justify-between border-2 border-primary bg-primary/5 p-5 shadow-lg sm:p-6">
          <div className="space-y-4">
            <CardHeader className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className="gap-1 bg-primary text-primary-foreground text-xs">
                  <Crown className="size-3.5 text-amber-300" />
                  <span>Paling Populer</span>
                </Badge>
                <span className="font-semibold text-primary text-xs">
                  Sekali Bayar / Acara
                </span>
              </div>
              <CardTitle className="mt-2 font-serif text-xl sm:text-2xl">
                Paket Premium (Terbit & Sebar)
              </CardTitle>
              <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
                <span className="font-bold text-2xl whitespace-nowrap text-foreground sm:text-3xl">
                  {formatCurrency(29000)}
                </span>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  / undangan aktif penuh selamanya
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5 p-0 pt-4 text-xs">
              {[
                "Tautan publik aktif selamanya tanpa watermark draf",
                "Nama tamu otomatis tanpa batas (?to=Nama+Tamu) & Link Grup WA",
                "Impor tamu CSV massal & kirim WhatsApp sekali klik",
                "Export data rekap tamu & konfirmasi RSVP ke Excel",
                "Musik latar autoplay dari Pustaka, Upload MP3, atau YouTube",
                "Dokumentasi galeri foto & pemutar video tanpa batas",
                "Amplop Digital, nomor rekening & QRIS interaktif",
                "Buku tamu & konfirmasi kehadiran RSVP real-time",
                "Bebas sisipkan blok modular Layout Kustom di posisi mana saja",
              ].map((feat) => (
                <div key={feat} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="font-medium text-foreground">{feat}</span>
                </div>
              ))}
            </CardContent>
          </div>

          <CardFooter className="p-0 pt-6">
            <Button
              render={<Link href={"/dashboard/templates" as Route} />}
              className="w-full gap-2 shadow-sm"
            >
              <Zap className="size-4" />
              <span>Buat & Terbitkan Undangan</span>
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* 3. Pilihan 2 Add-On Unggulan */}
      <section className="space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant="secondary" className="text-xs">
            Fitur Tambahan Opsional
          </Badge>
          <h2 className="font-serif font-bold text-2xl text-foreground sm:text-3xl">
            2 Add-On Unggulan Sesuai Kebutuhan Acara
          </h2>
          <p className="max-w-xl text-muted-foreground text-xs sm:text-sm">
            Tambahkan kapan saja saat menerbitkan undangan atau setelah undangan
            terbit dari dashboard Anda.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          {ADDON_ITEMS.map((addon) => (
            <Card key={addon.id} className="flex flex-col justify-between p-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    {addon.badge}
                  </Badge>
                  <span className="font-bold text-primary text-sm">
                    + {formatCurrency(addon.price)}
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground">
                  {addon.name}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {addon.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Tabel Perbandingan Biaya Undangan Cetak vs Digital (100 - 1.000 Tamu) */}
      <section className="space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant="outline" className="gap-1.5 text-emerald-600 text-xs">
            <TrendingDown className="size-3.5" />
            <span>Simulasi Penghematan Anggaran</span>
          </Badge>
          <h2 className="font-serif font-bold text-2xl text-foreground sm:text-3xl">
            Perbandingan Biaya Undangan Cetak vs Digital Senara
          </h2>
          <p className="max-w-xl text-muted-foreground text-xs sm:text-sm">
            Asumsi rata-rata biaya cetak fisik Rp 8.500/lembar (belum termasuk
            plastik, label nama, dan ongkos kirim).
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="pl-5 text-xs uppercase">
                  Jumlah Tamu
                </TableHead>
                <TableHead className="text-xs uppercase">
                  Biaya Undangan Cetak
                </TableHead>
                <TableHead className="text-xs uppercase">
                  Waktu Pengerjaan Cetak
                </TableHead>
                <TableHead className="text-xs uppercase">
                  Undangan Digital Senara
                </TableHead>
                <TableHead className="pr-5 text-right text-xs uppercase">
                  Total Penghematan
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRINT_VS_DIGITAL_ROWS.map((row) => (
                <TableRow key={row.guestCount} className="hover:bg-muted/20">
                  <TableCell className="pl-5 font-bold text-foreground text-xs">
                    {row.guestCount}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs line-through">
                    {row.printCost}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {row.printTime}
                  </TableCell>
                  <TableCell className="font-bold text-primary text-xs">
                    {row.digitalCost} (5 Menit Jadi)
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Badge className="bg-emerald-600 text-[10px] text-white">
                      {row.savings}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 5. Timeline Penyebaran H-90 s/d H-1 */}
      <section className="space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <CalendarClock className="size-3.5" />
            <span>Panduan Waktu Terbaik</span>
          </Badge>
          <h2 className="font-serif font-bold text-2xl text-foreground sm:text-3xl">
            Timeline Penyebaran Undangan (H-90 s/d H-1)
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISTRIBUTION_TIMELINE.map((item, idx) => (
            <Card key={item.day} className="p-5">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-primary text-xs">
                  {item.day}
                </Badge>
                <span className="font-serif font-bold text-muted-foreground/40 text-xl">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="mt-3 font-bold text-foreground text-sm">
                {item.title}
              </h3>
              <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

