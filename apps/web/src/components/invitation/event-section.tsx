"use client";

import { Calendar as CalendarIcon, Clock, ExternalLink, MapPin } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";
import { cn } from "@senara/ui/lib/utils";

import type { ThemeConfig } from "@/components/editor/theme-modal";

export interface EventScheduleItem {
  id: string;
  title: string;
  date: Date | string;
  startTime: string;
  endTime?: string | null;
  timezone: string;
  venueName: string;
  address: string;
  mapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface EventSectionProps {
  schedules: EventScheduleItem[];
  themeConfig: ThemeConfig;
}

// Helper membuat link Google Calendar
function createGoogleCalendarUrl(schedule: EventScheduleItem): string {
  const eventDateObj = new Date(schedule.date);
  const year = eventDateObj.getFullYear();
  const month = String(eventDateObj.getMonth() + 1).padStart(2, "0");
  const day = String(eventDateObj.getDate()).padStart(2, "0");

  const startClean = schedule.startTime.replace(":", "");
  const endClean = schedule.endTime ? schedule.endTime.replace(":", "") : startClean;

  const startIso = `${year}${month}${day}T${startClean}00Z`;
  const endIso = `${year}${month}${day}T${endClean}00Z`;

  const titleEncoded = encodeURIComponent(schedule.title);
  const detailsEncoded = encodeURIComponent(
    `Menghadiri ${schedule.title} di ${schedule.venueName}.\nAlamat: ${schedule.address}`
  );
  const locationEncoded = encodeURIComponent(`${schedule.venueName}, ${schedule.address}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&dates=${startIso}/${endIso}&details=${detailsEncoded}&location=${locationEncoded}`;
}

export function EventSection({ schedules, themeConfig }: EventSectionProps) {
  if (!schedules || schedules.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-background">
      {/* Judul Bagian */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-primary border-primary/30">
          Waktu & Lokasi
        </Badge>
        <h3
          className="font-bold text-2xl tracking-tight text-foreground"
          style={{ fontFamily: themeConfig.typography.headingFont }}
        >
          Rangkaian Acara
        </h3>
        <p className="text-xs text-muted-foreground max-w-xs">
          Dengan penuh rasa syukur, kami mengundang Anda untuk hadir pada rangkaian acara berikut:
        </p>
      </div>

      {/* Kartu Daftar Jadwal Acara */}
      <div className="flex flex-col gap-4">
        {schedules.map((schedule) => {
          const dateFormatted = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(schedule.date));

          const mapsHref =
            schedule.mapsUrl ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${schedule.venueName} ${schedule.address}`
            )}`;

          const calendarHref = createGoogleCalendarUrl(schedule);

          return (
            <Card
              key={schedule.id}
              className="text-left shadow-xs transition-shadow hover:shadow-md"
            >
              {/* Header Acara */}
              <CardHeader className="border-b pb-3">
                <CardTitle
                  className="font-bold text-base text-foreground tracking-tight"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                >
                  {schedule.title}
                </CardTitle>
                <CardAction>
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {schedule.timezone}
                  </Badge>
                </CardAction>
              </CardHeader>

              {/* Tanggal & Waktu */}
              <CardContent className="space-y-2 py-3 text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CalendarIcon className="size-4 shrink-0 text-primary" />
                  <span>{dateFormatted}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 shrink-0 text-primary" />
                  <span>
                    Pukul {schedule.startTime}{" "}
                    {schedule.endTime ? `- ${schedule.endTime}` : "Selesai"}{" "}
                    {schedule.timezone}
                  </span>
                </div>

                {/* Lokasi Gedung */}
                <div className="flex items-start gap-2 pt-1 text-muted-foreground">
                  <MapPin className="size-4 shrink-0 text-rose-500 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-xs">{schedule.venueName}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {schedule.address}
                    </p>
                  </div>
                </div>
              </CardContent>

              {/* Tombol Aksi: Buka Maps & Simpan ke Kalender */}
              <CardFooter className="grid grid-cols-2 gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold"
                  render={
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <MapPin className="size-3.5 text-rose-500" />
                  <span>Buka Maps</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  className="w-full text-xs font-semibold"
                  render={
                    <a
                      href={calendarHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <CalendarIcon className="size-3.5" />
                  <span>Simpan Kalender</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

