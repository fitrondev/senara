"use client";

import { CheckCircle2, HelpCircle, MessageSquare, Users, XCircle } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { cn } from "@senara/ui/lib/utils";

import { EmptyState } from "@/components/shared/empty-state";
import { formatDateTime } from "@/lib/format";

export interface GuestRsvpReply {
  id: string;
  guestName: string;
  attendance: "ATTENDING" | "NOT_ATTENDING" | "UNCERTAIN" | string;
  guestCount: number;
  message?: string | null;
  createdAt?: Date | string;
}

interface GuestWishesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestName: string;
  isGroupLink?: boolean;
  rsvps: GuestRsvpReply[];
}

export function GuestWishesDialog({
  open,
  onOpenChange,
  guestName,
  isGroupLink = false,
  rsvps,
}: GuestWishesDialogProps) {
  const attendingPax = rsvps
    .filter((r) => r.attendance === "ATTENDING")
    .reduce((sum, r) => sum + (r.guestCount || 1), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant={isGroupLink ? "default" : "secondary"} className="text-[10px]">
              {isGroupLink ? "Link Grup WA" : "Tamu Personal"}
            </Badge>
            {rsvps.length > 0 ? (
              <Badge variant="outline" className="text-[10px]">
                {rsvps.length} Balasan · {attendingPax} Orang Hadir
              </Badge>
            ) : null}
          </div>
          <DialogTitle className="mt-1">
            Ucapan & RSVP: {guestName}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isGroupLink
              ? "Daftar seluruh konfirmasi kehadiran dan doa dari anggota grup yang membuka tautan ini."
              : "Detail konfirmasi kehadiran dan pesan doa yang dikirimkan oleh tamu."}
          </DialogDescription>
        </DialogHeader>

        {rsvps.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Belum Ada Balasan RSVP"
            description="Tamu atau anggota grup ini belum mengirimkan konfirmasi kehadiran maupun ucapan."
            className="py-8"
          />
        ) : (
          <div className="flex flex-col gap-3 py-2">
            {rsvps.map((reply) => (
              <div
                key={reply.id}
                className="flex flex-col gap-1.5 rounded-xl border bg-muted/20 p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-xs">
                      {reply.guestName}
                    </span>
                    <Badge
                      variant={
                        reply.attendance === "ATTENDING"
                          ? "default"
                          : reply.attendance === "NOT_ATTENDING"
                            ? "destructive"
                            : "secondary"
                      }
                      className={cn(
                        "gap-1 text-[10px]",
                        reply.attendance === "ATTENDING" && "bg-emerald-600 text-white"
                      )}
                    >
                      {reply.attendance === "ATTENDING" ? (
                        <>
                          <CheckCircle2 className="size-2.5" />
                          <span>Hadir ({reply.guestCount} org)</span>
                        </>
                      ) : reply.attendance === "NOT_ATTENDING" ? (
                        <>
                          <XCircle className="size-2.5" />
                          <span>Tidak Hadir</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="size-2.5" />
                          <span>Masih Ragu</span>
                        </>
                      )}
                    </Badge>
                  </div>
                  {reply.createdAt ? (
                    <span className="text-[10px] text-muted-foreground">
                      {formatDateTime(reply.createdAt)}
                    </span>
                  ) : null}
                </div>

                {reply.message ? (
                  <p className="mt-1 whitespace-pre-line rounded-lg bg-background p-2.5 text-foreground text-xs leading-relaxed">
                    &ldquo;{reply.message}&rdquo;
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Tidak menyertakan pesan ucapan.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm" />}>
            Tutup
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

