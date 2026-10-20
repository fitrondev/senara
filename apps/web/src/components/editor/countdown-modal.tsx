"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Sparkles } from "lucide-react";

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

export interface CountdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date | string | null;
  onSave: (targetDateIso: string) => void;
}

function toDatetimeLocalString(dateInput?: Date | string | null): string {
  if (!dateInput) return "2026-10-24T08:00";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "2026-10-24T08:00";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "2026-10-24T08:00";
  }
}

function formatIndonesianDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
}

export function CountdownModal({
  open,
  onOpenChange,
  initialDate,
  onSave,
}: CountdownModalProps) {
  const [datetime, setDatetime] = useState(() => toDatetimeLocalString(initialDate));

  useEffect(() => {
    if (open) {
      setDatetime(toDatetimeLocalString(initialDate));
    }
  }, [open, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datetime) return;
    onSave(datetime);
    onOpenChange(false);
  };

  const previewText = formatIndonesianDateTime(datetime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Tanggal Acara
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Atur tanggal dan waktu target untuk hitung mundur acara.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-1 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="countdown-datetime" className="text-xs font-semibold">
                Tanggal & Waktu Acara
              </Label>
              <div className="relative">
                <Input
                  id="countdown-datetime"
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="text-xs pr-3"
                  required
                />
              </div>
              {previewText ? (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
                  <Clock className="size-3 text-primary shrink-0" />
                  <span className="font-medium text-foreground">{previewText}</span>
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-[11px] text-muted-foreground">
              <p className="flex items-center gap-1.5 font-medium text-primary">
                <Sparkles className="size-3.5" />
                <span>Hitung Mundur Otomatis</span>
              </p>
              <p className="mt-1 leading-relaxed">
                Hari, jam, menit, dan detik pada undangan akan secara otomatis menghitung mundur menuju waktu yang Anda tentukan di atas.
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

