"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  Copy,
  Globe,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@senara/ui/components/button";
import { Skeleton } from "@senara/ui/components/skeleton";

import { CreateTemplateDialog } from "./create-template-dialog";
import { TemplateGeneratorTable } from "./template-generator-table";
import { TemplatePreviewModal } from "./template-preview-modal";
import type {
  TemplateCategory,
  TemplateGeneratorItem,
  TemplateStatus,
} from "./template-generator-types";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  SearchFilterBar,
  type FilterTabOption,
} from "@/components/shared/search-filter-bar";
import { trpc } from "@/utils/trpc";

const CATEGORY_TABS: readonly FilterTabOption<"ALL" | TemplateCategory>[] = [
  { value: "ALL", label: "Semua Kategori" },
  { value: "WEDDING", label: "Pernikahan" },
  { value: "BIRTHDAY", label: "Ulang Tahun" },
  { value: "KHITANAN", label: "Khitanan" },
] as const;

const STATUS_FILTERS: readonly { value: "ALL" | TemplateStatus; label: string }[] = [
  { value: "ALL", label: "Semua Status" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export function TemplateGeneratorView() {
  const queryClient = useQueryClient();

  const [categoryFilter, setCategoryFilter] = useState<"ALL" | TemplateCategory>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TemplateStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<TemplateGeneratorItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TemplateGeneratorItem | null>(null);

  const templatesQuery = useQuery(
    trpc.templateGenerator.listTemplates.queryOptions({
      category: categoryFilter !== "ALL" ? categoryFilter : undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      search: searchQuery || undefined,
    })
  );

  const duplicateMutation = useMutation(
    trpc.templateGenerator.duplicate.mutationOptions({
      onSuccess: async (cloned) => {
        await queryClient.invalidateQueries(
          trpc.templateGenerator.listTemplates.pathFilter()
        );
        toast.success(`Template draf "${cloned.name}" berhasil dibuat.`);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menggandakan template.");
      },
    })
  );

  const publishMutation = useMutation(
    trpc.templateGenerator.publish.mutationOptions({
      onSuccess: async (updated) => {
        await queryClient.invalidateQueries(
          trpc.templateGenerator.listTemplates.pathFilter()
        );
        toast.success(`Template "${updated.name}" berhasil dipublikasikan ke galeri.`);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mempublikasikan template.");
      },
    })
  );

  const archiveMutation = useMutation(
    trpc.templateGenerator.archive.mutationOptions({
      onSuccess: async (updated) => {
        await queryClient.invalidateQueries(
          trpc.templateGenerator.listTemplates.pathFilter()
        );
        toast.success(`Template "${updated.name}" berhasil diarsipkan.`);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengarsipkan template.");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.templateGenerator.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.templateGenerator.listTemplates.pathFilter()
        );
        toast.success("Template berhasil dihapus permanen.");
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus template.");
      },
    })
  );

  const templates = templatesQuery.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template Generator"
        description="Rancang, kustomisasi tata letak visual, atur latar dinamis, dan publikasikan template undangan digital master untuk seluruh pengguna Senara."
        badgeText="SUPERADMIN"
        actions={
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2 bg-amber-600 hover:bg-amber-500 text-white"
          >
            <Plus className="size-4" />
            <span>Buat Template Baru</span>
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari nama template atau slug..."
          tabs={CATEGORY_TABS}
          activeTab={categoryFilter}
          onTabChange={setCategoryFilter}
          rightSlot={
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {STATUS_FILTERS.map((s) => {
                const isActive = statusFilter === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStatusFilter(s.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-amber-500 text-amber-950 font-semibold shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          }
        />
      </div>

      {templatesQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      ) : templates.length === 0 ? (
        <EmptyState
          icon={Wand2}
          title="Belum Ada Template yang Sesuai"
          description="Tidak ditemukan template dengan kata kunci atau filter yang Anda pilih. Buat template baru untuk memulai."
          action={
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 bg-amber-600 hover:bg-amber-500 text-white"
            >
              <Plus className="size-4" />
              <span>Buat Template Baru</span>
            </Button>
          }
        />
      ) : (
        <TemplateGeneratorTable
          templates={templates}
          onDuplicate={(tpl) => duplicateMutation.mutate({ id: tpl.id })}
          onPublish={(tpl) => publishMutation.mutate({ id: tpl.id })}
          onArchive={(tpl) => archiveMutation.mutate({ id: tpl.id })}
          onDelete={(tpl) => setDeleteTarget(tpl)}
          onPreview={(tpl) => setPreviewTarget(tpl)}
          isActionLoading={
            duplicateMutation.isPending ||
            publishMutation.isPending ||
            archiveMutation.isPending
          }
        />
      )}

      <CreateTemplateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <TemplatePreviewModal
        template={previewTarget}
        open={Boolean(previewTarget)}
        onOpenChange={(open) => {
          if (!open) setPreviewTarget(null);
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Template Undangan?"
        description={`Apakah Anda yakin ingin menghapus template "${deleteTarget?.name}"? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.`}
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({ id: deleteTarget.id });
          }
        }}
      />
    </div>
  );
}

