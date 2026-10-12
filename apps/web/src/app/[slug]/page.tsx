"use client";

import { use, useMemo, useState } from "react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CreditCard,
  Heart,
  ImageIcon,
  Loader2,
  Lock,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";

import {
  DEFAULT_THEME_CONFIG,
  type ThemeConfig,
} from "@/components/editor/theme-modal";
import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { CoverGate } from "@/components/invitation/cover-gate";
import {
  DigitalGiftSection,
  type BankAccountItem,
} from "@/components/invitation/digital-gift-section";
import {
  EventSection,
  type EventScheduleItem,
} from "@/components/invitation/event-section";
import {
  PublicCustomContentSlot,
  type PublicCustomContentItem,
} from "@/components/invitation/public-custom-content-slot";
import { RSVPSection } from "@/components/invitation/rsvp-section";
import { trpc } from "@/utils/trpc";

interface PublicInvitationPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    to?: string;
  }>;
}

export default function PublicInvitationPage({
  params,
  searchParams,
}: PublicInvitationPageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);

  const slug = resolvedParams.slug;

  // Personalisasi Tamu via query URL (?to=...)
  const guestName = useMemo(() => {
    if (!resolvedSearchParams?.to) return undefined;
    try {
      return decodeURIComponent(resolvedSearchParams.to.replace(/\+/g, " "));
    } catch {
      return resolvedSearchParams.to;
    }
  }, [resolvedSearchParams]);

  // Ambil data undangan dari tRPC publik
  const {
    data: invitation,
    isLoading,
    isError,
  } = useQuery(trpc.invitation.getBySlugPublic.queryOptions({ slug }));

  // State Cover Gate (Buka Undangan)
  const [isCoverGateOpen, setIsCoverGateOpen] = useState(false);

  // Ambil Konfigurasi Tema
  const themeConfig = useMemo<ThemeConfig>(() => {
    if (invitation?.themeConfig) {
      return invitation.themeConfig as unknown as ThemeConfig;
    }
    return DEFAULT_THEME_CONFIG;
  }, [invitation?.themeConfig]);

  // Pengecekan Visibilitas Section
  const isSectionVisible = (sectionKey: string) => {
    if (!invitation?.sections) return true;
    const sec = invitation.sections.find((s) => s.sectionKey === sectionKey);
    return sec ? sec.isVisible : true;
  };

  const customContents = (invitation?.customContents ?? []) as unknown as PublicCustomContentItem[];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-xs font-medium tracking-wide">
          Mempersiapkan undangan istimewa...
        </p>
      </div>
    );
  }

  if (isError || !invitation) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-6 text-center bg-background">
        <h2 className="font-bold text-2xl text-foreground">Undangan Tidak Ditemukan</h2>
        <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
          Tautan undangan mungkin salah atau acara telah dinonaktifkan oleh penyelenggara.
        </p>
        <Button render={<Link href={"/" as Route} />} className="gap-2 text-xs">
          Kembali ke Senara
        </Button>
      </div>
    );
  }

  // Cek Status Undangan: EXPIRED
  if (invitation.status === "EXPIRED") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-6 text-center bg-background">
        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
          Acara Telah Selesai
        </Badge>
        <h2 className="font-bold text-2xl text-foreground">{invitation.title}</h2>
        <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
          Masa tayang undangan ini telah berakhir. Terima kasih atas segala doa restu dan perhatian
          yang telah diberikan kepada kami.
        </p>
      </div>
    );
  }

  const coverImage =
    invitation.coverImageUrl ||
    invitation.template?.thumbnail ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      className="min-h-screen bg-zinc-950/5 flex justify-center selection:bg-primary selection:text-primary-foreground"
      style={
        {
          "--editor-primary": themeConfig.palette.primary,
          "--editor-bg": themeConfig.palette.background,
          "--editor-accent": themeConfig.palette.accent,
          "--editor-font-heading": themeConfig.typography.headingFont,
          "--editor-font-body": themeConfig.typography.bodyFont,
        } as React.CSSProperties
      }
    >
      {/* 1. Layar Gerbang Sampul & Kepatuhan Audio Autoplay (Cover Gate) */}
      <CoverGate
        title={invitation.title}
        coverImageUrl={coverImage}
        guestName={guestName}
        eventDate={invitation.eventDate}
        audioUrl={invitation.musicUrl}
        isOpen={isCoverGateOpen}
        onOpen={() => setIsCoverGateOpen(true)}
        themeConfig={themeConfig}
      />

      {/* 2. Badan Konten Undangan (Wadah Mobile-First Terpusat) */}
      <main
        className="w-full max-w-md min-h-screen bg-background shadow-2xl relative text-center overflow-x-hidden"
        style={{ fontFamily: themeConfig.typography.bodyFont }}
      >
        {/* Section 1: Hero / Sampul Depan */}
        {isSectionVisible("hero") && (
          <div
            className="relative min-h-[520px] flex flex-col justify-end p-6 text-white overflow-hidden"
            style={{ backgroundColor: themeConfig.palette.primary }}
          >
            <Image
              src={coverImage}
              alt={invitation.title}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-2">
              <Badge
                variant="secondary"
                className="text-[10px] bg-white/20 text-white backdrop-blur border-none uppercase tracking-widest px-3 py-1 font-semibold"
              >
                The Wedding of
              </Badge>

              <h1
                className="font-bold text-3xl tracking-tight text-white leading-tight"
                style={{ fontFamily: themeConfig.typography.headingFont }}
              >
                {invitation.title}
              </h1>

              <p className="text-white/80 text-xs mt-1 font-medium">
                {invitation.eventDate
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(invitation.eventDate))
                  : "Hari Bahagia Kami"}
              </p>
            </div>
          </div>
        )}

        {/* Titik Jangkar Slot: after-hero */}
        <PublicCustomContentSlot
          slotId="after-hero"
          items={customContents}
          themeConfig={themeConfig}
        />

        {/* Section 2: Ayat Suci / Untaian Doa (Quote) */}
        {isSectionVisible("quote") && (
          <div className="flex flex-col gap-2 p-8 bg-muted/15 border-b">
            <Heart className="size-4 text-primary mx-auto mb-1 opacity-70" />
            <p className="text-xs italic text-muted-foreground leading-relaxed">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri
              dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan
              dijadikan-Nya diantaramu rasa kasih dan sayang."
            </p>
            <span className="text-[11px] font-semibold text-primary mt-1">— QS. Ar-Rum: 21</span>
          </div>
        )}

        {/* Titik Jangkar Slot: after-quote */}
        <PublicCustomContentSlot
          slotId="after-quote"
          items={customContents}
          themeConfig={themeConfig}
        />

        {/* Section 3: Profil Mempelai (Couple Profile) */}
        {isSectionVisible("couple") && (
          <div
            className="flex flex-col gap-6 p-8"
            style={{ backgroundColor: themeConfig.palette.secondary }}
          >
            <div className="flex flex-col items-center gap-1">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider text-primary border-primary/30"
              >
                Kedua Mempelai
              </Badge>
              <h2
                className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-100"
                style={{ fontFamily: themeConfig.typography.headingFont }}
              >
                Mempelai yang Berbahagia
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col items-center gap-2">
                <div className="relative size-24 overflow-hidden rounded-full border-3 border-white shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    alt="Mempelai Wanita"
                    fill
                    className="object-cover"
                  />
                </div>
                <span
                  className="font-bold text-base text-foreground mt-1"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                >
                  Adinda Rahma
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  Putri dari Bpk. Hendra & Ibu Rina
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="relative size-24 overflow-hidden rounded-full border-3 border-white shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt="Mempelai Pria"
                    fill
                    className="object-cover"
                  />
                </div>
                <span
                  className="font-bold text-base text-foreground mt-1"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                >
                  Bagas Pratama
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  Putra dari Bpk. Santoso & Ibu Dewi
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Titik Jangkar Slot: after-couple (Persistent Slot Rule) */}
        <PublicCustomContentSlot
          slotId="after-couple"
          items={customContents}
          themeConfig={themeConfig}
        />

        {/* Section 4: Rangkaian Acara (Event Schedule) & Hitung Mundur */}
        {isSectionVisible("event") && (
          <div>
            <EventSection
              schedules={invitation.schedules as unknown as EventScheduleItem[]}
              themeConfig={themeConfig}
            />

            {invitation.eventDate && (
              <div className="px-6 pb-6 bg-background">
                <CountdownTimer
                  targetDate={invitation.eventDate}
                  themeConfig={themeConfig}
                />
              </div>
            )}
          </div>
        )}

        {/* Titik Jangkar Slot: after-event */}
        <PublicCustomContentSlot
          slotId="after-event"
          items={customContents}
          themeConfig={themeConfig}
        />

        {/* Section 5: Kisah Cinta (Love Story Timeline) */}
        {isSectionVisible("love-story") && invitation.loveStories && invitation.loveStories.length > 0 && (
          <div className="flex flex-col gap-5 p-8 bg-muted/15 border-t text-left">
            <div className="flex flex-col items-center gap-1 text-center">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider text-primary border-primary/30"
              >
                Perjalanan Cinta
              </Badge>
              <h3
                className="font-bold text-2xl tracking-tight text-foreground"
                style={{ fontFamily: themeConfig.typography.headingFont }}
              >
                Kisah Klasik Kami
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              {invitation.loveStories.map((story) => (
                <div
                  key={story.id}
                  className="border-l-2 border-primary/60 pl-4 py-1 text-xs relative"
                >
                  <span className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-primary" />
                  <p className="font-bold text-primary text-xs">{story.yearOrDate}</p>
                  <p className="font-semibold text-foreground text-sm mt-0.5">{story.title}</p>
                  <p className="text-muted-foreground mt-1 leading-relaxed">{story.story}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Titik Jangkar Slot: after-story */}
        <PublicCustomContentSlot
          slotId="after-story"
          items={customContents}
          themeConfig={themeConfig}
        />

        {/* Section 6: Galeri Foto & Video */}
        {isSectionVisible("gallery") && invitation.galleries && invitation.galleries.length > 0 && (
          <div className="flex flex-col gap-5 p-8 bg-background border-t">
            <div className="flex flex-col items-center gap-1 text-center">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider text-primary border-primary/30"
              >
                Dokumentasi
              </Badge>
              <h3
                className="font-bold text-2xl tracking-tight text-foreground"
                style={{ fontFamily: themeConfig.typography.headingFont }}
              >
                Potret Kenangan
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {invitation.galleries.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-2xs group"
                >
                  <Image
                    src={item.mediaUrl}
                    alt={item.caption || "Foto Kenangan"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Titik Jangkar Slot: after-gallery */}
        <PublicCustomContentSlot
          slotId="after-gallery"
          items={customContents}
          themeConfig={themeConfig}
        />

        {/* Section 7: Amplop Digital & QRIS */}
        {isSectionVisible("gift") && (
          <DigitalGiftSection
            bankAccounts={invitation.bankAccounts as unknown as BankAccountItem[]}
            themeConfig={themeConfig}
          />
        )}

        {/* Titik Jangkar Slot: after-gift */}
        <PublicCustomContentSlot
          slotId="after-gift"
          items={customContents}
          themeConfig={themeConfig}
        />

        {/* Section 8: RSVP & Buku Tamu */}
        {isSectionVisible("rsvp") && (
          <RSVPSection
            invitationId={invitation.id}
            initialGuestName={guestName}
            themeConfig={themeConfig}
          />
        )}

        {/* Titik Jangkar Slot: before-footer */}
        <PublicCustomContentSlot
          slotId="before-footer"
          items={customContents}
          themeConfig={themeConfig}
        />

        {/* Section 9: Salam Penutup */}
        {isSectionVisible("closing") && (
          <div className="p-8 bg-background border-t text-xs text-muted-foreground flex flex-col items-center gap-3">
            <p className="leading-relaxed max-w-xs">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
              berkenan hadir dan memberikan doa restu kepada kedua mempelai.
            </p>
            <p
              className="font-bold text-base text-foreground"
              style={{ fontFamily: themeConfig.typography.headingFont }}
            >
              {invitation.title}
            </p>
          </div>
        )}

        {/* Watermark Senara Footer */}
        <footer className="p-6 bg-muted/30 border-t text-center text-[11px] text-muted-foreground flex flex-col items-center gap-1">
          <p className="flex items-center gap-1 font-semibold text-foreground/80">
            <Sparkles className="size-3 text-primary" />
            <span>Senara Invitation Platform</span>
          </p>
          <p className="text-[10px] text-muted-foreground/70">
            Dibuat dengan cinta untuk momen terindah hidup Anda.
          </p>
        </footer>
      </main>
    </div>
  );
}
