"use client";

import type { Route } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Crop,
  Eye,
  Globe,
  Layers,
  Loader2,
  Music,
  Palette,
  RefreshCw,
  Smartphone,
  Sparkles,
  SwatchBook,
  Tablet,
  Type,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Separator } from "@senara/ui/components/separator";
import { ToggleGroup, ToggleGroupItem } from "@senara/ui/components/toggle-group";
import { cn } from "@senara/ui/lib/utils";

import { PhotoSwitch } from "@/components/invitation/photo-switch";

export interface EditorToolbarProps {
  autoSaveStatus: "idle" | "saving" | "saved" | "unsaved" | "error";
  onRetrySave: () => void;
  withPhotos: boolean;
  onToggleWithPhotos: (nextWithPhotos: boolean) => void;
  deviceMode: "mobile" | "desktop";
  onDeviceModeChange: (mode: "mobile" | "desktop") => void;
  customContentsCount: number;
  publicUrl: string;
  isPublished: boolean;
  isPublishing: boolean;
  onTogglePublish: () => void;
  onOpenChangeTheme: () => void;
  onOpenFontModal: () => void;
  onOpenMusicModal: () => void;
  onOpenPhotoFramer: () => void;
  onOpenCustomContent: () => void;
  onOpenThemePalette: () => void;
  onOpenReorderModal: () => void;
}

export function EditorToolbar({
  autoSaveStatus,
  onRetrySave,
  withPhotos,
  onToggleWithPhotos,
  deviceMode,
  onDeviceModeChange,
  customContentsCount,
  publicUrl,
  isPublished,
  isPublishing,
  onTogglePublish,
  onOpenChangeTheme,
  onOpenFontModal,
  onOpenMusicModal,
  onOpenPhotoFramer,
  onOpenCustomContent,
  onOpenThemePalette,
  onOpenReorderModal,
}: EditorToolbarProps) {
  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex items-center gap-2.5">
        <Button
          render={<Link href={"/dashboard" as Route} />}
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>

        <Separator orientation="vertical" className="h-4" />

        <div className="flex items-center gap-1.5 text-xs">
          {autoSaveStatus === "saving" ? (
            <span className="flex items-center gap-1.5 font-medium text-amber-500">
              <Loader2 className="size-3.5 animate-spin" />
              <span className="hidden md:inline">Menyimpan...</span>
            </span>
          ) : null}
          {autoSaveStatus === "saved" ? (
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="hidden md:inline">Tersimpan</span>
            </span>
          ) : null}
          {autoSaveStatus === "unsaved" ? (
            <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-amber-400" />
              <span className="hidden md:inline">Ada perubahan...</span>
            </span>
          ) : null}
          {autoSaveStatus === "error" ? (
            <Button
              variant="ghost"
              size="xs"
              type="button"
              onClick={onRetrySave}
              className="flex h-auto items-center gap-1 p-0 text-xs font-medium text-destructive hover:text-destructive hover:underline"
            >
              <RefreshCw className="size-3" />
              <span>Coba lagi</span>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="hidden items-center gap-2 xl:flex">
        <PhotoSwitch withPhotos={withPhotos} onChange={onToggleWithPhotos} />

        <ToggleGroup
          value={[deviceMode]}
          onValueChange={(val) => {
            const selected = val[0];
            if (selected === "mobile" || selected === "desktop") {
              onDeviceModeChange(selected);
            }
          }}
          variant="outline"
          size="sm"
          className="rounded-lg border bg-muted/40 p-0.5"
        >
          <ToggleGroupItem
            value="mobile"
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
              deviceMode === "mobile" &&
                "bg-background text-foreground shadow-xs"
            )}
          >
            <Smartphone className="size-3.5" />
            <span>Mobile</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="desktop"
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
              deviceMode === "desktop" &&
                "bg-background text-foreground shadow-xs"
            )}
          >
            <Tablet className="size-3.5" />
            <span>Lebar</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenChangeTheme}
          className="gap-1.5"
          title="Ganti Desain Template"
        >
          <SwatchBook className="size-3.5 text-primary" />
          <span className="hidden lg:inline">Ganti Tema</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFontModal}
          className="gap-1.5"
          title="Pilih Pasangan Huruf"
        >
          <Type className="size-3.5 text-primary" />
          <span className="hidden lg:inline">Huruf</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenMusicModal}
          className="gap-1.5"
          title="Pengelola Musik & YouTube"
        >
          <Music className="size-3.5 text-rose-500" />
          <span className="hidden lg:inline">Musik</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPhotoFramer}
          className="gap-1.5"
          title="Atur Posisi & Zoom Foto"
        >
          <Crop className="size-3.5 text-amber-500" />
          <span className="hidden lg:inline">Foto</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCustomContent}
          className="gap-1.5"
        >
          <Sparkles className="size-3.5 text-primary" />
          <span className="hidden sm:inline">Layout Kustom</span>
          {customContentsCount > 0 ? (
            <Badge
              variant="secondary"
              className="flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {customContentsCount}
            </Badge>
          ) : null}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenThemePalette}
          className="gap-1.5"
          title="Palet Warna"
        >
          <Palette className="size-3.5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenReorderModal}
          className="gap-1.5"
          title="Urutan Layout"
        >
          <Layers className="size-3.5" />
        </Button>

        <Button
          render={
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" />
          }
          variant="outline"
          size="sm"
          className="gap-1.5"
          title="Buka Pratinjau Publik"
        >
          <Eye className="size-3.5" />
        </Button>

        <Button
          size="sm"
          onClick={onTogglePublish}
          disabled={isPublishing}
          className={cn(
            "gap-1.5 shadow-xs",
            isPublished
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isPublished ? (
            <>
              <Check className="size-3.5" />
              <span>Terbit</span>
            </>
          ) : (
            <>
              <Globe className="size-3.5" />
              <span>Terbitkan</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}

