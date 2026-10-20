"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Pencil, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@senara/ui/components/alert";
import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import { cn } from "@senara/ui/lib/utils";

import { CountdownModal } from "@/components/editor/countdown-modal";
import type { ThemeConfig } from "@/components/editor/theme-modal";
import { useEditContext } from "./edit-context";
import { EditableField } from "./primitives";

interface CountdownTimerProps {
  targetDate?: Date | string | null;
  themeConfig: ThemeConfig;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function CountdownTimer({ targetDate, themeConfig }: CountdownTimerProps) {
  const {
    editing,
    getField,
    onPatchField,
    onPatchFields,
    onEventDateChange,
  } = useEditContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  const customDateStr = getField("countdownTargetDate", "");
  const effectiveTargetDate = customDateStr
    ? new Date(customDateStr)
    : targetDate
    ? new Date(targetDate)
    : new Date("2026-10-24T08:00:00Z");

  useEffect(() => {
    setIsMounted(true);
    const destination = effectiveTargetDate.getTime();
    if (isNaN(destination)) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [effectiveTargetDate.getTime()]);

  const handleSaveCountdown = (newDateIso: string) => {
    if (onEventDateChange) {
      onEventDateChange(newDateIso);
    }
    if (onPatchField) {
      onPatchField("countdownTargetDate", newDateIso);
    } else if (onPatchFields) {
      onPatchFields({ countdownTargetDate: newDateIso });
    }
    toast.success("Tanggal countdown berhasil diperbarui");
  };

  if (!isMounted) {
    return null;
  }

  if (timeLeft.isExpired) {
    return (
      <div className="flex flex-col items-center gap-3 w-full py-2">
        <Alert className="flex flex-col items-center justify-center p-4 text-center border-primary/20 bg-primary/10">
          <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
            <Sparkles className="size-4 animate-pulse" />
            <AlertTitle className="font-bold text-sm text-primary">
              <EditableField
                field="countdownExpiredTitle"
                fallback="Hari Bahagia Telah Tiba"
              />
            </AlertTitle>
          </div>
          <AlertDescription className="text-[11px] text-muted-foreground mt-1 text-center">
            <EditableField
              as="p"
              multiline
              field="countdownExpiredDesc"
              fallback="Terima kasih atas segala doa restu dan kehadiran yang telah diberikan."
            />
          </AlertDescription>
        </Alert>

        {editing ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 gap-1.5 px-3 text-xs font-semibold text-foreground/80 hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer shadow-xs"
          >
            <CalendarIcon className="size-3.5 text-primary" />
            <span>Edit Tanggal Countdown</span>
            <Pencil className="size-3 text-muted-foreground" />
          </Button>
        ) : null}

        {isModalOpen ? (
          <CountdownModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            initialDate={effectiveTargetDate}
            onSave={handleSaveCountdown}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full py-2">
      <Badge
        variant="outline"
        className="text-[10px] uppercase tracking-wider text-muted-foreground border-primary/20"
      >
        <EditableField
          field="countdownBadge"
          fallback="Menghitung Hari"
        />
      </Badge>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-xs">
        {/* Kotak Hari */}
        <Card
          onClick={() => {
            if (editing) {
              setIsModalOpen(true);
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center bg-card/60 p-2 sm:p-3 shadow-xs backdrop-blur-xs text-center transition-all",
            editing &&
              "cursor-pointer hover:bg-primary/5 hover:border-primary/50 group"
          )}
          title={editing ? "Klik untuk mengedit tanggal acara countdown" : undefined}
        >
          <span
            className="font-bold text-lg sm:text-2xl text-foreground tabular-nums pointer-events-none"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">
            <EditableField
              field="countdownDaysLabel"
              fallback="Hari"
            />
          </span>
        </Card>

        {/* Kotak Jam */}
        <Card
          onClick={() => {
            if (editing) {
              setIsModalOpen(true);
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center bg-card/60 p-2 sm:p-3 shadow-xs backdrop-blur-xs text-center transition-all",
            editing &&
              "cursor-pointer hover:bg-primary/5 hover:border-primary/50 group"
          )}
          title={editing ? "Klik untuk mengedit tanggal acara countdown" : undefined}
        >
          <span
            className="font-bold text-lg sm:text-2xl text-foreground tabular-nums pointer-events-none"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">
            <EditableField
              field="countdownHoursLabel"
              fallback="Jam"
            />
          </span>
        </Card>

        {/* Kotak Menit */}
        <Card
          onClick={() => {
            if (editing) {
              setIsModalOpen(true);
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center bg-card/60 p-2 sm:p-3 shadow-xs backdrop-blur-xs text-center transition-all",
            editing &&
              "cursor-pointer hover:bg-primary/5 hover:border-primary/50 group"
          )}
          title={editing ? "Klik untuk mengedit tanggal acara countdown" : undefined}
        >
          <span
            className="font-bold text-lg sm:text-2xl text-foreground tabular-nums pointer-events-none"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">
            <EditableField
              field="countdownMinutesLabel"
              fallback="Menit"
            />
          </span>
        </Card>

        {/* Kotak Detik */}
        <Card
          onClick={() => {
            if (editing) {
              setIsModalOpen(true);
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center bg-card/60 p-2 sm:p-3 shadow-xs backdrop-blur-xs text-center transition-all",
            editing &&
              "cursor-pointer hover:bg-primary/5 hover:border-primary/50 group"
          )}
          title={editing ? "Klik untuk mengedit tanggal acara countdown" : undefined}
        >
          <span
            className="font-bold text-lg sm:text-2xl text-primary tabular-nums pointer-events-none"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">
            <EditableField
              field="countdownSecondsLabel"
              fallback="Detik"
            />
          </span>
        </Card>
      </div>

      {/* Tombol Edit Countdown */}
      {editing ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="mt-1 h-8 gap-1.5 px-3 text-xs font-semibold text-foreground/80 hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer shadow-xs"
        >
          <CalendarIcon className="size-3.5 text-primary" />
          <span>Edit Countdown</span>
          <Pencil className="size-3 text-muted-foreground" />
        </Button>
      ) : null}

      {/* Modal Edit Tanggal Countdown */}
      {isModalOpen ? (
        <CountdownModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialDate={effectiveTargetDate}
          onSave={handleSaveCountdown}
        />
      ) : null}
    </div>
  );
}
