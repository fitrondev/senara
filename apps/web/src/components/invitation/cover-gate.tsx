"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MailOpen, Music, VolumeX } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import { cn } from "@senara/ui/lib/utils";

import { extractYouTubeId } from "@/components/editor/music-modal";
import type { ThemeConfig } from "@/components/editor/theme-modal";

interface CoverGateProps {
  title: string;
  coverImageUrl: string;
  guestName?: string;
  eventDate?: Date | string | null;
  audioUrl?: string | null;
  startAt?: number;
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
  startAt = 0,
  isOpen,
  onOpen,
  themeConfig,
}: CoverGateProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const youtubeId = audioUrl ? extractYouTubeId(audioUrl) : null;

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

  // Inisialisasi Audio MP3/M4A (jika bukan YouTube)
  useEffect(() => {
    if (youtubeId) return;

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
  }, [audioUrl, youtubeId]);

  // Auto-pause musik latar saat tamu memutar video di galeri
  useEffect(() => {
    const handleDocumentMediaPlay = (e: Event) => {
      const target = e.target;
      if (
        target instanceof HTMLVideoElement &&
        audioRef.current &&
        !audioRef.current.paused
      ) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener("play", handleDocumentMediaPlay, true);
    return () => {
      document.removeEventListener("play", handleDocumentMediaPlay, true);
    };
  }, []);

  // Handler Buka Undangan (User Gesture memicu Audio Autoplay dari detik startAt)
  const handleOpenInvitation = () => {
    onOpen();
    if (youtubeId) {
      setIsPlaying(true);
      return;
    }
    if (audioRef.current) {
      try {
        if (startAt > 0) {
          audioRef.current.currentTime = startAt;
        }
      } catch {
        // Ignore seek error before metadata load
      }
      audioRef.current
        .play()
        .then(() => {
          if (startAt > 0 && audioRef.current) {
            try {
              audioRef.current.currentTime = startAt;
            } catch {
              // Ignore
            }
          }
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  // Toggle Pemutar Musik Mengambang
  const togglePlayAudio = () => {
    if (youtubeId) {
      setIsPlaying((prev) => !prev);
      return;
    }
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
            ? "pointer-events-none -translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        )}
        style={{
          backgroundColor: themeConfig.palette.primary,
          fontFamily: themeConfig.typography.bodyFont,
        }}
      >
        {/* Gambar Latar Sampul dengan Efek Gradient & Blur Halus */}
        <div className="absolute inset-0">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              className="scale-105 object-cover transition-transform duration-1000"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>

        {/* Header Sampul Atas */}
        <div className="relative z-10 flex w-full flex-col items-center px-6 pt-12 text-center">
          <Badge
            variant="secondary"
            className="border-none bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-widest text-white uppercase backdrop-blur"
          >
            Undangan Spesial
          </Badge>
          <span className="mt-3 text-xs tracking-wider text-white/80">
            THE CELEBRATION OF
          </span>
        </div>

        {/* Badan Sampul Tengah: Judul Pasangan & Tanggal */}
        <div className="relative z-10 flex max-w-sm flex-col items-center px-6 text-center">
          <h1
            className="text-3xl leading-snug font-bold tracking-tight text-white drop-shadow-md sm:text-4xl"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {title}
          </h1>
          <p className="mt-2 text-xs font-medium tracking-wide text-white/80">
            {formattedDate}
          </p>
        </div>

        {/* Bagian Bawah: Personalisasi Tamu & Tombol Buka Undangan */}
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 pb-12 text-center">
          {guestName ? (
            <Card className="mb-6 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-center shadow-lg backdrop-blur-md">
              <p className="text-[11px] text-white/75">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </p>
              <h2 className="mt-1 text-base font-bold tracking-wide text-white sm:text-lg">
                {guestName}
              </h2>
              <p className="mt-0.5 text-[10px] text-white/60">
                Mohon maaf apabila ada kesalahan penulisan nama/gelar
              </p>
            </Card>
          ) : null}

          <Button
            size="lg"
            onClick={handleOpenInvitation}
            className="h-12 w-full gap-2 rounded-full bg-white text-sm font-semibold text-zinc-900 shadow-xl transition-transform hover:bg-white/90 active:scale-95"
          >
            <MailOpen className="text-primary size-4" />
            <span>Buka Undangan</span>
          </Button>
        </div>
      </div>

      {/* Hidden YouTube Audio Player (apabila menggunakan sumber YouTube) */}
      {isOpen && youtubeId && isPlaying ? (
        <iframe
          title="YouTube Background Music"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=${startAt}&loop=1&playlist=${youtubeId}`}
          className="pointer-events-none fixed bottom-0 left-0 size-1 opacity-0"
          allow="autoplay; encrypted-media"
        />
      ) : null}

      {/* 2. Floating Audio Controller (Muncul setelah sampul dibuka) */}
      {isOpen ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={togglePlayAudio}
          title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          className={cn(
            "fixed right-5 bottom-5 z-40 size-10 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95",
            isPlaying
              ? "bg-primary text-primary-foreground border-primary/40 ring-primary/20 hover:bg-primary/90 hover:text-primary-foreground ring-2"
              : "bg-background/90 text-foreground border-border"
          )}
        >
          {isPlaying ? (
            <Music className="size-4 animate-spin [animation-duration:4s]" />
          ) : (
            <VolumeX className="text-muted-foreground size-4" />
          )}
        </Button>
      ) : null}
    </>
  );
}
