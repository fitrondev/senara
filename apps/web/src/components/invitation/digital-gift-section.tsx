"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  CreditCard,
  Gift,
  QrCode,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { cn } from "@senara/ui/lib/utils";

import type { ThemeConfig } from "@/components/editor/theme-modal";

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  qrisImageUrl?: string | null;
}

interface DigitalGiftSectionProps {
  bankAccounts: BankAccountItem[];
  shippingAddress?: string | null;
  recipientName?: string | null;
  themeConfig: ThemeConfig;
}

export function DigitalGiftSection({
  bankAccounts,
  shippingAddress,
  recipientName,
  themeConfig,
}: DigitalGiftSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [qrisModalItem, setQrisModalItem] = useState<BankAccountItem | null>(null);

  const handleCopyAccount = (item: BankAccountItem) => {
    navigator.clipboard.writeText(item.accountNo);
    setCopiedId(item.id);
    toast.success(`Nomor rekening ${item.bankName} berhasil disalin!`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    toast.success("Alamat pengiriman kado berhasil disalin!");
    setTimeout(() => {
      setCopiedAddress(false);
    }, 2500);
  };

  if ((!bankAccounts || bankAccounts.length === 0) && !shippingAddress) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6 bg-muted/20 border-t">
        {/* Header Bagian */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-wider text-primary border-primary/30"
          >
            Tanda Kasih
          </Badge>
          <h3
            className="font-bold text-2xl tracking-tight text-foreground"
            style={{ fontFamily: themeConfig.typography.headingFont }}
          >
            Amplop Digital
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Doa restu Anda merupakan karunia terindah bagi kami. Bagi Bapak/Ibu/Saudara/i yang ingin
            memberikan tanda kasih, dapat melalui transfer atau QRIS di bawah ini:
          </p>
        </div>

        {/* Kartu-Kartu Rekening Bank & Dompet Digital */}
        <div className="flex flex-col gap-3">
          {bankAccounts.map((account) => {
            const isCopied = copiedId === account.id;

            return (
              <Card
                key={account.id}
                className="gap-3 p-4 text-left shadow-xs transition-shadow hover:shadow-md"
              >
                {/* Atas: Nama Bank & Tombol QRIS jika ada */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <CreditCard className="size-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm tracking-wide text-foreground">
                        {account.bankName}
                      </span>
                    </div>
                  </div>

                  {account.qrisImageUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQrisModalItem(account)}
                      className="h-7 gap-1 px-2.5 text-[11px] font-semibold"
                    >
                      <QrCode className="size-3 text-primary" />
                      <span>QRIS</span>
                    </Button>
                  )}
                </div>

                {/* Tengah: Nomor Rekening & Nama Pemilik */}
                <div className="rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Nomor Rekening
                      </p>
                      <p className="font-mono font-bold text-base sm:text-lg text-foreground tracking-wider">
                        {account.accountNo}
                      </p>
                    </div>

                    {/* Tombol Salin 1-Klik */}
                    <Button
                      size="sm"
                      variant={isCopied ? "default" : "outline"}
                      onClick={() => handleCopyAccount(account)}
                      className={cn(
                        "h-8 gap-1.5 px-3 text-xs font-semibold transition-all",
                        isCopied && "bg-emerald-600 hover:bg-emerald-700 text-white"
                      )}
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Salin No.</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    a.n <strong className="text-foreground">{account.accountName}</strong>
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bagian Alamat Pengiriman Kado Fisik (Jika Tersedia) */}
        {shippingAddress && (
          <Card className="gap-3 p-4 text-left shadow-xs">
            <div className="flex items-center gap-2 border-b pb-2.5">
              <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                <Gift className="size-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-foreground">Kirim Kado Fisik</h4>
                <p className="text-[10px] text-muted-foreground">Alamat penerima kado pernikahan</p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">
              {recipientName && (
                <p className="font-semibold text-foreground mb-1">
                  Penerima: {recipientName}
                </p>
              )}
              <p className="leading-relaxed text-[11px]">{shippingAddress}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyAddress(shippingAddress)}
              className="w-full gap-1.5 text-xs font-semibold h-8"
            >
              {copiedAddress ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span>Alamat Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Salin Alamat Lengkap</span>
                </>
              )}
            </Button>
          </Card>
        )}
      </div>

      {/* Modal Tampilan QRIS */}
      <Dialog
        open={!!qrisModalItem}
        onOpenChange={(open) => {
          if (!open) setQrisModalItem(null);
        }}
      >
        <DialogContent className="sm:max-w-xs text-center">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-base">
              QRIS {qrisModalItem?.bankName}
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              Pindai kode QRIS menggunakan GoPay, OVO, ShopeePay, BCA, atau perbankan digital Anda.
            </DialogDescription>
          </DialogHeader>

          {qrisModalItem?.qrisImageUrl ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative aspect-square w-56 overflow-hidden rounded-2xl border-2 border-primary/20 bg-white p-2 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrisModalItem.qrisImageUrl}
                  alt={`QRIS ${qrisModalItem.bankName}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-xs font-semibold text-foreground">
                a.n {qrisModalItem.accountName}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

