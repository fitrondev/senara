"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  HelpCircle,
  Loader2,
  MessageSquare,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent } from "@senara/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@senara/ui/components/empty";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import { NativeSelect, NativeSelectOption } from "@senara/ui/components/native-select";
import { Textarea } from "@senara/ui/components/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@senara/ui/components/toggle-group";
import { cn } from "@senara/ui/lib/utils";

import type { ThemeConfig } from "@/components/editor/theme-modal";
import { trpc } from "@/utils/trpc";

interface RSVPSectionProps {
  invitationId: string;
  initialGuestName?: string;
  themeConfig: ThemeConfig;
}

export function RSVPSection({
  invitationId,
  initialGuestName = "",
  themeConfig,
}: RSVPSectionProps) {
  const queryClient = useQueryClient();

  // Form State
  const [guestName, setGuestName] = useState(initialGuestName);
  const [attendance, setAttendance] = useState<"ATTENDING" | "NOT_ATTENDING" | "UNCERTAIN">(
    "ATTENDING"
  );
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Ambil Daftar Ucapan dari tRPC (Real-Time)
  const { data: rsvpData, isLoading: isLoadingWishes } = useQuery(
    trpc.rsvp.listByInvitation.queryOptions({
      invitationId,
      limit: 50,
    })
  );

  // Mutasi Submit RSVP
  const submitMutation = useMutation(
    trpc.rsvp.submit.mutationOptions({
      onSuccess: () => {
        toast.success("Terima kasih! Konfirmasi kehadiran dan ucapan Anda berhasil dikirim.");
        setIsSubmittedSuccess(true);
        setMessage("");
        // Invalidate query agar dinding ucapan langsung terupdate seketika
        queryClient.invalidateQueries(
          trpc.rsvp.listByInvitation.queryFilter({ invitationId })
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengirim RSVP. Silakan coba kembali.");
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error("Nama wajib diisi.");
      return;
    }

    submitMutation.mutate({
      invitationId,
      guestName: guestName.trim(),
      attendance,
      guestCount,
      message: message.trim() || undefined,
    });
  };

  const wishes = rsvpData?.items ?? [];

  return (
    <div className="flex flex-col gap-6 p-6 bg-background border-t">
      {/* Header Bagian */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Badge
          variant="outline"
          className="text-[10px] uppercase tracking-wider text-primary border-primary/30"
        >
          Konfirmasi Kehadiran
        </Badge>
        <h3
          className="font-bold text-2xl tracking-tight text-foreground"
          style={{ fontFamily: themeConfig.typography.headingFont }}
        >
          RSVP & Buku Doa
        </h3>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
          Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
        </p>
      </div>

      {/* Form RSVP */}
      <Card className="p-5 text-left shadow-xs">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. Nama Lengkap Tamu */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rsvp-name" className="text-xs font-semibold">
              Nama Lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rsvp-name"
              placeholder="Ketik nama Anda..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </div>

          {/* 2. Pilihan Status Kehadiran */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold">
              Konfirmasi Kehadiran <span className="text-destructive">*</span>
            </Label>
            <ToggleGroup
              value={[attendance]}
              onValueChange={(val) => {
                const first = val[0];
                if (first) {
                  setAttendance(first as "ATTENDING" | "NOT_ATTENDING" | "UNCERTAIN");
                }
              }}
              variant="outline"
              className="grid grid-cols-3 gap-2 w-full"
            >
              <ToggleGroupItem
                value="ATTENDING"
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 text-xs h-auto",
                  attendance === "ATTENDING" &&
                    "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold shadow-xs"
                )}
              >
                <CheckCircle2 className="size-4 text-emerald-600 mb-1" />
                <span>Hadir</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="NOT_ATTENDING"
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 text-xs h-auto",
                  attendance === "NOT_ATTENDING" &&
                    "border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 font-semibold shadow-xs"
                )}
              >
                <XCircle className="size-4 text-rose-600 mb-1" />
                <span>Tidak Hadir</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="UNCERTAIN"
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 text-xs h-auto",
                  attendance === "UNCERTAIN" &&
                    "border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 font-semibold shadow-xs"
                )}
              >
                <HelpCircle className="size-4 text-amber-600 mb-1" />
                <span>Masih Ragu</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* 3. Jumlah Tamu (Jika Hadir) */}
          {attendance === "ATTENDING" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rsvp-count" className="text-xs font-semibold">
                Jumlah Tamu
              </Label>
              <NativeSelect
                id="rsvp-count"
                value={String(guestCount)}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full"
              >
                <NativeSelectOption value="1">1 Orang</NativeSelectOption>
                <NativeSelectOption value="2">2 Orang</NativeSelectOption>
                <NativeSelectOption value="3">3 Orang</NativeSelectOption>
                <NativeSelectOption value="4">4 Orang</NativeSelectOption>
                <NativeSelectOption value="5">5 Orang</NativeSelectOption>
              </NativeSelect>
            </div>
          )}

          {/* 4. Doa & Ucapan */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rsvp-msg" className="text-xs font-semibold">
              Untaian Doa & Ucapan Selamat
            </Label>
            <Textarea
              id="rsvp-msg"
              rows={3}
              placeholder="Tuliskan ucapan selamat dan doa restu untuk kedua mempelai..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Tombol Kirim */}
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full h-10 gap-2 font-semibold shadow-xs"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Mengirim Konfirmasi...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Kirim RSVP & Ucapan</span>
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Dinding Ucapan & Doa Tamu (Wall of Wishes) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            <h4 className="font-bold text-sm text-foreground">Dinding Doa & Ucapan</h4>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {wishes.length} Pesan
          </Badge>
        </div>

        {isLoadingWishes ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : wishes.length === 0 ? (
          <Empty className="rounded-xl border border-dashed p-6">
            <EmptyHeader>
              <EmptyTitle className="text-xs font-medium text-foreground">
                Belum ada ucapan
              </EmptyTitle>
              <EmptyDescription className="text-[11px] text-muted-foreground">
                Jadilah yang pertama memberikan doa restu!
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
            {wishes.map((item) => {
              const dateFormatted = new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(item.createdAt));

              return (
                <Card
                  key={item.id}
                  className="gap-1.5 p-3.5 text-left shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-foreground">{item.guestName}</span>
                      <Badge
                        variant={
                          item.attendance === "ATTENDING"
                            ? "default"
                            : item.attendance === "NOT_ATTENDING"
                              ? "destructive"
                              : "secondary"
                        }
                        className={cn(
                          "text-[9px] px-1.5 py-0 h-4",
                          item.attendance === "ATTENDING" && "bg-emerald-600 text-white"
                        )}
                      >
                        {item.attendance === "ATTENDING"
                          ? `Hadir (${item.guestCount})`
                          : item.attendance === "NOT_ATTENDING"
                            ? "Tidak Hadir"
                            : "Ragu"}
                      </Badge>
                    </div>

                    <span className="text-[10px] text-muted-foreground">{dateFormatted}</span>
                  </div>

                  {item.message ? (
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line mt-0.5">
                      {item.message}
                    </p>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

