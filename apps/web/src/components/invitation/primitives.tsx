"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { Camera, EyeOff, ImagePlus, Pencil, Sparkles, Users } from "lucide-react";

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
import { Switch } from "@senara/ui/components/switch";
import { cn } from "@senara/ui/lib/utils";

import { getPageBackgroundPreset } from "@/components/editor/background-presets";
import { useEditContext, type EditorRegionKey } from "./edit-context";

export interface EditableFieldProps {
  field: string;
  fallback: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  multiline?: boolean;
  className?: string;
  style?: CSSProperties;
}

const HUMAN_FIELD_LABELS: Record<string, string> = {
  title: "Judul Undangan",
  groomNickname: "Panggilan Mempelai Pria",
  brideNickname: "Panggilan Mempelai Wanita",
  groomFullName: "Nama Lengkap Mempelai Pria",
  brideFullName: "Nama Lengkap Mempelai Wanita",
  groomParents: "Orang Tua Mempelai Pria",
  brideParents: "Orang Tua Mempelai Wanita",
  groomBio: "Biodata Singkat Pria",
  brideBio: "Biodata Singkat Wanita",
  quote: "Kata Mutiara / Kutipan Doa",
  quoteSource: "Sumber Kutipan / Ayat",
  eventGreeting: "Salam Pembuka",
  closingNote: "Pesan Penutup / Ucapan Terima Kasih",
  eventBadge: "Label Bagian Acara",
  eventTitle: "Judul Rangkaian Acara",
  eventSubtitle: "Deskripsi / Undangan Rangkaian Acara",
  countdownBadge: "Label Hitung Mundur",
  countdownDaysLabel: "Label Hari (Countdown)",
  countdownHoursLabel: "Label Jam (Countdown)",
  countdownMinutesLabel: "Label Menit (Countdown)",
  countdownSecondsLabel: "Label Detik (Countdown)",
  countdownExpiredTitle: "Judul Waktu Tiba",
  countdownExpiredDesc: "Pesan Waktu Tiba",
};

