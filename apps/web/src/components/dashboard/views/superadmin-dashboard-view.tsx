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
  Store,
  TicketPercent,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";
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

const SUPERADMIN_QUICK_ACTIONS = [
  {
    href: "/dashboard/users" as Route,
    title: "Kelola User, Role & Mitra",
    description: "Ubah 4 role sistem & saldo kredit reseller",
    icon: Users,
    iconBgClass: "bg-blue-500/10 text-blue-600",
  },
  {
    href: "/dashboard/coupons" as Route,
    title: "Kelola Kupon Promo",
    description: "Atur kode voucher diskon dan masa berlaku",
    icon: TicketPercent,
    iconBgClass: "bg-amber-500/10 text-amber-600",
  },
  {
    href: "/dashboard/orders" as Route,
    title: "Verifikasi Pembayaran",
    description: "Cek bukti transfer manual & konfirmasi pesanan",
    icon: Receipt,
    iconBgClass: "bg-emerald-500/10 text-emerald-600",
  },
  {
    href: "/dashboard/invitations" as Route,
    title: "Kelola Semua Undangan",
    description: "Moderasi dan kelola seluruh undangan website",
    icon: FolderKanban,
    iconBgClass: "bg-purple-500/10 text-purple-600",
  },
  {
    href: "/dashboard/master-templates" as Route,
    title: "Master Template",
    description: "Kelola katalog tema pernikahan, ultah & khitanan",
    icon: Palette,
    iconBgClass: "bg-primary/10 text-primary",
  },
  {
    href: "/dashboard/reseller" as Route,
    title: "Workspace Reseller",
    description: "Simulasi top-up kredit dan portal white-label",
    icon: Store,
    iconBgClass: "bg-teal-500/10 text-teal-600",
  },
] as const;

export function SuperAdminDashboardView() {
  const { data: metrics, isLoading } = useQuery(
    trpc.admin.getDashboardMetrics.queryOptions()
  );

  if (isLoading || !metrics) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-amber-500" />
        <p className="text-xs font-medium text-muted-foreground">
          Memuat ringkasan eksekutif Super Admin...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-w-0 w-full">
      <PageHeader
        badgeText="Hak Akses Tertinggi"
        badgeIcon={Crown}
        title="Ringkasan Eksekutif Platform"
        description="Otoritas penuh mencakup manajemen user & role, kupon promo, verifikasi transaksi, moderasi undangan, dan seluruh fitur platform."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={"/dashboard/users" as Route} />}
              className="gap-1.5 text-xs"
            >
              <Users className="size-3.5 text-blue-600" />
              <span>Kelola User & Role</span>
            </Button>
            <Button
              size="sm"
              render={<Link href={"/dashboard/orders" as Route} />}
              className="gap-1.5 text-xs"
            >
              <Receipt className="size-3.5" />
              <span>Verifikasi Order ({metrics.pendingOrdersCount})</span>
            </Button>
          </div>
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
              ({metrics.paidOrdersCount} lunas)
            </>
          }
          icon={Wallet}
          iconClassName="bg-emerald-500/10 text-emerald-500"
        />

        <StatCard
          label="Pengguna & Tamu"
          value={`${metrics.totalUsers} Akun`}
          description={`${metrics.totalGuests} Tamu · ${metrics.totalRsvps} Balasan RSVP`}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-500"
        />

        <StatCard
          label="Total Undangan di Sistem"
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
          label="Katalog & Promo Aktif"
          value={`${metrics.activeTemplates} / ${metrics.totalTemplates} Tema`}
          description={`${metrics.totalCoupons} Kupon Promo · ${metrics.premiumCount} Undangan Premium`}
          icon={TrendingUp}
          iconClassName="bg-amber-500/10 text-amber-500"
        />
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Akses Cepat Pengelolaan Sistem
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SUPERADMIN_QUICK_ACTIONS.map((item) => {
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 min-w-0 w-full">
        <Card className="flex flex-col justify-between shadow-2xs">
          <div>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
              <div>
                <CardTitle className="text-sm font-bold">
                  Transaksi & Order Terbaru
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {metrics.pendingOrdersCount} pesanan menunggu konfirmasi
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href={"/dashboard/orders" as Route} />}
                className="gap-1 text-xs"
              >
                <span>Semua Order</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {metrics.recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Belum ada transaksi tercatat.
                </div>
              ) : (
                <div className="w-full min-w-0 overflow-x-auto">
                  <Table className="w-full min-w-[500px]">
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
                </div>
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
                  Aktivitas pembuatan draf dan publikasi pengguna
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href={"/dashboard/invitations" as Route} />}
                className="gap-1 text-xs"
              >
                <span>Kelola Undangan</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {metrics.recentInvitations.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Belum ada undangan yang dibuat.
                </div>
              ) : (
                <div className="w-full min-w-0 overflow-x-auto">
                  <Table className="w-full min-w-[520px]">
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
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}

