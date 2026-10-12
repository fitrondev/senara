"use client";

import { useState } from "react";
import { Copy, ExternalLink, MessageCircle, RefreshCw, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
import { Label } from "@senara/ui/components/label";
import { Textarea } from "@senara/ui/components/textarea";

export const DEFAULT_WA_TEMPLATE = `Kepada Yth.
*{{guest_name}}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia kami:

Klik tautan berikut untuk membuka undangan:
{{invitation_url}}

Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran dan doa restu Anda.

Terima kasih,
Keluarga & Mempelai`;

/**
 * Normalisasi nomor ponsel Indonesia ke format internasional (628xxx)
 */
export function normalizeIndonesianPhone(phone?: string | null): string {
  if (!phone) return "";
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (clean.startsWith("8")) {
    clean = "62" + clean;
  }
  return clean;
}

/**
 * Menyusun URL WhatsApp API langsung
 */
export function generateWhatsAppUrl({
  phone,
  template,
  guestName,
  publicBaseUrl,
  invitationSlug,
}: {
  phone?: string | null;
  template: string;
  guestName: string;
  publicBaseUrl: string;
  invitationSlug: string;
}): string {
  const personalizedUrl = `${publicBaseUrl}/${invitationSlug}?to=${encodeURIComponent(guestName)}`;
  const message = template
    .replace(/{{guest_name}}/g, guestName)
    .replace(/{{invitation_url}}/g, personalizedUrl);

  const cleanPhone = normalizeIndonesianPhone(phone);
  const encodedText = encodeURIComponent(message);

  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

interface WhatsAppComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: string;
  onSaveTemplate: (newTemplate: string) => void;
  sampleGuestName?: string;
  invitationSlug: string;
}

export function WhatsAppComposerModal({
  open,
  onOpenChange,
  template,
  onSaveTemplate,
  sampleGuestName = "Bapak Budi Santoso",
  invitationSlug,
}: WhatsAppComposerModalProps) {
  const [draftTemplate, setDraftTemplate] = useState(template);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://senara.id";
  const sampleUrl = `${origin}/${invitationSlug}?to=${encodeURIComponent(sampleGuestName)}`;

  const previewMessage = draftTemplate
    .replace(/{{guest_name}}/g, sampleGuestName)
    .replace(/{{invitation_url}}/g, sampleUrl);

  const handleReset = () => {
    setDraftTemplate(DEFAULT_WA_TEMPLATE);
  };

  const handleSave = () => {
    onSaveTemplate(draftTemplate);
    toast.success("Format template pesan WhatsApp berhasil disimpan.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-emerald-600/10 p-1.5 text-emerald-600">
              <MessageCircle className="size-5" />
            </div>
            <div>
              <DialogTitle>Format Pesan WhatsApp</DialogTitle>
              <DialogDescription className="text-xs">
                Kustomisasi template teks undangan resmi yang akan dikirimkan ke tamu via WhatsApp.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-left">
          {/* Variabel yang Tersedia */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-muted/40 p-3 text-xs">
            <span className="text-muted-foreground font-medium text-[11px]">
              Variabel Otomatis:
            </span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setDraftTemplate((prev) => prev + " {{guest_name}}")}
              className="font-mono text-[11px]"
            >
              {"{{guest_name}}"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setDraftTemplate((prev) => prev + " {{invitation_url}}")}
              className="font-mono text-[11px]"
            >
              {"{{invitation_url}}"}
            </Button>
          </div>

          {/* Textarea Template */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wa-template" className="text-xs font-semibold">
              Teks Template Pesan
            </Label>
            <Textarea
              id="wa-template"
              rows={8}
              value={draftTemplate}
              onChange={(e) => setDraftTemplate(e.target.value)}
              className="font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Pratinjau Tampilan Pesan WhatsApp */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Pratinjau Pesan yang Diterima Tamu:
            </Label>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs text-foreground whitespace-pre-line leading-relaxed">
              {previewMessage}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row items-center justify-between gap-2 border-t pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <RefreshCw className="size-3" />
            <span>Kembalikan ke Default</span>
          </Button>

          <div className="flex items-center gap-2">
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Batal
            </DialogClose>
            <Button size="sm" onClick={handleSave} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
              <span>Simpan Format</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

