"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MailOpen, Music, Volume2, VolumeX } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import { cn } from "@senara/ui/lib/utils";

import type { ThemeConfig } from "@/components/editor/theme-modal";

interface CoverGateProps {
  title: string;
  coverImageUrl: string;
  guestName?: string;
  eventDate?: Date | string | null;
  audioUrl?: string | null;
  isOpen: boolean;
  onOpen: () => void;
  themeConfig: ThemeConfig;
}

export function CoverGate({
  title,
  coverImageUrl,
  guestName,
  eventDate,
  audioUrl,
  isOpen,
  onOpen,
  themeConfig,
}: CoverGateProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Kunci scroll halaman saat Cover Gate aktif (belum dibuka)
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Inisialisasi Audio
  useEffect(() => {
    const bgmUrl =
      audioUrl ||
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113540.mp3";
    const audio = new Audio(bgmUrl);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl]);

  // Handler Buka Undangan (User Gesture memicu Audio Autoplay)
  const handleOpenInvitation = () => {
    onOpen();
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Jika peramban tetap menolak autoplay audio, toleransi secara halus
          setIsPlaying(false);
        });
    }
  };

  // Toggle Pemutar Musik Mengambang
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const formattedDate = eventDate
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(eventDate))
    : "Hari Bahagia";

  return (
    <>
      {/* 1. Layar Gerbang Sampul Layar Penuh (Cover Gate) */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden text-white transition-all duration-1000 ease-in-out",
          isOpen
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        )}
        style={{
          backgroundColor: themeConfig.palette.primary,
          fontFamily: themeConfig.typography.bodyFont,
        }}
      >
        {/* Gambar Latar Sampul dengan Efek Gradient & Blur Halus */}
        <div className="absolute inset-0">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>

        {/* Header Sampul Atas */}
        <div className="relative z-10 flex w-full flex-col items-center pt-12 px-6 text-center">
          <Badge
            variant="secondary"
            className="bg-white/20 text-white backdrop-blur border-none uppercase tracking-widest text-[10px] px-3 py-1 font-semibold"
          >
            Undangan Pernikahan
          </Badge>
          <span className="mt-3 text-xs tracking-wider text-white/80">THE WEDDING OF</span>
        </div>

        {/* Badan Sampul Tengah: Judul Pasangan & Tanggal */}
        <div className="relative z-10 flex max-w-sm flex-col items-center px-6 text-center">
          <h1
            className="font-bold text-3xl sm:text-4xl tracking-tight leading-snug drop-shadow-md text-white"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {title}
          </h1>
          <p className="mt-2 text-xs text-white/80 tracking-wide font-medium">
            {formattedDate}
          </p>
        </div>

        {/* Bagian Bawah: Personalisasi Tamu & Tombol Buka Undangan */}
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center pb-12 px-6 text-center">
          {guestName && (
            <Card className="mb-6 w-full rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15 shadow-lg text-center">
              <p className="text-[11px] text-white/75">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
              <h2 className="mt-1 font-bold text-base sm:text-lg text-white tracking-wide">
                {guestName}
              </h2>
              <p className="mt-0.5 text-[10px] text-white/60">
                Mohon maaf apabila ada kesalahan penulisan nama/gelar
              </p>
            </Card>
          )}

          <Button
            size="lg"
            onClick={handleOpenInvitation}
            className="w-full h-12 gap-2 rounded-full font-semibold text-sm shadow-xl transition-transform active:scale-95 bg-white text-zinc-900 hover:bg-white/90"
          >
            <MailOpen className="size-4 text-primary" />
            <span>Buka Undangan</span>
          </Button>
        </div>
      </div>

      {/* 2. Floating Audio Controller (Muncul setelah sampul dibuka) */}
      {isOpen && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={togglePlayAudio}
          title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          className={cn(
            "fixed bottom-5 right-5 z-40 size-10 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95",
            isPlaying
              ? "bg-primary text-primary-foreground border-primary/40 ring-2 ring-primary/20 hover:bg-primary/90 hover:text-primary-foreground"
              : "bg-background/90 text-foreground border-border"
          )}
        >
          {isPlaying ? (
            <Music className="size-4 animate-spin [animation-duration:4s]" />
          ) : (
            <VolumeX className="size-4 text-muted-foreground" />
          )}
        </Button>
      )}
    </>
  );
}

