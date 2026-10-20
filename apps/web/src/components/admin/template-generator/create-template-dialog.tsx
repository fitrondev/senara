"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

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
import { Textarea } from "@senara/ui/components/textarea";

import {
  DEFAULT_CREATE_TEMPLATE_VALUES,
  type CreateTemplateFormValues,
  type TemplateCategory,
} from "./template-generator-types";
import { trpc } from "@/utils/trpc";

export interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_OPTIONS = [
  { slug: "kartu-pos-vintage", name: "Kartu Pos Vintage (Par Avion) - Pastel & Hangat" },
  { slug: "autumn-serenity", name: "Autumn Serenity & Pagoda - Terakota & Elegan" },
  { slug: "jawa-biru", name: "Jawa Biru Keraton - Adat Tradisional & Mewah" },
  { slug: "blush-confetti", name: "Blush Confetti & Party - Ceria & Pastel" },
  { slug: "crescent-linen", name: "Crescent Linen & Zaitun - Islami & Minimalis" },
] as const;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CreateTemplateDialog({
  open,
  onOpenChange,
}: CreateTemplateDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateTemplateFormValues>(
    DEFAULT_CREATE_TEMPLATE_VALUES
  );
  const [tagsInput, setTagsInput] = useState("Aesthetic, Modern, Terakota");

  const createMutation = useMutation(
    trpc.templateGenerator.create.mutationOptions({
      onSuccess: async (created) => {
        await queryClient.invalidateQueries(
          trpc.templateGenerator.listTemplates.pathFilter()
        );
        toast.success(`Template draf "${created.name}" berhasil dibuat!`);
        onOpenChange(false);
        router.push(`/dashboard/template-generator/${created.id}` as Route);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal membuat template baru.");
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Nama dan slug template wajib diisi.");
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    createMutation.mutate({
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
      category: form.category,
      thumbnail: form.thumbnail,
      isPremium: form.isPremium,
      price: form.isPremium ? Number(form.price) : 0,
      tags: tagsArray,
      status: "DRAFT",
      basePresetSlug: form.basePresetSlug,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-500">
            <Wand2 className="size-5" />
            <DialogTitle className="text-lg font-bold">
              Buat Template Undangan Baru
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Template baru akan dibuat sebagai status <strong>Draft</strong>. Anda
            dapat mendesain tata letak, palet warna, tipografi, dan latar per halaman
            di Template Generator Editor sebelum dipublikasikan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tpl-name" className="text-xs font-semibold">
                Nama Template <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tpl-name"
                placeholder="contoh: Sakura Blossom Luxury"
                value={form.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name: val,
                    slug: prev.slug === slugify(prev.name) ? slugify(val) : prev.slug,
                  }));
                }}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tpl-slug" className="text-xs font-semibold">
                Slug URL Unik <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tpl-slug"
                placeholder="contoh: sakura-blossom"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                }
                className="font-mono text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Kategori Undangan</Label>
              <Select
                value={form.category}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, category: val as TemplateCategory }))
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="WEDDING">Pernikahan (Wedding)</SelectItem>
                    <SelectItem value="BIRTHDAY">Ulang Tahun (Birthday)</SelectItem>
                    <SelectItem value="KHITANAN">Khitanan & Aqiqah</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Desain Dasar Bawaan (Preset)</Label>
              <Select
                value={form.basePresetSlug}
                onValueChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    basePresetSlug: val || "kartu-pos-vintage",
                  }))
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Pilih Preset Awal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PRESET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.slug} value={opt.slug}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tpl-desc" className="text-xs font-semibold">
              Deskripsi Singkat Template
            </Label>
            <Textarea
              id="tpl-desc"
              rows={2}
              placeholder="Deskripsi gaya, tema, nuansa acara, dan keunikan desain template..."
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tpl-thumb" className="text-xs font-semibold">
              URL Thumbnail / Sampul Template
            </Label>
            <Input
              id="tpl-thumb"
              value={form.thumbnail}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, thumbnail: e.target.value }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tpl-tags" className="text-xs font-semibold">
              Tags / Label (Pisahkan dengan koma)
            </Label>
            <Input
              id="tpl-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="text-xs"
              placeholder="Aesthetic, Luxury, Adat Jawa, Tanpa Foto"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold">Klasifikasi Premium</Label>
              <p className="text-[11px] text-muted-foreground">
                Jika diaktifkan, template hanya dapat dipakai oleh akun berbayar.
              </p>
            </div>
            <Switch
              checked={form.isPremium}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  isPremium: checked,
                  price: checked && prev.price === 0 ? 29000 : prev.price,
                }))
              }
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-2 bg-amber-600 hover:bg-amber-500 text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Buat & Buka Generator Editor</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
