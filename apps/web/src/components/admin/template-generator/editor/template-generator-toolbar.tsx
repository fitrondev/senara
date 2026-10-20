"use client";

import type { Route } from "next";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Crown,
  Eye,
  Globe,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  Monitor,
  Music2,
  Palette,
  Settings2,
  Smartphone,
  Type,
  Wand2,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Switch } from "@senara/ui/components/switch";

import type { TemplateGeneratorState } from "./use-template-generator-state";

export interface TemplateGeneratorToolbarProps {
  state: TemplateGeneratorState;
  deviceMode: "mobile" | "desktop";
  onDeviceModeChange: (mode: "mobile" | "desktop") => void;
  onOpenMetaDialog: () => void;
  onOpenThemeModal: () => void;
  onOpenFontModal: () => void;
  onOpenMusicModal: () => void;
  onOpenPhotoFramer: () => void;
  onOpenReorderModal: () => void;
  onOpenLayoutLibrary: () => void;
  onOpenPreview: () => void;
}

export function TemplateGeneratorToolbar({
  state,
  deviceMode,
  onDeviceModeChange,
  onOpenMetaDialog,
  onOpenThemeModal,
  onOpenFontModal,
  onOpenMusicModal,
  onOpenPhotoFramer,
  onOpenReorderModal,
  onOpenLayoutLibrary,
  onOpenPreview,
}: TemplateGeneratorToolbarProps) {
  const { metadata, status, actions, draft } = state;

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-background/95 px-4 py-2.5 backdrop-blur-md">
      {/* Kiri: Navigasi Kembali, Judul Template & Status */}
      <div className="flex items-center gap-3">
        <Button
          render={<Link href={"/dashboard/template-generator" as Route} />}
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali</span>
        </Button>

        <div className="h-4 w-px bg-border/80" />

        <div className="flex items-center gap-2">
          <span className="max-w-[180px] truncate font-serif text-sm font-bold text-foreground sm:max-w-xs">
            {metadata.name}
          </span>
          <Badge variant="outline" className="text-[10px] uppercase font-mono">
            {metadata.category}
          </Badge>
          {status.status === "PUBLISHED" ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px]">
              Published
            </Badge>
          ) : status.status === "ARCHIVED" ? (
            <Badge className="bg-zinc-500/15 text-zinc-600 border-zinc-500/30 text-[10px]">
              Archived
            </Badge>
          ) : (
            <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px]">
              Draft
            </Badge>
          )}
        </div>

        {/* Autosave status indicator */}
        <div className="hidden items-center gap-1.5 text-[11px] text-muted-foreground md:flex">
          {status.autoSaveStatus === "saving" ? (
            <>
              <Loader2 className="size-3 animate-spin text-amber-500" />
              <span>Menyimpan...</span>
            </>
          ) : status.autoSaveStatus === "saved" ? (
            <>
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span>Tersimpan</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Tengah: Quick Design Actions */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 px-2.5 text-xs"
          onClick={onOpenMetaDialog}
        >
          <Settings2 className="size-3.5 text-amber-500" />
          <span>Metadata</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 px-2.5 text-xs"
          onClick={onOpenThemeModal}
        >
          <Palette className="size-3.5 text-primary" />
          <span>Palet Warna</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 px-2.5 text-xs"
          onClick={onOpenFontModal}
        >
          <Type className="size-3.5 text-primary" />
          <span>Tipografi</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 px-2.5 text-xs"
          onClick={onOpenPhotoFramer}
        >
          <ImageIcon className="size-3.5 text-primary" />
          <span>Foto Sampul</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 px-2.5 text-xs"
          onClick={onOpenMusicModal}
        >
          <Music2 className="size-3.5 text-primary" />
          <span>Musik</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 px-2.5 text-xs"
          onClick={onOpenReorderModal}
        >
          <LayoutGrid className="size-3.5 text-primary" />
          <span>Bagian</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 px-2.5 text-xs border-amber-500/40 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
          onClick={onOpenLayoutLibrary}
        >
          <Wand2 className="size-3.5 text-amber-600" />
          <span>Layout Library</span>
        </Button>
      </div>

      {/* Kanan: Device Mode & Publish / Archive Action */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
          <Button
            variant={deviceMode === "mobile" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onDeviceModeChange("mobile")}
          >
            <Smartphone className="size-3.5" />
          </Button>
          <Button
            variant={deviceMode === "desktop" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onDeviceModeChange("desktop")}
          >
            <Monitor className="size-3.5" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2.5 text-xs"
          onClick={onOpenPreview}
        >
          <Eye className="size-3.5" />
          <span className="hidden sm:inline">Pratinjau</span>
        </Button>

        {status.status !== "PUBLISHED" ? (
          <Button
            type="button"
            size="sm"
            className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3"
            onClick={actions.publish}
            disabled={status.isPublishing}
          >
            {status.isPublishing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Globe className="size-3.5" />
            )}
            <span>Publikasikan</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-zinc-600 text-xs px-3"
            onClick={actions.archive}
            disabled={status.isArchiving}
          >
            <Archive className="size-3.5" />
            <span>Arsipkan</span>
          </Button>
        )}
      </div>
    </header>
  );
}
