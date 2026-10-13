"use client";

import {
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Laptop,
  Smartphone,
  Users,
  UsersRound,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";
import { cn } from "@senara/ui/lib/utils";

import { EmptyState } from "@/components/shared/empty-state";
import { formatDateTime, formatRelativeTime } from "@/lib/format";

export interface StatsGuestRow {
  id: string;
  name: string;
  category: string | null;
  isGroupLink: boolean;
  viewCount: number;
  lastViewedAt?: Date | string | null;
  rsvps?: { attendance: string; guestCount: number }[];
}

export interface StatsGeneralViewRow {
  id: string;
  guestName?: string | null;
  deviceType?: string | null;
  browser?: string | null;
  viewedAt: Date | string;
}

interface GuestVisitTableProps {
  mode: "GUESTS" | "GENERAL";
  guests: StatsGuestRow[];
  generalViews: StatsGeneralViewRow[];
}

export function GuestVisitTable({
  mode,
  guests,
  generalViews,
}: GuestVisitTableProps) {
  if (mode === "GENERAL") {
    if (generalViews.length === 0) {
      return (
        <EmptyState
          icon={Globe}
          title="Belum Ada Kunjungan Link Umum"
          description="Kunjungan dari tautan umum (tanpa kode tamu terdaftar) akan tercatat di tab ini."
        />
      );
    }

    return (
      <div className="w-full min-w-0 overflow-x-auto rounded-2xl border bg-card shadow-xs">
        <Table className="w-full min-w-[620px]">
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="pl-5 text-[11px] tracking-wider uppercase">
                Pengunjung (Link Umum)
              </TableHead>
              <TableHead className="text-[11px] tracking-wider uppercase">
                Perangkat
              </TableHead>
              <TableHead className="text-[11px] tracking-wider uppercase">
                Waktu Buka
              </TableHead>
              <TableHead className="pr-5 text-right text-[11px] tracking-wider uppercase">
                Tanggal & Jam
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generalViews.map((v) => (
              <TableRow key={v.id} className="hover:bg-muted/20">
                <TableCell className="pl-5 font-semibold text-foreground text-xs">
                  {v.guestName || "Tamu Umum (Tanpa Nama)"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    {v.deviceType === "desktop" ? (
                      <Laptop className="size-3" />
                    ) : (
                      <Smartphone className="size-3" />
                    )}
                    <span className="capitalize">
                      {v.deviceType || "mobile"}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-emerald-600 text-xs">
                  {formatRelativeTime(v.viewedAt)}
                </TableCell>
                <TableCell className="pr-5 text-right text-[11px] text-muted-foreground">
                  {formatDateTime(v.viewedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Tidak Ada Data Tamu pada Filter Ini"
        description="Coba ubah tab filter atau kata kunci pencarian nama tamu."
      />
    );
  }

  return (
    <div className="w-full min-w-0 overflow-x-auto rounded-2xl border bg-card shadow-xs">
      <Table className="w-full min-w-[620px]">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="pl-5 text-[11px] tracking-wider uppercase">
              Nama Tamu / Grup
            </TableHead>
            <TableHead className="text-[11px] tracking-wider uppercase">
              Frekuensi Buka
            </TableHead>
            <TableHead className="text-[11px] tracking-wider uppercase">
              Terakhir Dibuka
            </TableHead>
            <TableHead className="pr-5 text-right text-[11px] tracking-wider uppercase">
              Status RSVP
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((g) => {
            const latestRsvp = g.rsvps?.[0];
            return (
              <TableRow key={g.id} className="hover:bg-muted/20">
                <TableCell className="pl-5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-xs">
                      {g.name}
                    </span>
                    {g.isGroupLink ? (
                      <Badge
                        variant="default"
                        className="gap-1 bg-indigo-600 text-[10px] text-white"
                      >
                        <UsersRound className="size-2.5" />
                        <span>Grup</span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="font-normal text-[10px]"
                      >
                        {g.category || "Umum"}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={g.viewCount > 0 ? "default" : "secondary"}
                    className={cn(
                      "gap-1 text-[10px]",
                      g.viewCount > 0
                        ? "border border-emerald-600/20 bg-emerald-600/15 text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground"
                    )}
                  >
                    <Eye className="size-3" />
                    <span>
                      {g.viewCount > 0 ? `${g.viewCount}× buka` : "Belum buka"}
                    </span>
                  </Badge>
                </TableCell>

                <TableCell>
                  {g.lastViewedAt ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-xs">
                        {formatRelativeTime(g.lastViewedAt)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDateTime(g.lastViewedAt)}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      <span>Belum pernah dibuka</span>
                    </span>
                  )}
                </TableCell>

                <TableCell className="pr-5 text-right">
                  {latestRsvp?.attendance === "ATTENDING" ? (
                    <Badge className="gap-1 bg-emerald-600 text-[10px] text-white">
                      <CheckCircle2 className="size-2.5" />
                      <span>Hadir ({latestRsvp.guestCount})</span>
                    </Badge>
                  ) : latestRsvp?.attendance === "NOT_ATTENDING" ? (
                    <Badge variant="destructive" className="text-[10px]">
                      Tidak Hadir
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      Belum RSVP
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

