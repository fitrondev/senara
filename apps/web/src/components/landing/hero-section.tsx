import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Mail,
  Palette,
  Sparkles,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";

import { STATS } from "./landing-data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background pt-10 pb-14 sm:pt-14 sm:pb-18 md:pt-20 md:pb-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12">
          <div className="flex flex-col items-center gap-4 text-center sm:gap-5 lg:col-span-7 lg:items-start lg:text-left">
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-primary uppercase sm:gap-2 sm:px-3.5 sm:text-xs"
            >
              <Sparkles className="size-3.5 shrink-0" />
              <span>Platform Undangan Digital Modern</span>
            </Badge>

            <h1 className="max-w-2xl font-serif text-2xl leading-[1.25] font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
              Undangan Digital Elegan, Selesai dalam{" "}
              <span className="text-primary underline decoration-primary/40 decoration-wavy underline-offset-4 sm:underline-offset-8">
                Hitungan Menit.
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Buat website undangan pernikahan interaktif dengan live editor
              WYSIWYG, musik autoplay mulus, personalisasi nama tamu ke WhatsApp,
              serta amplop digital QRIS tanpa potongan biaya.
            </p>

            <div className="flex w-full flex-col items-center gap-3 pt-1 sm:w-auto sm:flex-row sm:gap-3.5 sm:pt-2">
              <Button
                size="lg"
                className="w-full gap-2 text-sm font-semibold shadow-lg shadow-primary/20 sm:w-auto"
                render={<Link href="/dashboard" />}
              >
                <span>Mulai Buat Undangan</span>
                <ArrowRight className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 text-sm font-semibold sm:w-auto"
                render={<a href="#template" />}
              >
                <Palette className="size-4 text-primary" />
                <span>Jelajahi Template</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs text-muted-foreground lg:justify-start">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>Tanpa Biaya Tersembunyi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>100% Responsif Seluler</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>Autoplay Musik Teruji</span>
              </div>
            </div>
          </div>

          <div
            id="demo"
            className="flex justify-center lg:col-span-5 lg:justify-end"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
              <div className="absolute -inset-4 rounded-[44px] bg-gradient-to-tr from-primary/30 to-amber-500/20 opacity-70 blur-2xl" />

              <div className="relative overflow-hidden rounded-[36px] border-4 border-foreground/15 bg-background shadow-2xl ring-1 ring-foreground/10 sm:rounded-[40px]">
                <div className="absolute top-2 left-1/2 z-20 h-3.5 w-24 -translate-x-1/2 rounded-full bg-foreground/15 sm:h-4 sm:w-28" />

                <div className="relative flex h-[460px] flex-col justify-between bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-5 text-white sm:h-[520px] sm:p-6">
                  <div className="z-10 flex flex-col items-center pt-5 text-center sm:pt-6">
                    <Badge
                      variant="secondary"
                      className="border-none bg-white/20 px-2.5 py-0.5 text-[10px] tracking-widest text-white uppercase backdrop-blur"
                    >
                      The Wedding Of
                    </Badge>
                    <h2 className="mt-2.5 font-serif text-xl font-bold tracking-tight text-white drop-shadow-md sm:mt-3 sm:text-2xl">
                      Adinda & Bagas
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-white/70">
                      Minggu, 18 Oktober 2026
                    </p>
                  </div>

                  <div className="z-10 rounded-xl border border-white/15 bg-white/10 p-3 text-center shadow-lg backdrop-blur-md sm:p-3.5">
                    <p className="text-[10px] text-white/70">
                      Kepada Yth. Bapak/Ibu/Saudara:
                    </p>
                    <p className="mt-0.5 text-xs font-bold tracking-wide text-white sm:text-sm">
                      Bpk. Hendra Pratama
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-2 border-white/20 bg-white/10 px-2 py-0 text-[9px] text-white"
                    >
                      Tamu Spesial
                    </Badge>
                  </div>

                  <div className="z-10 flex flex-col items-center gap-2.5 pb-1 sm:gap-3 sm:pb-2">
                    <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-zinc-950 shadow-xl transition-transform hover:scale-105 sm:py-3">
                      <Mail className="size-3.5 text-primary" />
                      <span>Buka Undangan</span>
                    </div>
                    <span className="text-center text-[10px] text-white/50">
                      ♫ Sentuh untuk memutar lagu latar
                    </span>
                  </div>

                  <div className="absolute top-1/3 right-2 flex animate-bounce items-center gap-1.5 rounded-lg border bg-card p-1.5 text-[10px] text-card-foreground shadow-xl [animation-duration:3s] sm:-right-2 sm:p-2">
                    <CreditCard className="size-3 text-emerald-500" />
                    <span className="font-medium">Amplop QRIS Aktif</span>
                  </div>

                  <div className="absolute bottom-1/4 left-2 flex items-center gap-1.5 rounded-lg border bg-card p-1.5 text-[10px] text-card-foreground shadow-xl sm:-left-2 sm:p-2">
                    <CheckCircle2 className="size-3 text-primary" />
                    <span className="font-medium">RSVP Terkonfirmasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-4">
          {STATS.map((item) => (
            <Card
              key={item.label}
              className="border-border/60 bg-card/60 p-4 text-center backdrop-blur-xs"
            >
              <span className="font-serif text-xl font-bold tracking-tight text-primary sm:text-2xl md:text-3xl">
                {item.value}
              </span>
              <p className="mt-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
                {item.label}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

