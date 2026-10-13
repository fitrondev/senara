"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  QrCode,
  RefreshCw,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";

import { formatCurrency } from "@/lib/format";
import { queryClient, trpc } from "@/utils/trpc";

const MANUAL_BANKS = [
  {
    bank: "BCA",
    accountNo: "8720194821",
    accountName: "PT Senara Digital Kreatif",
  },
  {
    bank: "Mandiri",
    accountNo: "1370029184712",
    accountName: "PT Senara Digital Kreatif",
  },
] as const;

export interface ActiveInvoiceData {
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentMethod: "QRIS" | "MANUAL_TRANSFER";
  proofImageUrl?: string | null;
}

interface PaymentMethodPanelProps {
  invoice: ActiveInvoiceData;
  invitationId: string;
  onSuccessPaid: () => void;
}

export function PaymentMethodPanel({
  invoice,
  invitationId,
  onSuccessPaid,
}: PaymentMethodPanelProps) {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState(invoice.proofImageUrl ?? "");
  const [senderNote, setSenderNote] = useState("");

  const checkStatusMutation = useMutation(
    trpc.order.checkPaymentStatus.mutationOptions({
      onSuccess: (res) => {
        if (res.status === "PAID") {
          toast.success(res.message);
          queryClient.invalidateQueries(
            trpc.invitation.getMyInvitations.queryOptions()
          );
          queryClient.invalidateQueries(
            trpc.invitation.getById.queryFilter({ id: invitationId })
          );
          queryClient.invalidateQueries(trpc.order.getMyOrders.queryOptions());
          onSuccessPaid();
        } else {
          toast.info(res.message);
        }
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memeriksa status pembayaran.");
      },
    })
  );

  const uploadProofMutation = useMutation(
    trpc.order.uploadPaymentProof.mutationOptions({
      onSuccess: () => {
        toast.success(
          "Bukti transfer berhasil dikirim! Super Admin akan segera memverifikasi pesanan Anda."
        );
        queryClient.invalidateQueries(trpc.order.getMyOrders.queryOptions());
        onSuccessPaid();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengunggah bukti transfer.");
      },
    })
  );

  const handleCopyAccount = async (accNo: string, bank: string) => {
    await navigator.clipboard.writeText(accNo);
    setCopiedBank(bank);
    toast.success(`Nomor rekening ${bank} berhasil disalin!`);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProofUrl(reader.result);
        toast.success("Foto bukti transfer siap dikirim.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadQris = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#18181b";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("QRIS SENARA INVITATION", 240, 50);

    ctx.font = "15px monospace";
    ctx.fillStyle = "#52525b";
    ctx.fillText(invoice.orderNumber, 240, 80);

    // Gambar pola kotak QR simulasi
    ctx.fillStyle = "#18181b";
    const startX = 110;
    const startY = 110;
    const size = 260;
    ctx.strokeRect(startX, startY, size, size);
    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        if ((r * 7 + c * 11) % 3 === 0 || (r < 3 && c < 3) || (r < 3 && c > 9) || (r > 9 && c < 3)) {
          ctx.fillRect(startX + 10 + c * 18.5, startY + 10 + r * 18.5, 15, 15);
        }
      }
    }

    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#16a34a";
    ctx.fillText(formatCurrency(invoice.amount), 240, 425);

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#71717a";
    ctx.fillText("Pindai melalui m-Banking / GoPay / OVO / DANA / ShopeePay", 240, 465);

    const link = document.createElement("a");
    link.download = `QRIS-${invoice.orderNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Gambar kode QRIS berhasil diunduh!");
  };

  return (
    <div className="space-y-4 rounded-2xl border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div>
          <p className="text-muted-foreground text-[11px]">Nomor Invoice</p>
          <p className="font-mono font-bold text-sm text-foreground">
            {invoice.orderNumber}
          </p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-[11px]">Total Tagihan</p>
          <p className="font-bold text-lg text-primary">
            {formatCurrency(invoice.amount)}
          </p>
        </div>
      </div>

      {invoice.paymentMethod === "QRIS" ? (
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <Badge variant="outline" className="gap-1 text-[10px]">
            <QrCode className="size-3 text-primary" />
            <span>QRIS Instan Nasional (Otomatis Aktif)</span>
          </Badge>

          {/* Visual Kode QRIS */}
          <div className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 text-zinc-900 shadow-sm">
            <span className="font-bold text-[11px] tracking-wider uppercase">
              PT Senara Digital Kreatif • NMID ID2026091827
            </span>
            <div className="grid size-44 grid-cols-9 gap-1 rounded-lg border p-2.5">
              {Array.from({ length: 81 }).map((_, idx) => {
                const row = Math.floor(idx / 9);
                const col = idx % 9;
                const isCorner =
                  (row < 3 && col < 3) ||
                  (row < 3 && col > 5) ||
                  (row > 5 && col < 3);
                const filled = isCorner || (idx * 17 + row * 3) % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={
                      filled ? "rounded-[2px] bg-zinc-900" : "bg-transparent"
                    }
                  />
                );
              })}
            </div>
            <span className="font-semibold text-emerald-700 text-xs">
              Nominal: {formatCurrency(invoice.amount)}
            </span>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-1.5 text-xs"
              onClick={handleDownloadQris}
            >
              <Download className="size-3.5" />
              <span>Download QRIS</span>
            </Button>
            <Button
              type="button"
              className="flex-1 gap-1.5 bg-emerald-600 text-white text-xs hover:bg-emerald-700"
              disabled={checkStatusMutation.isPending}
              onClick={() =>
                checkStatusMutation.mutate({
                  orderId: invoice.orderId,
                  simulateSettlement: true,
                })
              }
            >
              {checkStatusMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              <span>Cek Status Pembayaran</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Badge variant="outline" className="gap-1 text-[10px]">
            <Building2 className="size-3 text-primary" />
            <span>Transfer Bank Manual & Upload Bukti</span>
          </Badge>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MANUAL_BANKS.map((item) => (
              <div
                key={item.bank}
                className="flex items-center justify-between rounded-xl border bg-background p-3"
              >
                <div>
                  <p className="font-bold text-xs text-primary">{item.bank}</p>
                  <p className="font-mono font-semibold text-sm text-foreground">
                    {item.accountNo}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    a.n. {item.accountName}
                  </p>
                </div>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="gap-1 text-[11px]"
                  onClick={() => handleCopyAccount(item.accountNo, item.bank)}
                >
                  {copiedBank === item.bank ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  <span>Salin</span>
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-xl border bg-background p-3">
            <Label className="text-xs font-semibold">
              Unggah Foto / Tautan Bukti Transfer
            </Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs"
              />
              <Input
                placeholder="Atau tempel URL bukti transfer (https://...)"
                value={proofUrl.startsWith("data:") ? "" : proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                className="text-xs"
              />
            </div>
            <Input
              placeholder="Catatan pengirim (Contoh: Transfer dari BCA a.n. Budi Santoso)"
              value={senderNote}
              onChange={(e) => setSenderNote(e.target.value)}
              className="text-xs"
            />

            {proofUrl ? (
              <div className="flex items-center gap-2 rounded-lg border bg-emerald-500/10 p-2 text-emerald-700 text-xs">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="truncate">
                  Bukti transfer siap dikirim untuk verifikasi Super Admin.
                </span>
              </div>
            ) : null}

            <Button
              type="button"
              className="w-full gap-1.5 text-xs"
              disabled={!proofUrl.trim() || uploadProofMutation.isPending}
              onClick={() =>
                uploadProofMutation.mutate({
                  orderId: invoice.orderId,
                  proofImageUrl: proofUrl.trim(),
                  senderNote: senderNote.trim() || undefined,
                })
              }
            >
              {uploadProofMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              <span>Kirim Bukti Transfer ke Super Admin</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

