"use client";

import { useState } from "react";
import { Check, Sparkles, Star, Type } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { cn } from "@senara/ui/lib/utils";

import {
  FONT_PRESETS,
  getFontPresetById,
  getNativeFontPresetId,
  type FontPresetItem,
} from "@/lib/font-presets";

export interface FontModalSelection {
  fontSet: string;
  fontScale: number;
  headingFont: string;
  scriptFont: string;
  bodyFont: string;
}

interface FontModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateSlug: string;
  currentFontSet?: string;
  currentFontScale?: number;
  onSaveFont: (selection: FontModalSelection) => void;
}

const SCALE_OPTIONS = [
  { value: 0.92, label: "Kecil (92%)" },
  { value: 1, label: "Standar (100%)" },
  { value: 1.08, label: "Besar (108%)" },
] as const;

export function FontModal({
  open,
  onOpenChange,
  templateSlug,
  currentFontSet,
  currentFontScale = 1,
  onSaveFont,
}: FontModalProps) {
  const nativeId = getNativeFontPresetId(templateSlug);
  const [selectedId, setSelectedId] = useState<string>(
    currentFontSet || nativeId
  );
  const [scale, setScale] = useState<number>(currentFontScale || 1);

  const selectedPreset = getFontPresetById(selectedId);

  const recommendedList = FONT_PRESETS.filter(
    (p) =>
      p.id === nativeId ||
      p.recommendedTemplates.some((slug) => templateSlug.includes(slug))
  );

  const otherList = FONT_PRESETS.filter(
    (p) => !recommendedList.some((rec) => rec.id === p.id)
  );

  const handleApply = () => {
    onSaveFont({
      fontSet: selectedPreset.id,
      fontScale: scale,
      headingFont: selectedPreset.displayFont,
      scriptFont: selectedPreset.scriptFont,
      bodyFont: selectedPreset.bodyFont,
    });
    onOpenChange(false);
  };

  const renderPresetCard = (preset: FontPresetItem) => {
    const isNative = preset.id === nativeId;
    const isSelected = preset.id === selectedId;

    return (
      <button
        key={preset.id}
        type="button"
        onClick={() => setSelectedId(preset.id)}
        className={cn(
          "flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all",
          isSelected
            ? "border-primary bg-primary/5 ring-primary/30 ring-2"
            : "hover:bg-muted/50"
        )}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold">{preset.name}</span>
            {isNative ? (
              <Badge className="bg-amber-500/15 px-1.5 py-0 text-[10px] text-amber-600 dark:text-amber-400">
                <Star className="mr-0.5 size-2.5 fill-current" />
                Font asli desain ini
              </Badge>
            ) : null}
          </div>
          {isSelected ? (
            <Check className="text-primary size-4 shrink-0" />
          ) : null}
        </div>

        <p
          className="text-foreground text-lg leading-tight font-semibold"
          style={{ fontFamily: preset.displayFont }}
        >
          {preset.sampleTitle}
        </p>

        <p className="text-muted-foreground text-[11px]">{preset.description}</p>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              <Type className="mr-1 size-3" />
              Kurasi Tipografi
            </Badge>
          </div>
          <DialogTitle>Pilih Pasangan Huruf (Font Set)</DialogTitle>
          <DialogDescription>
            Setiap paket memadukan huruf judul utama (--f-display), aksen kaligrafi (--f-script), dan teks bacaan (--f-body) secara harmonis.
          </DialogDescription>
        </DialogHeader>

        {/* Pratinjau Langsung */}
        <div
          className="bg-muted/30 rounded-xl border p-4 text-center"
          style={{
            fontSize: `${scale * 100}%`,
          }}
        >
          <p
            className="text-primary text-xs italic"
            style={{ fontFamily: selectedPreset.scriptFont }}
          >
            The Wedding Celebration of
          </p>
          <h4
            className="mt-1 text-2xl font-bold"
            style={{ fontFamily: selectedPreset.displayFont }}
          >
            {selectedPreset.sampleTitle}
          </h4>
          <p
            className="text-muted-foreground mx-auto mt-1.5 max-w-sm text-xs leading-relaxed"
            style={{ fontFamily: selectedPreset.bodyFont }}
          >
            Sabtu, 24 Oktober 2026 • Merupakan kehormatan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i.
          </p>
        </div>

        {/* Pilihan Skala Ukuran Proporsional */}
        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <span className="text-xs font-medium">Skala Ukuran Teks</span>
          <div className="flex gap-1.5">
            {SCALE_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                size="xs"
                variant={scale === opt.value ? "default" : "outline"}
                onClick={() => setScale(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Bagian 1: Disarankan untuk desain ini */}
        <div className="space-y-2">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="size-3.5 text-amber-500" />
            Disarankan untuk desain ini
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {recommendedList.map(renderPresetCard)}
          </div>
        </div>

        {/* Bagian 2: Koleksi Pasangan Lainnya */}
        <div className="space-y-2 pt-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Koleksi Pasangan Huruf Lainnya
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {otherList.map(renderPresetCard)}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button type="button" onClick={handleApply}>
            Terapkan Huruf ({selectedPreset.name})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