function formatFieldLabel(field: string): string {
  if (HUMAN_FIELD_LABELS[field]) return HUMAN_FIELD_LABELS[field]!;
  if (field.startsWith("schedule_")) {
    const match = field.match(/^schedule_(\d+)_(.+)$/);
    if (match) {
      const num = parseInt(match[1]!, 10) + 1;
      const key = match[2];
      switch (key) {
        case "title":
          return `Nama Acara ${num}`;
        case "timezone":
          return `Zona Waktu Acara ${num}`;
        case "date":
          return `Tanggal Acara ${num}`;
        case "time":
          return `Waktu / Jam Acara ${num}`;
        case "venue":
          return `Nama Tempat / Gedung Acara ${num}`;
        case "address":
          return `Alamat Lokasi Acara ${num}`;
        case "mapsLabel":
          return `Teks Tombol Maps Acara ${num}`;
        case "calendarLabel":
          return `Teks Tombol Kalender Acara ${num}`;
      }
    }
  }
  if (field.startsWith("story_")) {
    const match = field.match(/^story_(\d+)_(.+)$/);
    if (match) {
      const num = parseInt(match[1]!, 10) + 1;
      const key = match[2];
      switch (key) {
        case "year":
          return `Tahun Kisah ${num}`;
        case "title":
          return `Judul Kisah ${num}`;
        case "body":
          return `Isi Cerita Kisah ${num}`;
      }
    }
  }
  return field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

/**
 * <EditableField /> ([data-field])
 * Teks berformat saat mode tamu/contoh, dan membuka Modal Rich Text Editor saat editing={true}.
 */
export function EditableField({
  field,
  fallback,
  as: Tag = "span",
  multiline = false,
  className,
  style,
}: EditableFieldProps) {
  const { editing, getField, onPatchField, onOpenTextEditor } = useEditContext();
  const currentValue = getField(field, fallback);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [draftValue, setDraftValue] = useState(currentValue);

  const hasHtml = /<[a-z][\s\S]*>/i.test(currentValue);
  const textAlignMatch = currentValue.match(/text-align:\s*(left|center|right)/i);
  const extractedAlign = textAlignMatch?.[1]?.toLowerCase() as
    | "left"
    | "center"
    | "right"
    | undefined;

  if (!editing) {
    if (hasHtml) {
      return (
        <Tag
          data-field={field}
          className={cn(
            extractedAlign ? "w-full block" : undefined,
            extractedAlign === "left" && "text-left",
            extractedAlign === "center" && "text-center",
            extractedAlign === "right" && "text-right",
            className
          )}
          style={{
            ...style,
            ...(extractedAlign ? { textAlign: extractedAlign } : {}),
          }}
          dangerouslySetInnerHTML={{ __html: currentValue }}
        />
      );
    }
    return (
      <Tag data-field={field} className={className} style={style}>
        {currentValue}
      </Tag>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenTextEditor) {
      onOpenTextEditor({ field, label: formatFieldLabel(field), fallback });
    } else {
      setDraftValue(currentValue);
      setIsEditingInline(true);
    }
  };

  if (isEditingInline) {
    const inlineAlignClass =
      extractedAlign === "left"
        ? "text-left"
        : extractedAlign === "right"
          ? "text-right"
          : "text-center";

    if (multiline) {
      return (
        <textarea
          data-field={field}
          autoFocus
          rows={3}
          value={draftValue}
          onChange={(e) => {
            setDraftValue(e.target.value);
            onPatchField?.(field, e.target.value);
          }}
          onBlur={() => setIsEditingInline(false)}
          className={cn(
            "w-full rounded-md border border-amber-400 bg-black/20 px-2 py-1 backdrop-blur-xs outline-none focus:ring-2 focus:ring-amber-400",
            inlineAlignClass,
            className
          )}
          style={{
            ...style,
            ...(extractedAlign ? { textAlign: extractedAlign } : {}),
          }}
        />
      );
    }

    return (
      <input
        type="text"
        data-field={field}
        autoFocus
        value={draftValue}
        onChange={(e) => {
          setDraftValue(e.target.value);
          onPatchField?.(field, e.target.value);
        }}
        onBlur={() => setIsEditingInline(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsEditingInline(false);
          }
        }}
        className={cn(
          "w-full rounded-md border border-amber-400 bg-black/20 px-2 py-0.5 backdrop-blur-xs outline-none focus:ring-2 focus:ring-amber-400",
          inlineAlignClass,
          className
        )}
        style={{
          ...style,
          ...(extractedAlign ? { textAlign: extractedAlign } : {}),
        }}
      />
    );
  }

  return (
    <Tag
      data-field={field}
      onClick={handleClick}
      title="Buka Modal Editor Teks & Warna"
      className={cn(
        "group/field relative cursor-pointer rounded px-1 transition-all hover:bg-amber-500/15 hover:outline-1 hover:outline-dashed hover:outline-amber-500/80",
        extractedAlign ? "w-full block" : "inline-block",
        extractedAlign === "left" && "text-left",
        extractedAlign === "center" && "text-center",
        extractedAlign === "right" && "text-right",
        className
      )}
      style={{
        ...style,
        ...(extractedAlign ? { textAlign: extractedAlign } : {}),
      }}
    >
      {hasHtml ? (
        <span
          className={cn(
            extractedAlign === "left" && "text-left",
            extractedAlign === "center" && "text-center",
            extractedAlign === "right" && "text-right"
          )}
          dangerouslySetInnerHTML={{ __html: currentValue }}
        />
      ) : (
        currentValue
      )}
      <Pencil className="ml-1 inline-block size-3 text-amber-500 opacity-60 transition-opacity group-hover/field:opacity-100" />
    </Tag>
  );
}

