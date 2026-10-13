"use client";

import Image from "next/image";
import {
  Check,
  Globe,
  Heart,
  Music,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@senara/ui/components/field";
import { Input } from "@senara/ui/components/input";

export interface TemplateItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  thumbnail: string;
  previewUrl: string | null;
  isPremium: boolean;
  price: string | number | { toString: () => string };
  isActive: boolean;
}

interface TemplatePreviewDialogProps {
  template: TemplateItem | null;
  onClose: () => void;
  onSelectForCreate: (template: TemplateItem) => void;
}

export function TemplatePreviewDialog({
  template,
  onClose,
  onSelectForCreate,
}: TemplatePreviewDialogProps) {
  return (
    <Dialog open={Boolean(template)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Pratinjau: {template?.name}</DialogTitle>
          <DialogDescription>
            Tampilan interaktif dan spesifikasi section bawaan template.
          </DialogDescription>
        </DialogHeader>

        {template ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={template.thumbnail}
                alt={template.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-md border p-2.5">
                <Music className="size-4 text-primary" />
                <span>Cover Gate Audio Autoplay</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-2.5">
                <Globe className="size-4 text-emerald-500" />
                <span>Personalisasi Nama Tamu (?to=)</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-2.5">
                <Heart className="size-4 text-rose-500" />
                <span>Amplop Digital & QRIS</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-2.5">
                <Sparkles className="size-4 text-amber-500" />
                <span>Fitur Modular &ldquo;Layout Kustom&rdquo;</span>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose render={<Button variant="outline" size="sm" />}>
            Tutup Pratinjau
          </DialogClose>
          {template ? (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onClose();
                onSelectForCreate(template);
              }}
            >
              <Wand2 className="size-4" />
              <span>Gunakan Template Ini</span>
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CreateInvitationDialogProps {
  template: TemplateItem | null;
  title: string;
  slug: string;
  isPending: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateInvitationDialog({
  template,
  title,
  slug,
  isPending,
  onTitleChange,
  onSlugChange,
  onClose,
  onSubmit,
}: CreateInvitationDialogProps) {
  return (
    <Dialog open={Boolean(template)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Undangan Baru</DialogTitle>
          <DialogDescription>
            Lengkapi judul dan alamat tautan unik untuk undangan berbasis template{" "}
            <strong>"{template?.name}"</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <FieldGroup className="py-2">
            <Field>
              <FieldLabel htmlFor="title">Judul Undangan</FieldLabel>
              <Input
                id="title"
                placeholder="Contoh: The Wedding of Adinda & Bagas"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                required
              />
              <FieldDescription>
                Nama utama yang akan ditampilkan pada sampul dan header undangan.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="slug">Tautan Publik (URL Slug)</FieldLabel>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-mono text-xs">
                  senara.id/
                </span>
                <Input
                  id="slug"
                  placeholder="adinda-bagas"
                  value={slug}
                  onChange={(e) =>
                    onSlugChange(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "")
                    )
                  }
                  required
                  className="font-mono text-xs"
                />
              </div>
              <FieldDescription>
                Hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).
              </FieldDescription>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                />
              }
            >
              Batal
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                "Membuat Undangan..."
              ) : (
                <>
                  <Check className="size-4" />
                  <span>Buat & Masuk ke Editor</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

