"use client";

import { use, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Crown,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
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

import { PhotoSwitch } from "@/components/invitation/photo-switch";
import { UnifiedInvitation } from "@/components/invitation/unified-invitation";
import { trpc } from "@/utils/trpc";

interface TemplateShowcasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function TemplateShowcasePage({
  params,
}: TemplateShowcasePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [withPhotos, setWithPhotos] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [invitationTitle, setInvitationTitle] = useState("Adinda & Bagas");
  const [invitationSlug, setInvitationSlug] = useState("adinda-bagas");

  const { data: template, isLoading } = useQuery(
    trpc.template.getBySlug.queryOptions({ slug })
  );

  const createMutation = useMutation(
    trpc.invitation.createFromTemplate.mutationOptions({
      onSuccess: (created) => {
        toast.success("Undangan berhasil dibuat! Membuka kanvas editor...");
        setCreateDialogOpen(false);
        router.push(`/editor/${created.id}` as Route);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal membuat undangan. Pastikan Anda sudah login.");
      },
    })
  );

  const handleOpenCreate = () => {
    const suffix = Math.floor(100 + Math.random() * 900);
    if (template?.category === "BIRTHDAY") {
      setInvitationTitle("Pesta Ulang Tahun Alya");
      setInvitationSlug(`ultah-alya-${suffix}`);
    } else if (template?.category === "KHITANAN") {
      setInvitationTitle("Walimatul Khitan Zayyan");
      setInvitationSlug(`khitan-zayyan-${suffix}`);
    } else {
      setInvitationTitle("The Wedding of Adinda & Bagas");
      setInvitationSlug(`adinda-bagas-${suffix}`);
    }
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;
    createMutation.mutate({
      templateId: template.id,
      title: invitationTitle.trim(),
      slug: invitationSlug.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-xs font-medium">
          Memuat contoh desain template...
        </p>
      </div>
    );
  }

  const effectiveSlug = template?.slug ?? slug;
  const effectiveName = template?.name ?? "Pratinjau Desain Senara";

  return (
    <div className="bg-muted/30 min-h-screen pb-16">
      {/* Top Showcase Control Bar (ala UndangYuk) */}
      <div className="bg-background/95 sticky top-0 z-30 border-b px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={"/dashboard/templates" as Route} />}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>Semua Template</span>
            </Button>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-sm font-bold">{effectiveName}</h1>
                {template?.isPremium ? (
                  <Badge className="bg-amber-500 text-[10px] text-amber-950">
                    <Crown className="mr-1 size-2.5" />
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    Gratis
                  </Badge>
                )}
              </div>
              {template?.tags && template.tags.length > 0 ? (
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-muted-foreground text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Tengah: Sakelar Interaktif Foto / Tanpa Foto */}
          <PhotoSwitch withPhotos={withPhotos} onChange={setWithPhotos} />

          {/* Kanan: Tombol Pakai Template Ini */}
          <div className="flex items-center gap-2">
            {template ? (
              <Button size="sm" onClick={handleOpenCreate} className="gap-1.5 text-xs">
                <Wand2 className="size-3.5" />
                <span>Pakai Template Ini</span>
              </Button>
            ) : (
              <Button
                size="sm"
                render={<Link href={"/dashboard/templates" as Route} />}
                className="gap-1.5 text-xs"
              >
                <Sparkles className="size-3.5" />
                <span>Coba Gratis</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Kanvas Pratinjau Smartphone */}
      <div className="mx-auto mt-6 flex max-w-md flex-col items-center px-3">
        <div className="mb-3 text-center">
          <p className="text-muted-foreground text-xs">
            💡 Ketuk nama tamu bergaris bawah emas di sampul untuk melihat simulasi personalisasi otomatis.
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-[2.25rem] border-[6px] border-zinc-800 bg-background shadow-2xl">
          <div className="flex h-5 w-full items-center justify-center bg-zinc-800">
            <div className="h-1 w-12 rounded-full bg-zinc-600" />
          </div>

          <UnifiedInvitation
            templateSlug={effectiveSlug}
            title={
              template?.category === "BIRTHDAY"
                ? "Alya Putri (Sweet 7th)"
                : template?.category === "KHITANAN"
                  ? "Ananda Zayyan Al-Fatih"
                  : "Adinda & Bagas"
            }
            coverImageUrl={template?.thumbnail}
            withPhotos={withPhotos}
            demo
            editing={false}
            guestName="Budi Santoso & Partner"
          />
        </div>
      </div>

      {/* Modal Buat Undangan dari Template Ini */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pakai Template {effectiveName}</DialogTitle>
            <DialogDescription>
              Tentukan judul acara dan alamat tautan undangan Anda. Seluruh isi dapat diubah langsung di kanvas editor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="showcase-title">Judul Undangan / Nama Acara</Label>
              <Input
                id="showcase-title"
                required
                value={invitationTitle}
                onChange={(e) => setInvitationTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="showcase-slug">Tautan URL Undangan</Label>
              <Input
                id="showcase-slug"
                required
                value={invitationSlug}
                onChange={(e) =>
                  setInvitationSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-")
                  )
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Membuat..." : "Lanjut ke Editor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

