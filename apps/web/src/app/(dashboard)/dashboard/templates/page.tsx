"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  Eye,
  Globe,
  Heart,
  Music,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@senara/ui/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@senara/ui/components/field";
import { Input } from "@senara/ui/components/input";
import { Skeleton } from "@senara/ui/components/skeleton";

import { trpc } from "@/utils/trpc";

// Vercel Best Practice: Hoist static categories configuration outside render
const CATEGORY_TABS = [
  { id: "ALL", label: "Semua Kategori" },
  { id: "WEDDING", label: "Pernikahan (Wedding)" },
  { id: "BIRTHDAY", label: "Ulang Tahun" },
  { id: "KHITANAN", label: "Khitanan" },
] as const;

export interface TemplateItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  thumbnail: string;
  previewUrl: string | null;
  isPremium: boolean;
  price: string | number | { toString: () => string };
  isActive: boolean;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [selectedTemplateForCreate, setSelectedTemplateForCreate] = useState<TemplateItem | null>(null);

  // State Form Buat Undangan
  const [invitationTitle, setInvitationTitle] = useState("");
  const [invitationSlug, setInvitationSlug] = useState("");

  // Query Daftar Template
  const { data: templates, isLoading } = useQuery(
    trpc.template.getAll.queryOptions(
      selectedCategory === "ALL" ? undefined : { category: selectedCategory }
    )
  );

  // Mutasi Pembuatan Undangan Baru
  const createMutation = useMutation(
    trpc.invitation.createFromTemplate.mutationOptions({
      onSuccess: (newInvitation) => {
        toast.success("Undangan berhasil dibuat! Mengalihkan ke editor...");
        setSelectedTemplateForCreate(null);
        router.push(`/editor/${newInvitation.id}` as Route);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal membuat draf undangan");
      },
    })
  );

  // Helper pembuat slug otomatis dari judul
  const handleTitleChange = (value: string) => {
    setInvitationTitle(value);
    const autoSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setInvitationSlug(autoSlug);
  };

  const handleOpenCreateModal = (tpl: TemplateItem) => {
    setSelectedTemplateForCreate(tpl);
    const defaultTitle =
      tpl.category === "WEDDING"
        ? "The Wedding of Adinda & Bagas"
        : `Acara ${tpl.name}`;
    setInvitationTitle(defaultTitle);
    handleTitleChange(defaultTitle);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateForCreate) return;
    if (!invitationTitle.trim() || !invitationSlug.trim()) {
      toast.error("Judul dan alamat tautan (slug) wajib diisi");
      return;
    }

    createMutation.mutate({
      templateId: selectedTemplateForCreate.id,
      title: invitationTitle.trim(),
      slug: invitationSlug.trim(),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Galeri */}
      <div>
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl text-foreground">
          Pilih Desain Template
        </h1>
        <p className="text-muted-foreground text-sm">
          Pilih gaya desain yang paling mencerminkan kepribadian Anda. Seluruh tema dapat
          disesuaikan di kanvas editor.
        </p>
      </div>

      {/* Filter Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORY_TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={selectedCategory === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(tab.id)}
            className="text-xs"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Grid Katalog Template */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-16/10 w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Card
              key={tpl.id}
              className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              {/* Gambar Cover Template */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                <Image
                  src={tpl.thumbnail}
                  alt={tpl.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge Kategori & Tier */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {tpl.category}
                  </Badge>
                  <Badge
                    variant={tpl.isPremium ? "default" : "outline"}
                    className="text-xs"
                  >
                    {tpl.isPremium ? "✨ Premium" : "Gratis"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <h3 className="font-semibold text-base tracking-tight text-foreground">
                  {tpl.name}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {tpl.isPremium
                    ? "Fitur Musik Kustom, Tanpa Watermark, Tamu Unlimited"
                    : "Paket Gratis Selamanya, Lengkap Amplop & RSVP"}
                </p>
              </CardHeader>

              <CardContent className="flex-1 p-4 pt-1 pb-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Music className="size-3.5 text-primary" />
                    <span>Autoplay Gate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5 text-rose-500" />
                    <span>Isian Kamu</span>
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center gap-2 border-t p-3 bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => setPreviewTemplate(tpl as TemplateItem)}
                >
                  <Eye className="size-3.5" />
                  <span>Lihat Preview</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-1.5 shadow-xs"
                  onClick={() => handleOpenCreateModal(tpl as TemplateItem)}
                >
                  <Wand2 className="size-3.5" />
                  <span>Gunakan Template</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <Palette className="mb-3 size-10 text-muted-foreground" />
          <h3 className="font-semibold text-base">Belum ada template di kategori ini</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Silakan pilih kategori lain atau periksa kembali nanti.
          </p>
        </div>
      )}

      {/* Modal Live Preview Template */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={(open: boolean) => !open && setPreviewTemplate(null)}
      >
        <DialogContent className="max-w-lg sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Pratinjau: {previewTemplate?.name}</DialogTitle>
            <DialogDescription>
              Tampilan interaktif dan spesifikasi section bawaan template.
            </DialogDescription>
          </DialogHeader>

          {previewTemplate && (
            <div className="flex flex-col gap-4 py-2">
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={previewTemplate.thumbnail}
                  alt={previewTemplate.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 rounded-md border p-2.5">
                  <Music className="size-4 text-primary" />
                  <span>Cover Gate Audio Autoplay</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-2.5">
                  <Globe className="size-4 text-emerald-500" />
                  <span>Personalisasi Nama Tamu (?to=)</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-2.5">
                  <Heart className="size-4 text-rose-500" />
                  <span>Amplop Digital & QRIS</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-2.5">
                  <Sparkles className="size-4 text-amber-500" />
                  <span>Fitur Modular "Isian Kamu"</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Tutup Pratinjau
            </DialogClose>
            {previewTemplate && (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  const tpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleOpenCreateModal(tpl);
                }}
              >
                <Wand2 className="size-4" />
                <span>Gunakan Template Ini</span>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Form Buat Undangan Baru */}
      <Dialog
        open={!!selectedTemplateForCreate}
        onOpenChange={(open: boolean) =>
          !open && setSelectedTemplateForCreate(null)
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Undangan Baru</DialogTitle>
            <DialogDescription>
              Lengkapi judul dan alamat tautan unik untuk undangan berbasis template{" "}
              <strong>"{selectedTemplateForCreate?.name}"</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit}>
            <FieldGroup className="py-2">
              <Field>
                <FieldLabel htmlFor="title">Judul Undangan</FieldLabel>
                <Input
                  id="title"
                  placeholder="Contoh: The Wedding of Adinda & Bagas"
                  value={invitationTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
                <FieldDescription>
                  Nama utama yang akan ditampilkan pada sampul dan header undangan.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="slug">Tautan Publik (URL Slug)</FieldLabel>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-xs font-mono">
                    senara.id/
                  </span>
                  <Input
                    id="slug"
                    placeholder="adinda-bagas"
                    value={invitationSlug}
                    onChange={(e) =>
                      setInvitationSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]+/g, "")
                      )
                    }
                    required
                    className="font-mono text-xs"
                  />
                </div>
                <FieldDescription>
                  Hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).
                </FieldDescription>
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={createMutation.isPending}
                  />
                }
              >
                Batal
              </DialogClose>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="gap-1.5"
              >
                {createMutation.isPending ? (
                  "Membuat Undangan..."
                ) : (
                  <>
                    <Check className="size-4" />
                    <span>Buat & Masuk ke Editor</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
