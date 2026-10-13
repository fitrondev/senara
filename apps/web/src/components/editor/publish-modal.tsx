"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  EyeOff,
  Globe,
  Link2,
  Loader2,
  Lock,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";

import { trpc } from "@/utils/trpc";

const SAMPLE_NAMES = [
  "adinda & bagas",
  "adinda rahma",
  "bagas pratama",
  "rania & dimas",
  "kartu pos vintage",
  "jawa biru",
  "blush confetti",
  "crescent linen",
  "contoh undangan",
];

export interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED" | "ARCHIVED";
  packageTier?: "FREE" | "PREMIUM";
  enabledAddons?: string[];
  isSlugLocked?: boolean;
  fields?: Record<string, string>;
  onOpenPricingModal?: () => void;
}

export function PublishModal({
  open,
  onOpenChange,
  invitationId,
  title,
  slug,
  status,
  packageTier = "FREE",
  enabledAddons = [],
  isSlugLocked = false,
  fields = {},
  onOpenPricingModal,
}: PublishModalProps) {
  const queryClient = useQueryClient();
  const [slugInput, setSlugInput] = useState(slug);
  const [copiedPreview, setCopiedPreview] = useState(false);

  useEffect(() => {
    setSlugInput(slug);
  }, [slug, open]);

  const isSampleCoupleName = useMemo(() => {
    const lowerTitle = (title || "").trim().toLowerCase();
    const p1 = (fields.person1Name || "").trim().toLowerCase();
    const p2 = (fields.person2Name || "").trim().toLowerCase();

    return (
      !lowerTitle ||
      SAMPLE_NAMES.some(
        (sample) =>
          lowerTitle.includes(sample) ||
          (p1 && p1.includes(sample)) ||
          (p2 && p2.includes(sample))
      )
    );
  }, [title, fields]);

  const previewUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}?preview=1`
      : `https://senara.id/${slug}?preview=1`;

  const updateMetadataMutation = useMutation(
    trpc.invitation.updateMetadata.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.invitation.getMyInvitations.queryOptions()
        );
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui pengaturan publikasi.");
      },
    })
  );

  const markPreviewSharedMutation = useMutation(
    trpc.invitation.markPreviewShared.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.invitation.getMyInvitations.queryOptions()
        );
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
    })
  );

  const handleSaveSlug = () => {
    const clean = slugInput
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (clean.length < 3) {
      toast.error("Alamat tautan minimal 3 karakter.");
      return;
    }
    updateMetadataMutation.mutate(
      { id: invitationId, slug: clean },
      {
        onSuccess: () => {
          toast.success("Alamat tautan undangan berhasil diperbarui!");
        },
      }
    );
  };

  const handleCopyPreview = async () => {
    if (isSampleCoupleName) {
      toast.warning(
        "Nama mempelai masih menggunakan nama contoh template. Pastikan sudah disesuaikan sebelum disebarkan."
      );
    }
    await navigator.clipboard.writeText(previewUrl);
    setCopiedPreview(true);
    markPreviewSharedMutation.mutate({ id: invitationId });
    toast.success("Tautan pratinjau disalin & alamat slug kini dikunci aman!");
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  const handleShareWhatsAppPreview = () => {
    if (isSampleCoupleName) {
      toast.error(
        "Ubah nama mempelai terlebih dahulu agar tidak masih berupa nama contoh template sebelum membagikan pratinjau ke WhatsApp."
      );
      return;
    }
    markPreviewSharedMutation.mutate({ id: invitationId });
    const message = `Halo, ini pratinjau undangan kami (${title}). Tolong dicek dulu ya sebelum kami terbitkan:\n\n${previewUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const isPublished = status === "PUBLISHED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-lg">
            <Globe className="size-5 text-primary" />
            <span>Bagikan Pratinjau & Publikasi Undangan</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Periksa kesiapan data mempelai, bagikan pratinjau ke pasangan, atau
            atur status tayang undangan <strong>&ldquo;{title}&rdquo;</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 1. Validasi Nama Mempelai */}
          <div
            className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
              isSampleCoupleName
                ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
            }`}
          >
            {isSampleCoupleName ? (
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            )}
            <div className="space-y-0.5">
              <p className="font-semibold">
                {isSampleCoupleName
                  ? "Nama Mempelai Masih Berupa Nama Contoh Template"
                  : "Nama Mempelai Sudah Disesuaikan"}
              </p>
              <p className="text-[11px] opacity-90">
                {isSampleCoupleName
                  ? `Judul saat ini "${title}" terdeteksi sebagai nama contoh bawaan. Ubah nama mempelai di kanvas editor sebelum mengirim ke WhatsApp pasangan.`
                  : `Undangan "${title}" siap dibagikan untuk dicek bersama pasangan atau keluarga.`}
              </p>
            </div>
          </div>

          {/* 2. Bagikan Pratinjau untuk Pasangan */}
          <div className="space-y-2.5 rounded-xl border bg-muted/20 p-3.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <MessageCircle className="size-3.5 text-emerald-600" />
                <span>Bagikan Pratinjau ke Pasangan / Keluarga</span>
              </Label>
              <Badge variant="outline" className="text-[10px]">
                Mode Cek Draf
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Kirimkan tautan pratinjau agar pasangan bisa mengecek penulisan
              nama, gelar, dan jadwal sebelum undangan resmi diterbitkan.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-xs"
                onClick={handleCopyPreview}
              >
                {copiedPreview ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>Salin Link Pratinjau</span>
              </Button>
              <Button
                type="button"
                size="sm"
                className="flex-1 gap-1.5 bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                onClick={handleShareWhatsAppPreview}
              >
                <MessageCircle className="size-3.5" />
                <span>Kirim Pratinjau via WA</span>
              </Button>
            </div>
          </div>

          {/* 3. Alamat Tautan (Slug URL) & Kunci Slug */}
          <div className="space-y-2 rounded-xl border p-3.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <Link2 className="size-3.5 text-primary" />
                <span>Alamat Tautan Undangan (Slug URL)</span>
              </Label>
              {isSlugLocked ? (
                <Badge
                  variant="secondary"
                  className="gap-1 text-[10px] text-amber-700 dark:text-amber-300"
                >
                  <Lock className="size-3" />
                  <span>Terkunci Aman</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  Dapat Diubah
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={slugInput}
                disabled={isSlugLocked}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder="contoh: adinda-bagas"
                className="font-mono text-xs"
              />
              {!isSlugLocked ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={
                    slugInput === slug || updateMetadataMutation.isPending
                  }
                  onClick={handleSaveSlug}
                  className="shrink-0 text-xs"
                >
                  Simpan Slug
                </Button>
              ) : null}
            </div>

            <p className="text-[11px] text-muted-foreground">
              {isSlugLocked
                ? "Alamat tautan telah dikunci otomatis karena undangan pernah diterbitkan atau tautan pratinjaunya sudah dibagikan, sehingga link di tangan tamu tidak akan mati."
                : "Anda masih dapat mengubah alamat tautan sebelum link pratinjau dibagikan atau diterbitkan."}
            </p>
          </div>

          {/* 4. Status Publikasi & Sembunyikan Sementara (Unpublish) */}
          <div className="space-y-2.5 border-t pt-3">
            {isPublished ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-xs text-foreground">
                    Undangan Sedang Tayang (Terbit)
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Ingin menyembunyikan sementara dari publik tanpa menghapus
                    data?
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={updateMetadataMutation.isPending}
                  onClick={() =>
                    updateMetadataMutation.mutate(
                      { id: invitationId, status: "DRAFT" },
                      {
                        onSuccess: () => {
                          toast.success(
                            "Undangan berhasil disembunyikan sementara (kembali ke mode Draf)."
                          );
                          onOpenChange(false);
                        },
                      }
                    )
                  }
                  className="gap-1.5 border-amber-500/40 text-amber-700 text-xs hover:bg-amber-500/10 dark:text-amber-300"
                >
                  {updateMetadataMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <EyeOff className="size-3.5" />
                  )}
                  <span>Sembunyikan Sementara (Unpublish)</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                {onOpenPricingModal &&
                !(packageTier === "PREMIUM" && enabledAddons.length >= 2) ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-1.5 border-primary/40 text-primary text-xs"
                    onClick={() => {
                      onOpenChange(false);
                      onOpenPricingModal();
                    }}
                  >
                    <Sparkles className="size-3.5" />
                    <span>
                      {packageTier === "PREMIUM"
                        ? "Tambah Fitur Add-On"
                        : "Terbitkan + Pilih Add-On (Rp 29rb)"}
                    </span>
                  </Button>
                ) : null}

                <Button
                  type="button"
                  className="flex-1 gap-1.5 text-xs"
                  disabled={updateMetadataMutation.isPending}
                  onClick={() =>
                    updateMetadataMutation.mutate(
                      { id: invitationId, status: "PUBLISHED" },
                      {
                        onSuccess: () => {
                          toast.success("Undangan berhasil diterbitkan!");
                          onOpenChange(false);
                        },
                      }
                    )
                  }
                >
                  {updateMetadataMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Globe className="size-3.5" />
                  )}
                  <span>Terbitkan Sekarang</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

