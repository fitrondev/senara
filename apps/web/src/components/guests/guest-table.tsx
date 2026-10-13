"use client";

import {
  CheckCircle2,
  Clock,
  Copy,
  Edit2,
  Eye,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  Smartphone,
  Trash2,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";
import { cn } from "@senara/ui/lib/utils";

import type { GuestRsvpReply } from "@/components/guests/guest-wishes-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeTime } from "@/lib/format";

export interface GuestListItem {
  id: string;
  name: string;
  phone: string | null;
  category: string | null;
  isGroupLink: boolean;
  isSentWa: boolean;
  viewCount: number;
  lastViewedAt?: Date | string | null;
  deviceFingerprints?: unknown;
  rsvps?: GuestRsvpReply[];
}

interface GuestTableProps {
  guests: GuestListItem[];
  isLoading: boolean;
  maxDevicesPerGuest: number;
  onAddFirstGuest: () => void;
  onSendWhatsApp: (guest: GuestListItem) => void;
  onCopyLink: (guest: GuestListItem) => void;
  onPreviewAsGuest: (guest: GuestListItem) => void;
  onViewWishes: (guest: GuestListItem) => void;
  onResetDevices: (guest: GuestListItem) => void;
  onEditGuest: (guest: GuestListItem) => void;
  onDeleteGuest: (guest: { id: string; name: string }) => void;
}

export function GuestTable({
  guests,
  isLoading,
  maxDevicesPerGuest,
  onAddFirstGuest,
  onSendWhatsApp,
  onCopyLink,
  onPreviewAsGuest,
  onViewWishes,
  onResetDevices,
  onEditGuest,
  onDeleteGuest,
}: GuestTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border bg-card p-12 shadow-xs">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Belum Ada Tamu atau Link Grup"
        description="Tambahkan tamu satu per satu, buat Link Grup WhatsApp, atau gunakan impor massal CSV."
        action={
          <Button
            size="sm"
            onClick={onAddFirstGuest}
            className="gap-1.5 text-xs"
          >
            <UserPlus className="size-3.5" />
            <span>Tambah Tamu Pertama</span>
          </Button>
        }
      />
    );
  }

  return (
    <div className="w-full min-w-0 overflow-x-auto rounded-2xl border bg-card shadow-xs">
      <Table className="w-full min-w-[780px]">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="pl-5 text-[11px] tracking-wider uppercase">
              Tamu / Grup
            </TableHead>
            <TableHead className="text-[11px] tracking-wider uppercase">
              Status Buka
            </TableHead>
            <TableHead className="text-[11px] tracking-wider uppercase">
              RSVP & Pax
            </TableHead>
            <TableHead className="text-[11px] tracking-wider uppercase">
              Perangkat HP
            </TableHead>
            <TableHead className="pr-5 text-right text-[11px] tracking-wider uppercase">
              Aksi Cepat
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => {
            const rsvpList = guest.rsvps ?? [];
            const latestRsvp = rsvpList[0];
            const attendingReplies = rsvpList.filter(
              (r) => r.attendance === "ATTENDING"
            );
            const totalAttendingPax = attendingReplies.reduce(
              (sum, r) => sum + (r.guestCount || 1),
              0
            );
            const devicesUsed = Array.isArray(guest.deviceFingerprints)
              ? guest.deviceFingerprints.length
              : 0;

            return (
              <TableRow
                key={guest.id}
                className="transition-colors hover:bg-muted/20"
              >
                <TableCell className="pl-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-foreground text-sm">
                        {guest.name}
                      </span>
                      {guest.isGroupLink ? (
                        <Badge
                          variant="default"
                          className="gap-1 bg-indigo-600 text-[10px] text-white"
                        >
                          <UsersRound className="size-2.5" />
                          <span>Link Grup</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="font-normal text-[10px]"
                        >
                          {guest.category || "Umum"}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      {guest.phone ? (
                        <span className="font-mono">{guest.phone}</span>
                      ) : (
                        <span>Tanpa No. WA</span>
                      )}
                      <span>·</span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-medium",
                          guest.isSentWa
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {guest.isSentWa ? (
                          <>
                            <CheckCircle2 className="size-3" />
                            <span>WA Terkirim</span>
                          </>
                        ) : (
                          <>
                            <Clock className="size-3" />
                            <span>Belum Dikirim</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <Badge
                      variant={guest.viewCount > 0 ? "default" : "secondary"}
                      className={cn(
                        "w-fit text-[10px]",
                        guest.viewCount > 0
                          ? "bg-blue-600/15 text-blue-700 border border-blue-600/20 dark:text-blue-400"
                          : "text-muted-foreground"
                      )}
                    >
                      {guest.viewCount > 0
                        ? `Dibuka ${guest.viewCount}×`
                        : "Belum dibuka"}
                    </Badge>
                    {guest.lastViewedAt ? (
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(guest.lastViewedAt)}
                      </span>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell>
                  {guest.isGroupLink ? (
                    <div className="flex flex-col gap-1">
                      {rsvpList.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge className="bg-emerald-600 text-[10px] text-white">
                            {totalAttendingPax} Hadir
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {rsvpList.length} Balasan Grup
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          Belum ada balasan grup
                        </span>
                      )}
                    </div>
                  ) : latestRsvp ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        {latestRsvp.attendance === "ATTENDING" ? (
                          <Badge className="bg-emerald-600 text-[10px] text-white">
                            Hadir ({latestRsvp.guestCount} pax)
                          </Badge>
                        ) : latestRsvp.attendance === "NOT_ATTENDING" ? (
                          <Badge variant="destructive" className="text-[10px]">
                            Tidak Hadir
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Masih Ragu
                          </Badge>
                        )}
                      </div>
                      {latestRsvp.message ? (
                        <span className="max-w-[160px] truncate text-[10px] text-muted-foreground">
                          &ldquo;{latestRsvp.message}&rdquo;
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      Belum Konfirmasi
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {guest.isGroupLink ? (
                    <span className="text-[11px] text-muted-foreground">
                      Bebas perangkat (Grup)
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 font-mono text-[10px]",
                          devicesUsed >= maxDevicesPerGuest &&
                            "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        )}
                      >
                        <Smartphone className="size-2.5" />
                        <span>
                          {devicesUsed}/{maxDevicesPerGuest} HP
                        </span>
                      </Badge>
                      {devicesUsed > 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => onResetDevices(guest)}
                          className="h-6 gap-1 px-1.5 text-[10px] text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                          title="Reset perangkat HP tamu"
                        >
                          <RotateCcw className="size-2.5" />
                          <span>Reset HP</span>
                        </Button>
                      ) : null}
                    </div>
                  )}
                </TableCell>

                <TableCell className="pr-5 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-1">
                    {rsvpList.length > 0 ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onViewWishes(guest)}
                        className="h-7 gap-1 px-2 text-[11px]"
                        title="Lihat ucapan & balasan RSVP"
                      >
                        <MessageSquare className="size-3 text-primary" />
                        <span>Lihat Ucapan ({rsvpList.length})</span>
                      </Button>
                    ) : null}

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onSendWhatsApp(guest)}
                      className="h-7 gap-1 border-emerald-600/30 px-2.5 font-semibold text-[11px] text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                      title="Kirim Undangan via WhatsApp"
                    >
                      <Send className="size-3" />
                      <span>Kirim WA</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onCopyLink(guest)}
                      className="h-7 gap-1 px-2 text-[11px]"
                      title="Salin Link Undangan Tamu"
                    >
                      <Copy className="size-3" />
                      <span>Salin Link</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      onClick={() => onPreviewAsGuest(guest)}
                      title={`Lihat seperti tamu: Tampilan untuk ${guest.name}`}
                    >
                      <Eye className="size-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      onClick={() => onEditGuest(guest)}
                      title="Edit Data Tamu"
                    >
                      <Edit2 className="size-3" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        onDeleteGuest({ id: guest.id, name: guest.name })
                      }
                      title="Hapus Tamu"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
