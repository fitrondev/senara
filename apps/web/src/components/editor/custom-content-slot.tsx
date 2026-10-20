"use client";

import { Pencil, Plus, Sparkles } from "lucide-react";

import { Button } from "@senara/ui/components/button";

import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import type { ThemeConfig } from "@/components/editor/theme-modal";
import { CustomContentItemRenderer } from "@/components/invitation/custom-content-item-renderer";

interface CustomContentSlotProps {
  slotId: string;
  slotLabel: string;
  items: CustomContentItemData[];
  themeConfig: ThemeConfig;
  onOpenSlotModal: (slotId: string) => void;
  onOpenLayoutLibrary?: (slotId: string) => void;
  onEditItem?: (item: CustomContentItemData) => void;
}

function getItemTypeLabel(type: string): string {
  switch (type) {
    case "TITLE":
      return "Judul";
    case "TEXT":
      return "Teks";
    case "PHOTO":
      return "Foto";
    case "VIDEO":
      return "Video";
    case "BUTTON":
      return "Tombol";
    case "LINK":
      return "Tautan";
    case "YOUTUBE":
      return "YouTube";
    case "MAP":
      return "Peta";
    default:
      return "Blok";
  }
}

export function CustomContentSlot({
  slotId,
  slotLabel,
  items,
  themeConfig,
  onOpenSlotModal,
  onOpenLayoutLibrary,
  onEditItem,
}: CustomContentSlotProps) {
  const slotItems = items
    .filter((item) => item.slotId === slotId && item.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="group/slot relative w-full">
      {slotItems.length > 0 ? (
        <div className="flex flex-col gap-4 border-y border-dashed border-primary/20 bg-background/50 p-4 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
              <Sparkles className="size-3" />
              <span>Layout Kustom: {slotLabel}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenSlotModal(slotId)}
              className="h-6 gap-1 px-2 text-[10px] text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-2.5" />
              <span>Kelola ({slotItems.length})</span>
            </Button>
          </div>

          {slotItems.map((item) => (
            <div
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditItem?.(item);
              }}
              title={`Klik untuk mengedit ${getItemTypeLabel(item.type)}`}
              className="group/item relative cursor-pointer rounded-lg p-2 transition-all hover:bg-primary/5 hover:outline-1 hover:outline-dashed hover:outline-primary/70"
            >
              <div className="pointer-events-none">
                <CustomContentItemRenderer
                  item={item}
                  themeConfig={themeConfig}
                />
              </div>

              <div className="absolute -top-2 right-2 hidden items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm group-hover/item:flex z-10 pointer-events-none">
                <Pencil className="size-2.5" />
                <span>Edit {getItemTypeLabel(item.type)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-2 border-y border-dashed border-primary/30 bg-primary/5 px-4 py-2 transition-colors hover:bg-primary/10">
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-[11px] font-semibold border-primary/40 bg-white/90 text-primary hover:bg-primary hover:text-primary-foreground shadow-xs dark:bg-zinc-900"
          onClick={() => onOpenLayoutLibrary?.(slotId)}
        >
          <Sparkles className="size-3 text-amber-500" />
          <span>Pilih Layout Halaman</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          onClick={() => onOpenSlotModal(slotId)}
        >
          <Plus className="size-3" />
          <span>
            {slotItems.length > 0
              ? `Kelola Blok (${slotItems.length})`
              : `Kustom Blok Satuan`}
          </span>
        </Button>
      </div>
    </div>
  );
}
