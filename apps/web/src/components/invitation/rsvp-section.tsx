"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  HelpCircle,
  Loader2,
  MessageSquare,
  Send,
  UsersRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@senara/ui/components/empty";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@senara/ui/components/select";
import { Textarea } from "@senara/ui/components/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@senara/ui/components/toggle-group";
import { cn } from "@senara/ui/lib/utils";

import type { ThemeConfig } from "@/components/editor/theme-modal";
import { formatDateTime } from "@/lib/format";
import { trpc } from "@/utils/trpc";

interface RSVPSectionProps {
  invitationId: string;
  guestId?: string;
  initialGuestName?: string;
  isGroupLink?: boolean;
  themeConfig: ThemeConfig;
}

const PAX_OPTIONS = ["1", "2", "3", "4", "5"] as const;

export function RSVPSection({
  invitationId,
  guestId,
  initialGuestName = "",
  isGroupLink = false,
  themeConfig,
}: RSVPSectionProps) {
  const queryClient = useQueryClient();

  const [guestName, setGuestName] = useState(
    isGroupLink ? "" : initialGuestName
  );
  const [attendance, setAttendance] = useState<
    "ATTENDING" | "NOT_ATTENDING" | "UNCERTAIN"
  >("ATTENDING");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState("");

  const { data: rsvpData, isLoading: isLoadingWishes } = useQuery(
    trpc.rsvp.listByInvitation.queryOptions({
      invitationId,
      limit: 50,
    })
  );

  const submitMutation = useMutation(
    trpc.rsvp.submit.mutationOptions({
      onSuccess: () => {
        toast.success(
          "Terima kasih! Konfirmasi kehadiran dan ucapan Anda berhasil dikirim."
        );
        setMessage("");
        if (isGroupLink) {
          setGuestName("");
        }
        queryClient.invalidateQueries(
          trpc.rsvp.listByInvitation.queryFilter({ invitationId })
        );
      },
      onError: (err) => {
        toast.error(
          err.message || "Gagal mengirim RSVP. Silakan coba kembali."
        );
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
      guestId,
      guestName: guestName.trim(),
      attendance,
      guestCount,
      message: message.trim() || undefined,
    });
  };

  const wishes = rsvpData?.items ?? [];

  return (
    <div className="flex flex-col gap-6 border-t bg-background p-6">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Badge
          variant="outline"
          className="border-primary/30 text-[10px] text-primary tracking-wider uppercase"
        >
          Konfirmasi Kehadiran
        </Badge>
        <h3
          className="font-bold text-2xl tracking-tight text-foreground"
          style={{ fontFamily: themeConfig.typography.headingFont }}
        >
          RSVP & Buku Doa
        </h3>
        <p className="max-w-xs text-muted-foreground text-xs leading-relaxed">
          Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan
          memberikan doa restu.
        </p>
      </div>

      <Card className="p-5 text-left shadow-xs">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isGroupLink && initialGuestName ? (
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs">
              <UsersRound className="size-4 shrink-0 text-indigo-600" />
              <span className="text-muted-foreground">
                Grup: <strong className="text-foreground">{initialGuestName}</strong>.
                Silakan ketik nama pribadi Anda di bawah ini.
              </span>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rsvp-name" className="font-semibold text-xs">
              Nama Lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rsvp-name"
              placeholder={
                isGroupLink
                  ? "Ketik nama pribadi Anda (Anggota Grup)..."
                  : "Ketik nama Anda..."
              }
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="font-semibold text-xs">
              Konfirmasi Kehadiran <span className="text-destructive">*</span>
            </Label>
            <ToggleGroup
              value={[attendance]}
              onValueChange={(val) => {
                const first = val[0];
                if (first) {
                  setAttendance(
                    first as "ATTENDING" | "NOT_ATTENDING" | "UNCERTAIN"
                  );
                }
              }}
              variant="outline"
              className="grid w-full grid-cols-3 gap-2"
            >
              <ToggleGroupItem
                value="ATTENDING"
                className={cn(
                  "flex h-auto flex-col items-center justify-center p-2.5 text-xs",
                  attendance === "ATTENDING" &&
                    "border-emerald-600 bg-emerald-50 font-semibold text-emerald-800 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-200"
                )}
              >
                <CheckCircle2 className="mb-1 size-4 text-emerald-600" />
                <span>Hadir</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="NOT_ATTENDING"
                className={cn(
                  "flex h-auto flex-col items-center justify-center p-2.5 text-xs",
                  attendance === "NOT_ATTENDING" &&
                    "border-rose-600 bg-rose-50 font-semibold text-rose-800 shadow-xs dark:bg-rose-950/40 dark:text-rose-200"
                )}
              >
                <XCircle className="mb-1 size-4 text-rose-600" />
                <span>Tidak Hadir</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="UNCERTAIN"
                className={cn(
                  "flex h-auto flex-col items-center justify-center p-2.5 text-xs",
                  attendance === "UNCERTAIN" &&
                    "border-amber-600 bg-amber-50 font-semibold text-amber-800 shadow-xs dark:bg-amber-950/40 dark:text-amber-200"
                )}
              >
                <HelpCircle className="mb-1 size-4 text-amber-600" />
                <span>Masih Ragu</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {attendance === "ATTENDING" ? (
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold text-xs">Jumlah Tamu</Label>
              <Select
                value={String(guestCount)}
                onValueChange={(val) => {
                  if (val) setGuestCount(Number(val));
                }}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Pilih jumlah orang">
                    {`${guestCount} Orang`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PAX_OPTIONS.map((num) => (
                    <SelectItem key={num} value={num}>
                      {num} Orang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rsvp-msg" className="font-semibold text-xs">
              Untaian Doa & Ucapan Selamat
            </Label>
            <Textarea
              id="rsvp-msg"
              rows={3}
              placeholder="Tuliskan ucapan selamat dan doa restu..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="h-10 w-full gap-2 font-semibold shadow-xs"
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

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            <h4 className="font-bold text-foreground text-sm">
              Dinding Doa & Ucapan
            </h4>
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
              <EmptyTitle className="font-medium text-foreground text-xs">
                Belum ada ucapan
              </EmptyTitle>
              <EmptyDescription className="text-[11px] text-muted-foreground">
                Jadilah yang pertama memberikan doa restu!
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto pr-1">
            {wishes.map((item) => (
              <Card
                key={item.id}
                className="gap-1.5 p-3.5 text-left shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground text-xs">
                      {item.guestName}
                    </span>
                    <Badge
                      variant={
                        item.attendance === "ATTENDING"
                          ? "default"
                          : item.attendance === "NOT_ATTENDING"
                            ? "destructive"
                            : "secondary"
                      }
                      className={cn(
                        "h-4 px-1.5 py-0 text-[9px]",
                        item.attendance === "ATTENDING" &&
                          "bg-emerald-600 text-white"
                      )}
                    >
                      {item.attendance === "ATTENDING"
                        ? `Hadir (${item.guestCount})`
                        : item.attendance === "NOT_ATTENDING"
                          ? "Tidak Hadir"
                          : "Ragu"}
                    </Badge>
                  </div>

                  <span className="text-[10px] text-muted-foreground">
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>

                {item.message ? (
                  <p className="mt-0.5 whitespace-pre-line text-muted-foreground text-xs leading-relaxed">
                    {item.message}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
