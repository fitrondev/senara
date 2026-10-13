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
}

export function CustomContentSlot({
  slotId,
  slotLabel,
  items,
  themeConfig,
  onOpenSlotModal,
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
            <CustomContentItemRenderer
              key={item.id}
              item={item}
              themeConfig={themeConfig}
            />
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-center border-y border-dashed border-primary/30 bg-primary/5 px-4 py-2 transition-colors hover:bg-primary/10">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-[11px] text-primary hover:bg-primary/10"
          onClick={() => onOpenSlotModal(slotId)}
        >
          <Plus className="size-3" />
          <span>
            {slotItems.length > 0
              ? `+ Tambah Blok Lagi (${slotLabel})`
              : `+ Sisipkan Layout Kustom (${slotLabel})`}
          </span>
        </Button>
      </div>
    </div>
  );
}
