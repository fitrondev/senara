"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

import { cn } from "@senara/ui/lib/utils";

import type { ContentTypeOption } from "./custom-content-types";

interface DraggablePaletteItemProps {
  option: ContentTypeOption;
  onClick: () => void;
  disabled?: boolean;
}

export function DraggablePaletteItem({
  option,
  onClick,
  disabled = false,
}: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${option.type}`,
    disabled,
    data: {
      type: option.type,
      label: option.label,
      isNewComponent: true,
    },
  });

  const Icon = option.icon;

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={onClick}
      disabled={disabled}
      style={{ touchAction: "none" }}
      title={`Tarik atau klik untuk menambahkan blok ${option.label}`}
      className={cn(
        "group relative flex h-9.5 w-full select-none items-center justify-start gap-1.5 rounded-lg border bg-background px-2.5 text-xs font-medium transition-all shadow-2xs",
        "cursor-grab active:cursor-grabbing hover:border-primary/50 hover:bg-primary/5",
        isDragging && "opacity-35 border-dashed border-primary ring-2 ring-primary/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <GripVertical className="size-3 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
      <Icon className={cn("size-3.5 shrink-0", option.iconColorClass)} />
      <span className="font-medium text-foreground">{option.label}</span>
    </button>
  );
}

export function PaletteItemPreview({ option }: { option: ContentTypeOption }) {
  const Icon = option.icon;
  return (
    <div className="pointer-events-none z-50 flex select-none items-center gap-2 rounded-lg border-2 border-primary bg-background px-3 py-2 shadow-2xl ring-4 ring-primary/20">
      <GripVertical className="size-3.5 text-primary" />
      <Icon className={cn("size-4 shrink-0", option.iconColorClass)} />
      <span className="text-xs font-semibold text-foreground">
        {option.label}
      </span>
      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
        Lepaskan di daftar
      </span>
    </div>
  );
}
