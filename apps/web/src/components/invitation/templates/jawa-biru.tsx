"use client";

import Image from "next/image";
import { Crown, Sparkles } from "lucide-react";

import { EditableField, EditableRegion, GuestHint } from "../primitives";
import { useEditContext } from "../edit-context";
import type { TemplateThemePreset } from "./kartu-pos";

export const JAWA_BIRU_PRESET: TemplateThemePreset = {
  slug: "jawa-biru",
  eventCategory: "WEDDING",
  bgMain: "#0F1E36",
  bgCard: "#162A4A",
  textMain: "#F8EFE0",
  textMuted: "#C5B496",
  accentColor: "#D4AF37",
  borderStyle: "#D4AF37",
  labels: {
    coverBadge: "PAWIWAHAN AGUNG • ADAT NUSANTARA",
    defaultTitle: "Raras & Danang",
    quoteTitle: "Sabda & Doa Restu",
    defaultQuote:
      "Mugi Gusti Kang Maha Agung tansah paring berkah rahmat saha kabagyan langgeng dhumateng temanten kekalih.",
    defaultQuoteSource: "Doa Restu Pawiwahan",
    profileBadge: "Sri Pengantin",
    profileTitle: "Mempelai Berbahagia",
    person1Name: "R.A. Rarasati Ningrum",
    person1Parents: "Putri Bpk. K.R.T. Suryo Diningrat & Ibu Dewi Sekar",
    person1Photo:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
    person2Name: "R.M. Danang Wijaya",
    person2Parents: "Putra Bpk. Bambang Pamungkas & Ibu Sri Rahayu",
    person2Photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    eventTitle: "Rangkaian Hajatan & Ijab Qobul",
    storyBadge: "Babad Asmara",
    storyTitle: "Perjalanan Cinta",
    galleryTitle: "Nawala Gambar Kenangan",
    giftTitle: "Tali Asih & Tanda Kasih",
    rsvpTitle: "Buku Tamu Kehormatan",
    closingText:
      "Atas rawuh saha berkah pangestu Bapak/Ibu/Saudara/i sedaya, kami haturkan agunging panuwun.",
  },
};

export function JawaBiruHeroBanner({
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
    <EditableRegion region="cover" label="Sampul Jawa Biru Keraton">
      <div
        className="relative min-h-[500px] overflow-hidden border-b-2 border-[#D4AF37]/40 p-6 text-center"
        style={{
          background:
            "radial-gradient(circle at top, #1D3760 0%, #0F1E36 65%, #091324 100%)",
          color: "#F8EFE0",
        }}
      >
        {/* Bingkai Ornamen Emas Keraton */}
        <div className="relative flex min-h-[450px] flex-col items-center justify-between rounded-t-[3rem] border-2 border-[#D4AF37]/60 p-6 shadow-inner">
          <div className="flex flex-col items-center gap-1">
            <Crown className="size-5 text-[#D4AF37]" />
            <span className="text-[10px] font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              <EditableField field="coverSubtitle" fallback="Pawiwahan Agung" />
            </span>
          </div>

          {withPhotos ? (
            <div className="my-4 relative h-52 w-44 overflow-hidden rounded-t-full border-2 border-[#D4AF37] shadow-xl">
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="my-5 flex size-28 flex-col items-center justify-center rounded-t-full border-2 border-[#D4AF37]/80 bg-[#162A4A] p-4 text-[#D4AF37]">
              <Sparkles className="size-8" />
              <span className="mt-1 font-serif text-[10px] tracking-widest uppercase">
                Gunungan
              </span>
            </div>
          )}

          <div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-[#F8EFE0]">
              <EditableField field="title" fallback={title} />
            </h1>
            <p className="mt-1.5 text-xs font-medium tracking-widest text-[#D4AF37]">
              <EditableField field="eventDateText" fallback={eventDateFormatted} />
            </p>
          </div>

          <div className="mt-5 w-full rounded-xl border border-[#D4AF37]/40 bg-[#162A4A]/80 px-4 py-3">
            <p className="text-[10px] tracking-wider text-[#C5B496] uppercase">
              Katur Dhumateng Bapak/Ibu/Saudara/i:
            </p>
            <div className="mt-1 text-sm text-[#F8EFE0]">
              <GuestHint className="text-[#F8EFE0]" />
            </div>
          </div>
        </div>
      </div>
    </EditableRegion>
  );
}

