"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  CameraOff,
  Check,
  ImagePlus,
  Move,
  RotateCcw,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";

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
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import { Slider } from "@senara/ui/components/slider";
import { cn } from "@senara/ui/lib/utils";

export interface PhotoFocusConfig {
  x: number; // 0 - 100 (%)
  y: number; // 0 - 100 (%)
  zoom: number; // 1.0 - 2.5
}

export const DEFAULT_PHOTO_FOCUS: PhotoFocusConfig = {
  x: 50,
  y: 50,
  zoom: 1,
};

const CURATED_SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
];

interface PhotoFramerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImageUrl: string;
  currentFocus?: PhotoFocusConfig;
  uploadedPhotos?: string[];
  onSavePhoto: (result: {
    imageUrl: string;
    focus: PhotoFocusConfig;
    withPhotos: boolean;
    updatedUploads: string[];
  }) => void;
}

export function PhotoFramerModal({
  open,
  onOpenChange,
  currentImageUrl,
  currentFocus = DEFAULT_PHOTO_FOCUS,
  uploadedPhotos = [],
  onSavePhoto,
}: PhotoFramerModalProps) {
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl);
  const [focus, setFocus] = useState<PhotoFocusConfig>(currentFocus);
  const [uploads, setUploads] = useState<string[]>(
    Array.from(new Set([...uploadedPhotos, ...CURATED_SAMPLE_PHOTOS]))
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: focus.x,
      startY: focus.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    const nextX = Math.max(
      0,
      Math.min(100, Math.round(dragStartRef.current.startX - dx * 0.35))
    );
    const nextY = Math.max(
      0,
      Math.min(100, Math.round(dragStartRef.current.startY - dy * 0.35))
    );
    setFocus((prev) => ({
      ...prev,
      x: nextX,
      y: nextY,
    }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const dataUrl = reader.result;
        setImageUrl(dataUrl);
        setUploads((prev) => Array.from(new Set([dataUrl, ...prev])));
        toast.success("Foto berhasil ditambahkan ke galeri unggahan!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setFocus(DEFAULT_PHOTO_FOCUS);
  };

  const handleWithoutPhoto = () => {
    onSavePhoto({
      imageUrl,
      focus,
      withPhotos: false,
      updatedUploads: uploads,
    });
    onOpenChange(false);
  };

  const handleApply = () => {
    const nextUploads = imageUrl.trim()
      ? Array.from(new Set([imageUrl.trim(), ...uploads]))
      : uploads;

    onSavePhoto({
      imageUrl: imageUrl.trim(),
      focus,
      withPhotos: true,
      updatedUploads: nextUploads,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              <Move className="mr-1 size-3" />
              Fokus & Bingkai Foto
            </Badge>
          </div>
          <DialogTitle>Atur Posisi & Zoom Foto</DialogTitle>
          <DialogDescription>
            Geser langsung gambar di dalam bingkai untuk menentukan titik fokus wajah, atau pilih dari foto yang sudah pernah kamu unggah.
          </DialogDescription>
        </DialogHeader>

        {/* Kanvas Interaktif Drag-to-Pan & Zoom */}
        <div className="flex flex-col items-center gap-3">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={cn(
              "bg-muted relative aspect-[4/3] w-full max-w-[300px] overflow-hidden rounded-2xl border-2 shadow-md select-none",
              isDragging ? "cursor-grabbing border-primary" : "cursor-grab"
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Pratinjau Fokus Foto"
                fill
                draggable={false}
                className="pointer-events-none object-cover transition-transform duration-75"
                style={{
                  objectPosition: `${focus.x}% ${focus.y}%`,
                  transform: `scale(${focus.zoom})`,
                }}
              />
            ) : null}

            {/* Grid Bantu Rule of Thirds */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div key={idx} className="border border-white/15" />
              ))}
            </div>

            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
              Geser foto ({focus.x}%, {focus.y}%) • Zoom {focus.zoom.toFixed(1)}×
            </div>
          </div>

          {/* Kontrol Zoom & Reset menggunakan Shadcn Slider */}
          <div className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5">
            <ZoomIn className="text-muted-foreground size-4 shrink-0" />
            <Slider
              min={1}
              max={2.4}
              step={0.05}
              value={[focus.zoom]}
              onValueChange={(val) => {
                const nextZoom = Array.isArray(val) ? val[0] : val;
                if (typeof nextZoom === "number") {
                  setFocus((prev) => ({
                    ...prev,
                    zoom: nextZoom,
                  }));
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={handleReset}
              className="gap-1"
            >
              <RotateCcw className="size-3" />
              <span>Atur Ulang</span>
            </Button>
          </div>
        </div>

        {/* Unggah Foto Baru / URL */}
        <div className="space-y-2.5 rounded-xl border p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="framer-upload" className="flex items-center gap-1.5">
              <ImagePlus className="text-primary size-3.5" />
              <span>Unggah Foto dari Perangkat</span>
            </Label>
          </div>
          <Input
            id="framer-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Input
            type="url"
            placeholder="Atau tempel URL gambar https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="text-xs"
          />
        </div>

        {/* Galeri "Foto yang Sudah Kamu Unggah" */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold">
            Foto yang Sudah Kamu Unggah ({uploads.length})
          </p>
          <div className="grid grid-cols-4 gap-2">
            {uploads.slice(0, 8).map((url) => {
              const isSelected = url === imageUrl;
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => setImageUrl(url)}
                  className={cn(
                    "bg-muted relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                    isSelected
                      ? "border-primary ring-primary/30 ring-2"
                      : "border-transparent opacity-80 hover:opacity-100"
                  )}
                >
                  <Image
                    src={url}
                    alt="Unggahan"
                    fill
                    className="object-cover"
                  />
                  {isSelected ? (
                    <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex size-4 items-center justify-center rounded-full">
                      <Check className="size-2.5" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex-col justify-between gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleWithoutPhoto}
            className="gap-1.5"
          >
            <CameraOff className="size-3.5" />
            <span>Tanpa Foto</span>
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="button" onClick={handleApply}>
              Simpan Posisi Foto
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

