"use client";

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

import type { EditorRegionKey } from "@/components/invitation/edit-context";
import { PhotoSwitch } from "@/components/invitation/photo-switch";

const REGION_TITLES: Record<EditorRegionKey, string> = {
  cover: "Pengaturan Sampul, Foto & Musik",
  quote: "Pengaturan Kutipan & Untaian Doa",
  couple: "Pengaturan Profil Utama",
  event: "Pengaturan Tanggal & Rangkaian Acara",
  story: "Pengaturan Cerita Perjalanan",
  gallery: "Pengaturan Galeri Foto",
  gift: "Pengaturan Amplop Digital & QRIS",
  rsvp: "Pengaturan Buku Tamu & RSVP",
  closing: "Pengaturan Salam Penutup",
};

interface EditorRegionDialogProps {
  activeRegion: EditorRegionKey | null;
  onClose: () => void;
  title: string;
  onTitleChange: (nextTitle: string) => void;
  eventDateInput: string;
  onEventDateChange: (nextDate: string) => void;
  withPhotos: boolean;
  onToggleWithPhotos: (nextWithPhotos: boolean) => void;
}

export function EditorRegionDialog({
  activeRegion,
  onClose,
  title,
  onTitleChange,
  eventDateInput,
  onEventDateChange,
  withPhotos,
  onToggleWithPhotos,
}: EditorRegionDialogProps) {
  return (
    <Dialog
      open={Boolean(activeRegion)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {activeRegion ? REGION_TITLES[activeRegion] : "Pengaturan Bagian"}
          </DialogTitle>
          <DialogDescription>
            Anda juga dapat langsung mengetuk teks mana pun di kanvas untuk
            mengedit isinya secara inline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="region-title">Judul Utama Undangan</Label>
            <Input
              id="region-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="region-date">Tanggal Utama Acara</Label>
            <Input
              id="region-date"
              type="date"
              value={eventDateInput}
              onChange={(e) => onEventDateChange(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-xs font-medium">Mode Tampilan Foto</span>
            <PhotoSwitch
              withPhotos={withPhotos}
              onChange={onToggleWithPhotos}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

