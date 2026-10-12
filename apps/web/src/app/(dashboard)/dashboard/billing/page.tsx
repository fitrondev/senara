"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  ExternalLink,
  Loader2,
  Receipt,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@senara/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@senara/ui/components/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";
import { cn } from "@senara/ui/lib/utils";

import { PricingModal } from "@/components/billing/pricing-modal";
import { trpc } from "@/utils/trpc";

export default function BillingPage() {
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>("");

  // Ambil Data Undangan Pengguna untuk memilih mana yang ingin di-upgrade
  const { data: invitations, isLoading: isLoadingInvitations } = useQuery(
    trpc.invitation.getMyInvitations.queryOptions()
  );

  // Ambil Riwayat Pesanan Pengguna
  const { data: orders, isLoading: isLoadingOrders } = useQuery(
    trpc.order.getMyOrders.queryOptions()
  );

  const invitationList = invitations ?? [];
  const orderList = orders ?? [];

  const handleOpenUpgrade = (invId?: string) => {
    setSelectedInvitationId(invId || invitationList[0]?.id || "");
    setPricingModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 max-w-5xl mx-auto w-full">
      {/* 1. Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={"/dashboard" as Route} className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tagihan & Paket</span>
          </div>
          <h1 className="font-bold text-2xl tracking-tight text-foreground">
            Paket Langganan & Riwayat Tagihan
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola paket fitur premium undangan Anda dan lihat arsip invoice pembayaran.
          </p>
        </div>

        <Button
          onClick={() => handleOpenUpgrade()}
          className="gap-2 text-xs font-semibold shadow-xs"
        >
          <Crown className="size-3.5 text-amber-300" />
          <span>Upgrade Undangan ke Premium</span>
        </Button>
      </div>

      {/* 2. Banner Sorotan Paket Premium */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-xs overflow-hidden">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary p-3 text-primary-foreground shadow-md">
              <Crown className="size-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-foreground">Senara Premium Access</h3>
                <Badge className="bg-amber-500 text-white text-[10px] font-bold">Rp 49.000</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                Sekali bayar per acara. Tanpa batas masa draf, akses semua template romantis,
                distribusi tamu dan RSVP tanpa batas, bebas watermark, serta dukungan audio autoplay
                penuh.
              </p>
            </div>
          </div>

          <Button
            onClick={() => handleOpenUpgrade()}
            size="sm"
            className="shrink-0 gap-1.5 text-xs font-semibold"
          >
            <Zap className="size-3.5" />
            <span>Pilih Undangan untuk Upgrade</span>
          </Button>
        </CardContent>
      </Card>

      {/* 3. Daftar Undangan & Status Paketnya */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <CreditCard className="size-4 text-primary" />
          <span>Status Paket Undangan Anda</span>
        </h3>

        {isLoadingInvitations ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : invitationList.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-xs text-muted-foreground">
            Belum ada undangan yang dibuat.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {invitationList.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-2xs"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{inv.title}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Template: {inv.template?.name || "Kustom"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    Gratis
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenUpgrade(inv.id)}
                    className="h-7 text-[11px] gap-1 text-primary border-primary/30 hover:bg-primary/10"
                  >
                    <Crown className="size-3 text-amber-500" />
                    <span>Upgrade</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Tabel Riwayat Transaksi & Pembayaran */}
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Receipt className="size-4 text-primary" />
            <span>Riwayat Transaksi</span>
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            {orderList.length} Transaksi
          </Badge>
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden shadow-xs">
          {isLoadingOrders ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : orderList.length === 0 ? (
            <Empty className="p-8">
              <EmptyHeader>
                <EmptyTitle className="text-xs font-medium text-foreground">
                  Belum ada riwayat transaksi pembayaran
                </EmptyTitle>
                <EmptyDescription className="text-[11px] text-muted-foreground">
                  Ketika Anda melakukan upgrade ke paket Premium, catatan pesanan akan tampil di sini.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="pl-5 text-[10px] uppercase tracking-wider">No. Pesanan</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Paket</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Jumlah</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="pr-5 text-right text-[10px] uppercase tracking-wider">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((order) => {
                  const dateFormatted = new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(order.createdAt));

                  return (
                    <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-5 font-mono font-semibold text-foreground">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {order.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-foreground">
                        Rp {Number(order.amount).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={order.status === "PAID" ? "default" : "secondary"}
                          className={cn(
                            "text-[10px]",
                            order.status === "PAID"
                              ? "bg-emerald-600 text-white"
                              : "text-amber-700 bg-amber-500/10"
                          )}
                        >
                          {order.status === "PAID" ? "Lunas" : "Menunggu"}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-5 text-right text-muted-foreground">
                        {dateFormatted}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Modal Dialog Upgrade Paket */}
      <PricingModal
        open={pricingModalOpen}
        onOpenChange={setPricingModalOpen}
        invitationId={selectedInvitationId}
        invitationTitle={
          invitationList.find((i) => i.id === selectedInvitationId)?.title || "Undangan Pilihan"
        }
      />
    </div>
  );
}

