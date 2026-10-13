import type { Route } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Send,
  Smartphone,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";

import { PanduanCopyTemplates } from "@/components/marketing/panduan-copy-templates";

const MOBILE_STEPS = [
  {
    step: "Langkah 1",
    title: "Pilih Desain & Mode Foto / Tanpa Foto",
    description:
      "Buka katalog template dari HP Anda, ketuk sakelar Foto / Tanpa Foto untuk melihat pratinjau instan, lalu tekan 'Pakai Template Ini'.",
    icon: Wand2,
  },
  {
    step: "Langkah 2",
    title: "Ketuk Langsung Teks di Kanvas Undangan",
    description:
      "Tidak perlu berpindah formulir yang rumit. Ketuk nama mempelai, jadwal akad, atau kutipan doa langsung di layar untuk mengeditnya.",
    icon: Smartphone,
  },
  {
    step: "Langkah 3",
    title: "Tambah Tamu, Link Grup & Sebar via WA",
    description:
      "Masukkan daftar tamu atau buat Link Grup WhatsApp, lalu kirim undangan dengan nama tamu otomatis (?to=Nama) sekali ketuk.",
    icon: Send,
  },
] as const;

export default function PanduanPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:gap-16 sm:px-6 sm:py-16">
      {/* 1. Hero Header */}
      <section className="flex flex-col items-center gap-3.5 text-center sm:gap-4">
        <Badge
          variant="outline"
          className="gap-1.5 border-primary/30 bg-primary/5 px-3 py-1 text-primary text-[11px] sm:text-xs"
        >
          <BookOpen className="size-3.5 shrink-0" />
          <span>Pusat Edukasi & Panduan Cepat Senara</span>
        </Badge>
        <h1 className="max-w-3xl font-serif font-bold text-2xl leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Buat Undangan Digital dari HP Hanya dalam 5 Menit
        </h1>
        <p className="max-w-2xl text-muted-foreground text-xs leading-relaxed sm:text-sm md:text-base">
          Pelajari cara mengedit langsung di atas kanvas undangan, mengatur musik
          YouTube/MP3, hingga menyalin contoh teks undangan siap pakai.
        </p>
      </section>

      {/* 2. Video Panduan Singkat & 3 Langkah dari HP */}
      <section className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12">
        <Card className="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/15 via-muted to-background p-6 text-center shadow-lg sm:aspect-video sm:p-8 lg:col-span-6">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md sm:size-16">
            <PlayCircle className="size-7 sm:size-8" />
          </div>
          <h3 className="mt-3.5 font-serif font-bold text-foreground text-base sm:mt-4 sm:text-lg">
            Video Tutorial: Cara Edit Undangan dari HP (2 Menit)
          </h3>
          <p className="mt-1 max-w-sm text-muted-foreground text-xs leading-relaxed">
            Lihat betapa mudahnya mengganti tema, mengatur titik fokus foto
            sampul, dan menyisipkan blok &ldquo;Layout Kustom&rdquo; langsung dari
            ponsel.
          </p>
          <Button
            render={<Link href={"/dashboard/templates" as Route} />}
            size="sm"
            className="mt-4 gap-1.5 text-xs sm:mt-5"
          >
            <Sparkles className="size-3.5" />
            <span>Praktik Langsung di Editor</span>
          </Button>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-6">
          {MOBILE_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} className="flex items-start gap-4 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {item.step}
                    </Badge>
                    <h3 className="font-bold text-foreground text-sm">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. Contoh Teks Undangan Siap Salin (Islami, Umum, Formal, Santai) */}
      <section className="space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant="secondary" className="text-xs">
            Siap Salin & Tempel
          </Badge>
          <h2 className="font-serif font-bold text-2xl text-foreground sm:text-3xl">
            Kumpulan Contoh Teks Undangan & Pengantar WhatsApp
          </h2>
          <p className="max-w-xl text-muted-foreground text-xs sm:text-sm">
            Pilih gaya bahasa yang sesuai dengan keluarga dan tamu undangan
            Anda, lalu salin dengan satu ketukan.
          </p>
        </div>

        <PanduanCopyTemplates />
      </section>

      {/* 4. Checklist Sebelum Sebar */}
      <section className="rounded-3xl border bg-muted/20 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-foreground text-xl">
              Checklist Penting Sebelum Menyebarkan Undangan
            </h3>
            <p className="text-muted-foreground text-xs">
              Pastikan 4 poin berikut sudah dicek bersama pasangan sebelum
              menekan tombol Terbitkan:
            </p>
          </div>
          <Button
            render={<Link href={"/dashboard" as Route} />}
            className="w-fit gap-2 text-xs"
          >
            <span>Buka Dashboard Saya</span>
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Ejaan nama lengkap mempelai & gelar kedua orang tua sudah benar",
            "Titik koordinat Google Maps sudah diuji buka dari HP",
            "Nomor rekening & gambar QRIS Amplop Digital sudah sesuai",
            "Detik awal musik latar ('Mulai dari') sudah pas pada bagian reff",
          ].map((tip) => (
            <div
              key={tip}
              className="flex items-start gap-2.5 rounded-xl border bg-background p-3.5 text-xs"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <span className="text-foreground/90 leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

