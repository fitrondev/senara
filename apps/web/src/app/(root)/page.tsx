import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Heart,
  HelpCircle,
  Layers,
  Mail,
  MapPin,
  MessageSquare,
  Music,
  Palette,
  QrCode,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@senara/ui/components/accordion";
import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";
import { Separator } from "@senara/ui/components/separator";
import { cn } from "@senara/ui/lib/utils";

// Vercel Best Practice: Hoist static data structures to module scope
const STATS = [
  { value: "< 10 Menit", label: "Waktu Pembuatan Cepat" },
  { value: "100% Langsung", label: "Dana Amplop ke Rekening Anda" },
  { value: "0% Ribet", label: "Tanpa Coding & Siap Kirim" },
  { value: "99.9%", label: "Keandalan Musik Autoplay" },
] as const;

const FEATURES = [
  {
    icon: Smartphone,
    title: "Visual WYSIWYG Canvas",
    description:
      "Edit langsung teks, foto, dan informasi acara di atas kanvas simulasi ponsel pintar dengan pratinjau real-time tanpa jeda.",
    badge: "Live Editor",
  },
  {
    icon: Layers,
    title: 'Fitur Eksklusif "Isian Kamu"',
    description:
      "Sisipkan paragraf kustom, embed video, panduan dress code, maupun peta khusus di antara section bawaan dengan slot dinamis yang rapi.",
    badge: "Fleksibel",
  },
  {
    icon: Users,
    title: "Personalisasi Tamu & WhatsApp",
    description:
      "Satu undangan untuk ribuan tamu. Buat tautan unik per nama tamu dan bagikan pesan WhatsApp terformat rapi hanya dalam satu klik.",
    badge: "Hemat Waktu",
  },
  {
    icon: CreditCard,
    title: "Amplop Digital & QRIS",
    description:
      "Fasilitasi kado pernikahan dengan tombol 1-klik salin nomor rekening bank dan QRIS statis langsung ke rekening Anda tanpa potongan.",
    badge: "Bebas Potongan",
  },
  {
    icon: MessageSquare,
    title: "Buku Tamu & RSVP Real-Time",
    description:
      "Kumpulkan konfirmasi kehadiran tamu beserta doa restu hangat secara instan dan kelola datanya langsung dari dasbor analitik.",
    badge: "Interaktif",
  },
  {
    icon: Music,
    title: "Kepatuhan Musik Autoplay",
    description:
      "Gerbang Cover Gate interaktif memastikan latar musik romantis Anda berputar mulus di seluruh browser (iOS, Android, Chrome, Safari).",
    badge: "Autoplay Ready",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Pilih Template Favorit",
    description:
      "Pilih dari beragam katalog tema pernikahan mulai dari Minimalist, Royal Floral, Modern Sage, hingga Rustic elegan.",
  },
  {
    step: "02",
    title: "Isi Data & Kustomisasi",
    description:
      "Ketik nama pasangan, waktu acara, lokasi Google Maps, nomor rekening amplop, serta galeri momen prewedding terindah Anda.",
  },
  {
    step: "03",
    title: "Sebarkan via WhatsApp",
    description:
      "Terbitkan website undangan, tambahkan daftar tamu, dan kirimkan tautan personalisasi eksklusif ke kerabat dan sahabat.",
  },
] as const;

const TEMPLATES_PREVIEW = [
  {
    id: "minimalist-elegance",
    name: "Minimalist Elegance",
    category: "Modern & Clean",
    description: "Nuansa monokromatik modern dengan tipografi serif elegan dan tata letak lapang.",
    color: "#27272a",
    tag: "Populer",
  },
  {
    id: "royal-floral",
    name: "Royal Floral",
    category: "Klasik Mewah",
    description: "Aksen bunga mawar anggun dengan palet warna rosegold dan bingkai klasik menawan.",
    color: "#be185d",
    tag: "Eksklusif",
  },
  {
    id: "modern-sage",
    name: "Modern Sage Green",
    category: "Botanikal & Alami",
    description: "Warna hijau sage menenangkan dengan sentuhan ornamen daun tropis minimalis.",
    color: "#059669",
    tag: "Favorit",
  },
  {
    id: "sunset-romance",
    name: "Sunset Romance",
    category: "Hangat & Estetis",
    description: "Gradasi rona senja tembaga dan terracotta yang memancarkan kehangatan cinta sejati.",
    color: "#ea580c",
    tag: "Baru",
  },
] as const;

