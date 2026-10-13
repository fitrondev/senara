"use client";

import Image from "next/image";
import { Music } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";

import type { ThemeConfig } from "@/components/editor/theme-modal";

import {
  EditableField,
  EditableRegion,
  GuestHint,
  SectionSwitch,
} from "../primitives";
import { BlushConfettiHeroBanner } from "../templates/blush-confetti";
import { CrescentLinenHeroBanner } from "../templates/crescent-linen";
import { JawaBiruHeroBanner } from "../templates/jawa-biru";
import {
  KartuPosHeroBanner,
  type TemplateThemePreset,
} from "../templates/kartu-pos";

interface InvitationHeroSectionProps {
  templateSlug: string;
  title: string;
  coverImageUrl: string;
  eventDateFormatted: string;
  preset: TemplateThemePreset;
  themeConfig: ThemeConfig;
  withPhotos: boolean;
  editing: boolean;
}

export function InvitationHeroSection({
  templateSlug,
  title,
  coverImageUrl,
  eventDateFormatted,
  preset,
  themeConfig,
  withPhotos,
  editing,
}: InvitationHeroSectionProps) {
  const renderBanner = () => {
    if (templateSlug.includes("kartu-pos")) {
      return (
        <KartuPosHeroBanner
          title={title}
          coverImageUrl={coverImageUrl}
          eventDateFormatted={eventDateFormatted}
        />
      );
    }
    if (templateSlug.includes("jawa-biru")) {
      return (
        <JawaBiruHeroBanner
          title={title}
          coverImageUrl={coverImageUrl}
          eventDateFormatted={eventDateFormatted}
        />
      );
    }
    if (templateSlug.includes("blush-confetti")) {
      return (
        <BlushConfettiHeroBanner
          title={title}
          coverImageUrl={coverImageUrl}
          eventDateFormatted={eventDateFormatted}
        />
      );
    }
    if (templateSlug.includes("crescent-linen")) {
      return (
        <CrescentLinenHeroBanner
          title={title}
          coverImageUrl={coverImageUrl}
          eventDateFormatted={eventDateFormatted}
        />
      );
    }

    return (
      <EditableRegion region="cover" label="Sampul & Foto Utama">
        <div
          className="relative flex min-h-[480px] flex-col justify-end overflow-hidden p-6 text-white"
          style={{ backgroundColor: themeConfig.palette.primary }}
        >
          {withPhotos ? (
            <>
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                className="object-cover opacity-65"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
          )}

          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            <Badge
              variant="secondary"
              className="border-none bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-widest text-white uppercase backdrop-blur"
            >
              <EditableField
                field="coverSubtitle"
                fallback={preset.labels.coverBadge}
              />
            </Badge>

            <h1
              className="text-3xl leading-tight font-bold tracking-tight text-white"
              style={{ fontFamily: themeConfig.typography.headingFont }}
            >
              <EditableField field="title" fallback={title} />
            </h1>

            <p className="mt-1 text-xs font-medium text-white/85">
              <EditableField
                field="eventDateText"
                fallback={eventDateFormatted}
              />
            </p>

            <div className="mt-4 w-full rounded-xl border border-white/20 bg-black/35 px-4 py-2.5 backdrop-blur-xs">
              <p className="text-[10px] tracking-wider text-white/75 uppercase">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </p>
              <div className="mt-1 text-sm text-white">
                <GuestHint className="text-white" />
              </div>
            </div>

            {editing ? (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-semibold text-zinc-900 shadow">
                <Music className="size-3.5 animate-pulse text-rose-500" />
                <span>Gerbang Autoplay Musik Aktif</span>
              </div>
            ) : null}
          </div>
        </div>
      </EditableRegion>
    );
  };

  return (
    <SectionSwitch sectionKey="hero" label="Sampul Utama" isLocked>
      {renderBanner()}
    </SectionSwitch>
  );
}

