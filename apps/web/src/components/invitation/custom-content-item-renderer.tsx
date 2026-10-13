"use client";

import { ExternalLink, MapPin } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import { cn } from "@senara/ui/lib/utils";

import type { ThemeConfig } from "@/components/editor/theme-modal";

// Vercel Best Practice (js-hoist-regexp): Hoist RegExp creation outside functions
const YOUTUBE_URL_REGEXP =
  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

export function getYoutubeEmbedUrl(
  rawUrl: string,
  autoPlay?: boolean
): string | null {
  if (!rawUrl) return null;
  const match = rawUrl.match(YOUTUBE_URL_REGEXP);
  const videoId =
    match && match[2] && match[2].length === 11 ? match[2] : null;
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=1`;
}

export interface RenderableCustomContentItem {
  id: string;
  type: string;
  content: unknown;
}

interface CustomContentItemRendererProps {
  item: RenderableCustomContentItem;
  themeConfig: ThemeConfig;
}

export function CustomContentItemRenderer({
  item,
  themeConfig,
}: CustomContentItemRendererProps) {
  const content = (item.content as Record<string, unknown>) || {};

  switch (item.type) {
    case "TITLE": {
      const titleText = (content.title as string) || "";
      const align =
        (content.align as "left" | "center" | "right") || "center";
      const sizeClass = (content.fontSize as string) || "text-xl";
      const textAlignClass =
        align === "left"
          ? "text-left"
          : align === "right"
            ? "text-right"
            : "text-center";

      return (
        <h4
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
      const align =
        (content.align as "left" | "center" | "right") || "center";
      const textAlignClass =
        align === "left"
          ? "text-left"
          : align === "right"
            ? "text-right"
            : "text-center";

      return (
        <p
          className={cn(
            "w-full whitespace-pre-line text-xs leading-relaxed text-muted-foreground",
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
        <div className="flex w-full flex-col items-center gap-1.5">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-xl border bg-muted shadow-xs",
              aspectClass
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={caption || "Foto Layout Kustom"}
              className="h-full w-full object-cover"
            />
          </div>
          {caption ? (
            <p className="text-center text-[11px] italic text-muted-foreground">
              {caption}
            </p>
          ) : null}
        </div>
      );
    }

    case "VIDEO": {
      const videoUrl = (content.videoUrl as string) || "";
      const poster = (content.posterUrl as string) || undefined;
      const isMuted =
        typeof content.isMuted === "boolean" ? content.isMuted : true;

      return (
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border bg-black shadow-xs">
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
      const label = (content.label as string) || "Klik Di Sini";
      const url = (content.url as string) || "#";
      const style = (content.style as "solid" | "outline") || "solid";
      const openNewTab =
        typeof content.openNewTab === "boolean" ? content.openNewTab : true;

      return (
        <div className="w-full py-1">
          <a
            href={url}
            target={openNewTab ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={cn(
              "flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-xs transition-colors",
              style === "solid"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-primary text-primary hover:bg-primary/10"
            )}
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
        <div className="py-1 text-center">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span>{linkLabel}</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      );
    }

    case "YOUTUBE": {
      const ytUrl = (content.youtubeUrl as string) || "";
      const autoPlay = Boolean(content.autoPlay);
      const embedUrl = getYoutubeEmbedUrl(ytUrl, autoPlay);

      return (
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border bg-black shadow-xs">
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
        <Card className="gap-2 p-3 text-left shadow-xs">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-rose-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">{locName}</p>
              {locAddress ? (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {locAddress}
                </p>
              ) : null}
            </div>
          </div>
          {mapsUrl ? (
            <Button
              variant="outline"
              size="sm"
              render={
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" />
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
}

