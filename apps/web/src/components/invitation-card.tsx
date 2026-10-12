"use client";

import { useState } from "react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Check,
  Copy,
  Edit,
  ExternalLink,
  Globe,
  MoreVertical,
  Radio,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@senara/ui/components/alert-dialog";
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

import { trpc } from "@/utils/trpc";

export interface InvitationCardItem {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED" | "ARCHIVED";
  packageTier: "FREE" | "PREMIUM";
  eventDate?: Date | string | null;
  coverImageUrl?: string | null;
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

export function InvitationCard({ invitation, onRefresh }: InvitationCardProps) {
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mutasi Hapus Undangan
  const deleteMutation = useMutation(
    trpc.invitation.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Undangan berhasil dihapus");
        setDeleteDialogOpen(false);
        queryClient.invalidateQueries(trpc.invitation.getMyInvitations.queryFilter());
        onRefresh?.();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus undangan");
      },
    })
  );

  // Mutasi Duplikasi Undangan
  const duplicateMutation = useMutation(
    trpc.invitation.duplicate.mutationOptions({
      onSuccess: (res) => {
        toast.success("Undangan berhasil diduplikasi");
        queryClient.invalidateQueries(trpc.invitation.getMyInvitations.queryFilter());
        onRefresh?.();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menduplikasi undangan");
      },
    })
  );

  // Mutasi Publikasi Undangan
  const publishMutation = useMutation(
    trpc.invitation.updateMetadata.mutationOptions({
      onSuccess: () => {
        toast.success("Undangan berhasil diterbitkan!");
        queryClient.invalidateQueries(trpc.invitation.getMyInvitations.queryFilter());
        onRefresh?.();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menerbitkan undangan");
      },
    })
  );

  const publicUrl = typeof window !== "undefined"
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
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

  const formattedEventDate = invitation.eventDate
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(invitation.eventDate))
    : null;

  return (
    <>
      <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Cover Thumbnail & Badges */}
        <div className="relative aspect-16/9 w-full overflow-hidden bg-muted">
          <Image
            src={coverImage}
            alt={invitation.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
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
              variant={invitation.packageTier === "PREMIUM" ? "default" : "secondary"}
              className="text-xs"
            >
              {invitation.packageTier === "PREMIUM" ? "✨ Premium" : "Gratis"}
            </Badge>
          </div>

          {/* Sisa Masa Aktif Draf */}
          {invitation.status === "DRAFT" && (
            <div className="absolute bottom-2 left-3 text-[11px] font-medium text-white/90 drop-shadow-sm">
              Masa aktif draf: Tanpa Batas
            </div>
          )}
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-base tracking-tight text-foreground">
                {invitation.title}
              </h3>
              <p className="text-muted-foreground truncate text-xs">
                Template: {invitation.template?.name ?? "Kustom"}
              </p>
            </div>

            {/* Dropdown Menu Aksi Lanjutan */}
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
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
                    {isCopied ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    <span>Salin Tautan</span>
                  </DropdownMenuItem>

                  {invitation.status === "DRAFT" && (
                    <DropdownMenuItem
                      onClick={() =>
                        publishMutation.mutate({
                          id: invitation.id,
                          status: "PUBLISHED",
                        })
                      }
                      disabled={publishMutation.isPending}
                      className="gap-2 text-emerald-600 dark:text-emerald-400"
                    >
                      <Globe className="size-4" />
                      <span>Terbitkan Sekarang</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    render={<Link href={`/dashboard/guests/${invitation.id}` as Route} />}
                    className="gap-2"
                  >
                    <Users className="size-4" />
                    <span>Manajemen Tamu (WA)</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={<Link href={`/dashboard/stats/${invitation.id}` as Route} />}
                    className="gap-2"
                  >
                    <ExternalLink className="size-4" />
                    <span>Statistik Kunjungan</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => duplicateMutation.mutate({ id: invitation.id })}
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

        <CardContent className="flex-1 p-4 pt-1 pb-3 text-xs">
          <div className="flex flex-col gap-1.5 text-muted-foreground">
            {formattedEventDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 shrink-0" />
                <span>{formattedEventDate}</span>
              </div>
            )}
            <div className="flex items-center gap-3 pt-1">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                <span>{invitation._count?.guests ?? 0} Tamu</span>
              </span>
              <span className="flex items-center gap-1">
                <Send className="size-3.5" />
                <span>{invitation._count?.rsvps ?? 0} RSVP</span>
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-2 border-t p-3 bg-muted/20">
          <Button
            render={<Link href={`/editor/${invitation.id}` as Route} />}
            variant="default"
            size="sm"
            className="flex-1 gap-1.5"
          >
            <Edit className="size-3.5" />
            <span>Edit Undangan</span>
          </Button>

          <Button
            render={
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            variant="outline"
            size="sm"
            className="size-8 p-0"
            title="Buka Pratinjau Undangan"
          >
            <ExternalLink className="size-3.5" />
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => setDeleteDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Undangan Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>"{invitation.title}"</strong>?
              Seluruh data isian, daftar tamu, dan pesan RSVP terkait akan dihapus
              secara permanen dan tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate({ id: invitation.id })}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus Undangan"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
