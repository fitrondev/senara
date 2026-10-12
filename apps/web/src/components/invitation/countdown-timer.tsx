"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Alert, AlertDescription, AlertTitle } from "@senara/ui/components/alert";
import { Card } from "@senara/ui/components/card";
import { cn } from "@senara/ui/lib/utils";

import type { ThemeConfig } from "@/components/editor/theme-modal";

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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!targetDate) return;

    const destination = new Date(targetDate).getTime();

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
  }, [targetDate]);

  if (!isMounted || !targetDate) {
    return null;
  }

  if (timeLeft.isExpired) {
    return (
      <Alert className="flex flex-col items-center justify-center p-4 text-center border-primary/20 bg-primary/10">
        <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
          <Sparkles className="size-4 animate-pulse" />
          <AlertTitle className="font-bold text-sm text-primary">Hari Bahagia Telah Tiba</AlertTitle>
        </div>
        <AlertDescription className="text-[11px] text-muted-foreground mt-1 text-center">
          Terima kasih atas segala doa restu dan kehadiran yang telah diberikan.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full py-2">
      <Badge
        variant="outline"
        className="text-[10px] uppercase tracking-wider text-muted-foreground"
      >
        Menghitung Hari
      </Badge>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-xs">
        {/* Kotak Hari */}
        <Card className="flex flex-col items-center justify-center bg-card/60 p-2 sm:p-3 shadow-xs backdrop-blur-xs text-center">
          <span
            className="font-bold text-lg sm:text-2xl text-foreground tabular-nums"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">Hari</span>
        </Card>

        {/* Kotak Jam */}
        <Card className="flex flex-col items-center justify-center bg-card/60 p-2 sm:p-3 shadow-xs backdrop-blur-xs text-center">
          <span
            className="font-bold text-lg sm:text-2xl text-foreground tabular-nums"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">Jam</span>
        </Card>

        {/* Kotak Menit */}
        <Card className="flex flex-col items-center justify-center bg-card/60 p-2 sm:p-3 shadow-xs backdrop-blur-xs text-center">
          <span
            className="font-bold text-lg sm:text-2xl text-foreground tabular-nums"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">Menit</span>
        </Card>

        {/* Kotak Detik */}
        <Card className="flex flex-col items-center justify-center bg-card/60 p-2 sm:p-3 shadow-xs backdrop-blur-xs text-center">
          <span
            className="font-bold text-lg sm:text-2xl text-primary tabular-nums"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">Detik</span>
        </Card>
      </div>
    </div>
  );
}

