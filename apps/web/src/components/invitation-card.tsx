"use client";

import { useState } from "react";
import type { Route } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Check,
  Copy,
  Crown,
  Edit,
  ExternalLink,
  EyeOff,
  Globe,
  Lock,
  MessageCircle,
  MoreVertical,
  Radio,
  Send,
  Sparkles,
  Trash2,
  Users,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@senara/ui/components/dropdown-menu";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { formatDate } from "@/lib/format";
import { trpc } from "@/utils/trpc";

const PublishModal = dynamic(
  () => import("@/components/editor/publish-modal").then((m) => m.PublishModal),
  { ssr: false }
);
const PricingModal = dynamic(
  () => import("@/components/billing/pricing-modal").then((m) => m.PricingModal),
  { ssr: false }
);

export interface InvitationCardItem {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED" | "ARCHIVED";
  packageTier: "FREE" | "PREMIUM";
  eventDate?: Date | string | null;
  coverImageUrl?: string | null;
  themeConfig?: Record<string, unknown> | null;
  enabledAddons?: string[];
  isSlugLocked?: boolean;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  template?: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
  } | null;
  _count?: {
    guests: number;
    rsvps: number;
    stats?: number;
  };
}

interface InvitationCardProps {
  invitation: InvitationCardItem;
  onRefresh?: () => void;
}

const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

