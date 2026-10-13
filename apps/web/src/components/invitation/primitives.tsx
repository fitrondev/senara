"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { EyeOff, Pencil, Sparkles, Users } from "lucide-react";

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
};

function formatFieldLabel(field: string): string {
  if (HUMAN_FIELD_LABELS[field]) return HUMAN_FIELD_LABELS[field]!;
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

  if (!editing) {
    if (hasHtml) {
      return (
        <Tag
          data-field={field}
          className={className}
          style={style}
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
            "w-full rounded-md border border-amber-400 bg-black/20 px-2 py-1 text-center backdrop-blur-xs outline-none focus:ring-2 focus:ring-amber-400",
            className
          )}
          style={style}
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
          "w-full rounded-md border border-amber-400 bg-black/20 px-2 py-0.5 text-center backdrop-blur-xs outline-none focus:ring-2 focus:ring-amber-400",
          className
        )}
        style={style}
      />
    );
  }

  return (
    <Tag
      data-field={field}
      onClick={handleClick}
      title="Buka Modal Editor Teks & Warna"
      className={cn(
        "group/field relative inline-block cursor-pointer rounded px-1 transition-all hover:bg-amber-500/15 hover:outline-1 hover:outline-dashed hover:outline-amber-500/80",
        className
      )}
      style={style}
    >
      {hasHtml ? (
        <span dangerouslySetInnerHTML={{ __html: currentValue }} />
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
  const { editing, onOpenRegion } = useEditContext();

  if (!editing) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      data-region={region}
      className={cn(
        "inv-region group/region relative transition-all hover:ring-1 hover:ring-amber-500/50",
        className
      )}
    >
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
      {children}
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

