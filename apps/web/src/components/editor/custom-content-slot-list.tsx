"use client";

import type * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  Heading,
  Image as ImageIcon,
  Link2,
  MapPin,
  MousePointerClick,
  Trash2,
  Type,
  Video,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@senara/ui/components/empty";
import { Label } from "@senara/ui/components/label";
import { Switch } from "@senara/ui/components/switch";
import { cn } from "@senara/ui/lib/utils";

import type { CustomContentType } from "./custom-content-forms";
import type { CustomContentItemData } from "./custom-content-modal";

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const CONTENT_TYPE_OPTIONS: readonly {
  type: CustomContentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass: string;
}[] = [
  {
    type: "TITLE",
    label: "+ Judul",
    icon: Heading,
    iconColorClass: "text-primary",
  },
  {
    type: "TEXT",
    label: "+ Teks",
    icon: Type,
    iconColorClass: "text-blue-500",
  },
  {
    type: "PHOTO",
    label: "+ Foto",
    icon: ImageIcon,
    iconColorClass: "text-emerald-500",
  },
  {
    type: "VIDEO",
    label: "+ Video",
    icon: Video,
    iconColorClass: "text-purple-500",
  },
  {
    type: "BUTTON",
    label: "+ Tombol",
    icon: MousePointerClick,
    iconColorClass: "text-amber-500",
  },
  {
    type: "LINK",
    label: "+ Tautan",
    icon: Link2,
    iconColorClass: "text-cyan-500",
  },
  {
    type: "YOUTUBE",
    label: "+ YouTube",
    icon: YoutubeIcon,
    iconColorClass: "text-red-500",
  },
  {
    type: "MAP",
    label: "+ Peta Lokasi",
    icon: MapPin,
    iconColorClass: "text-rose-500",
  },
] as const;

function renderItemSummary(item: CustomContentItemData) {
  const content = (item.content as Record<string, unknown>) || {};
  switch (item.type) {
    case "TITLE":
      return (
        <div className="flex items-center gap-2">
          <Heading className="size-4 shrink-0 text-primary" />
          <span className="truncate text-sm font-semibold">
            {(content.title as string) || "Judul Tanpa Nama"}
          </span>
        </div>
      );
    case "TEXT":
      return (
        <div className="flex items-center gap-2">
          <Type className="size-4 shrink-0 text-blue-500" />
          <span className="line-clamp-1 truncate text-xs text-muted-foreground">
            {(content.text as string) || "Teks paragraf..."}
          </span>
        </div>
      );
    case "PHOTO":
      return (
        <div className="flex items-center gap-2">
          <ImageIcon className="size-4 shrink-0 text-emerald-500" />
          <span className="truncate text-xs">
            {(content.caption as string) ||
              (content.imageUrl as string) ||
              "Foto"}
          </span>
        </div>
      );
    case "VIDEO":
      return (
        <div className="flex items-center gap-2">
          <Video className="size-4 shrink-0 text-purple-500" />
          <span className="truncate text-xs">
            {(content.videoUrl as string) || "Video Clip"}
          </span>
        </div>
      );
    case "BUTTON":
      return (
        <div className="flex items-center gap-2">
          <MousePointerClick className="size-4 shrink-0 text-amber-500" />
          <span className="truncate text-xs font-medium">
            {(content.label as string) || "Tombol CTA"}
          </span>
        </div>
      );
    case "LINK":
      return (
        <div className="flex items-center gap-2">
          <Link2 className="size-4 shrink-0 text-cyan-500" />
          <span className="truncate text-xs">
            {(content.label as string) || "Tautan"}
          </span>
        </div>
      );
    case "YOUTUBE":
      return (
        <div className="flex items-center gap-2">
          <YoutubeIcon className="size-4 shrink-0 text-red-500" />
          <span className="truncate text-xs">
            {(content.youtubeUrl as string) || "YouTube Video"}
          </span>
        </div>
      );
    case "MAP":
      return (
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-rose-500" />
          <span className="truncate text-xs font-medium">
            {(content.locationName as string) || "Lokasi Peta"}
          </span>
        </div>
      );
    default:
      return (
        <span className="text-xs text-muted-foreground">Blok Layout Kustom</span>
      );
  }
}

interface CustomContentSlotListProps {
  slotItems: CustomContentItemData[];
  isReordering: boolean;
  onMoveOrder: (index: number, direction: "up" | "down") => void;
  onToggleVisible: (itemId: string, currentVisible: boolean) => void;
  onEditItem: (item: CustomContentItemData) => void;
  onDeleteItem: (item: CustomContentItemData) => void;
  onCreateType: (type: CustomContentType) => void;
}

export function CustomContentSlotList({
  slotItems,
  isReordering,
  onMoveOrder,
  onToggleVisible,
  onEditItem,
  onDeleteItem,
  onCreateType,
}: CustomContentSlotListProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-foreground">
          Daftar Blok di Posisi Ini:
        </Label>

        {slotItems.length === 0 ? (
          <Empty className="rounded-xl border border-dashed border-muted-foreground/30 p-6">
            <EmptyHeader>
              <EmptyTitle className="text-xs font-medium text-foreground">
                Posisi ini masih kosong
              </EmptyTitle>
              <EmptyDescription className="text-[11px] text-muted-foreground">
                Pilih salah satu tombol tipe konten di bawah untuk mulai
                menyisipkan blok layout kustom.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-2">
            {slotItems.map((item, idx) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3 transition-colors",
                  item.isVisible ? "bg-card" : "bg-muted/40 opacity-60"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Badge
                    variant="secondary"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    {idx + 1}
                  </Badge>

                  <div className="min-w-0 flex-1">
                    {renderItemSummary(item)}
                  </div>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                  <div className="flex items-center rounded border bg-background p-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onMoveOrder(idx, "up")}
                      disabled={idx === 0 || isReordering}
                      title="Geser Naik"
                      className="size-5 rounded-none"
                    >
                      <ArrowUp className="size-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onMoveOrder(idx, "down")}
                      disabled={idx === slotItems.length - 1 || isReordering}
                      title="Geser Turun"
                      className="size-5 rounded-none"
                    >
                      <ArrowDown className="size-3" />
                    </Button>
                  </div>

                  <div title={item.isVisible ? "Tampilkan" : "Sembunyikan"}>
                    <Switch
                      checked={item.isVisible}
                      onCheckedChange={() =>
                        onToggleVisible(item.id, item.isVisible)
                      }
                      size="sm"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground"
                    onClick={() => onEditItem(item)}
                    title="Edit Komponen"
                  >
                    <Edit2 className="size-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:bg-destructive/10"
                    onClick={() => onDeleteItem(item)}
                    title="Hapus Komponen"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t pt-2">
        <Label className="text-xs font-semibold text-foreground">
          Tambah Komponen Baru ke Slot Ini:
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CONTENT_TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <Button
                key={opt.type}
                variant="outline"
                size="sm"
                className="h-9 justify-start gap-1.5 text-xs"
                onClick={() => onCreateType(opt.type)}
              >
                <Icon className={cn("size-3.5", opt.iconColorClass)} />
                <span>{opt.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}

