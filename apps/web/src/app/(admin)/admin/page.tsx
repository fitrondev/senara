"use client";

import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Crown,
  FolderKanban,
  Loader2,
  Palette,
  Receipt,
  TicketPercent,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@senara/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency } from "@/lib/format";
import { trpc } from "@/utils/trpc";

const SUPERADMIN_QUICK_LINKS = [
  {
    href: "/admin/templates" as Route,
    title: "Master Template",
    description: "Tambah desain Pernikahan, Ultah & Khitanan",
    icon: Palette,
    iconBgClass: "bg-primary/10 text-primary",
  },
  {
    href: "/admin/coupons" as Route,
    title: "Kupon & Promo",
    description: "Atur kode voucher potongan harga (Super Admin)",
    icon: TicketPercent,
    iconBgClass: "bg-amber-500/10 text-amber-600",
  },
  {
    href: "/admin/users" as Route,
    title: "User & Kredit Reseller",
    description: "Kelola 4 role sistem & saldo kredit white-label",
    icon: Users,
    iconBgClass: "bg-blue-500/10 text-blue-600",
  },
] as const;

const OPERATIONAL_QUICK_LINKS = [
  {
    href: "/admin/orders" as Route,
    title: "Verifikasi Pembayaran",
    description: "Konfirmasi bukti transfer manual & aktivasi paket",
    icon: Receipt,
    iconBgClass: "bg-emerald-500/10 text-emerald-600",
  },
  {
    href: "/admin/templates" as Route,
    title: "Master Template",
    description: "Tambah desain Pernikahan, Ultah & Khitanan",
    icon: Palette,
    iconBgClass: "bg-primary/10 text-primary",
  },
  {
    href: "/admin/invitations" as Route,
    title: "Moderasi Undangan",
    description: "Pantau undangan publik & status paket pengguna",
    icon: FolderKanban,
    iconBgClass: "bg-blue-500/10 text-blue-600",
  },
] as const;

export default function AdminDashboardPage() {
  const { data: access } = useQuery(trpc.admin.checkAccess.queryOptions());
  const { data: metrics, isLoading } = useQuery(
    trpc.admin.getDashboardMetrics.queryOptions()
  );
  const quickLinks = access?.isSuperAdmin
    ? SUPERADMIN_QUICK_LINKS
    : OPERATIONAL_QUICK_LINKS;

  if (isLoading || !metrics) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-amber-500" />
        <p className="text-xs font-medium text-muted-foreground">
          Memuat metrik global platform Senara...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Ringkasan Eksekutif Platform"
        description="Pantau pertumbuhan pengguna, konversi undangan, katalog desain, dan arus transaksi secara real-time."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              render={<Link href={"/admin/templates" as Route} />}
              className="gap-1.5 text-xs"
            >
              <Palette className="size-3.5" />
              <span>Kelola Template</span>
            </Button>
            <Button
              size="sm"
              render={<Link href={"/admin/orders" as Route} />}
              className="gap-1.5 text-xs"
            >
              <Receipt className="size-3.5" />
              <span>Verifikasi Pesanan ({metrics.pendingOrdersCount})</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Pendapatan (Lunas)"
          value={formatCurrency(metrics.totalRevenue)}
          description={
            <>
              Bulan ini:{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(metrics.monthlyRevenue)}
              </span>{" "}
              ({metrics.paidOrdersCount} transaksi lunas)
            </>
          }
          icon={Wallet}
          iconClassName="bg-emerald-500/10 text-emerald-500"
        />

        <StatCard
          label="Total Undangan Dibuat"
          value={metrics.totalInvitations}
          description={
            <>
              <span className="font-semibold text-emerald-600">
                {metrics.publishedCount} Terbit
              </span>{" "}
              · {metrics.draftCount} Draf · Konversi {metrics.conversionRate}%
            </>
          }
          icon={FolderKanban}
        />

        <StatCard
          label="Pengguna & Distribusi Tamu"
          value={`${metrics.totalUsers} Akun`}
          description={`${metrics.totalGuests} Tamu Terdaftar · ${metrics.totalRsvps} Balasan RSVP`}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-500"
        />

        <StatCard
          label="Katalog & Promo Aktif"
          value={`${metrics.activeTemplates}/${metrics.totalTemplates} Tema`}
          description={`${metrics.totalCoupons} Kupon Diskon Aktif · ${metrics.premiumCount} Undangan Premium`}
          icon={TrendingUp}
          iconClassName="bg-amber-500/10 text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col justify-between shadow-2xs">
          <div>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
              <div>
                <CardTitle className="text-sm font-bold">
                  Transaksi & Pesanan Terbaru
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {metrics.pendingOrdersCount} pesanan menunggu konfirmasi
                  pembayaran
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href={"/admin/orders" as Route} />}
                className="gap-1 text-xs"
              >
                <span>Semua</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {metrics.recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Belum ada transaksi tercatat.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Invoice</TableHead>
                      <TableHead className="text-xs">Pengguna</TableHead>
                      <TableHead className="text-xs">Nominal</TableHead>
                      <TableHead className="text-right text-xs">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="max-w-[140px] truncate text-xs">
                          {order.user?.name ??
                            order.user?.email ??
                            "Pengguna Senara"}
                        </TableCell>
                        <TableCell className="text-xs font-semibold">
                          {formatCurrency(order.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              order.status === "PAID"
                                ? "default"
                                : order.status === "PENDING"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="gap-1 text-[10px]"
                          >
                            {order.status === "PAID" ? (
                              <CheckCircle2 className="size-3" />
                            ) : (
                              <Clock className="size-3" />
                            )}
                            <span>
                              {order.status === "PAID"
                                ? "Lunas"
                                : order.status === "PENDING"
                                  ? "Menunggu"
                                  : order.status}
                            </span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </div>
        </Card>

        <Card className="flex flex-col justify-between shadow-2xs">
          <div>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
              <div>
                <CardTitle className="text-sm font-bold">
                  Undangan Terbaru Dibuat
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Aktivitas pembuatan draf dan publikasi undangan pengguna
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href={"/admin/invitations" as Route} />}
                className="gap-1 text-xs"
              >
                <span>Moderasi</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {metrics.recentInvitations.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Belum ada undangan yang dibuat.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Judul & Slug</TableHead>
                      <TableHead className="text-xs">Template</TableHead>
                      <TableHead className="text-xs">Paket</TableHead>
                      <TableHead className="text-right text-xs">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.recentInvitations.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>
                          <div className="text-xs font-semibold">
                            {inv.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            /{inv.slug}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {inv.template?.name ?? "-"}
                        </TableCell>
                        <TableCell>
                          {inv.packageTier === "PREMIUM" ? (
                            <Badge className="gap-1 bg-amber-500 text-[10px] text-white">
                              <Crown className="size-3" />
                              <span>Premium</span>
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px]">
                              Gratis
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              inv.status === "PUBLISHED"
                                ? "default"
                                : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {inv.status === "PUBLISHED" ? "Terbit" : "Draf"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="shadow-2xs">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 ${item.iconBgClass}`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={item.href} />}
                  className="text-xs"
                >
                  Buka
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
