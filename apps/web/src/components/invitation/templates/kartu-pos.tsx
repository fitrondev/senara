"use client";

import Image from "next/image";
import { Mail, Stamp } from "lucide-react";

import { EditableField, EditableRegion, GuestHint } from "../primitives";
import { useEditContext } from "../edit-context";

export interface TemplateThemePreset {
  slug: string;
  eventCategory: "WEDDING" | "BIRTHDAY" | "KHITANAN";
  bgMain: string;
  bgCard: string;
  textMain: string;
  textMuted: string;
  accentColor: string;
  borderStyle: string;
  labels: {
    coverBadge: string;
    defaultTitle: string;
    quoteTitle: string;
    defaultQuote: string;
    defaultQuoteSource: string;
    profileBadge: string;
    profileTitle: string;
    person1Name: string;
    person1Parents: string;
    person1Photo: string;
    person2Name?: string;
    person2Parents?: string;
    person2Photo?: string;
    eventTitle: string;
    storyBadge: string;
    storyTitle: string;
    galleryTitle: string;
    giftTitle: string;
    rsvpTitle: string;
    closingText: string;
  };
}

export const KARTU_POS_PRESET: TemplateThemePreset = {
  slug: "kartu-pos-vintage",
  eventCategory: "WEDDING",
  bgMain: "#F6EEDC",
  bgCard: "#FBF6EA",
  textMain: "#2C221E",
  textMuted: "#6E5A4F",
  accentColor: "#B8332A",
  borderStyle: "#D8C7A8",
  labels: {
    coverBadge: "PAR AVION • POS UDARA ISTIMEWA",
    defaultTitle: "Adinda & Bagas",
    quoteTitle: "Warkat Doa",
    defaultQuote:
      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.",
    defaultQuoteSource: "QS. Ar-Rum: 21",
    profileBadge: "Pengirim Kabar Bahagia",
    profileTitle: "Kedua Mempelai",
    person1Name: "Adinda Rahma, S.Ars",
    person1Parents: "Putri pertama Bpk. Hendra Wijaya & Ibu Rina Kusuma",
    person1Photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    person2Name: "Bagas Pratama, S.T.",
    person2Parents: "Putra kedua Bpk. Santoso Adi & Ibu Dewi Lestari",
    person2Photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    eventTitle: "Tujuan & Waktu Perjumpaan",
    storyBadge: "Catatan Perjalanan",
    storyTitle: "Lembar demi Lembar",
    galleryTitle: "Prangko Kenangan",
    giftTitle: "Wesel & Tanda Kasih",
    rsvpTitle: "Kartu Balasan Tamu (RSVP)",
    closingText:
      "Kehadiran dan doa restu Bapak/Ibu/Saudara/i adalah prangko terindah dalam perjalanan baru kami.",
  },
};

export function KartuPosHeroBanner({
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
    <EditableRegion region="cover" label="Sampul & Foto Kartu Pos">
      <div
        className="relative overflow-hidden p-4"
        style={{
          backgroundColor: "#F6EEDC",
          backgroundImage:
            "repeating-linear-gradient(135deg, #b8332a 0 12px, #f6eedc 12px 20px, #1e3f66 20px 32px, #f6eedc 32px 40px)",
        }}
      >
        <div
          className="relative flex min-h-[470px] flex-col justify-between border border-[#D8C7A8] p-6 shadow-md"
          style={{ backgroundColor: "#FBF6EA", color: "#2C221E" }}
        >
          {/* Baris Atas: Cap Pos & Prangko */}
          <div className="flex items-start justify-between gap-3 border-b border-dashed border-[#C7B290] pb-4">
            <div className="text-left">
              <span className="inline-block rounded border border-[#1E3F66] px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#1E3F66]">
                PAR AVION • AIRMAIL
              </span>
              <p className="mt-1 font-mono text-[10px] text-[#6E5A4F]">
                NO. SERI: SNR-2026-POS
              </p>
            </div>

            {/* Cap Pos Bundar */}
            <div className="flex size-16 flex-col items-center justify-center rounded-full border-2 border-dashed border-[#B8332A]/75 text-center font-mono text-[8px] font-bold tracking-tighter text-[#B8332A] -rotate-12">
              <span>POS CINTA</span>
              <span className="border-y border-[#B8332A]/50 px-1 text-[9px]">
                2026
              </span>
              <span>INDONESIA</span>
            </div>
          </div>

          {/* Bagian Tengah: Foto Prangko atau Ilustrasi Monogram */}
          <div className="my-5 flex flex-col items-center">
            {withPhotos ? (
              <div className="relative aspect-[4/3] w-full max-w-[250px] rotate-1 border-[6px] border-dotted border-[#D8C7A8] bg-white p-2 shadow-md">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={coverImageUrl}
                    alt={title}
                    fill
                    className="object-cover sepia-[0.15]"
                  />
                </div>
              </div>
            ) : (
              <div className="my-4 flex size-28 flex-col items-center justify-center rounded-full border-2 border-double border-[#B8332A]/50 bg-[#F6EEDC] p-4 text-[#B8332A]">
                <Stamp className="size-9 opacity-80" />
                <span className="mt-1 font-mono text-[9px] tracking-widest uppercase">
                  Warkat Resmi
                </span>
              </div>
            )}

            <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-[#6E5A4F] uppercase">
              <EditableField
                field="coverSubtitle"
                fallback="Warkat Undangan Pernikahan"
              />
            </p>

            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#2C221E]">
              <EditableField field="title" fallback={title} />
            </h1>

            <p className="mt-1.5 font-mono text-xs font-semibold text-[#B8332A]">
              <EditableField field="eventDateText" fallback={eventDateFormatted} />
            </p>
          </div>

          {/* Bagian Bawah: Alamat Tujuan Tamu */}
          <div className="rounded-md border border-[#D8C7A8] bg-[#F6EEDC]/70 p-3 text-left">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#6E5A4F] uppercase">
              <Mail className="size-3 text-[#B8332A]" />
              <span>Kepada Yth. Penerima Warkat:</span>
            </div>
            <div className="mt-1 text-sm text-[#2C221E]">
              <GuestHint />
            </div>
          </div>
        </div>
      </div>
    </EditableRegion>
  );
}