export interface EditableRegionProps {
  region: EditorRegionKey;
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * <EditableRegion /> (.inv-region & .inv-region-pill)
 * Menampilkan tombol kapsul mengambang di pojok blok untuk membuka modal editor spesifik.
 */
export function EditableRegion({
  region,
  label,
  children,
  className,
}: EditableRegionProps) {
  const { editing, onOpenRegion, pageBackgrounds, onOpenBackgroundModal } =
    useEditContext();

  const bgSetting = pageBackgrounds?.[region];
  const preset = getPageBackgroundPreset(region);
  const activeBgUrl =
    bgSetting?.type === "custom" && bgSetting.customUrl
      ? bgSetting.customUrl
      : bgSetting?.type === "default"
        ? preset.defaultBgUrl
        : undefined;

  if (!editing) {
    if (activeBgUrl) {
      return (
        <div className={cn("relative overflow-hidden", className)}>
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: `url(${activeBgUrl})`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 z-0 bg-background/55 backdrop-blur-[0.5px]" />
          <div className="relative z-1">{children}</div>
        </div>
      );
    }
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      data-region={region}
      className={cn(
        "inv-region group/region relative overflow-hidden transition-all hover:ring-1 hover:ring-amber-500/50",
        className
      )}
    >
      {/* Background layer jika aktif */}
      {activeBgUrl ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: `url(${activeBgUrl})`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 z-0 bg-background/55 backdrop-blur-[0.5px]" />
        </>
      ) : null}

      {/* Tombol Atur Background Halaman (Kiri Atas) */}
      {onOpenBackgroundModal ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenBackgroundModal(region);
          }}
          className="inv-bg-pill absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-zinc-800 shadow-md backdrop-blur-md transition-transform hover:scale-105 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200"
          title={`Atur background halaman ${preset.pageTitle}`}
        >
          <ImagePlus className="size-3 text-primary" />
          <span>Background</span>
        </button>
      ) : null}

      {/* Tombol Edit Wilayah Konten (Kanan Atas) */}
      {onOpenRegion ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenRegion(region);
          }}
          className="inv-region-pill absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-zinc-900/85 px-3 py-1 text-[11px] font-medium text-amber-200 shadow-lg backdrop-blur-md transition-transform hover:scale-105 hover:bg-zinc-900"
        >
          <Pencil className="size-3 text-amber-400" />
          <span>{label}</span>
        </button>
      ) : null}

      <div className="relative z-1">{children}</div>
    </div>
  );
}

export interface SectionSwitchProps {
  sectionKey: string;
  label: string;
  isLocked?: boolean;
  children: ReactNode;
}

/**
 * <SectionSwitch /> (.inv-section-bar & .inv-switch & .inv-section-off)
 * Menampilkan sakelar on/off di bawah setiap section pada kanvas editor;
 * jika dimatikan, menampilkan pita .inv-section-off bertuliskan "Bagian ini disembunyikan".
 */
