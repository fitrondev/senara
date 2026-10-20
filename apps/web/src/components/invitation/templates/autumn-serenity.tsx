"use client";

import { Flower2, Sparkles, SunDim } from "lucide-react";

import { useEditContext } from "../edit-context";
import {
  EditableField,
  EditableImage,
  EditableRegion,
  GuestHint,
} from "../primitives";
import type { TemplateThemePreset } from "./kartu-pos";

export const AUTUMN_SERENITY_PRESET: TemplateThemePreset = {
  slug: "autumn-serenity",
  eventCategory: "WEDDING",
  bgMain: "#FAF5EE",
  bgCard: "#FFFFFF",
  textMain: "#2C1E18",
  textMuted: "#7C695D",
  accentColor: "#9C4121",
  borderStyle: "#E8DAC8",
  labels: {
    coverBadge: "THE WEDDING CELEBRATION • WALIMATUL 'URS",
    defaultTitle: "Rizky & Nadya",
    quoteTitle: "Doa & Sabda Suci",
    defaultQuote:
      "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    defaultQuoteSource: "QS. Ar-Rum: 21",
    profileBadge: "Mempelai Berbahagia",
    profileTitle: "Kedua Mempelai",
    person1Name: "Rizky Pratama, S.Kom",
    person1Parents: "Putra pertama Bpk. H. Bambang Soediro & Ibu Hj. Sri Wahyuni",
    person1Photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    person2Name: "Nadya Azzahra, S.Ds",
    person2Parents: "Putri bungsu Bpk. H. Gunawan Wibowo & Ibu Hj. Endang Lestari",
    person2Photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    eventTitle: "Waktu & Lokasi Acara",
    storyBadge: "Catatan Perjalanan",
    storyTitle: "Langkah Menuju Pelaminan",
    galleryTitle: "Potret Kenangan Indah",
    giftTitle: "Tanda Kasih & Doa Restu",
    rsvpTitle: "Kartu Konfirmasi Tamu (RSVP)",
    closingText:
      "Kehadiran dan doa restu Bapak/Ibu/Saudara/i adalah karunia terindah dalam perjalanan baru bahtera rumah tangga kami.",
  },
};

export function AutumnSerenityHeroBanner({
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
    <EditableRegion region="cover" label="Sampul Autumn Serenity">
      <div
        className="relative overflow-hidden p-4 sm:p-6"
        style={{
          background:
            "linear-gradient(180deg, #F5EBE1 0%, #FAF5EE 45%, #FFFFFF 100%)",
          color: "#2C1E18",
        }}
      >
        {/* Bingkai Arsitektur Oriental & Emas Lembut */}
        <div className="relative flex min-h-[500px] flex-col items-center justify-between rounded-t-[3.5rem] rounded-b-3xl border-2 border-[#D9C4B0] bg-[#FFFDF9]/90 p-6 shadow-md backdrop-blur-xs">
          {/* Header Sampul */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#9C4121]/30 bg-[#9C4121]/10 px-3 py-1 text-[10px] font-semibold tracking-widest text-[#9C4121] uppercase">
              <SunDim className="size-3" />
              <EditableField
                field="coverSubtitle"
                fallback="The Celebration of Love • Walimatul 'Urs"
              />
            </div>
          </div>

          {/* Foto Sampul dengan Lengkungan Estetik (Arch Modern) */}
          {withPhotos ? (
            <div className="my-5 relative h-56 w-44 overflow-hidden rounded-t-full border-3 border-[#9C4121]/40 shadow-xl ring-4 ring-[#E8DAC8]/60">
              <EditableImage
                src={coverImageUrl}
                alt={title}
                fill
                priority
                className="object-cover"
                field="coverImageUrl"
                label="Foto Sampul Utama"
              />
            </div>
          ) : (
            <div className="my-5 flex size-28 flex-col items-center justify-center rounded-t-full border-2 border-[#9C4121]/50 bg-[#F5EBE1] p-4 text-[#9C4121] shadow-inner">
              <Flower2 className="size-8" />
              <span className="mt-1 font-serif text-[9px] tracking-widest uppercase">
                Serenity
              </span>
            </div>
          )}

          {/* Judul Pengantin & Tanggal */}
          <div className="w-full text-center">
            <h1 className="w-full font-serif text-3xl font-bold tracking-tight text-[#2C1E18] sm:text-4xl">
              <EditableField field="title" fallback={title} />
            </h1>

            <p className="mt-2 font-mono text-xs font-semibold tracking-wider text-[#9C4121]">
              <EditableField
                field="eventDateText"
                fallback={eventDateFormatted}
              />
            </p>

            {/* Kotak Personalisasi Tamu Undangan */}
            <div className="mt-4 w-full rounded-2xl border border-[#E8DAC8] bg-[#FAF5EE]/90 px-4 py-2.5 shadow-2xs">
              <p className="text-[10px] tracking-wider text-[#7C695D] uppercase">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </p>
              <div className="mt-1 text-sm font-semibold text-[#2C1E18]">
                <GuestHint className="text-[#2C1E18]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </EditableRegion>
  );
}

