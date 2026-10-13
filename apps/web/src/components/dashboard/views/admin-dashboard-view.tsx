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
  ShieldCheck,
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

const ADMIN_QUICK_LINKS = [
  {
    href: "/dashboard/orders" as Route,
    title: "Cek Pembayaran & Order",
    description: "Verifikasi bukti transfer manual & aktivasi paket pengguna",
    icon: Receipt,
    iconBgClass: "bg-emerald-500/10 text-emerald-600",
  },
  {
    href: "/dashboard/invitations" as Route,
    title: "Kelola Semua Undangan",
    description: "Pantau data undangan publik, draf & moderasi konten",
    icon: FolderKanban,
    iconBgClass: "bg-blue-500/10 text-blue-600",
  },
  {
    href: "/dashboard/master-templates" as Route,
    title: "Master Template",
    description: "Atur katalog tema Pernikahan, Ultah & Khitanan",
    icon: Palette,
    iconBgClass: "bg-primary/10 text-primary",
  },
] as const;

export function AdminDashboardView() {
  const { data: metrics, isLoading } = useQuery(
    trpc.admin.getDashboardMetrics.queryOptions()
  );

  if (isLoading || !metrics) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-blue-500" />
        <p className="text-xs font-medium text-muted-foreground">
          Memuat ringkasan operasional Admin...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-w-0 w-full">
      <PageHeader
        badgeText="Admin Operasional"
        badgeIcon={ShieldCheck}
        title="Dashboard Operasional Admin"
        description="Kelola seluruh data undangan pengguna, verifikasi bukti pembayaran manual, dan pemeliharaan katalog template."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={"/dashboard/invitations" as Route} />}
              className="gap-1.5 text-xs"
            >
              <FolderKanban className="size-3.5" />
              <span>Kelola Semua Undangan</span>
            </Button>
            <Button
              size="sm"
              render={<Link href={"/dashboard/orders" as Route} />}
              className="gap-1.5 text-xs"
            >
              <Receipt className="size-3.5" />
              <span>Cek Pembayaran ({metrics.pendingOrdersCount})</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Menunggu Verifikasi"
          value={`${metrics.pendingOrdersCount} Order`}
          description="Perlu pengecekan bukti transfer manual"
          icon={Clock}
          iconClassName="bg-amber-500/10 text-amber-600"
        />
        <StatCard
          label="Transaksi Lunas"
          value={`${metrics.paidOrdersCount} Order`}
          description={`Total terverifikasi: ${formatCurrency(metrics.totalRevenue)}`}
          icon={Wallet}
          iconClassName="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          label="Total Data Undangan"
          value={metrics.totalInvitations}
          description={`${metrics.publishedCount} Terbit · ${metrics.draftCount} Draf`}
          icon={FolderKanban}
          iconClassName="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          label="Master Template Aktif"
          value={`${metrics.activeTemplates} / ${metrics.totalTemplates}`}
          description={`${metrics.premiumCount} Undangan paket Premium`}
          icon={Palette}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ADMIN_QUICK_LINKS.map((item) => {
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 min-w-0 w-full">
        <Card className="flex flex-col justify-between shadow-2xs">
          <div>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
              <div>
                <CardTitle className="text-sm font-bold">
                  Antrean Pembayaran & Order Terbaru
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {metrics.pendingOrdersCount} pesanan menunggu konfirmasi admin
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href={"/dashboard/orders" as Route} />}
                className="gap-1 text-xs"
              >
                <span>Cek Semua</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {metrics.recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Belum ada transaksi masuk.
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
                  Data Undangan Terbaru
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Pantau draf dan undangan publik yang baru dibuat pengguna
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href={"/dashboard/invitations" as Route} />}
                className="gap-1 text-xs"
              >
                <span>Kelola</span>
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