export function SectionSwitch({
  sectionKey,
  label,
  isLocked = false,
  children,
}: SectionSwitchProps) {
  const { editing, isSectionVisible, onToggleSection } = useEditContext();
  const visible = isSectionVisible(sectionKey);

  if (!editing) {
    return visible ? <>{children}</> : null;
  }

  return (
    <div className="relative">
      {!visible ? (
        <div className="inv-section-off flex items-center justify-between bg-zinc-900/90 px-4 py-2 text-xs text-amber-300">
          <span className="flex items-center gap-1.5 font-medium">
            <EyeOff className="size-3.5" />
            Bagian ini disembunyikan ({label})
          </span>
          <button
            type="button"
            onClick={() => onToggleSection?.(sectionKey, true)}
            className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/30"
          >
            Tampilkan Kembali
          </button>
        </div>
      ) : null}

      <div className={cn(!visible && "pointer-events-none opacity-35 grayscale")}>
        {children}
      </div>

      {!isLocked && onToggleSection ? (
        <div className="inv-section-bar flex items-center justify-between border-y border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-2 text-xs">
          <span className="text-muted-foreground font-medium">
            Bagian: <strong className="text-foreground">{label}</strong>
          </span>
          <div className="inv-switch flex items-center gap-2">
            <span className="text-[11px] text-zinc-500">
              {visible ? "Ditampilkan" : "Disembunyikan"}
            </span>
            <Switch
              size="sm"
              checked={visible}
              onCheckedChange={(checked) =>
                onToggleSection(sectionKey, checked)
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export interface GuestHintProps {
  className?: string;
}

/**
 * <GuestHint /> ([data-guest-hint])
 * Garis bawah putus-putus emas pada nama tamu di sampul yang saat diklik membuka bottom sheet penjelasan.
 */
export function GuestHint({ className }: GuestHintProps) {
  const { demo, editing, guestName, setGuestHintOpen } = useEditContext();
  const displayGuest = guestName || "Budi Santoso & Partner";

  if (!demo && !editing) {
    return <span className={className}>{displayGuest}</span>;
  }

  return (
    <button
      type="button"
      data-guest-hint="true"
      onClick={(e) => {
        e.stopPropagation();
        setGuestHintOpen(true);
      }}
      className={cn(
        "group inline-flex items-center gap-1.5 border-b border-dashed border-amber-400/90 pb-0.5 font-semibold transition-colors hover:border-amber-300",
        className
      )}
      title="Klik untuk melihat cara kerja nama tamu otomatis"
    >
      <span>{displayGuest}</span>
      <Sparkles className="size-3.5 text-amber-400 transition-transform group-hover:scale-125" />
    </button>
  );
}

/**
 * Modal / Bottom Sheet penjelasan Nama Tamu Otomatis
 */
export function GuestHintModal() {
  const { guestHintOpen, setGuestHintOpen } = useEditContext();

  return (
    <Dialog open={guestHintOpen} onOpenChange={setGuestHintOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Sparkles className="mr-1 size-3" />
              Fitur Personalisasi Tamu
            </Badge>
          </div>
          <DialogTitle>✨ Nama tamu terisi otomatis</DialogTitle>
          <DialogDescription>
            Setiap tamu undangan Anda akan disapa dengan namanya masing-masing pada sampul undangan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-3">
            <Users className="text-primary mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">Bagaimana cara kerjanya?</p>
              <p className="text-muted-foreground mt-1">
                Setelah selesai mengedit undangan, buka menu{" "}
                <strong>Kirim WhatsApp / Buku Tamu</strong> di dashboard. Cukup ketik atau impor daftar nama tamu Anda dari Excel, lalu sistem akan membuatkan link unik untuk setiap tamu (contoh:{" "}
                <code className="font-mono text-[11px]">?to=Budi+Santoso</code>).
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => setGuestHintOpen(false)}>
            Mengerti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface EditableImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  field?: string;
  label?: string;
  onSave?: (newUrl: string) => void;
  priority?: boolean;
  unoptimized?: boolean;
}

/**
 * <EditableImage />
 * Komponen gambar yang dapat diklik untuk diganti foto/gambarnya saat mode editing={true}.
 * Menampilkan overlay kamera halus saat di-hover dan membuka MediaModal terpadu.
 */
export function EditableImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  containerClassName,
  field,
  label,
  onSave,
  priority = false,
  unoptimized,
}: EditableImageProps) {
  const { editing, getField, onPatchField, onOpenImagePicker } = useEditContext();
  const currentSrc = field ? getField(field, src) : src;

  if (!editing) {
    if (fill) {
      return (
        <div className={cn("relative", fill && "h-full w-full", containerClassName)}>
          <Image
            src={currentSrc}
            alt={alt}
            fill
            className={className}
            priority={priority}
            unoptimized={unoptimized || currentSrc.startsWith("data:")}
          />
        </div>
      );
    }
    return (
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        unoptimized={unoptimized || currentSrc.startsWith("data:")}
      />
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenImagePicker) {
      onOpenImagePicker({
        currentUrl: currentSrc,
        label: label || "Ganti Gambar",
        onSelect: (newUrl) => {
          if (onSave) onSave(newUrl);
          if (field && onPatchField) onPatchField(field, newUrl);
        },
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group/img relative cursor-pointer overflow-hidden transition-all",
        fill && "h-full w-full",
        "hover:ring-2 hover:ring-primary/80 hover:shadow-md",
        containerClassName
      )}
      title={label ? `Klik untuk mengganti ${label}` : "Klik untuk mengganti foto/gambar"}
    >
      {fill ? (
        <Image
          src={currentSrc}
          alt={alt}
          fill
          className={cn(
            "transition-transform duration-300 group-hover/img:scale-105",
            className
          )}
          priority={priority}
          unoptimized={unoptimized || currentSrc.startsWith("data:")}
        />
      ) : (
        <Image
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-transform duration-300 group-hover/img:scale-105",
            className
          )}
          priority={priority}
          unoptimized={unoptimized || currentSrc.startsWith("data:")}
        />
      )}

      {/* Overlay Kamera Edit Saat Hover */}
      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white z-10 pointer-events-none">
        <div className="flex size-7 items-center justify-center rounded-full bg-white/25 backdrop-blur-xs text-white mb-1 shadow">
          <Camera className="size-3.5" />
        </div>
        <span className="text-[10px] font-semibold text-center leading-tight drop-shadow-sm px-1 line-clamp-1">
          {label ? `Ganti ${label}` : "Ganti Foto"}
        </span>
      </div>
    </div>
  );
}

