"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Pencil } from "lucide-react";
import { toast } from "sonner";

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

import { EventMapsModal } from "@/components/editor/event-maps-modal";
import { EventReminderModal } from "@/components/editor/event-reminder-modal";
import type { ThemeConfig } from "@/components/editor/theme-modal";
import { useEditContext } from "./edit-context";
import { EditableField } from "./primitives";

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

function formatIsoDate(d: Date | string): string {
  try {
    const dateObj = new Date(d);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  } catch {
    // fallback
  }
  return "2026-10-24";
}

function formatTimeHHmm(timeStr?: string | null, fallback = "08:00"): string {
  if (!timeStr) return fallback;
  const cleaned = timeStr.replace(".", ":");
  const match = cleaned.match(/(\d{1,2}):(\d{2})/);
  if (match && match[1] && match[2]) {
    return `${match[1].padStart(2, "0")}:${match[2]}`;
  }
  return fallback;
}

// Helper membuat link Google Calendar dengan dukungan kustomisasi
function createGoogleCalendarUrl(
  schedule: EventScheduleItem,
  custom?: {
    title?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    location?: string;
  }
): string {
  const title = custom?.title || schedule.title;
  const location = custom?.location || `${schedule.venueName}, ${schedule.address}`;

  let startIsoDate = "";
  if (custom?.startDate) {
    startIsoDate = custom.startDate.replace(/-/g, "");
  } else {
    const eventDateObj = new Date(schedule.date);
    if (!isNaN(eventDateObj.getTime())) {
      const year = eventDateObj.getFullYear();
      const month = String(eventDateObj.getMonth() + 1).padStart(2, "0");
      const day = String(eventDateObj.getDate()).padStart(2, "0");
      startIsoDate = `${year}${month}${day}`;
    } else {
      startIsoDate = "20261024";
    }
  }

  let endIsoDate = startIsoDate;
  if (custom?.endDate) {
    endIsoDate = custom.endDate.replace(/-/g, "");
  }

  const rawStartTime = custom?.startTime || schedule.startTime || "08:00";
  const rawEndTime = custom?.endTime || schedule.endTime || rawStartTime;

  const startClean = rawStartTime.replace(/[^0-9]/g, "").padEnd(4, "0").slice(0, 4);
  const endClean = rawEndTime.replace(/[^0-9]/g, "").padEnd(4, "0").slice(0, 4);

  const startIso = `${startIsoDate}T${startClean}00Z`;
  const endIso = `${endIsoDate}T${endClean}00Z`;

  const titleEncoded = encodeURIComponent(title);
  const detailsEncoded = encodeURIComponent(
    `Menghadiri ${title} di ${location}.`
  );
  const locationEncoded = encodeURIComponent(location);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&dates=${startIso}/${endIso}&details=${detailsEncoded}&location=${locationEncoded}`;
}

export function EventSection({ schedules, themeConfig }: EventSectionProps) {
  const { editing, getField, onPatchField, onPatchFields } = useEditContext();

  const [editingMapsSchedule, setEditingMapsSchedule] = useState<{
    idx: number;
    schedule: EventScheduleItem;
  } | null>(null);

  const [editingReminderSchedule, setEditingReminderSchedule] = useState<{
    idx: number;
    schedule: EventScheduleItem;
  } | null>(null);

  if (!schedules || schedules.length === 0) {
    return null;
  }

  const handleSaveMaps = (data: { label: string; targetUrl: string }) => {
    if (!editingMapsSchedule) return;
    const { idx } = editingMapsSchedule;
    const updates: Record<string, string> = {
      [`schedule_${idx}_mapsLabel`]: data.label,
      [`schedule_${idx}_mapsUrl`]: data.targetUrl,
    };
    if (onPatchFields) {
      onPatchFields(updates);
    } else if (onPatchField) {
      Object.entries(updates).forEach(([k, v]) => onPatchField(k, v));
    }
    toast.success("Tautan dan label peta berhasil diperbarui");
    setEditingMapsSchedule(null);
  };

  const handleSaveReminder = (data: {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    label: string;
  }) => {
    if (!editingReminderSchedule) return;
    const { idx } = editingReminderSchedule;
    const updates: Record<string, string> = {
      [`schedule_${idx}_calendarTitle`]: data.title,
      [`schedule_${idx}_calendarStartDate`]: data.startDate,
      [`schedule_${idx}_calendarStartTime`]: data.startTime,
      [`schedule_${idx}_calendarEndDate`]: data.endDate,
      [`schedule_${idx}_calendarEndTime`]: data.endTime,
      [`schedule_${idx}_calendarLocation`]: data.location,
      [`schedule_${idx}_calendarLabel`]: data.label,
    };
    if (onPatchFields) {
      onPatchFields(updates);
    } else if (onPatchField) {
      Object.entries(updates).forEach(([k, v]) => onPatchField(k, v));
    }
    toast.success("Pengaturan pengingat kalender berhasil disimpan");
    setEditingReminderSchedule(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-background">
      {/* Judul Bagian */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-primary border-primary/30">
          <EditableField
            field="eventBadge"
            fallback="Waktu & Lokasi"
          />
        </Badge>
        <h3
          className="font-bold text-2xl tracking-tight text-foreground"
          style={{ fontFamily: themeConfig.typography.headingFont }}
        >
          <EditableField
            field="eventTitle"
            fallback="Rangkaian Acara"
          />
        </h3>
        <EditableField
          as="p"
          multiline
          field="eventSubtitle"
          fallback="Dengan penuh rasa syukur, kami mengundang Anda untuk hadir pada rangkaian acara berikut:"
          className="text-xs text-muted-foreground max-w-xs"
        />
      </div>

      {/* Kartu Daftar Jadwal Acara */}
      <div className="flex flex-col gap-4">
        {schedules.map((schedule, idx) => {
          const dateFormatted = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(schedule.date));

          const defaultMapsHref =
            schedule.mapsUrl ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${schedule.venueName} ${schedule.address}`
            )}`;
          const mapsHref = getField(`schedule_${idx}_mapsUrl`, "") || defaultMapsHref;
          const mapsLabel = getField(`schedule_${idx}_mapsLabel`, "Buka Maps");

          const customCalendarTitle = getField(
            `schedule_${idx}_calendarTitle`,
            schedule.title
          );
          const customCalendarStartDate = getField(
            `schedule_${idx}_calendarStartDate`,
            formatIsoDate(schedule.date)
          );
          const customCalendarStartTime = getField(
            `schedule_${idx}_calendarStartTime`,
            formatTimeHHmm(schedule.startTime, "08:00")
          );
          const customCalendarEndDate = getField(
            `schedule_${idx}_calendarEndDate`,
            formatIsoDate(schedule.date)
          );
          const customCalendarEndTime = getField(
            `schedule_${idx}_calendarEndTime`,
            formatTimeHHmm(schedule.endTime, "10:00")
          );
          const customCalendarLocation = getField(
            `schedule_${idx}_calendarLocation`,
            `${schedule.venueName}, ${schedule.address}`
          );
          const calendarLabel = getField(
            `schedule_${idx}_calendarLabel`,
            "Simpan Kalender"
          );

          const calendarHref = createGoogleCalendarUrl(schedule, {
            title: customCalendarTitle,
            startDate: customCalendarStartDate,
            startTime: customCalendarStartTime,
            endDate: customCalendarEndDate,
            endTime: customCalendarEndTime,
            location: customCalendarLocation,
          });

          const timeFormatted = `Pukul ${schedule.startTime}${
            schedule.endTime ? ` - ${schedule.endTime}` : " Selesai"
          } ${schedule.timezone}`;

          return (
            <Card
              key={schedule.id || `schedule-${idx}`}
              className="text-left shadow-xs transition-shadow hover:shadow-md"
            >
              {/* Header Acara */}
              <CardHeader className="border-b p-5 pb-3.5">
                <CardTitle
                  className="font-bold text-base text-foreground tracking-tight"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                >
                  <EditableField
                    field={`schedule_${idx}_title`}
                    fallback={schedule.title}
                  />
                </CardTitle>
                <CardAction>
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    <EditableField
                      field={`schedule_${idx}_timezone`}
                      fallback={schedule.timezone}
                    />
                  </Badge>
                </CardAction>
              </CardHeader>

              {/* Tanggal & Waktu */}
              <CardContent className="space-y-2 p-5 py-4 text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CalendarIcon className="size-4 shrink-0 text-primary" />
                  <span>
                    <EditableField
                      field={`schedule_${idx}_date`}
                      fallback={dateFormatted}
                    />
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 shrink-0 text-primary" />
                  <span>
                    <EditableField
                      field={`schedule_${idx}_time`}
                      fallback={timeFormatted}
                    />
                  </span>
                </div>

                {/* Lokasi Gedung */}
                <div className="flex items-start gap-2 pt-1 text-muted-foreground">
                  <MapPin className="size-4 shrink-0 text-rose-500 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-xs">
                      <EditableField
                        field={`schedule_${idx}_venue`}
                        fallback={schedule.venueName}
                      />
                    </p>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      <EditableField
                        as="p"
                        multiline
                        field={`schedule_${idx}_address`}
                        fallback={schedule.address}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Tombol Aksi: Buka Maps & Simpan ke Kalender */}
              <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/15 px-5 py-3.5">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full text-xs font-semibold relative transition-all",
                    editing && "cursor-pointer hover:border-primary hover:bg-primary/5 group"
                  )}
                  onClick={
                    editing
                      ? (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingMapsSchedule({ idx, schedule });
                        }
                      : undefined
                  }
                  title={editing ? "Klik untuk mengubah tautan atau label Google Maps" : undefined}
                  render={
                    editing ? (
                      <button type="button" />
                    ) : (
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    )
                  }
                >
                  <MapPin className="size-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{mapsLabel}</span>
                  {editing ? (
                    <Pencil className="size-2.5 opacity-60 group-hover:opacity-100 text-muted-foreground ml-auto shrink-0" />
                  ) : null}
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  className={cn(
                    "w-full text-xs font-semibold relative transition-all",
                    editing && "cursor-pointer hover:brightness-105 group"
                  )}
                  onClick={
                    editing
                      ? (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingReminderSchedule({ idx, schedule });
                        }
                      : undefined
                  }
                  title={editing ? "Klik untuk mengatur rincian pengingat Google Calendar" : undefined}
                  render={
                    editing ? (
                      <button type="button" />
                    ) : (
                      <a
                        href={calendarHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    )
                  }
                >
                  <CalendarIcon className="size-3.5 shrink-0" />
                  <span className="truncate">{calendarLabel}</span>
                  {editing ? (
                    <Pencil className="size-2.5 opacity-70 group-hover:opacity-100 text-primary-foreground ml-auto shrink-0" />
                  ) : null}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Modal Edit Google Maps */}
      {editingMapsSchedule ? (
        <EventMapsModal
          open={!!editingMapsSchedule}
          onOpenChange={(open) => {
            if (!open) setEditingMapsSchedule(null);
          }}
          scheduleTitle={
            getField(
              `schedule_${editingMapsSchedule.idx}_title`,
              editingMapsSchedule.schedule.title
            ) || undefined
          }
          initialLabel={getField(
            `schedule_${editingMapsSchedule.idx}_mapsLabel`,
            "Buka Maps"
          )}
          initialTargetUrl={
            getField(`schedule_${editingMapsSchedule.idx}_mapsUrl`, "") ||
            editingMapsSchedule.schedule.mapsUrl ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${editingMapsSchedule.schedule.venueName} ${editingMapsSchedule.schedule.address}`
            )}`
          }
          onSave={handleSaveMaps}
        />
      ) : null}

      {/* Modal Edit Pengingat Kalender */}
      {editingReminderSchedule ? (
        <EventReminderModal
          open={!!editingReminderSchedule}
          onOpenChange={(open) => {
            if (!open) setEditingReminderSchedule(null);
          }}
          initialTitle={getField(
            `schedule_${editingReminderSchedule.idx}_calendarTitle`,
            getField(
              `schedule_${editingReminderSchedule.idx}_title`,
              editingReminderSchedule.schedule.title
            )
          )}
          initialStartDate={getField(
            `schedule_${editingReminderSchedule.idx}_calendarStartDate`,
            formatIsoDate(editingReminderSchedule.schedule.date)
          )}
          initialStartTime={getField(
            `schedule_${editingReminderSchedule.idx}_calendarStartTime`,
            formatTimeHHmm(editingReminderSchedule.schedule.startTime, "08:00")
          )}
          initialEndDate={getField(
            `schedule_${editingReminderSchedule.idx}_calendarEndDate`,
            formatIsoDate(editingReminderSchedule.schedule.date)
          )}
          initialEndTime={getField(
            `schedule_${editingReminderSchedule.idx}_calendarEndTime`,
            formatTimeHHmm(editingReminderSchedule.schedule.endTime, "10:00")
          )}
          initialLocation={getField(
            `schedule_${editingReminderSchedule.idx}_calendarLocation`,
            `${editingReminderSchedule.schedule.venueName}, ${editingReminderSchedule.schedule.address}`
          )}
          initialLabel={getField(
            `schedule_${editingReminderSchedule.idx}_calendarLabel`,
            "Simpan Kalender"
          )}
          onSave={handleSaveReminder}
        />
      ) : null}
    </div>
  );
}
