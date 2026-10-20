"use client";

import {
  Calendar,
  Camera,
  Check,
  Clock,
  Crown,
  Heart,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Video,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { cn } from "@senara/ui/lib/utils";

import type { LayoutTemplateItem } from "./layout-library-types";

interface LayoutThumbnailCardProps {
  item: LayoutTemplateItem;
  isSelected: boolean;
  onSelect: (item: LayoutTemplateItem) => void;
}

export function LayoutThumbnailCard({
  item,
  isSelected,
  onSelect,
}: LayoutThumbnailCardProps) {
  const renderPreviewMockup = () => {
    switch (item.previewVariant) {
      case "opening-circle":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between py-1 text-center">
            <span className="text-[7px] font-semibold tracking-wider text-muted-foreground uppercase">
              Wedding Invitation
            </span>
            <span className="font-serif text-[10px] font-bold text-foreground">
              Abu & Faizah
            </span>
            <div className="my-1.5 flex size-12 items-center justify-center rounded-full bg-slate-200/80 text-slate-500 shadow-inner">
              <ImageIcon className="size-5 opacity-70" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[6px] text-muted-foreground">Kepada Yth:</span>
              <span className="text-[7px] font-semibold text-foreground">
                Tamu Undangan
              </span>
            </div>
            <div className="mt-1.5 rounded-full bg-slate-200/90 px-3 py-0.5 text-[7px] font-semibold text-slate-700 shadow-xs">
              Buka Undangan
            </div>
          </div>
        );

      case "opening-arch":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between py-1 text-center">
            <span className="text-[6px] tracking-widest text-muted-foreground uppercase">
              THE WEDDING OF
            </span>
            <div className="my-1 flex h-14 w-11 items-center justify-center rounded-t-full bg-slate-200/80 text-slate-500 shadow-inner">
              <ImageIcon className="size-5 opacity-70" />
            </div>
            <span className="font-serif text-[10px] font-bold text-foreground">
              Rizky & Nadya
            </span>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[6px] text-muted-foreground">
                Kepada Yth. Tamu Undangan
              </span>
            </div>
            <div className="mt-1 rounded-full bg-slate-200/90 px-3 py-0.5 text-[7px] font-semibold text-slate-700 shadow-xs">
              Buka Undangan
            </div>
          </div>
        );

      case "opening-oval":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between rounded-full border border-slate-300 p-2 text-center">
            <span className="text-[5px] tracking-wider text-muted-foreground uppercase">
              YOU ARE INVITED TO
            </span>
            <div className="my-0.5">
              <span className="font-serif text-[10px] font-extrabold text-foreground">
                Suzan & Cameron
              </span>
              <p className="text-[6px] text-muted-foreground">05 / 05 / 2026</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[6px] text-muted-foreground">Kepada Yth:</span>
              <span className="text-[7px] font-medium text-foreground">
                Tamu Undangan
              </span>
            </div>
            <div className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[6px] font-semibold text-slate-700 shadow-xs">
              Buka Undangan
            </div>
          </div>
        );

      case "opening-letter":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between border border-dashed border-amber-300 bg-amber-50/50 p-2 text-center">
            <div className="flex w-full items-center justify-between">
              <span className="rounded bg-rose-600/10 px-1 font-mono text-[5px] text-rose-700">
                AIRMAIL
              </span>
              <Mail className="size-3 text-rose-600" />
            </div>
            <span className="font-serif text-[9px] italic text-amber-900">
              Dear Beloved Friends
            </span>
            <p className="line-clamp-2 text-[6px] text-amber-800/80">
              Kami mengundang Anda pada hari istimewa kami
            </p>
            <div className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[6px] font-semibold text-white shadow-xs">
              Buka Warkat
            </div>
          </div>
        );

      case "love-story":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <span className="font-serif text-[8px] font-bold tracking-wider text-foreground uppercase">
              LOVE STORY
            </span>
            <div className="my-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="text-[6px] text-muted-foreground">2020: Bertemu</span>
              </div>
              <div className="h-2 w-0.5 bg-slate-200" />
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-rose-500" />
                <span className="text-[6px] text-muted-foreground">2023: Janji</span>
              </div>
              <div className="h-2 w-0.5 bg-slate-200" />
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[6px] text-muted-foreground">2026: Akad</span>
              </div>
            </div>
            <span className="text-[6px] text-primary">Kisah Perjalanan</span>
          </div>
        );

      case "quotes":
      case "quotes-romance":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-2 text-center">
            <Quote className="size-4 text-primary/70" />
            <div className="space-y-1">
              <div className="mx-auto h-1 w-12 rounded bg-slate-200" />
              <div className="mx-auto h-1 w-16 rounded bg-slate-200" />
              <div className="mx-auto h-1 w-10 rounded bg-slate-200" />
            </div>
            <p className="text-[6px] italic text-muted-foreground">
              QS. Ar-Rum : 21
            </p>
          </div>
        );

      case "profile":
      case "couple":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <span className="text-[7px] font-semibold text-muted-foreground uppercase">
              Kedua Mempelai
            </span>
            <div className="my-1 flex items-center justify-center gap-1.5">
              <div className="flex size-8 items-center justify-center rounded-full border border-primary/40 bg-slate-100 text-slate-500">
                <User className="size-4" />
              </div>
              <Heart className="size-3 text-rose-500" />
              <div className="flex size-8 items-center justify-center rounded-full border border-primary/40 bg-slate-100 text-slate-500">
                <User className="size-4" />
              </div>
            </div>
            <span className="font-serif text-[8px] font-bold text-foreground">
              Rizky & Nadya
            </span>
          </div>
        );

      case "salam":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-center">
            <Sparkles className="size-4 text-amber-500" />
            <span className="font-serif text-[8px] font-semibold text-foreground">
              Assalamu&apos;alaikum
            </span>
            <p className="text-[6px] text-muted-foreground">
              Salam & Sambutan Hangat
            </p>
          </div>
        );

      case "event":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <span className="text-[7px] font-bold text-foreground uppercase">
              Rangkaian Acara
            </span>
            <div className="w-full space-y-1 rounded bg-slate-50 p-1">
              <div className="flex items-center justify-between text-[6px]">
                <span className="font-semibold text-foreground">AKAD</span>
                <span className="text-muted-foreground">08:00</span>
              </div>
              <div className="flex items-center justify-between text-[6px]">
                <span className="font-semibold text-foreground">RESEPSI</span>
                <span className="text-muted-foreground">11:00</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[6px] text-muted-foreground">
              <Calendar className="size-2.5 text-primary" />
              <span>24 Okt 2026</span>
            </div>
          </div>
        );

      case "maps":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <div className="flex size-7 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <MapPin className="size-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[7px] font-bold text-foreground">
                Petunjuk Lokasi
              </span>
              <p className="text-[6px] text-muted-foreground line-clamp-1">
                Grand Ballroom Senara
              </p>
            </div>
            <div className="rounded-full bg-primary/90 px-2 py-0.5 text-[6px] font-semibold text-primary-foreground shadow-xs">
              Google Maps
            </div>
          </div>
        );

      case "countdown":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <div className="flex items-center gap-1 text-[7px] font-bold text-foreground">
              <Clock className="size-3 text-primary" />
              <span>Susunan Acara</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {["08", "14", "32", "45"].map((val, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center rounded bg-slate-100 p-0.5 text-[7px] font-mono font-bold"
                >
                  {val}
                </div>
              ))}
            </div>
            <span className="text-[6px] text-muted-foreground">Hari Menuju Acara</span>
          </div>
        );

      case "filter":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2 text-center">
            <Camera className="size-5 text-pink-600" />
            <span className="text-[7px] font-bold text-foreground">
              Wedding Filter IG
            </span>
            <div className="rounded-full border border-pink-400 bg-pink-50 px-2 py-0.5 text-[6px] font-semibold text-pink-700">
              Coba Filter
            </div>
          </div>
        );

      case "live":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[6px] font-bold text-white uppercase animate-pulse">
              LIVE
            </span>
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-rose-600 shadow-inner">
              <Play className="size-4 ml-0.5" />
            </div>
            <span className="text-[6px] text-muted-foreground">Siaran Langsung</span>
          </div>
        );

      case "gallery":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1 text-center">
            <div className="grid grid-cols-2 gap-1 w-full h-16">
              <div className="rounded bg-slate-200" />
              <div className="rounded bg-slate-200" />
            </div>
            <span className="text-[7px] font-semibold text-foreground">
              Galeri Kenangan
            </span>
          </div>
        );

      case "gift":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between rounded border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-1.5 text-center shadow-xs">
            <div className="flex w-full items-center justify-between text-[6px] font-bold text-slate-700">
              <span>DEBIT CARD</span>
              <span>BCA</span>
            </div>
            <div className="my-1 font-mono text-[7px] font-semibold tracking-wider text-slate-800">
              •••• 7890
            </div>
            <div className="rounded bg-slate-800 px-2 py-0.5 text-[6px] font-semibold text-white">
              Salin No. Rekening
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2 text-center">
            <MessageCircle className="size-5 text-emerald-600" />
            <span className="text-[7px] font-bold text-foreground">
              Kontak WhatsApp
            </span>
            <div className="rounded-full bg-emerald-600 px-2 py-0.5 text-[6px] font-semibold text-white">
              Hubungi Kami
            </div>
          </div>
        );

      case "video":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded bg-black p-2 text-center text-white">
            <Video className="size-5 text-white/80" />
            <span className="text-[7px] font-medium">Video Prewedding</span>
          </div>
        );

      case "rsvp":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <span className="text-[7px] font-bold text-foreground uppercase">
              Konfirmasi RSVP
            </span>
            <div className="w-full space-y-1">
              <div className="h-1.5 w-full rounded bg-slate-100" />
              <div className="h-1.5 w-3/4 rounded bg-slate-100 mx-auto" />
            </div>
            <div className="rounded-full bg-primary px-2 py-0.5 text-[6px] font-semibold text-primary-foreground">
              Kirim RSVP
            </div>
          </div>
        );

      case "dresscode":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <span className="text-[7px] font-bold text-foreground">
              Dress Code
            </span>
            <div className="flex items-center justify-center gap-1">
              <span className="size-3.5 rounded-full bg-emerald-300 shadow-xs" />
              <span className="size-3.5 rounded-full bg-amber-100 shadow-xs" />
              <span className="size-3.5 rounded-full bg-yellow-400 shadow-xs" />
            </div>
            <span className="text-[6px] text-muted-foreground">Sage & Earth Tone</span>
          </div>
        );

      case "invitation":
        return (
          <div className="flex h-full w-full flex-col items-center justify-between p-1.5 text-center">
            <Users className="size-4 text-primary" />
            <span className="text-[7px] font-bold text-foreground">
              Turut Mengundang
            </span>
            <p className="text-[6px] text-muted-foreground">
              Keluarga Besar
            </p>
          </div>
        );

      case "protocol":
      default:
        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2 text-center">
            <ShieldCheck className="size-5 text-emerald-600" />
            <span className="text-[7px] font-bold text-foreground">
              Tata Tertib & Protokol
            </span>
            <p className="text-[6px] text-muted-foreground">Kenyamanan Bersama</p>
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group flex flex-col items-center cursor-pointer select-none"
    >
      {/* Bingkai Handphone Mockup */}
      <div
        className={cn(
          "relative aspect-[9/16] w-full max-w-[130px] rounded-xl border bg-white p-2.5 transition-all shadow-xs",
          "hover:border-primary hover:shadow-md hover:scale-[1.02]",
          isSelected
            ? "border-primary ring-2 ring-primary/80 ring-offset-1"
            : "border-zinc-200 dark:border-zinc-800"
        )}
      >
        {item.isPremium ? (
          <div className="absolute top-1 left-1 z-10 flex items-center gap-0.5 rounded-full bg-amber-500/90 px-1 py-0.5 text-[8px] font-semibold text-white shadow-xs">
            <Crown className="size-2.5" />
          </div>
        ) : null}

        {isSelected ? (
          <div className="absolute top-1 right-1 z-10 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
            <Check className="size-2.5 stroke-[3]" />
          </div>
        ) : null}

        {/* Konten Mockup Miniatur */}
        <div className="h-full w-full overflow-hidden">
          {renderPreviewMockup()}
        </div>

        {/* Overlay Hover "+ Sisipkan" */}
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          <span className="rounded-full bg-white px-2 py-1 text-[9px] font-bold text-zinc-900 shadow">
            + Sisipkan
          </span>
        </div>
      </div>

      {/* Label Nama Kategori / Layout di bawah kartu */}
      <span className="mt-1.5 text-center text-xs font-medium text-foreground/90 line-clamp-1 group-hover:text-primary transition-colors">
        {item.name}
      </span>
    </div>
  );
}