const PRICING_PLANS = [
  {
    name: "Gratis (Trial)",
    price: "Rp 0",
    period: "selamanya",
    description: "Cocok untuk mencoba seluruh fitur editor visual sebelum menerbitkan undangan.",
    features: [
      "1 Proyek Undangan Aktif",
      "Akses Template Dasar",
      "Editor Visual WYSIWYG",
      "Watermark Senara",
      "Batas 50 Nama Tamu",
      "Masa Aktif 7 Hari",
    ],
    ctaText: "Coba Gratis",
    popular: false,
    variant: "outline" as const,
  },
  {
    name: "Paket Premium",
    price: "Rp 99.000",
    period: "sekali bayar",
    description: "Pilihan utama calon pengantin untuk perayaan pernikahan yang sempurna dan tanpa batas.",
    features: [
      "Semua Fitur Paket Gratis",
      "Bebas Watermark Senara",
      "Tamu Tanpa Batas (Unlimited)",
      "Masa Aktif Selamanya",
      "Amplop Digital & QRIS Statis",
      "Buku Tamu & RSVP Real-Time",
      "Musik Latar Kustom (BGM)",
      "Galeri Foto (hingga 10 foto) & Video",
      "Slot Bebas Isian Kamu",
    ],
    ctaText: "Pilih Paket Premium",
    popular: true,
    variant: "default" as const,
  },
  {
    name: "Paket Eksklusif",
    price: "Rp 199.000",
    period: "sekali bayar",
    description: "Layanan prioritas untuk pasangan dan Wedding Organizer yang menginginkan hasil maksimal.",
    features: [
      "Semua Fitur Paket Premium",
      "Dukungan Custom Domain (.com / .id)",
      "Galeri Foto Tanpa Batas",
      "Bantuan Input Data (Concierge Service)",
      "Export Data Tamu & RSVP ke Excel",
      "Format Pesan WhatsApp Generator Pro",
      "Dukungan Prioritas 24/7",
    ],
    ctaText: "Pilih Paket Eksklusif",
    popular: false,
    variant: "outline" as const,
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Senara sangat membantu kami! Dalam 15 menit undangan selesai dan tamu-tamu kami sangat kagum dengan lagu yang otomatis terputar begitu dibuka. Amplop digitalnya juga langsung masuk ke rekening.",
    author: "Adinda & Dimas",
    event: "Pernikahan di Jakarta • Menikah Sep 2026",
  },
  {
    quote:
      "Fitur personalisasi tamu dengan WhatsApp benar-benar penyelamat waktu. Kami mengirimkan 800 undangan tanpa salah sebut nama. Tampilannya elegan sekali di handphone tamu.",
    author: "Rizky & Amanda",
    event: "Pernikahan di Bandung • Menikah Ags 2026",
  },
  {
    quote:
      "Sebagai Wedding Organizer, fitur Isian Kamu dan reorder section sangat fleksibel untuk mengakomodasi rundown adat tradisional keluarga klien. Sangat saya rekomendasikan!",
    author: "Citra Kirana",
    event: "Owner Harmony Wedding Planner",
  },
] as const;

