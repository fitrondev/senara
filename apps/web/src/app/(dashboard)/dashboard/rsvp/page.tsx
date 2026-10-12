"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookHeart,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  HelpCircle,
  Loader2,
  MessageSquare,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@senara/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@senara/ui/components/empty";
import { NativeSelect, NativeSelectOption } from "@senara/ui/components/native-select";
import { cn } from "@senara/ui/lib/utils";

import { trpc } from "@/utils/trpc";

export default function RSVPAdminPage() {
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>("");

  // Ambil daftar undangan pengguna
  const { data: invitations, isLoading: isLoadingInvitations } = useQuery(
    trpc.invitation.getMyInvitations.queryOptions()
  );

  const invitationList = invitations ?? [];
  const activeId = selectedInvitationId || invitationList[0]?.id || "";

  // Ambil respon RSVP untuk undangan terpilih
  const { data: rsvpData, isLoading: isLoadingRsvp } = useQuery(
    trpc.rsvp.listByInvitation.queryOptions(
      { invitationId: activeId, limit: 100 },
      { enabled: !!activeId }
    )
  );

  const wishes = rsvpData?.items ?? [];

  const attendingCount = wishes.filter((w) => w.attendance === "ATTENDING").length;
  const notAttendingCount = wishes.filter((w) => w.attendance === "NOT_ATTENDING").length;
  const uncertainCount = wishes.filter((w) => w.attendance === "UNCERTAIN").length;
  const totalPax = wishes.reduce(
    (acc, cur) => (cur.attendance === "ATTENDING" ? acc + cur.guestCount : acc),
    0
  );

  if (isLoadingInvitations) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Memuat buku tamu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={"/dashboard" as Route} className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Buku Tamu</span>
          </div>
          <h1 className="font-bold text-2xl tracking-tight text-foreground">
            Buku Tamu & Rekap RSVP
          </h1>
          <p className="text-xs text-muted-foreground">
            Pantau konfirmasi kehadiran dan baca untaian doa restu dari para tamu undangan.
          </p>
        </div>

        {/* Pemilih Undangan */}
        {invitationList.length > 1 && (
          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-muted-foreground" />
            <NativeSelect
              value={activeId}
              onChange={(e) => setSelectedInvitationId(e.target.value)}
              className="text-xs h-9"
            >
              {invitationList.map((inv) => (
                <NativeSelectOption key={inv.id} value={inv.id}>
                  {inv.title}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        )}
      </div>

      {invitationList.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-xs text-muted-foreground">
          Belum ada undangan yang dibuat.
        </div>
      ) : (
        <>
          {/* Ringkasan Metrik RSVP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="shadow-2xs">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                  <span>Total Respon</span>
                  <BookHeart className="size-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="font-bold text-2xl text-foreground tabular-nums">{wishes.length}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Tamu merespon</p>
              </CardContent>
            </Card>

            <Card className="shadow-2xs">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                  <span>Hadir ({totalPax} Pax)</span>
                  <CheckCircle2 className="size-4 text-emerald-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="font-bold text-2xl text-emerald-600 tabular-nums">{attendingCount}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Konfirmasi hadir</p>
              </CardContent>
            </Card>

            <Card className="shadow-2xs">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                  <span>Berhalangan</span>
                  <XCircle className="size-4 text-rose-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="font-bold text-2xl text-rose-600 tabular-nums">
                  {notAttendingCount}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Tidak bisa hadir</p>
              </CardContent>
            </Card>

            <Card className="shadow-2xs">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                  <span>Masih Ragu</span>
                  <HelpCircle className="size-4 text-amber-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="font-bold text-2xl text-amber-500 tabular-nums">{uncertainCount}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Belum memastikan</p>
              </CardContent>
            </Card>
          </div>

          {/* Dinding Ucapan & Doa */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <span>Pesan Doa & Ucapan Tamu</span>
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                {wishes.length} Pesan
              </Badge>
            </div>

            {isLoadingRsvp ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : wishes.length === 0 ? (
              <Empty className="rounded-2xl border bg-card p-8">
                <EmptyHeader>
                  <EmptyTitle className="text-xs font-medium text-foreground">
                    Belum ada ucapan atau konfirmasi RSVP
                  </EmptyTitle>
                  <EmptyDescription className="text-[11px] text-muted-foreground">
                    Ketika tamu merespon undangan ini, doa dan ucapan akan tampil di sini.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wishes.map((item) => {
                  const dateFormatted = new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(item.createdAt));

                  return (
                    <Card
                      key={item.id}
                      className="gap-2 p-4 shadow-2xs text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">{item.guestName}</span>
                        <Badge
                          variant={
                            item.attendance === "ATTENDING"
                              ? "default"
                              : item.attendance === "NOT_ATTENDING"
                                ? "destructive"
                                : "secondary"
                          }
                          className={cn(
                            "text-[10px]",
                            item.attendance === "ATTENDING" && "bg-emerald-600 text-white"
                          )}
                        >
                          {item.attendance === "ATTENDING"
                            ? `Hadir (${item.guestCount} orang)`
                            : item.attendance === "NOT_ATTENDING"
                              ? "Tidak Hadir"
                              : "Ragu"}
                        </Badge>
                      </div>

                      {item.message ? (
                        <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed mt-1">
                          "{item.message}"
                        </p>
                      ) : (
                        <p className="text-xs italic text-muted-foreground/60 mt-1">
                          (Tidak meninggalkan pesan)
                        </p>
                      )}

                      <span className="text-[10px] text-muted-foreground/80 mt-2 border-t pt-2">
                        {dateFormatted}
                      </span>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

