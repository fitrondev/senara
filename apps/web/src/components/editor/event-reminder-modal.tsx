"use client";

import { useEffect, useState } from "react";
import { Calendar, Sparkles } from "lucide-react";

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
import { Textarea } from "@senara/ui/components/textarea";

export interface EventReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle: string;
  initialStartDate: string;
  initialStartTime: string;
  initialEndDate: string;
  initialEndTime: string;
  initialLocation: string;
  initialLabel: string;
  onSave: (data: {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    label: string;
  }) => void;
}

export function EventReminderModal({
  open,
  onOpenChange,
  initialTitle,
  initialStartDate,
  initialStartTime,
  initialEndDate,
  initialEndTime,
  initialLocation,
  initialLabel,
  onSave,
}: EventReminderModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [location, setLocation] = useState(initialLocation);
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle || "");
      setStartDate(initialStartDate || "2026-10-24");
      setStartTime(initialStartTime || "08:00");
      setEndDate(initialEndDate || initialStartDate || "2026-10-24");
      setEndTime(initialEndTime || "10:00");
      setLocation(initialLocation || "");
      setLabel(initialLabel || "Simpan Kalender");
    }
  }, [
    open,
    initialTitle,
    initialStartDate,
    initialStartTime,
    initialEndDate,
    initialEndTime,
    initialLocation,
    initialLabel,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim() || initialTitle,
      startDate: startDate || "2026-10-24",
      startTime: startTime || "08:00",
      endDate: endDate || startDate || "2026-10-24",
      endTime: endTime || "10:00",
      location: location.trim(),
      label: label.trim() || "Simpan Kalender",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Pengaturan Reminder
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Atur rincian agenda acara yang akan tersimpan saat tamu menekan tombol pengingat kalender.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-1 text-xs">
            {/* Judul Acara */}
            <div className="space-y-1.5">
              <Label htmlFor="reminder-title" className="text-xs font-semibold">
                Judul Agenda di Kalender
              </Label>
              <Input
                id="reminder-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Pernikahan Rendra & Sarah - Akad Nikah"
                className="text-xs"
                required
              />
            </div>

            {/* Waktu Mulai */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mulai</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">Tanggal</span>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">Jam</span>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Waktu Berakhir */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Berakhir</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">Tanggal</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">Jam</span>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Lokasi & Alamat */}
            <div className="space-y-1.5">
              <Label htmlFor="reminder-location" className="text-xs font-semibold">
                Lokasi & Alamat Acara
              </Label>
              <Textarea
                id="reminder-location"
                rows={3}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nama gedung atau alamat lengkap lokasi acara..."
                className="text-xs leading-relaxed"
              />
            </div>

            {/* Label Tombol */}
            <div className="space-y-1.5">
              <Label htmlFor="reminder-label" className="text-xs font-semibold">
                Label Tombol
              </Label>
              <Input
                id="reminder-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Contoh: Simpan Kalender"
                className="text-xs"
              />
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-[11px] text-muted-foreground">
              <p className="flex items-center gap-1.5 font-medium text-primary">
                <Sparkles className="size-3.5" />
                <span>Otomatisasi Google Calendar</span>
              </p>
              <p className="mt-1 leading-relaxed">
                Saat tamu menekan tombol ini di undangan, jadwal dan pengingat akan otomatis masuk ke Google Calendar mereka.
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

