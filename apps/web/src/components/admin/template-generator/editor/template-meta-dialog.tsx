"use client";

import { useState, useEffect } from "react";
import { Settings2 } from "lucide-react";

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

import type { TemplateCategory } from "../template-generator-types";

export interface TemplateMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metadata: {
    name: string;
    slug: string;
    description: string;
    category: string;
    thumbnail: string;
    isPremium: boolean;
    price: number;
    tags: string[];
  };
  onSave: (updated: {
    name: string;
    slug: string;
    description: string;
    category: string;
    thumbnail: string;
    isPremium: boolean;
    price: number;
    tags: string[];
  }) => void;
}

export function TemplateMetaDialog({
  open,
  onOpenChange,
  metadata,
  onSave,
}: TemplateMetaDialogProps) {
  const [name, setName] = useState(metadata.name);
  const [slug, setSlug] = useState(metadata.slug);
  const [description, setDescription] = useState(metadata.description);
  const [category, setCategory] = useState<TemplateCategory>(
    (metadata.category as TemplateCategory) || "WEDDING"
  );
  const [thumbnail, setThumbnail] = useState(metadata.thumbnail);
  const [isPremium, setIsPremium] = useState(metadata.isPremium);
  const [price, setPrice] = useState(metadata.price);
  const [tagsInput, setTagsInput] = useState(metadata.tags.join(", "));

  useEffect(() => {
    if (open) {
      setName(metadata.name);
      setSlug(metadata.slug);
      setDescription(metadata.description);
      setCategory((metadata.category as TemplateCategory) || "WEDDING");
      setThumbnail(metadata.thumbnail);
      setIsPremium(metadata.isPremium);
      setPrice(metadata.price);
      setTagsInput(metadata.tags.join(", "));
    }
  }, [open, metadata]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      name,
      slug,
      description,
      category,
      thumbnail,
      isPremium,
      price: isPremium ? Number(price) : 0,
      tags,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-500">
            <Settings2 className="size-5" />
            <DialogTitle className="text-base font-bold">
              Pengaturan Metadata Template
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Kelola nama, tautan slug, klasifikasi paket, dan deskripsi publik
            template ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nama Template</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Slug URL Unik</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="font-mono text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Kategori Acara</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as TemplateCategory)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="WEDDING">Pernikahan</SelectItem>
                    <SelectItem value="BIRTHDAY">Ulang Tahun</SelectItem>
                    <SelectItem value="KHITANAN">Khitanan & Aqiqah</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Harga (Rp)</Label>
              <Input
                type="number"
                disabled={!isPremium}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Deskripsi Template</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs"
              placeholder="Deskripsi keunggulan dan nuansa visual template..."
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">URL Thumbnail / Sampul</Label>
            <Input
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tags (Pisahkan koma)</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold">Klasifikasi Premium</Label>
              <p className="text-[11px] text-muted-foreground">
                Tentukan apakah template gratis atau khusus paket premium.
              </p>
            </div>
            <Switch checked={isPremium} onCheckedChange={setIsPremium} />
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
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              Terapkan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

