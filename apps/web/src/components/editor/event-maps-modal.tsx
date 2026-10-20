"use client";

import { useEffect, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";

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

export interface EventMapsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleTitle?: string;
  initialLabel: string;
  initialTargetUrl: string;
  onSave: (data: { label: string; targetUrl: string }) => void;
}

export function EventMapsModal({
  open,
  onOpenChange,
  scheduleTitle,
  initialLabel,
  initialTargetUrl,
  onSave,
}: EventMapsModalProps) {
  const [label, setLabel] = useState(initialLabel);
  const [targetUrl, setTargetUrl] = useState(initialTargetUrl);

  useEffect(() => {
    if (open) {
      setLabel(initialLabel || "Buka Maps");
      setTargetUrl(initialTargetUrl || "");
    }
  }, [open, initialLabel, initialTargetUrl]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      label: label.trim() || "Buka Maps",
      targetUrl: targetUrl.trim(),
    });
    onOpenChange(false);
  };

  const isValidUrl =
    targetUrl.startsWith("http://") ||
    targetUrl.startsWith("https://") ||
    targetUrl.startsWith("maps:");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                <MapPin className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Edit Tombol Peta
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {scheduleTitle
                    ? `Atur label dan tautan peta Google Maps untuk ${scheduleTitle}.`
                    : "Atur label tombol dan tautan Google Maps untuk navigasi tamu."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-1 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="maps-label" className="text-xs font-semibold">
                Label Tombol
              </Label>
              <Input
                id="maps-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Contoh: Buka Maps atau Petunjuk Ke Lokasi"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="maps-url" className="text-xs font-semibold">
                  Target URL (Tautan Google Maps)
                </Label>
                {isValidUrl ? (
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    <span>Uji Tautan</span>
                    <ExternalLink className="size-3" />
                  </a>
                ) : null}
              </div>
              <Input
                id="maps-url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/... atau https://maps.google.com/..."
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Salin tautan dari fitur <strong>Bagikan Lokasi</strong> di Google Maps agar tamu dapat langsung membuka petunjuk arah.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-row items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" size="sm">
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