export function InvitationCard({ invitation, onRefresh }: InvitationCardProps) {
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  const isStrictDelete =
    invitation.packageTier === "PREMIUM" ||
    invitation.status === "PUBLISHED" ||
    Boolean(invitation.publishedAt);

  const deleteMutation = useMutation(
    trpc.invitation.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Undangan berhasil dihapus");
        setDeleteDialogOpen(false);
        queryClient.invalidateQueries(
          trpc.invitation.getMyInvitations.queryFilter()
        );
        onRefresh?.();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus undangan");
      },
    })
  );

  const duplicateMutation = useMutation(
    trpc.invitation.duplicate.mutationOptions({
      onSuccess: () => {
        toast.success("Undangan berhasil diduplikasi");
        queryClient.invalidateQueries(
          trpc.invitation.getMyInvitations.queryFilter()
        );
        onRefresh?.();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menduplikasi undangan");
      },
    })
  );

  const updateStatusMutation = useMutation(
    trpc.invitation.updateMetadata.mutationOptions({
      onSuccess: (updated) => {
        toast.success(
          updated.status === "PUBLISHED"
            ? "Undangan berhasil diterbitkan!"
            : "Undangan berhasil disembunyikan sementara (mode Draf)."
        );
        queryClient.invalidateQueries(
          trpc.invitation.getMyInvitations.queryFilter()
        );
        onRefresh?.();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengubah status undangan");
      },
    })
  );

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${invitation.slug}`
      : `/${invitation.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      toast.success("Tautan undangan berhasil disalin");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin tautan");
    }
  };

  const coverImage =
    invitation.coverImageUrl ||
    invitation.template?.thumbnail ||
    DEFAULT_COVER_IMAGE;

  const formattedEventDate = invitation.eventDate
    ? formatDate(invitation.eventDate, "long")
    : null;

  const fields =
    (invitation.themeConfig?.fields as Record<string, string> | undefined) ??
    {};

  return (
    <>
      <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-16/9 w-full overflow-hidden bg-muted">
          <Image
            src={coverImage}
            alt={invitation.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <Badge
              variant={
                invitation.status === "PUBLISHED"
                  ? "default"
                  : invitation.status === "DRAFT"
                    ? "secondary"
                    : "outline"
              }
              className="font-medium shadow-xs"
            >
              {invitation.status === "PUBLISHED" ? (
                <>
                  <Radio className="mr-1 size-3 text-emerald-400" />
                  Terbit
                </>
              ) : invitation.status === "DRAFT" ? (
                "Draf"
              ) : (
                invitation.status
              )}
            </Badge>

            <Badge
              variant={
                invitation.packageTier === "PREMIUM" ? "default" : "secondary"
              }
              className="text-xs"
            >
              {invitation.packageTier === "PREMIUM" ? "✨ Premium" : "Gratis"}
            </Badge>

            {invitation.isSlugLocked ? (
              <Badge
                variant="secondary"
                className="gap-1 bg-black/50 text-white text-[10px]"
              >
                <Lock className="size-2.5" />
                <span>Slug Terkunci</span>
              </Badge>
            ) : null}
          </div>

          {invitation.status === "DRAFT" ? (
            <div className="absolute bottom-2 left-3 text-[11px] font-medium text-white/90 drop-shadow-sm">
              Masa aktif draf: Tanpa Batas
            </div>
          ) : null}
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-base tracking-tight text-foreground">
                {invitation.title}
              </h3>
              <p className="text-muted-foreground truncate text-xs">
                /{invitation.slug} • {invitation.template?.name ?? "Kustom"}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  />
                }
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Menu tindakan</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setPublishModalOpen(true)}
                    className="gap-2 text-primary"
                  >
                    <MessageCircle className="size-4" />
                    <span>Bagikan Pratinjau & Atur Slug</span>
                  </DropdownMenuItem>

                  {!(
                    invitation.packageTier === "PREMIUM" &&
                    (invitation.enabledAddons?.length ?? 0) >= 2
                  ) ? (
                    <DropdownMenuItem
                      onClick={() => setPricingModalOpen(true)}
                      className="gap-2"
                    >
                      <Crown className="size-4 text-amber-500" />
                      <span>
                        {invitation.packageTier === "PREMIUM"
                          ? "Beli Add-On Tambahan"
                          : "Terbitkan & Pilih Add-On"}
                      </span>
                    </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
                    {isCopied ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    <span>Salin Tautan Publik</span>
                  </DropdownMenuItem>

                  {invitation.status === "PUBLISHED" ? (
                    <DropdownMenuItem
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: invitation.id,
                          status: "DRAFT",
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                      className="gap-2 text-amber-600 dark:text-amber-400"
                    >
                      <EyeOff className="size-4" />
                      <span>Sembunyikan Sementara (Unpublish)</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => setPublishModalOpen(true)}
                      className="gap-2 text-emerald-600 dark:text-emerald-400"
                    >
                      <Globe className="size-4" />
                      <span>Terbitkan Sekarang</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    render={
                      <Link
                        href={`/dashboard/guests/${invitation.id}` as Route}
                      />
                    }
                    className="gap-2"
                  >
                    <Users className="size-4" />
                    <span>Manajemen Tamu (WA)</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={
                      <Link
                        href={`/dashboard/stats/${invitation.id}` as Route}
                      />
                    }
                    className="gap-2"
                  >
                    <ExternalLink className="size-4" />
                    <span>Statistik Kunjungan</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      duplicateMutation.mutate({ id: invitation.id })
                    }
                    disabled={duplicateMutation.isPending}
                    className="gap-2"
                  >
                    <Send className="size-4" />
                    <span>Duplikasi Undangan</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="size-4" />
                  <span>Hapus Undangan</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-5 pt-1 pb-4 text-xs">
          <div className="flex flex-col gap-1.5 text-muted-foreground">
            {formattedEventDate ? (
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 shrink-0" />
                <span>{formattedEventDate}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-3 pt-1">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                <span>{invitation._count?.guests ?? 0} Tamu</span>
              </span>
              <span className="flex items-center gap-1">
                <Send className="size-3.5" />
                <span>{invitation._count?.rsvps ?? 0} RSVP</span>
              </span>
              {(invitation.enabledAddons?.length ?? 0) > 0 ? (
                <span className="flex items-center gap-1 text-primary">
                  <Sparkles className="size-3.5" />
                  <span>{invitation.enabledAddons?.length} Add-On</span>
                </span>
              ) : null}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/20 px-4 py-3 sm:px-5 sm:flex-nowrap">
          <Button
            render={<Link href={`/editor/${invitation.id}` as Route} />}
            variant="default"
            size="sm"
            className="flex-1 min-w-[120px] gap-1.5"
          >
            <Edit className="size-3.5" />
            <span className="truncate">Edit Undangan</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPublishModalOpen(true)}
            className="gap-1.5 text-xs"
            title="Bagikan Pratinjau atau Terbitkan"
          >
            <MessageCircle className="size-3.5 text-emerald-600" />
            <span>Pratinjau</span>
          </Button>

          <Button
            render={
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" />
            }
            variant="outline"
            size="sm"
            className="size-8 p-0"
            title="Buka Undangan Publik"
          >
            <ExternalLink className="size-3.5" />
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={
          isStrictDelete
            ? "Hapus Permanen Undangan Terbit / Berbayar?"
            : "Hapus Undangan Ini?"
        }
        description={
          <>
            Apakah Anda yakin ingin menghapus{" "}
            <strong>&ldquo;{invitation.title}&rdquo;</strong>? Seluruh data
            acara, daftar tamu, dan pesan RSVP terkait akan dihapus secara
            permanen dan tidak dapat dipulihkan.
          </>
        }
        requireConfirmText={isStrictDelete ? "HAPUS" : undefined}
        confirmLabel="Ya, Hapus Undangan"
        isPending={deleteMutation.isPending}
        onConfirm={(typedText) =>
          deleteMutation.mutate({
            id: invitation.id,
            confirmText: typedText,
          })
        }
      />

      {publishModalOpen ? (
        <PublishModal
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          invitationId={invitation.id}
          title={invitation.title}
          slug={invitation.slug}
          status={invitation.status}
          packageTier={invitation.packageTier}
          enabledAddons={invitation.enabledAddons ?? []}
          isSlugLocked={invitation.isSlugLocked}
          fields={fields}
          onOpenPricingModal={() => setPricingModalOpen(true)}
        />
      ) : null}

      {pricingModalOpen ? (
        <PricingModal
          open={pricingModalOpen}
          onOpenChange={setPricingModalOpen}
          invitationId={invitation.id}
          invitationTitle={invitation.title}
          isAlreadyPremium={invitation.packageTier === "PREMIUM"}
          enabledAddons={invitation.enabledAddons ?? []}
        />
      ) : null}
    </>
  );
}
