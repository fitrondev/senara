"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Percent, Plus, Ticket, Trash2 } from "lucide-react";
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
import { Skeleton } from "@senara/ui/components/skeleton";
import { Switch } from "@senara/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";

import {
  CouponFormDialog,
  DEFAULT_COUPON_FORM,
  type CouponFormState,
} from "@/components/admin/coupon-form-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency } from "@/lib/format";
import { trpc } from "@/utils/trpc";

export function AdminCouponsView() {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CouponFormState>(DEFAULT_COUPON_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    code: string;
  } | null>(null);

  const couponsQuery = useQuery(trpc.admin.listCoupons.queryOptions());

  const upsertMutation = useMutation(
    trpc.admin.upsertCoupon.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.listCoupons.pathFilter()
        );
        toast.success(
          form.id
            ? "Kupon berhasil diperbarui!"
            : "Kupon promo baru berhasil dibuat!"
        );
        setDialogOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menyimpan kupon promo.");
      },
    })
  );

  const toggleActiveMutation = useMutation(
    trpc.admin.toggleCouponActive.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.listCoupons.pathFilter()
        );
        toast.success("Status kupon promo diperbarui.");
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengubah status kupon.");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.admin.deleteCoupon.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.listCoupons.pathFilter()
        );
        toast.success("Kupon berhasil dihapus.");
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus kupon.");
      },
    })
  );

  const coupons = couponsQuery.data ?? [];

  const handleOpenCreate = () => {
    setForm(DEFAULT_COUPON_FORM);
    setDialogOpen(true);
  };

  const handleOpenEdit = (coupon: (typeof coupons)[number]) => {
    setForm({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description ?? "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxUses: coupon.maxUses !== null ? String(coupon.maxUses) : "",
      isActive: coupon.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: form.id,
      code: form.code.toUpperCase().trim(),
      description: form.description.trim() || undefined,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxUses: form.maxUses.trim() ? Number(form.maxUses) : null,
      isActive: form.isActive,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badgeText="Voucher & Diskon"
        badgeIcon={Ticket}
        title="Manajemen Kupon Promo"
        description="Buat kode promo potongan harga tetap (Rp) atau persentase (%) untuk meningkatkan konversi checkout."
        actions={
          <Button onClick={handleOpenCreate} className="gap-1.5">
            <Plus className="size-4" />
            <span>Buat Kupon Promo</span>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Daftar Kode Promo ({coupons.length})
          </CardTitle>
          <CardDescription>
            Kupon yang aktif dapat digunakan oleh pengguna pada halaman Checkout
            / Billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {couponsQuery.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="Belum ada kupon promo"
              description="Klik tombol Buat Kupon Promo untuk menambahkan kode diskon pertama."
            />
          ) : (
            <div className="w-full min-w-0 overflow-x-auto">
              <Table className="w-full min-w-[620px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Kupon</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Besar Diskon</TableHead>
                  <TableHead>Pemakaian</TableHead>
                  <TableHead>Status Aktif</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <Badge className="font-mono text-xs">{coupon.code}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {coupon.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-semibold">
                        <Percent className="size-3 text-primary" />
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : formatCurrency(coupon.discountValue)}
                      </div>
                      {coupon.minOrderAmount > 0 ? (
                        <p className="text-[10px] text-muted-foreground">
                          Min. belanja {formatCurrency(coupon.minOrderAmount)}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {coupon.usedCount} /{" "}
                      {coupon.maxUses !== null ? coupon.maxUses : "∞"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={(checked) =>
                          toggleActiveMutation.mutate({
                            id: coupon.id,
                            isActive: checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(coupon)}
                          title="Edit Kupon"
                        >
                          <Edit3 className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          disabled={deleteMutation.isPending}
                          onClick={() =>
                            setDeleteTarget({
                              id: coupon.id,
                              code: coupon.code,
                            })
                          }
                          title="Hapus Kupon"
                        >
                          <Trash2 className="size-3.5" />
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

      <CouponFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        setForm={setForm}
        isPending={upsertMutation.isPending}
        onSubmit={handleSave}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Kupon Promo?"
        description={
          <>
            Apakah Anda yakin ingin menghapus kode kupon{" "}
            <strong className="font-mono">{deleteTarget?.code}</strong>?
          </>
        }
        confirmLabel="Ya, Hapus Kupon"
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({ id: deleteTarget.id });
          }
        }}
      />
    </div>
  );
}

