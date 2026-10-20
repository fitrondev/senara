"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Check, CloudUpload, RefreshCw, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { cn } from "@senara/ui/lib/utils";

import { getPageBackgroundPreset } from "./background-presets";
import type { PageBackgroundSetting } from "./background-types";

export interface BackgroundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageKey: string;
  currentSetting?: PageBackgroundSetting;
  onSaveBackground: (pageKey: string, setting: PageBackgroundSetting) => void;
}

export function BackgroundModal({
  open,
  onOpenChange,
  pageKey,
  currentSetting,
  onSaveBackground,
}: BackgroundModalProps) {
  const fileInputId = useId();
  const preset = getPageBackgroundPreset(pageKey);

  const [activeType, setActiveType] = useState<"default" | "custom">(
    currentSetting?.type ?? "default"
  );
  const [customImageUrl, setCustomImageUrl] = useState<string>(
    currentSetting?.customUrl ?? ""
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran berkas background maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const dataUrl = reader.result;
        setCustomImageUrl(dataUrl);
        setActiveType("custom");
        onSaveBackground(pageKey, {
          type: "custom",
          customUrl: dataUrl,
        });
        toast.success("Background kustom berhasil diunggah & diterapkan!");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSelectDefault = () => {
    setActiveType("default");
    onSaveBackground(pageKey, {
      type: "default",
      customUrl: customImageUrl,
    });
    toast.success("Background bawaan berhasil dipilih.");
  };

  const handleSelectCustom = () => {
    if (!customImageUrl) {
      // Buka file picker jika belum ada gambar
      const input = document.getElementById(fileInputId) as HTMLInputElement;
      input?.click();
      return;
    }
    setActiveType("custom");
    onSaveBackground(pageKey, {
      type: "custom",
      customUrl: customImageUrl,
    });
    toast.success("Background kustom berhasil dipilih.");
  };

  const handleRemoveCustom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomImageUrl("");
    setActiveType("default");
    onSaveBackground(pageKey, {
      type: "default",
      customUrl: undefined,
    });
    toast.success("Background kustom dihapus, beralih ke bawaan.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden p-0 sm:max-w-md"
        showCloseButton={false}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <DialogTitle className="text-foreground text-base font-semibold tracking-tight">
            {preset.modalTitle}
          </DialogTitle>
          <DialogClose
            render={
              <button
                type="button"
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-1 transition-colors"
                aria-label="Tutup Dialog"
              >
                <X className="size-4" />
              </button>
            }
          />
        </div>

        {/* Isi Modal */}
        <div className="flex flex-col gap-4 overflow-y-auto p-5">
          {/* Kotak Informasi Ungu / Lavender Sesuai Screenshot */}
          <div className="rounded-xl bg-[#EBE9FE] p-3 text-xs leading-relaxed text-[#5B21B6] dark:bg-purple-950/40 dark:text-purple-200">
            <p className="font-medium">
              Kreasikan background undanganmu, setiap halaman bisa berbeda beda
              loh 🤩 .
            </p>
          </div>

          {/* Grid 2 Kolom Pilihan Background */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* 1. Bg Utama (Default Background) */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                onClick={handleSelectDefault}
                className={cn(
                  "group bg-muted relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl border shadow-xs transition-all",
                  "hover:border-primary hover:shadow-md",
                  activeType === "default"
                    ? "border-emerald-600 ring-2 ring-emerald-600/80 ring-offset-1"
                    : "border-zinc-200 dark:border-zinc-800"
                )}
                title="Pilih Background Bawaan"
              >
                <Image
                  src={preset.defaultThumbnailUrl}
                  alt={preset.pageTitle}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 160px, 200px"
                />

                {activeType === "default" ? (
                  <div className="absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                ) : null}
              </div>

              <span className="text-foreground text-xs font-medium">
                Bg Utama
              </span>
            </div>

            {/* 2. Bg Custom (Upload Background) */}
            <div className="flex flex-col items-center gap-1.5">
              <input
                id={fileInputId}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleFileUpload}
              />

              {customImageUrl ? (
                <div
                  onClick={handleSelectCustom}
                  className={cn(
                    "group bg-muted relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl border shadow-xs transition-all",
                    "hover:border-primary hover:shadow-md",
                    activeType === "custom"
                      ? "border-emerald-600 ring-2 ring-emerald-600/80 ring-offset-1"
                      : "border-zinc-200 dark:border-zinc-800"
                  )}
                  title="Pilih Background Kustom"
                >
                  <Image
                    src={customImageUrl}
                    alt="Background Kustom"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 160px, 200px"
                    unoptimized={customImageUrl.startsWith("data:")}
                  />

                  {activeType === "custom" ? (
                    <div className="absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  ) : null}

                  {/* Tombol Ganti & Hapus Saat Hover */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1 bg-black/45 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <label
                      htmlFor={fileInputId}
                      onClick={(e) => e.stopPropagation()}
                      className="flex cursor-pointer items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-zinc-900 shadow hover:bg-white"
                    >
                      <RefreshCw className="size-2.5" />
                      <span>Ganti</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveCustom}
                      className="flex items-center gap-1 rounded-full bg-rose-600/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow hover:bg-rose-700"
                    >
                      <Trash2 className="size-2.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor={fileInputId}
                  className={cn(
                    "relative flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-center transition-all",
                    "hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-zinc-700 dark:bg-zinc-900/50"
                  )}
                  title="Klik untuk mengunggah background dari perangkat"
                >
                  <CloudUpload className="group-hover:text-primary mb-1.5 size-8 text-zinc-400" />
                  <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    Upload Background
                  </span>
                </label>
              )}

              <span className="text-foreground text-xs font-medium">
                Bg Custom
              </span>
            </div>
          </div>
        </div>

        {/* Footer Tombol Close Sesuai Screenshot */}
        <div className="bg-background flex justify-end border-t px-5 py-3">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-lg bg-[#008080] px-5 font-semibold text-white shadow-xs hover:bg-[#006666]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
