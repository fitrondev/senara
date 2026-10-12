"use client";

import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import { cn } from "@senara/ui/lib/utils";

import type { ThemeConfig } from "@/components/editor/theme-modal";

export interface PublicCustomContentItem {
  id: string;
  slotId: string;
  type: string;
  content: unknown;
  sortOrder: number;
  isVisible: boolean;
}

interface PublicCustomContentSlotProps {
  slotId: string;
  items: PublicCustomContentItem[];
  themeConfig: ThemeConfig;
}

function getYoutubeEmbedUrl(rawUrl: string, autoPlay?: boolean): string | null {
  if (!rawUrl) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = rawUrl.match(regExp);
  const videoId = match && match[2] && match[2].length === 11 ? match[2] : null;
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=1`;
}

export function PublicCustomContentSlot({
  slotId,
  items,
  themeConfig,
}: PublicCustomContentSlotProps) {
  const slotItems = items
    .filter((item) => item.slotId === slotId && item.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (slotItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-background/50">
      {slotItems.map((item) => {
        const content = (item.content as Record<string, unknown>) || {};

        switch (item.type) {
          case "TITLE": {
            const titleText = (content.title as string) || "";
            const align = (content.align as "left" | "center" | "right") || "center";
            const sizeClass = (content.fontSize as string) || "text-xl";
            const textAlignClass =
              align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

            return (
              <h4
                key={item.id}
                className={cn(
                  "w-full font-bold tracking-tight text-foreground",
                  sizeClass,
                  textAlignClass
                )}
                style={{ fontFamily: themeConfig.typography.headingFont }}
              >
                {titleText}
              </h4>
            );
          }

          case "TEXT": {
            const textBody = (content.text as string) || "";
            const align = (content.align as "left" | "center" | "right") || "center";
            const textAlignClass =
              align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

            return (
              <p
                key={item.id}
                className={cn(
                  "w-full text-xs leading-relaxed text-muted-foreground whitespace-pre-line",
                  textAlignClass
                )}
                style={{ fontFamily: themeConfig.typography.bodyFont }}
              >
                {textBody}
              </p>
            );
          }

          case "PHOTO": {
            const photoUrl = (content.imageUrl as string) || "";
            const caption = (content.caption as string) || "";
            const ratio = (content.aspectRatio as string) || "16:9";
            const aspectClass =
              ratio === "1:1"
                ? "aspect-square"
                : ratio === "4:5"
                  ? "aspect-4/5"
                  : "aspect-16/9";

            return (
              <div key={item.id} className="flex flex-col items-center gap-1.5 w-full">
                <div
                  className={`relative w-full overflow-hidden rounded-xl border bg-muted shadow-xs ${aspectClass}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={caption || "Foto"}
                    className="h-full w-full object-cover"
                  />
                </div>
                {caption ? (
                  <p className="text-[11px] text-muted-foreground italic text-center">
                    {caption}
                  </p>
                ) : null}
              </div>
            );
          }

          case "VIDEO": {
            const videoUrl = (content.videoUrl as string) || "";
            const poster = (content.posterUrl as string) || undefined;
            const isMuted = typeof content.isMuted === "boolean" ? content.isMuted : true;

            return (
              <div
                key={item.id}
                className="relative w-full aspect-16/9 overflow-hidden rounded-xl border bg-black shadow-xs"
              >
                <video
                  src={videoUrl}
                  poster={poster}
                  muted={isMuted}
                  controls
                  playsInline
                  className="h-full w-full object-contain"
                />
              </div>
            );
          }

          case "BUTTON": {
            const label = (content.label as string) || "Kunjungi";
            const url = (content.url as string) || "#";
            const style = (content.style as "solid" | "outline") || "solid";
            const openNewTab =
              typeof content.openNewTab === "boolean" ? content.openNewTab : true;

            return (
              <div key={item.id} className="w-full py-1">
                <a
                  href={url}
                  target={openNewTab ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 px-4 text-xs font-semibold shadow-xs transition-colors ${
                    style === "solid"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-primary text-primary hover:bg-primary/10"
                  }`}
                >
                  <span>{label}</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            );
          }

          case "LINK": {
            const linkLabel = (content.label as string) || "Tautan";
            const linkUrl = (content.url as string) || "#";

            return (
              <div key={item.id} className="text-center py-1">
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                >
                  <span>{linkLabel}</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            );
          }

          case "YOUTUBE": {
            const ytUrl = (content.youtubeUrl as string) || "";
            const autoPlay = !!content.autoPlay;
            const embedUrl = getYoutubeEmbedUrl(ytUrl, autoPlay);

            return (
              <div
                key={item.id}
                className="relative w-full aspect-16/9 overflow-hidden rounded-xl border bg-black shadow-xs"
              >
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="YouTube Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
                    URL YouTube tidak valid
                  </div>
                )}
              </div>
            );
          }

          case "MAP": {
            const locName = (content.locationName as string) || "Lokasi";
            const locAddress = (content.address as string) || "";
            const mapsUrl = (content.mapsUrl as string) || "";

            return (
              <Card
                key={item.id}
                className="gap-2 p-3 text-left shadow-xs"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 shrink-0 text-rose-500 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs text-foreground">{locName}</p>
                    {locAddress ? (
                      <p className="text-[11px] text-muted-foreground mt-0.5">{locAddress}</p>
                    ) : null}
                  </div>
                </div>
                {mapsUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    className="mt-1 w-full gap-1 text-[11px]"
                  >
                    <ExternalLink className="size-3 text-muted-foreground" />
                    <span>Buka di Google Maps</span>
                  </Button>
                ) : null}
              </Card>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

