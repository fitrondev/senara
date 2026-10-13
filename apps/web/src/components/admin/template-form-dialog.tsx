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
import { Switch } from "@senara/ui/components/switch";

export type TemplateCategory = "WEDDING" | "BIRTHDAY" | "KHITANAN";

export interface TemplateFormState {
  id?: string;
  name: string;
  slug: string;
  category: TemplateCategory;
  thumbnail: string;
  previewUrl: string;
  price: number;
  isPremium: boolean;
  isActive: boolean;
  tagsInput: string;
}

export const DEFAULT_TEMPLATE_FORM_STATE: TemplateFormState = {
  name: "",
  slug: "",
  category: "WEDDING",
  thumbnail:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  previewUrl: "",
  price: 29000,
  isPremium: true,
  isActive: true,
  tagsInput: "Elegant, Floral, Tanpa Foto",
};

function slugifyText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface TemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: TemplateFormState;
  setForm: React.Dispatch<React.SetStateAction<TemplateFormState>>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function TemplateFormDialog({
  open,
  onOpenChange,
  form,
  setForm,
  isPending,
  onSubmit,
}: TemplateFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {form.id ? "Edit Master Template" : "Tambah Template Baru"}
          </DialogTitle>
          <DialogDescription>
            Konfigurasikan identitas tema, kategori acara, harga paket, serta
            label gaya desain.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tpl-name">Nama Tema</Label>
              <Input
                id="tpl-name"
                required
                placeholder="Contoh: Royal Javanese Gold"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.id ? prev.slug : slugifyText(name),
                  }));
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tpl-slug">Slug Tema</Label>
              <Input
                id="tpl-slug"
                required
                placeholder="royal-javanese-gold"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    slug: slugifyText(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Kategori Acara</Label>
              <Select
                value={form.category}
                onValueChange={(val) => {
                  if (val) {
                    setForm((prev) => ({
                      ...prev,
                      category: val as TemplateCategory,
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori acara">
                    {form.category === "WEDDING"
                      ? "Pernikahan (Wedding)"
                      : form.category === "BIRTHDAY"
                        ? "Ulang Tahun (Birthday)"
                        : "Khitanan & Aqiqah"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="WEDDING">
                      Pernikahan (Wedding)
                    </SelectItem>
                    <SelectItem value="BIRTHDAY">
                      Ulang Tahun (Birthday)
                    </SelectItem>
                    <SelectItem value="KHITANAN">
                      Khitanan & Aqiqah
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tpl-price">Harga Lisensi (IDR)</Label>
              <Input
                id="tpl-price"
                type="number"
                min={0}
                step={1000}
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tpl-thumb">
              URL Gambar Thumbnail (Unsplash / CDN)
            </Label>
            <Input
              id="tpl-thumb"
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={form.thumbnail}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, thumbnail: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tpl-tags">
              Tag Gaya Desain (pisahkan dengan koma)
            </Label>
            <Input
              id="tpl-tags"
              placeholder="Luxury, Adat Jawa, Dengan Foto, Floral"
              value={form.tagsInput}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tagsInput: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-xs font-medium">Template Kelas Premium</p>
              <p className="text-[11px] text-muted-foreground">
                Membutuhkan paket berbayar untuk publikasi penuh tanpa watermark
              </p>
            </div>
            <Switch
              checked={form.isPremium}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isPremium: checked }))
              }
            />
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
              {isPending ? "Menyimpan..." : "Simpan Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

