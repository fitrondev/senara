"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  GripVertical,
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
import { Switch } from "@senara/ui/components/switch";
import { cn } from "@senara/ui/lib/utils";

import type { CustomContentItemData } from "./custom-content-modal";
import { YoutubeIcon } from "./custom-content-types";

function renderItemSummary(item: CustomContentItemData) {
  const content = (item.content as Record<string, unknown>) || {};
  switch (item.type) {
    case "TITLE": {
      const rawTitle = (content.title as string) || "";
      const cleanTitle =
        rawTitle.replace(/<[^>]*>?/gm, "").trim() || "Judul Tanpa Nama";
      return (
        <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
          <Heading className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {cleanTitle}
          </span>
        </div>
      );
    }
    case "TEXT": {
      const rawText = (content.text as string) || "";
      const cleanText =
        rawText.replace(/<[^>]*>?/gm, "").trim() || "Teks paragraf...";
      return (
        <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
          <Type className="size-4 shrink-0 text-blue-500" />
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {cleanText}
          </span>
        </div>
      );
    }
    case "PHOTO":
      return (
        <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
          <ImageIcon className="size-4 shrink-0 text-emerald-500" />
          <span className="min-w-0 flex-1 truncate text-xs">
            {(content.caption as string) ||
              (content.imageUrl as string) ||
              "Foto"}
          </span>
        </div>
      );
    case "VIDEO":
      return (
        <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
          <Video className="size-4 shrink-0 text-purple-500" />
          <span className="min-w-0 flex-1 truncate text-xs">
            {(content.videoUrl as string) || "Video Clip"}
          </span>
        </div>
      );
    case "BUTTON":
      return (
        <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
          <MousePointerClick className="size-4 shrink-0 text-amber-500" />
          <span className="min-w-0 flex-1 truncate text-xs font-medium">
            {(content.label as string) || "Tombol CTA"}
          </span>
        </div>
      );
    case "LINK":
      return (
        <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
          <Link2 className="size-4 shrink-0 text-cyan-500" />
          <span className="min-w-0 flex-1 truncate text-xs">
            {(content.label as string) || "Tautan"}
          </span>
        </div>
      );
    case "YOUTUBE":
      return (
        <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
          <YoutubeIcon className="size-4 shrink-0 text-red-500" />
          <span className="min-w-0 flex-1 truncate text-xs">
            {(content.youtubeUrl as string) || "YouTube Video"}
          </span>
        </div>
      );
    case "MAP":
      return (
        <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
          <MapPin className="size-4 shrink-0 text-rose-500" />
          <span className="min-w-0 flex-1 truncate text-xs font-medium">
            {(content.locationName as string) || "Lokasi Peta"}
          </span>
        </div>
      );
    default:
      return (
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          Blok Layout Kustom
        </span>
      );
  }
}

interface SortableCustomContentItemProps {
  item: CustomContentItemData;
  index: number;
  totalCount: number;
  isReordering: boolean;
  onMoveOrder: (index: number, direction: "up" | "down") => void;
  onToggleVisible: (itemId: string, currentVisible: boolean) => void;
  onEditItem: (item: CustomContentItemData) => void;
  onDeleteItem: (item: CustomContentItemData) => void;
}

export function SortableCustomContentItem({
  item,
  index,
  totalCount,
  isReordering,
  onMoveOrder,
  onToggleVisible,
  onEditItem,
  onDeleteItem,
}: SortableCustomContentItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      item,
      isSortableItem: true,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex w-full min-w-0 max-w-full items-center justify-between rounded-lg border p-2.5 transition-colors overflow-hidden",
        item.isVisible ? "bg-card" : "bg-muted/40 opacity-60",
        isDragging && "z-10 border-primary bg-primary/5 opacity-50 shadow-md ring-2 ring-primary/20"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
        {/* Handle Drag Reorder */}
        <button
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
          style={{ touchAction: "none" }}
          title="Tarik untuk mengubah urutan blok"
          aria-label={`Ubah urutan blok ke-${index + 1}`}
          className="flex size-6 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>

        <Badge
          variant="secondary"
          className="flex size-5.5 shrink-0 items-center justify-center rounded-full p-0 text-[10px] font-semibold"
        >
          {index + 1}
        </Badge>

        <div className="min-w-0 flex-1 overflow-hidden">{renderItemSummary(item)}</div>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-1.5">
        {/* Tombol Geser Atas / Bawah untuk Aksesibilitas */}
        <div className="flex items-center rounded border bg-background p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onMoveOrder(index, "up")}
            disabled={index === 0 || isReordering}
            title="Geser Naik"
            className="size-5 rounded-none"
          >
            <ArrowUp className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onMoveOrder(index, "down")}
            disabled={index === totalCount - 1 || isReordering}
            title="Geser Turun"
            className="size-5 rounded-none"
          >
            <ArrowDown className="size-3" />
          </Button>
        </div>

        <div title={item.isVisible ? "Tampilkan" : "Sembunyikan"}>
          <Switch
            checked={item.isVisible}
            onCheckedChange={() => onToggleVisible(item.id, item.isVisible)}
            size="sm"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-foreground"
          onClick={() => onEditItem(item)}
          title="Edit Komponen"
        >
          <Edit2 className="size-3" />
        </Button>

        <Button
          type="button"
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
  );
}

export function SortableItemPreview({ item }: { item: CustomContentItemData }) {
  return (
    <div className="pointer-events-none z-50 flex max-w-sm min-w-0 select-none items-center justify-between rounded-lg border-2 border-primary bg-background p-3 shadow-2xl ring-4 ring-primary/20 overflow-hidden">
      <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
        <GripVertical className="size-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1 overflow-hidden">{renderItemSummary(item)}</div>
      </div>
    </div>
  );
}

