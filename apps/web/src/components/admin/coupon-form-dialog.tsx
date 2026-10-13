"use client";

import type * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@senara/ui/components/select";

export type DiscountType = "FIXED" | "PERCENTAGE";

export interface CouponFormState {
  id?: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxUses: string;
  isActive: boolean;
}

export const DEFAULT_COUPON_FORM: CouponFormState = {
  code: "SENARA50",
  description: "Diskon Spesial Launching Senara",
  discountType: "PERCENTAGE",
  discountValue: 50,
  minOrderAmount: 0,
  maxUses: "100",
  isActive: true,
};

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CouponFormState;
  setForm: React.Dispatch<React.SetStateAction<CouponFormState>>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function CouponFormDialog({
  open,
  onOpenChange,
  form,
  setForm,
  isPending,
  onSubmit,
}: CouponFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {form.id ? "Edit Kupon Promo" : "Buat Kupon Promo Baru"}
          </DialogTitle>
          <DialogDescription>
            Atur kode voucher, tipe potongan harga, serta batas kuota klaim.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="coupon-code">Kode Kupon</Label>
            <Input
              id="coupon-code"
              required
              placeholder="SENARA50"
              className="font-mono uppercase"
              value={form.code}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  code: e.target.value.toUpperCase(),
                }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coupon-desc">Keterangan Promo</Label>
            <Input
              id="coupon-desc"
              placeholder="Promo Spesial Akhir Pekan"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipe Potongan</Label>
              <Select
                value={form.discountType}
                onValueChange={(val) => {
                  if (val) {
                    setForm((prev) => ({
                      ...prev,
                      discountType: val as DiscountType,
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih tipe potongan">
                    {form.discountType === "PERCENTAGE"
                      ? "Persentase (%)"
                      : "Nominal Tetap (IDR)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="PERCENTAGE">Persentase (%)</SelectItem>
                    <SelectItem value="FIXED">Nominal Tetap (IDR)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coupon-val">
                Nilai Diskon (
                {form.discountType === "PERCENTAGE" ? "%" : "Rp"})
              </Label>
              <Input
                id="coupon-val"
                type="number"
                min={1}
                required
                value={form.discountValue}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    discountValue: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="coupon-min">Min. Transaksi (IDR)</Label>
              <Input
                id="coupon-min"
                type="number"
                min={0}
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    minOrderAmount: Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coupon-max">Kuota Maksimal (Kosong = ∞)</Label>
              <Input
                id="coupon-max"
                type="number"
                min={1}
                placeholder="Tanpa batas"
                value={form.maxUses}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, maxUses: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              <CheckCircle2 className="mr-1.5 size-3.5" />
              {isPending ? "Menyimpan..." : "Simpan Kupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

