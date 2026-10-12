"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Crown,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";

import { trpc } from "@/utils/trpc";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: string;
  invitationTitle?: string;
}

export function PricingModal({
  open,
  onOpenChange,
  invitationId,
  invitationTitle,
}: PricingModalProps) {
  const queryClient = useQueryClient();

  // Mutasi Buat Order Pembayaran
  const createOrderMutation = useMutation(
    trpc.order.createOrder.mutationOptions({
      onSuccess: (data) => {
        toast.success("Invoice pembayaran berhasil dibuat!");

        // Jika Snap JS terpasang di window
        if (typeof window !== "undefined" && window.snap) {
          window.snap.pay(data.snapToken, {
            onSuccess: () => {
              toast.success("Pembayaran berhasil! Undangan Anda resmi Premium.");
              queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
              onOpenChange(false);
            },
            onPending: () => {
              toast.info("Menunggu penyelesaian pembayaran Anda.");
            },
            onError: () => {
              toast.error("Terjadi kendala saat pembayaran.");
            },
          });
        } else {
          // Buka link pembayaran Snap / gateway
          window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
          onOpenChange(false);
        }
      },
      onError: (err) => {
        toast.error(err.message || "Gagal membuat invoice.");
      },
    })
  );

  const handleUpgrade = () => {
    createOrderMutation.mutate({
      invitationId,
      tier: "PREMIUM",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-500">
              <Crown className="size-5" />
            </div>
            <div>
              <DialogTitle>Tingkatkan ke Paket Premium</DialogTitle>
              <DialogDescription className="text-xs">
                Nikmati kebebasan tanpa batas untuk undangan{" "}
                <strong>"{invitationTitle || "Undangan Anda"}"</strong>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Matriks Perbandingan Paket Gratis vs Premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* 1. Paket Gratis */}
          <div className="flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-2xs">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-foreground">Paket Gratis</span>
                <Badge variant="outline" className="text-[10px]">
                  Bawaan
                </Badge>
              </div>

              <div>
                <p className="font-bold text-2xl text-foreground">Rp 0</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Selamanya tanpa biaya</p>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>3 Pilihan Template Vintage</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Maksimal 20 Tamu Terdaftar</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Masa Draf 14 Hari</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-3.5 text-muted-foreground/40 shrink-0 text-center font-bold">
                    ✕
                  </span>
                  <span className="line-through text-muted-foreground/60">Tanpa Watermark</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-3.5 text-muted-foreground/40 shrink-0 text-center font-bold">
                    ✕
                  </span>
                  <span className="line-through text-muted-foreground/60">
                    Musik & Amplop Digital Penuh
                  </span>
                </div>
              </div>
            </div>

            <Button variant="outline" disabled className="w-full text-xs mt-6">
              Paket Saat Ini
            </Button>
          </div>

          {/* 2. Paket Premium (Unggulan) */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-primary bg-primary/5 p-5 shadow-md">
            <div className="absolute -top-3 right-4">
              <Badge className="bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-wider px-2.5 shadow-sm">
                Rekomendasi
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-primary flex items-center gap-1.5">
                  <Crown className="size-4" />
                  <span>Senara Premium</span>
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <p className="font-bold text-3xl text-foreground">Rp 49.000</p>
                  <span className="text-xs text-muted-foreground">/ acara</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Sekali bayar, aktif selamanya
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Akses Semua Template Premium Eksklusif</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Tamu & Pesan RSVP Tanpa Batas</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Aktif Selamanya (Tanpa Kedaluwarsa)</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Bebas Watermark Senara</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Musik Autoplay & Amplop QRIS Penuh</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Kustomisasi Slot "Isian Kamu" Lengkap</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              disabled={createOrderMutation.isPending}
              className="w-full gap-2 text-xs font-semibold mt-6 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground h-10"
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Menyiapkan Invoice...</span>
                </>
              ) : (
                <>
                  <Zap className="size-4" />
                  <span>Upgrade Sekarang (Rp 49.000)</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Jaminan Keamanan Pembayaran */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted-foreground text-center">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>Pembayaran aman instan via QRIS, GoPay, ShopeePay, & Virtual Account Bank.</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

