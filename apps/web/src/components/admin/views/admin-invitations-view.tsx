"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  CheckCircle2,
  Crown,
  ExternalLink,
  Globe,
  Trash2,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  SearchFilterBar,
  type FilterTabOption,
} from "@/components/shared/search-filter-bar";
import { trpc } from "@/utils/trpc";

type InvitationStatusFilter = "ALL" | "PUBLISHED" | "DRAFT" | "ARCHIVED";

const STATUS_TABS: readonly FilterTabOption<InvitationStatusFilter>[] = [
  { value: "ALL", label: "Semua Undangan" },
  { value: "PUBLISHED", label: "Tayang (PUBLISHED)" },
  { value: "DRAFT", label: "Draf (DRAFT)" },
  { value: "ARCHIVED", label: "Diarsipkan / Takedown" },
] as const;

export function AdminInvitationsView() {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] =
    useState<InvitationStatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
    slug: string;
  } | null>(null);

  const invitationsQuery = useQuery(
    trpc.admin.listAllInvitations.queryOptions()
  );

  const moderateMutation = useMutation(
    trpc.admin.moderateInvitation.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.admin.listAllInvitations.pathFilter()
          ),
          queryClient.invalidateQueries(
            trpc.admin.getDashboardMetrics.pathFilter()
          ),
        ]);
        toast.success("Status moderasi undangan berhasil diperbarui.");
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui undangan.");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.admin.deleteInvitationAdmin.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.admin.listAllInvitations.pathFilter()
          ),
          queryClient.invalidateQueries(
            trpc.admin.getDashboardMetrics.pathFilter()
          ),
        ]);
        toast.success("Undangan telah dihapus dari sistem.");
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus undangan.");
      },
    })
  );

  const invitations = invitationsQuery.data ?? [];

  const filteredInvitations = invitations.filter((inv) => {
    const matchesStatus =
      statusFilter === "ALL" || inv.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badgeText="Moderasi Konten"
        badgeIcon={Globe}
        title="Moderasi Undangan Publik"
        description="Pantau seluruh undangan pengguna, berikan upgrade paket manual, atau arsipkan undangan yang melanggar ketentuan."
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari judul, slug, atau email pemilik..."
        tabs={STATUS_TABS}
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Daftar Undangan ({filteredInvitations.length})
          </CardTitle>
          <CardDescription>
            Kelola status publikasi dan lisensi paket undangan secara instan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitationsQuery.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredInvitations.length === 0 ? (
            <EmptyState
              icon={Globe}
              title="Tidak ada undangan ditemukan"
              description="Belum ada undangan yang sesuai dengan kriteria pencarian atau filter saat ini."
            />
          ) : (
            <div className="w-full min-w-0 overflow-x-auto">
              <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Judul & URL Slug</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Tema</TableHead>
                  <TableHead>Statistik</TableHead>
                  <TableHead>Lisensi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Moderasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <p className="text-xs font-medium">{inv.title}</p>
                      <Link
                        href={`/${inv.slug}` as Route}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                      >
                        /{inv.slug}
                        <ExternalLink className="size-2.5" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-medium">
                        {inv.user.name ?? "Pengguna"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {inv.user.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="font-medium">{inv.template.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {inv.template.category}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span>{inv._count.guests} tamu</span>
                      <span className="mx-1 text-muted-foreground">•</span>
                      <span>{inv._count.rsvps} RSVP</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="xs"
                        variant={
                          inv.packageTier === "PREMIUM" ? "default" : "outline"
                        }
                        disabled={moderateMutation.isPending}
                        onClick={() =>
                          moderateMutation.mutate({
                            invitationId: inv.id,
                            packageTier:
                              inv.packageTier === "PREMIUM"
                                ? "FREE"
                                : "PREMIUM",
                          })
                        }
                        title="Klik untuk toggle lisensi FREE / PREMIUM"
                      >
                        <Crown className="mr-1 size-3" />
                        {inv.packageTier}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inv.status === "PUBLISHED" ? "default" : "secondary"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status !== "PUBLISHED" ? (
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={moderateMutation.isPending}
                            onClick={() =>
                              moderateMutation.mutate({
                                invitationId: inv.id,
                                status: "PUBLISHED",
                              })
                            }
                            title="Tayangkan (Publish)"
                          >
                            <CheckCircle2 className="mr-1 size-3" />
                            Publish
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={moderateMutation.isPending}
                            onClick={() =>
                              moderateMutation.mutate({
                                invitationId: inv.id,
                                status: "ARCHIVED",
                              })
                            }
                            title="Arsipkan / Takedown"
                          >
                            <Archive className="mr-1 size-3" />
                            Arsipkan
                          </Button>
                        )}
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          disabled={deleteMutation.isPending}
                          onClick={() =>
                            setDeleteTarget({
                              id: inv.id,
                              title: inv.title,
                              slug: inv.slug,
                            })
                          }
                          title="Hapus Permanen"
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

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Undangan Pengguna?"
        description={
          <>
            Apakah Anda yakin ingin menghapus undangan{" "}
            <strong>&ldquo;{deleteTarget?.title}&rdquo;</strong> (
            <span className="font-mono">/{deleteTarget?.slug}</span>) secara
            permanen dari sistem?
          </>
        }
        confirmLabel="Ya, Hapus Permanen"
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({ invitationId: deleteTarget.id });
          }
        }}
      />
    </div>
  );
}

