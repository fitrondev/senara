"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Check,
  Crown,
  Loader2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Tag,
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
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";

import { ADDON_ITEMS } from "@/components/marketing/pricing-comparison-data";
import { formatCurrency } from "@/lib/format";
import { trpc } from "@/utils/trpc";

import {
  type ActiveInvoiceData,
  PaymentMethodPanel,
} from "./payment-method-panel";

type AddonId = "STATS" | "PRIVATE_MODE";

export interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: string;
  invitationTitle?: string;
  isAlreadyPremium?: boolean;
  enabledAddons?: string[];
  initialInvoice?: ActiveInvoiceData | null;
}

const BASE_PUBLISH_PRICE = 29000;

export function PricingModal({
  open,
  onOpenChange,
  invitationId,
  invitationTitle,
  isAlreadyPremium = false,
  enabledAddons = [],
  initialInvoice = null,
}: PricingModalProps) {
  const queryClient = useQueryClient();

  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string;
    discountAmount: number;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "QRIS" | "MANUAL_TRANSFER"
  >("QRIS");
  const [activeInvoice, setActiveInvoice] =
    useState<ActiveInvoiceData | null>(initialInvoice);

  useEffect(() => {
    setActiveInvoice(initialInvoice);
  }, [initialInvoice, open]);

  const includeBasePublish = !isAlreadyPremium;

  const subtotal = useMemo(() => {
    const base = includeBasePublish ? BASE_PUBLISH_PRICE : 0;
    const addonSum = selectedAddons.reduce((acc, addonId) => {
      const found = ADDON_ITEMS.find((a) => a.id === addonId);
      return acc + (found?.price ?? 0);
    }, 0);
    return base + addonSum;
  }, [includeBasePublish, selectedAddons]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.min(subtotal, appliedCoupon.discountAmount);
  }, [appliedCoupon, subtotal]);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const toggleAddon = (id: AddonId) => {
    if (enabledAddons.includes(id)) return;
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setAppliedCoupon(null);
  };

  const validateCouponMutation = useMutation(
    trpc.order.validateCoupon.mutationOptions({
      onSuccess: (res) => {
        setAppliedCoupon({
          code: res.code,
          description: res.description,
          discountAmount: res.discountAmount,
        });
        toast.success(
          `Kode promo ${res.code} aktif! Hemat ${formatCurrency(res.discountAmount)}`
        );
      },
      onError: (err) => {
        setAppliedCoupon(null);
        toast.error(err.message || "Kode promo tidak valid.");
      },
    })
  );

  const createOrderMutation = useMutation(
    trpc.order.createOrder.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.order.getMyOrders.queryOptions());
        if (data.status === "PAID") {
          toast.success("Undangan & Add-On Anda langsung aktif!");
          queryClient.invalidateQueries(
            trpc.invitation.getMyInvitations.queryOptions()
          );
          queryClient.invalidateQueries(
            trpc.invitation.getById.queryFilter({ id: invitationId })
          );
          onOpenChange(false);
          return;
        }

        toast.success(
          `Invoice ${data.orderNumber} dibuat! Silakan selesaikan pembayaran.`
        );
        setActiveInvoice({
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
        });
      },
      onError: (err) => {
        toast.error(err.message || "Gagal membuat invoice pembayaran.");
      },
    })
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Crown className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-serif text-lg">
                {activeInvoice
                  ? "Selesaikan Pembayaran Invoice"
                  : isAlreadyPremium
                    ? "Tambah Fitur Add-On Undangan"
                    : "Terbitkan Undangan & Pilih Add-On"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Undangan:{" "}
                <strong className="text-foreground">
                  {invitationTitle || "Undangan Pilihan"}
                </strong>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {activeInvoice ? (
          <div className="space-y-3">
            <PaymentMethodPanel
              invoice={activeInvoice}
              invitationId={invitationId}
              onSuccessPaid={() => {
                setActiveInvoice(null);
                onOpenChange(false);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => setActiveInvoice(null)}
            >
              ← Kembali ke Rincian Paket & Add-On
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 1. Paket Dasar Publikasi */}
            <div className="flex items-center justify-between rounded-xl border bg-primary/5 p-3.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    {isAlreadyPremium
                      ? "Paket Terbit Undangan (Sudah Aktif)"
                      : "Terbit Undangan Premium (Sekali Bayar)"}
                  </span>
                  <Badge variant="default" className="text-[10px]">
                    {isAlreadyPremium ? "Lunas" : "Wajib Terbit"}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Tamu tanpa batas, musik latar autoplay, amplop QRIS, & aktif
                  selamanya tanpa watermark.
                </p>
              </div>
              <span className="font-bold text-base text-primary">
                {isAlreadyPremium
                  ? "Rp 0"
                  : formatCurrency(BASE_PUBLISH_PRICE)}
              </span>
            </div>

            {/* 2. Pilihan Checklist 3 Add-On Unggulan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-xs font-semibold">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>Pilih Tambahan Fitur Add-On (Opsional)</span>
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Bisa dipilih sesuai kebutuhan
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {ADDON_ITEMS.map((addon) => {
                  const addonId = addon.id as AddonId;
                  const alreadyOwned = enabledAddons.includes(addonId);
                  const isChecked =
                    alreadyOwned || selectedAddons.includes(addonId);

                  return (
                    <button
                      key={addon.id}
                      type="button"
                      disabled={alreadyOwned}
                      onClick={() => toggleAddon(addonId)}
                      className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-left transition-all ${
                        alreadyOwned
                          ? "cursor-default border-emerald-500/30 bg-emerald-500/5 opacity-80"
                          : isChecked
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${
                            isChecked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40 bg-background"
                          }`}
                        >
                          {isChecked ? <Check className="size-3" /> : null}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-xs text-foreground">
                              {addon.name}
                            </span>
                            <Badge variant="secondary" className="text-[9px]">
                              {alreadyOwned ? "Sudah Aktif" : addon.badge}
                            </Badge>
                          </div>
                          <p className="text-[11px] leading-relaxed text-muted-foreground">
                            {addon.description}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 font-bold text-xs text-primary">
                        {alreadyOwned
                          ? "Aktif"
                          : `+ ${formatCurrency(addon.price)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Kode Promo & Metode Pembayaran */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs">
                  <Tag className="size-3 text-primary" />
                  <span>Kode Promo / Kupon Diskon</span>
                </Label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Contoh: HEMAT10 / SENARA15"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    className="text-xs uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs"
                    disabled={
                      !couponInput.trim() ||
                      subtotal === 0 ||
                      validateCouponMutation.isPending
                    }
                    onClick={() =>
                      validateCouponMutation.mutate({
                        code: couponInput.trim(),
                        subtotal,
                      })
                    }
                  >
                    {validateCouponMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      "Pakai"
                    )}
                  </Button>
                </div>
                {appliedCoupon ? (
                  <p className="text-[11px] font-medium text-emerald-600">
                    ✓ {appliedCoupon.description} (-
                    {formatCurrency(discountAmount)})
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Metode Pembayaran</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("QRIS")}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all ${
                      paymentMethod === "QRIS"
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <QrCode className="size-3.5" />
                    <span>QRIS Instan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("MANUAL_TRANSFER")}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all ${
                      paymentMethod === "MANUAL_TRANSFER"
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building2 className="size-3.5" />
                    <span>Transfer Bank</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Ringkasan Total & Tombol Buat Invoice */}
            <div className="space-y-2 rounded-xl border bg-muted/30 p-3.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal Paket & Add-On ({selectedAddons.length} dipilih)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 ? (
                <div className="flex justify-between font-medium text-emerald-600">
                  <span>Potongan Promo ({appliedCoupon?.code})</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between border-t pt-2 font-bold text-sm text-foreground">
                <span>Total Pembayaran</span>
                <span className="text-base text-primary">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() =>
                createOrderMutation.mutate({
                  invitationId,
                  tier: "PREMIUM",
                  includeBasePublish,
                  addons: selectedAddons,
                  couponCode: appliedCoupon?.code,
                  paymentMethod,
                })
              }
              disabled={subtotal === 0 || createOrderMutation.isPending}
              className="h-10 w-full gap-2 text-xs font-semibold"
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Menyiapkan Invoice...</span>
                </>
              ) : (
                <>
                  <Zap className="size-4" />
                  <span>
                    Lanjutkan Pembayaran {paymentMethod === "QRIS" ? "QRIS" : "Transfer"} (
                    {formatCurrency(finalTotal)})
                  </span>
                </>
              )}
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-1 text-center text-[11px] text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>
            Mendukung QRIS Instan (otomatis aktif) & Transfer Bank Manual (verifikasi Super Admin).
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
