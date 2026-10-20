"use client";

import Image from "next/image";
import { Moon, Star } from "lucide-react";

import { EditableField, EditableImage, EditableRegion, GuestHint } from "../primitives";
import { useEditContext } from "../edit-context";
import type { TemplateThemePreset } from "./kartu-pos";

export const CRESCENT_LINEN_PRESET: TemplateThemePreset = {
  slug: "crescent-linen",
  eventCategory: "KHITANAN",
  bgMain: "#FBF8F3",
  bgCard: "#FFFFFF",
  textMain: "#1F362B",
  textMuted: "#567063",
  accentColor: "#2E4F3E",
  borderStyle: "#C8B898",
  labels: {
    coverBadge: "WALIMATUL KHITAN • TASYAKURAN KHITAN",
    defaultTitle: "Ananda Zayyan Al-Fatih",
    quoteTitle: "Doa Anak Sholeh",
    defaultQuote:
      "Ya Allah, jadikanlah ia anak yang sholeh, berbakti kepada kedua orang tua, cerdas, serta bermanfaat bagi agama, nusa, dan bangsa.",
    defaultQuoteSource: "Doa Walimatul Khitan",
    profileBadge: "Ananda Tercinta",
    profileTitle: "Ananda yang Dikhitan",
    person1Name: "Muhammad Zayyan Al-Fatih",
    person1Parents: "Putra tercinta Bpk. H. Fauzan Hakim & Ibu Hj. Siti Maryam",
    person1Photo:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=400&q=80",
    eventTitle: "Waktu & Tempat Tasyakuran",
    storyBadge: "Cerita Ananda",
    storyTitle: "Perjalanan Tumbuh Ananda",
    galleryTitle: "Potret Ananda",
    giftTitle: "Tanda Kasih & Doa",
    rsvpTitle: "Doa Restu & Konfirmasi Kehadiran",
    closingText:
      "Atas kehadiran serta doa restu Bapak/Ibu/Saudara/i untuk kesembuhan dan keberkahan putra kami, kami ucapkan Jazakumullahu Khairan Katsiran.",
  },
};

export function CrescentLinenHeroBanner({
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
    <EditableRegion region="cover" label="Sampul Walimatul Khitan">
      <div
        className="relative min-h-[490px] overflow-hidden border-b border-[#C8B898] p-6 text-center"
        style={{
          backgroundColor: "#FBF8F3",
          color: "#1F362B",
        }}
      >
        <div className="relative flex min-h-[440px] flex-col items-center justify-between rounded-t-[4rem] border-2 border-[#C8B898] bg-white/90 p-6 shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-[#B08D57]">
              <Moon className="size-4" />
              <Star className="size-3" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.22em] text-[#2E4F3E] uppercase">
              <EditableField
                field="coverSubtitle"
                fallback="Walimatul Khitan • Bismillahirrahmanirrahim"
              />
            </span>
          </div>

          {withPhotos ? (
            <div className="my-4 relative h-48 w-40 overflow-hidden rounded-t-full border-2 border-[#B08D57] shadow-md">
              <EditableImage
                src={coverImageUrl}
                alt={title}
                fill
                className="object-cover"
                field="coverImageUrl"
                label="Foto Sampul Khitanan"
              />
            </div>
          ) : (
            <div className="my-5 flex size-28 flex-col items-center justify-center rounded-t-full border-2 border-[#B08D57] bg-[#FBF8F3] p-4 text-[#2E4F3E]">
              <Moon className="size-9 text-[#B08D57]" />
              <span className="mt-1 font-serif text-[10px] tracking-widest uppercase">
                Tasyakuran
              </span>
            </div>
          )}

          <div className="w-full">
            <h1 className="w-full font-serif text-2xl font-bold tracking-tight text-[#1F362B] sm:text-3xl">
              <EditableField field="title" fallback={title} />
            </h1>
            <p className="mt-1.5 text-xs font-semibold text-[#B08D57]">
              <EditableField field="eventDateText" fallback={eventDateFormatted} />
            </p>
          </div>

          <div className="mt-4 w-full rounded-xl border border-[#C8B898] bg-[#FBF8F3] px-4 py-3">
            <p className="text-[10px] font-medium tracking-wider text-[#567063] uppercase">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </p>
            <div className="mt-1 text-sm text-[#1F362B]">
              <GuestHint />
            </div>
          </div>
        </div>
      </div>
    </EditableRegion>
  );
}

