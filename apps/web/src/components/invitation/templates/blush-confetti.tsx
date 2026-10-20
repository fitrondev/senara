"use client";

import Image from "next/image";
import { Cake, PartyPopper, Sparkles } from "lucide-react";

import { EditableField, EditableImage, EditableRegion, GuestHint } from "../primitives";
import { useEditContext } from "../edit-context";
import type { TemplateThemePreset } from "./kartu-pos";

export const BLUSH_CONFETTI_PRESET: TemplateThemePreset = {
  slug: "blush-confetti",
  eventCategory: "BIRTHDAY",
  bgMain: "#FFF5F7",
  bgCard: "#FFFFFF",
  textMain: "#3F1D28",
  textMuted: "#8C4A5E",
  accentColor: "#E11D48",
  borderStyle: "#FBCFE8",
  labels: {
    coverBadge: "BIRTHDAY CELEBRATION • PESTA ULANG TAHUN",
    defaultTitle: "Alya Putri (Sweet 7th)",
    quoteTitle: "Harapan & Doa Ulang Tahun",
    defaultQuote:
      "Semoga setiap langkah tumbuh kembangmu selalu dipenuhi kebahagiaan, kesehatan, dan cinta kasih yang berlimpah.",
    defaultQuoteSource: "Doa Ayah & Bunda",
    profileBadge: "Bintang Pesta Hari Ini",
    profileTitle: "Yang Berulang Tahun",
    person1Name: "Alya Putri Kirana",
    person1Parents: "Putri kesayangan Bpk. Reza Prakoso & Ibu Nadia Larasati",
    person1Photo:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80",
    eventTitle: "Jadwal Pesta & Tiup Lilin",
    storyBadge: "Cerita Pertumbuhan",
    storyTitle: "Momen Tumbuh Kembang",
    galleryTitle: "Album Ceria",
    giftTitle: "Kado & Tanda Kasih",
    rsvpTitle: "Konfirmasi Kehadiran Teman & Keluarga",
    closingText:
      "Kehadiran teman-teman dan keluarga tercinta akan membuat pesta ulang tahun ini semakin meriah!",
  },
};

export function BlushConfettiHeroBanner({
  title,
  coverImageUrl,
  eventDateFormatted,
}: {
  title: string;
  coverImageUrl: string;
  eventDateFormatted: string;
}) {
  const { withPhotos } = useEditContext();

  return (
    <EditableRegion region="cover" label="Sampul Ulang Tahun">
      <div
        className="relative min-h-[480px] overflow-hidden border-b border-pink-200 p-6 text-center"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, #FFE4E6 0%, #FFF5F7 55%, #FDF2F8 100%)",
          color: "#3F1D28",
        }}
      >
        <div className="relative flex min-h-[430px] flex-col items-center justify-between rounded-3xl border-2 border-dashed border-pink-300 bg-white/85 p-6 shadow-sm">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-rose-600 uppercase">
            <PartyPopper className="size-3.5" />
            <EditableField
              field="coverSubtitle"
              fallback="You Are Invited! • Pesta Ulang Tahun"
            />
          </div>

          {withPhotos ? (
            <div className="my-4 relative size-40 overflow-hidden rounded-full border-4 border-pink-300 shadow-lg">
              <EditableImage
                src={coverImageUrl}
                alt={title}
                fill
                className="object-cover"
                field="coverImageUrl"
                label="Foto Sampul Ulang Tahun"
              />
            </div>
          ) : (
            <div className="my-5 flex size-28 flex-col items-center justify-center rounded-full border-2 border-pink-300 bg-pink-50 p-4 text-rose-500">
              <Cake className="size-9" />
              <span className="mt-1 text-[10px] font-bold tracking-wider uppercase">
                Happy Birthday
              </span>
            </div>
          )}

          <div className="w-full">
            <h1 className="w-full font-serif text-3xl font-extrabold tracking-tight text-[#3F1D28]">
              <EditableField field="title" fallback={title} />
            </h1>
            <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
              <Sparkles className="size-3" />
              <EditableField field="eventDateText" fallback={eventDateFormatted} />
            </p>
          </div>

          <div className="mt-4 w-full rounded-2xl border border-pink-200 bg-pink-50/70 px-4 py-3">
            <p className="text-[10px] font-medium tracking-wider text-rose-500 uppercase">
              Spesial Untuk Teman / Sahabat / Keluarga:
            </p>
            <div className="mt-1 text-sm text-[#3F1D28]">
              <GuestHint />
            </div>
          </div>
        </div>
      </div>
    </EditableRegion>
  );
}