const FAQS = [
  {
    question: "Apakah tamu undangan perlu mengunduh aplikasi untuk membuka undangan?",
    answer:
      "Sama sekali tidak. Undangan Senara berbasis tautan website (web-based) yang responsif dan dapat diakses dengan cepat dari peramban apa pun (Chrome, Safari, Firefox) di smartphone maupun laptop tanpa perlu memasang aplikasi tambahan.",
  },
  {
    question: "Bagaimana cara kerja musik autoplay di smartphone?",
    answer:
      "Browser modern memblokir audio otomatis tanpa interaksi pengguna. Senara menggunakan fitur inovatif 'Cover Gate' (Layar Buka Undangan). Saat tamu menekan tombol 'Buka Undangan', interaksi tersebut secara resmi mengizinkan musik pengiring terputar seketika dengan mulus.",
  },
  {
    question: "Apakah ada potongan biaya untuk uang yang dikirimkan lewat Amplop Digital?",
    answer:
      "Tidak ada potongan sama sekali (0% fee). Tamu mentransfer langsung ke nomor rekening bank atau dompet digital Anda, atau memindai QRIS Anda sendiri. Seluruh dana 100% masuk langsung ke rekening pengantin.",
  },
  {
    question: "Bisakah saya mengubah informasi acara setelah undangan disebarkan?",
    answer:
      "Tentu saja bisa. Anda dapat memperbarui data waktu acara, lokasi gedung, foto galeri, atau teks kapan saja melalui editor Senara. Perubahan akan langsung tercermin secara otomatis bagi siapa pun yang membuka tautan undangan.",
  },
  {
    question: "Bagaimana cara kerja personalisasi nama tamu di WhatsApp?",
    answer:
      "Anda cukup menginput daftar nama tamu (atau mengimpor dari file CSV). Senara akan membuat tautan khusus per tamu (misal: senara.id/adinda-dimas?to=Bpk.+Budi) dan menyediakan tombol 1-klik untuk membuka pesan WhatsApp dengan teks pengantar yang sopan dan telah disesuaikan.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Sisi Kiri: Pesan Nilai Utama */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
              <Badge
                variant="outline"
                className="gap-2 border-primary/30 bg-primary/10 px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider"
              >
                <Sparkles className="size-3.5" />
                <span>Platform Undangan Digital Modern</span>
              </Badge>

              <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.15]">
                Undangan Digital Elegan, Selesai dalam{" "}
                <span className="text-primary underline decoration-primary/40 decoration-wavy underline-offset-8">
                  Hitungan Menit.
                </span>
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
                Buat website undangan pernikahan interaktif dengan live editor WYSIWYG, musik autoplay mulus, personalisasi nama tamu ke WhatsApp, serta amplop digital QRIS tanpa potongan biaya.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-2">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-semibold shadow-lg shadow-primary/20"
                  render={<Link href="/dashboard" />}
                >
                  <span>Mulai Buat Undangan</span>
                  <ArrowRight className="size-4" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-semibold"
                  render={<a href="#template" />}
                >
                  <Palette className="size-4 text-primary" />
                  <span>Jelajahi Template</span>
                </Button>
              </div>

              {/* Nilai Percaya Singkat */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>Tanpa Biaya Tersembunyi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>100% Responsif Seluler</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>Autoplay Musik Teruji</span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Interactive Smartphone Invitation Mockup */}
            <div id="demo" className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
                {/* Efek Glow Latar Belakang */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-amber-500/20 rounded-[44px] blur-2xl opacity-70" />

                {/* Bingkai Smartphone Mockup */}
                <div className="relative rounded-[40px] border-4 border-foreground/15 bg-background shadow-2xl overflow-hidden ring-1 ring-foreground/10">
                  {/* Speaker Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-28 bg-foreground/15 rounded-full z-20" />

                  {/* Isi Layar Simulasi Undangan */}
                  <div className="h-[560px] flex flex-col justify-between p-6 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white relative">
                    {/* Header Miniatur Undangan */}
                    <div className="pt-6 flex flex-col items-center text-center z-10">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white backdrop-blur text-[10px] tracking-widest uppercase border-none px-2.5 py-0.5"
                      >
                        The Wedding Of
                      </Badge>
                      <h2 className="mt-3 font-serif font-bold text-2xl tracking-tight text-white drop-shadow-md">
                        Adinda & Bagas
                      </h2>
                      <p className="text-white/70 text-[11px] mt-1 font-medium">
                        Minggu, 18 Oktober 2026
                      </p>
                    </div>

                    {/* Personalisasi Tamu Miniatur */}
                    <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-md border border-white/15 text-center z-10 shadow-lg">
                      <p className="text-[10px] text-white/70">Kepada Yth. Bapak/Ibu/Saudara:</p>
                      <p className="font-bold text-sm text-white mt-0.5 tracking-wide">
                        Bpk. Hendra Pratama
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-2 text-[9px] bg-white/10 text-white border-white/20 px-2 py-0"
                      >
                        Tamu Spesial
                      </Badge>
                    </div>

                    {/* Tombol Buka Undangan Mockup */}
                    <div className="pb-2 flex flex-col items-center gap-3 z-10">
                      <div className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-zinc-950 py-3 px-4 font-semibold text-xs shadow-xl transition-transform hover:scale-105 cursor-pointer">
                        <Mail className="size-3.5 text-primary" />
                        <span>Buka Undangan</span>
                      </div>
                      <span className="text-[10px] text-white/50 text-center">
                        ♫ Sentuh untuk memutar lagu latar
                      </span>
                    </div>

                    {/* Miniatur Floating Badges */}
                    <div className="absolute top-1/3 -right-3 rounded-lg bg-card text-card-foreground border p-2 shadow-xl text-[10px] flex items-center gap-1.5 animate-bounce [animation-duration:3s]">
                      <CreditCard className="size-3 text-emerald-500" />
                      <span className="font-medium">Amplop QRIS Aktif</span>
                    </div>

                    <div className="absolute bottom-1/4 -left-3 rounded-lg bg-card text-card-foreground border p-2 shadow-xl text-[10px] flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 text-primary" />
                      <span className="font-medium">RSVP Terkonfirmasi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Baris Statistik */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((item) => (
              <Card key={item.label} className="p-4 text-center border-border/60 bg-card/60 backdrop-blur-xs">
                <span className="font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
                  {item.value}
                </span>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FITUR UNGGULAN SECTION
         ========================================================================= */}
      <section id="fitur" className="py-20 md:py-28 bg-muted/20 border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
              Fitur Lengkap
            </Badge>
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
              Semua yang Anda Butuhkan untuk Momen Teristimewa
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Dari pengeditan visual hingga distribusi pesan ke ratusan tamu, Senara dirancang untuk kemudahan maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="p-6 transition-all duration-300 hover:shadow-md hover:border-primary/40 flex flex-col justify-between"
                >
                  <CardHeader className="p-0 gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold tracking-tight text-foreground mt-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CARA KERJA (HOW IT WORKS)
         ========================================================================= */}
      <section id="cara-kerja" className="py-20 md:py-28 border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
              Alur Cepat
            </Badge>
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
              Tiga Langkah Mudah Menuju Hari Bahagia
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Tidak butuh waktu berhari-hari. Publikasikan undangan Anda dalam hitungan menit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <Card
                key={item.step}
                className="relative p-6 border-dashed transition-colors hover:border-solid hover:border-primary/40"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-3xl font-extrabold text-primary/30">
                    {item.step}
                  </span>
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    ✓
                  </div>
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SHOWCASE TEMPLATE
         ========================================================================= */}
      <section id="template" className="py-20 md:py-28 bg-muted/20 border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-14">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <Badge variant="outline" className="w-fit mx-auto sm:mx-0 text-xs uppercase tracking-wider text-primary border-primary/30">
                Katalog Desain
              </Badge>
              <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
                Koleksi Template Elegan
              </h2>
              <p className="text-muted-foreground text-sm">
                Dirancang khusus dengan estetika premium yang memikat mata setiap tamu.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs font-semibold"
              render={<Link href="/dashboard/templates" />}
            >
              <span>Lihat Semua Template</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES_PREVIEW.map((tpl) => (
              <Card
                key={tpl.id}
                className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Visual Header Kotak Warna Tema */}
                <div
                  className="h-44 w-full flex flex-col justify-between p-4 relative text-white"
                  style={{ backgroundColor: tpl.color }}
                >
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur text-[10px]">
                      {tpl.category}
                    </Badge>
                    <Badge variant="outline" className="bg-black/30 border-white/20 text-white text-[10px]">
                      {tpl.tag}
                    </Badge>
                  </div>
                  <div className="font-serif font-bold text-lg leading-tight drop-shadow-sm">
                    {tpl.name}
                  </div>
                </div>

                <CardContent className="p-4 flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {tpl.description}
                  </p>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    size="sm"
                    className="w-full text-xs font-semibold"
                    render={<Link href="/dashboard/templates" />}
                  >
                    <span>Gunakan Template Ini</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PAKET HARGA (PRICING)
         ========================================================================= */}
      <section id="harga" className="py-20 md:py-28 border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
              Paket & Biaya
            </Badge>
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
              Investasi Terjangkau, Tanpa Biaya Tersembunyi
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Pilih paket yang paling sesuai dengan kebutuhan perayaan pernikahan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "p-6 flex flex-col justify-between relative transition-all duration-300",
                  plan.popular
                    ? "border-primary ring-2 ring-primary/20 shadow-xl lg:-translate-y-2 bg-card"
                    : "border-border shadow-xs"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-0.5 shadow-sm">
                    Paling Populer
                  </Badge>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6 flex items-baseline gap-1.5">
                    <span className="font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-muted-foreground">/{plan.period}</span>
                  </div>

                  <Separator className="mb-6" />

                  {/* Daftar Fitur */}
                  <ul className="flex flex-col gap-3 text-xs mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.variant}
                  size="default"
                  className={cn("w-full font-semibold text-xs", plan.popular && "shadow-md")}
                  render={<Link href="/dashboard/billing" />}
                >
                  {plan.ctaText}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. TESTIMONI PENGGUNA
         ========================================================================= */}
      <section className="py-20 md:py-28 bg-muted/20 border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
              Kisah Bahagia
            </Badge>
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
              Dipercaya Pasangan Pengantin & Vendor Pernikahan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Pengalaman nyata mereka yang telah mempercayakan momen sakralnya bersama Senara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, index) => (
              <Card key={index} className="p-6 flex flex-col justify-between">
                <div>
                  {/* Bintang Ulasan */}
                  <div className="flex items-center gap-1 mb-4 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-foreground italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-bold text-xs text-foreground">{t.author}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t.event}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. TANYA JAWAB (FAQ)
         ========================================================================= */}
      <section id="faq" className="py-20 md:py-28 border-b">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-3 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
              Tanya Jawab
            </Badge>
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-muted-foreground text-sm">
              Semua jawaban atas keraguan Anda seputar undangan digital Senara.
            </p>
          </div>

          <Accordion className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-sm font-semibold text-foreground py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* =========================================================================
          8. CALL TO ACTION BANNER (PENUTUP)
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center flex flex-col items-center gap-6">
          <Badge
            variant="secondary"
            className="bg-white/20 text-white backdrop-blur text-xs uppercase tracking-widest border-none px-3 py-1 font-semibold"
          >
            Mulai Hari Ini
          </Badge>

          <h2 className="font-extrabold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
            Siap Membuat Undangan Pernikahan Impian Anda?
          </h2>

          <p className="text-white/85 text-sm sm:text-base max-w-xl leading-relaxed">
            Bergabunglah bersama ribuan pasangan lain. Buat, sesuaikan, dan kirimkan undangan digital Anda dalam waktu kurang dari 10 menit.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto font-semibold text-sm bg-white text-zinc-950 hover:bg-white/90 shadow-xl"
              render={<Link href="/dashboard" />}
            >
              <span>Daftar & Buat Undangan Sekarang</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
