"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  Receipt,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Label } from "@senara/ui/components/label";
import { Skeleton } from "@senara/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";
import { Textarea } from "@senara/ui/components/textarea";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  SearchFilterBar,
  type FilterTabOption,
} from "@/components/shared/search-filter-bar";
import { formatCurrency, formatDate } from "@/lib/format";
import { trpc } from "@/utils/trpc";

type OrderStatusFilter = "ALL" | "PENDING" | "PAID" | "FAILED";

const STATUS_TABS: readonly FilterTabOption<OrderStatusFilter>[] = [
  { value: "ALL", label: "Semua Transaksi" },
  { value: "PENDING", label: "Menunggu Verifikasi" },
  { value: "PAID", label: "Lunas (PAID)" },
  { value: "FAILED", label: "Ditolak / Gagal" },
] as const;

export function AdminOrdersView() {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const ordersQuery = useQuery(
    trpc.admin.listOrders.queryOptions({ status: statusFilter })
  );

  const reviewMutation = useMutation(
    trpc.admin.reviewOrderPayment.mutationOptions({
      onSuccess: async (_, variables) => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.admin.listOrders.pathFilter()),
          queryClient.invalidateQueries(
            trpc.admin.getDashboardMetrics.pathFilter()
          ),
        ]);
        toast.success(
          variables.action === "APPROVE"
            ? "Pembayaran disetujui! Undangan pengguna otomatis di-upgrade ke PREMIUM & PUBLISHED."
            : "Pembayaran telah ditolak."
        );
        setSelectedOrderId(null);
        setAdminNote("");
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memproses verifikasi pembayaran.");
      },
    })
  );

  const orders = ordersQuery.data ?? [];

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.invoiceNumber.toLowerCase().includes(q) ||
      order.user.email.toLowerCase().includes(q) ||
      (order.user.name ?? "").toLowerCase().includes(q)
    );
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  const handleOpenReview = (order: (typeof orders)[number]) => {
    setSelectedOrderId(order.id);
    setAdminNote(order.payment?.adminNote ?? "");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badgeText="Verifikasi Pembayaran"
        badgeIcon={Receipt}
        title="Manajemen Transaksi & Bukti Transfer"
        description="Verifikasi pembayaran manual/QRIS maupun gateway Midtrans. Menyetujui pesanan akan otomatis mengaktifkan fitur Premium pada undangan terkait."
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari No. Invoice atau email..."
        tabs={STATUS_TABS}
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Daftar Pesanan ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Klik tombol Periksa untuk melihat detail pembayaran dan melakukan
            Approve / Reject
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ordersQuery.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="Tidak ada transaksi ditemukan"
              description="Semua pesanan yang dibuat pengguna akan muncul di tabel ini."
            />
          ) : (
            <div className="w-full min-w-0 overflow-x-auto">
              <Table className="w-full min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Paket & Kupon</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {order.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs font-medium">
                          {order.user.name ?? "Pengguna"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {order.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline">{order.packageTier}</Badge>
                        {order.couponCode ? (
                          <Badge
                            variant="secondary"
                            className="font-mono text-[10px]"
                          >
                            {order.couponCode}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">
                        {formatCurrency(order.amount)}
                      </p>
                      {order.discountAmount > 0 ? (
                        <p className="text-[10px] text-emerald-600">
                          Hemat {formatCurrency(order.discountAmount)}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "PAID"
                            ? "default"
                            : order.status === "PENDING"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          order.status === "PAID"
                            ? "bg-emerald-600 text-white"
                            : order.status === "PENDING"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              : "text-destructive"
                        }
                      >
                        {order.status === "PAID" ? (
                          <CheckCircle2 className="mr-1 size-3" />
                        ) : order.status === "PENDING" ? (
                          <Clock className="mr-1 size-3" />
                        ) : (
                          <XCircle className="mr-1 size-3" />
                        )}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === "PENDING" ? (
                          <Button
                            size="xs"
                            onClick={() =>
                              reviewMutation.mutate({
                                orderId: order.id,
                                action: "APPROVE",
                                adminNote: "Disetujui cepat oleh Admin",
                              })
                            }
                            disabled={reviewMutation.isPending}
                          >
                            <CheckCircle2 className="mr-1 size-3" />
                            Approve
                          </Button>
                        ) : null}
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleOpenReview(order)}
                        >
                          <Eye className="mr-1 size-3" />
                          Periksa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verifikasi Pesanan</DialogTitle>
            <DialogDescription>
              Invoice:{" "}
              <span className="font-mono font-semibold">
                {selectedOrder?.invoiceNumber}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedOrder ? (
            <div className="space-y-4">
              <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pemesan:</span>
                  <span className="font-medium">
                    {selectedOrder.user.name} ({selectedOrder.user.email})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Nominal Tagihan:
                  </span>
                  <span className="font-serif text-sm font-bold">
                    {formatCurrency(selectedOrder.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode Gateway:</span>
                  <span className="font-mono">
                    {selectedOrder.payment?.gateway ?? "MANUAL_TRANSFER"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Status Saat Ini:
                  </span>
                  <Badge variant="outline">{selectedOrder.status}</Badge>
                </div>
              </div>

              {selectedOrder.payment?.proofImageUrl ? (
                <div className="space-y-1.5">
                  <Label>Bukti Transfer Pengguna</Label>
                  <a
                    href={selectedOrder.payment.proofImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-xs text-primary underline"
                  >
                    Lihat Lampiran Bukti Transfer
                  </a>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label htmlFor="admin-note">Catatan Verifikasi Admin</Label>
                <Textarea
                  id="admin-note"
                  rows={2}
                  placeholder="Contoh: Dana masuk ke rekening BCA Senara..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="text-destructive"
                  disabled={reviewMutation.isPending}
                  onClick={() =>
                    reviewMutation.mutate({
                      orderId: selectedOrder.id,
                      action: "REJECT",
                      adminNote,
                    })
                  }
                >
                  <XCircle className="mr-1.5 size-3.5" />
                  Tolak (Reject)
                </Button>
                <Button
                  type="button"
                  disabled={reviewMutation.isPending}
                  onClick={() =>
                    reviewMutation.mutate({
                      orderId: selectedOrder.id,
                      action: "APPROVE",
                      adminNote,
                    })
                  }
                >
                  <CheckCircle2 className="mr-1.5 size-3.5" />
                  Setujui & Aktifkan Premium
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

