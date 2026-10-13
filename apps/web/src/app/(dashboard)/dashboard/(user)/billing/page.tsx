"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  Coins,
  CreditCard,
  Crown,
  Loader2,
  Plus,
  QrCode,
  Receipt,
  Sparkles,
  Store,
  Upload,
  Zap,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent } from "@senara/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";
import { cn } from "@senara/ui/lib/utils";

import type { ActiveInvoiceData } from "@/components/billing/payment-method-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency, formatDate } from "@/lib/format";
import { trpc } from "@/utils/trpc";

const PricingModal = dynamic(
  () => import("@/components/billing/pricing-modal").then((m) => m.PricingModal),
  { ssr: false }
);

const ADDON_LABELS: Record<string, string> = {
  STATS: "Statistik Tamu",
  PRIVATE_MODE: "Mode Privat",
};

export default function BillingPage() {
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>("");
  const [initialInvoice, setInitialInvoice] =
    useState<ActiveInvoiceData | null>(null);

  const { data: access } = useQuery(trpc.admin.checkAccess.queryOptions());
  const isReseller = access?.isReseller ?? false;

  const { data: invitations, isLoading: isLoadingInvitations } = useQuery(
    trpc.invitation.getMyInvitations.queryOptions()
  );

  const { data: orders, isLoading: isLoadingOrders } = useQuery(
    trpc.order.getMyOrders.queryOptions()
  );

  const invitationList = invitations ?? [];
  const orderList = orders ?? [];

  const selectedInvitation = invitationList.find(
    (i) => i.id === selectedInvitationId
  );

  const handleOpenUpgrade = (
    invId?: string,
    invoiceToResume?: ActiveInvoiceData | null
  ) => {
    setSelectedInvitationId(invId || invitationList[0]?.id || "");
    setInitialInvoice(invoiceToResume ?? null);
    setPricingModalOpen(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 min-w-0">
      <PageHeader
        backHref={"/dashboard" as Route}
        backLabel="Kembali ke Dashboard"
        title={
          isReseller
            ? "Riwayat Transaksi & Saldo Kredit Reseller"
            : "Paket Terbit, Add-On & Riwayat Tagihan"
        }
        description={
          isReseller
            ? "Pantau riwayat invoice top-up saldo kredit reseller, status konfirmasi pembayaran QRIS / Transfer Bank, dan kelola saldo akun mitra Anda."
            : "Kelola publikasi undangan (Rp 29.000), tambahan fitur Add-On hemat, kode promo, serta bukti pembayaran QRIS / Transfer Bank."
        }
        actions={
          isReseller ? (
            <Button
              render={<Link href={"/dashboard/reseller" as Route} />}
              className="gap-2 text-xs font-semibold shadow-xs"
            >
              <Coins className="size-3.5 text-amber-300" />
              <span>Top-Up Kredit Reseller</span>
            </Button>
          ) : (
            <Button
              onClick={() => handleOpenUpgrade()}
              className="gap-2 text-xs font-semibold shadow-xs"
            >
              <Crown className="size-3.5 text-amber-300" />
              <span>Terbitkan / Tambah Add-On</span>
            </Button>
          )
        }
      />

      {isReseller ? (
        <Card className="overflow-hidden border-2 border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent shadow-xs">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-600 p-3 text-white shadow-md">
                <Sparkles className="size-6 text-amber-300" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-foreground text-lg">
                    Paket Mitra Reseller: Semua Add-On Otomatis Aktif
                  </h3>
                  <Badge className="bg-emerald-600 font-bold text-[10px] text-white">
                    {access?.creditBalance ?? 0} Kredit Aktif
                  </Badge>
                </div>
                <p className="mt-1 max-w-2xl text-muted-foreground text-xs leading-relaxed">
                  Sebagai mitra reseller, setiap undangan yang dibuat menggunakan kredit otomatis{" "}
                  <strong>Terbit Premium</strong> dan seluruh fitur Add-On (
                  <strong>Statistik Tamu</strong> & <strong>Mode Privat</strong>) langsung aktif tanpa perlu membayar biaya tambahan per acara.
                </p>
              </div>
            </div>

            <Button
              render={<Link href={"/dashboard/reseller" as Route} />}
              size="sm"
              className="shrink-0 gap-1.5 font-semibold text-xs"
            >
              <Store className="size-3.5" />
              <span>Buka Workspace Reseller</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-xs">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary p-3 text-primary-foreground shadow-md">
                <Crown className="size-6 text-amber-300" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-foreground text-lg">
                    Terbit Per Undangan + 2 Add-On Unggulan
                  </h3>
                  <Badge className="bg-amber-500 font-bold text-[10px] text-white">
                    Mulai {formatCurrency(29000)}
                  </Badge>
                </div>
                <p className="mt-1 max-w-xl text-muted-foreground text-xs leading-relaxed">
                  Sekali bayar per acara tanpa langganan bulanan. Tambahkan{" "}
                  <strong>Statistik Tamu (Rp 5.000)</strong> atau{" "}
                  <strong>Mode Privat (Rp 15.000)</strong> kapan saja sesuai
                  kebutuhan.
                </p>
              </div>
            </div>

            <Button
              onClick={() => handleOpenUpgrade()}
              size="sm"
              className="shrink-0 gap-1.5 font-semibold text-xs"
            >
              <Zap className="size-3.5" />
              <span>Pilih Undangan & Add-On</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status Paket & Add-On per Undangan (Khusus Pengguna Biasa) */}
      {!isReseller ? (
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 font-bold text-base text-foreground">
            <CreditCard className="size-4 text-primary" />
            <span>Status Paket & Add-On Undangan Anda</span>
          </h3>

        {isLoadingInvitations ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : invitationList.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Belum ada undangan yang dibuat"
            description="Buat draf undangan pertama Anda untuk melihat status paket dan Add-On."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {invitationList.map((inv) => {
              const isPremium = inv.packageTier === "PREMIUM";
              const addons = inv.enabledAddons ?? [];

              return (
                <div
                  key={inv.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-4 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm">
                        {inv.title}
                      </span>
                      <span className="mt-0.5 text-[11px] text-muted-foreground">
                        Template: {inv.template?.name || "Kustom"} • /{inv.slug}
                      </span>
                    </div>
                    <Badge
                      variant={isPremium ? "default" : "outline"}
                      className="text-[10px]"
                    >
                      {isPremium ? "✨ Terbit Premium" : "Draf Gratis"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2.5">
                    <div className="flex flex-wrap items-center gap-1">
                      {addons.length === 0 ? (
                        <span className="text-[11px] text-muted-foreground">
                          Belum ada Add-On tambahan
                        </span>
                      ) : (
                        addons.map((addonKey) => (
                          <Badge
                            key={addonKey}
                            variant="secondary"
                            className="gap-1 text-[10px]"
                          >
                            <Sparkles className="size-2.5 text-primary" />
                            <span>{ADDON_LABELS[addonKey] || addonKey}</span>
                          </Badge>
                        ))
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleOpenUpgrade(inv.id, null)}
                      className="gap-1 border-primary/30 text-[11px] text-primary hover:bg-primary/10"
                    >
                      {isPremium ? (
                        <>
                          <Plus className="size-3" />
                          <span>Beli Add-On</span>
                        </>
                      ) : (
                        <>
                          <Crown className="size-3 text-amber-500" />
                          <span>Terbitkan</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      ) : null}

      {/* Tabel Riwayat Transaksi */}
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="flex items-center gap-2 font-bold text-base text-foreground">
            <Receipt className="size-4 text-primary" />
            <span>Riwayat Transaksi & Bukti Pembayaran</span>
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            {orderList.length} Transaksi
          </Badge>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
          {isLoadingOrders ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : orderList.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Belum ada riwayat transaksi pembayaran"
              description="Ketika Anda menerbitkan undangan atau membeli Add-On, invoice akan tercatat di sini."
              className="border-none"
            />
          ) : (
            <div className="w-full min-w-0 overflow-x-auto">
              <Table className="w-full min-w-[640px]">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="pl-5 text-[10px] uppercase tracking-wider">
                    No. Invoice
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">
                    Paket & Add-On
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">
                    Total Bayar
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">
                    Status & Metode
                  </TableHead>
                  <TableHead className="pr-5 text-right text-[10px] uppercase tracking-wider">
                    Tindakan
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((order) => {
                  const isManual =
                    order.payment?.gateway === "MANUAL_TRANSFER";
                  return (
                    <TableRow
                      key={order.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <TableCell className="pl-5">
                        <p className="font-mono font-semibold text-xs text-foreground">
                          {order.orderNumber}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {order.tier}
                          </Badge>
                          {order.addons.map((addon) => (
                            <Badge
                              key={addon}
                              variant="outline"
                              className="text-[10px]"
                            >
                              {ADDON_LABELS[addon] || addon}
                            </Badge>
                          ))}
                        </div>
                        {order.couponCode ? (
                          <p className="mt-0.5 text-[10px] text-emerald-600">
                            Kupon {order.couponCode} (-
                            {formatCurrency(order.discountAmount)})
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">
                        {formatCurrency(order.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          <Badge
                            variant={
                              order.status === "PAID" ? "default" : "secondary"
                            }
                            className={cn(
                              "text-[10px]",
                              order.status === "PAID"
                                ? "bg-emerald-600 text-white"
                                : "bg-amber-500/15 text-amber-700"
                            )}
                          >
                            {order.status === "PAID"
                              ? "Lunas"
                              : order.payment?.proofImageUrl
                                ? "Menunggu Verifikasi Admin"
                                : "Menunggu Pembayaran"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {isManual ? "Transfer Bank Manual" : "QRIS Instan"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        {order.status === "PENDING" ? (
                          <Button
                            size="xs"
                            variant="outline"
                            className="gap-1 text-xs"
                            onClick={() =>
                              handleOpenUpgrade(
                                order.invitationId ||
                                  invitationList[0]?.id ||
                                  "",
                                {
                                  orderId: order.id,
                                  orderNumber: order.orderNumber,
                                  amount: order.amount,
                                  paymentMethod: isManual
                                    ? "MANUAL_TRANSFER"
                                    : "QRIS",
                                  proofImageUrl: order.payment?.proofImageUrl,
                                }
                              )
                            }
                          >
                            {isManual ? (
                              <>
                                <Upload className="size-3" />
                                <span>Upload Bukti</span>
                              </>
                            ) : (
                              <>
                                <QrCode className="size-3" />
                                <span>Bayar / Cek QRIS</span>
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            Selesai
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        </div>
      </div>

      {pricingModalOpen ? (
        <PricingModal
          open={pricingModalOpen}
          onOpenChange={setPricingModalOpen}
          invitationId={selectedInvitationId}
          invitationTitle={selectedInvitation?.title || "Undangan Pilihan"}
          isAlreadyPremium={selectedInvitation?.packageTier === "PREMIUM"}
          enabledAddons={selectedInvitation?.enabledAddons ?? []}
          initialInvoice={initialInvoice}
        />
      ) : null}
    </div>
  );
}
