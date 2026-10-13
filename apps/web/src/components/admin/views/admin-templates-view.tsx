"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Crown,
  Edit3,
  ExternalLink,
  Palette,
  Plus,
  Sparkles,
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
import { Switch } from "@senara/ui/components/switch";

import {
  DEFAULT_TEMPLATE_FORM_STATE,
  TemplateFormDialog,
  type TemplateCategory,
  type TemplateFormState,
} from "@/components/admin/template-form-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  SearchFilterBar,
  type FilterTabOption,
} from "@/components/shared/search-filter-bar";
import { formatCurrency } from "@/lib/format";
import { trpc } from "@/utils/trpc";

const CATEGORY_TABS: readonly FilterTabOption<"ALL" | TemplateCategory>[] = [
  { value: "ALL", label: "Semua Kategori" },
  { value: "WEDDING", label: "Pernikahan" },
  { value: "BIRTHDAY", label: "Ulang Tahun" },
  { value: "KHITANAN", label: "Khitanan & Aqiqah" },
] as const;

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  WEDDING: "Pernikahan",
  BIRTHDAY: "Ulang Tahun",
  KHITANAN: "Khitanan",
};

export function AdminTemplatesView() {
  const queryClient = useQueryClient();

  const [categoryFilter, setCategoryFilter] = useState<
    "ALL" | TemplateCategory
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TemplateFormState>(
    DEFAULT_TEMPLATE_FORM_STATE
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const templatesQuery = useQuery(trpc.admin.listTemplates.queryOptions());

  const upsertMutation = useMutation(
    trpc.admin.upsertTemplate.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.listTemplates.pathFilter()
        );
        toast.success(
          form.id
            ? "Template berhasil diperbarui!"
            : "Template baru berhasil ditambahkan!"
        );
        setDialogOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menyimpan template.");
      },
    })
  );

  const toggleActiveMutation = useMutation(
    trpc.admin.toggleTemplateActive.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.listTemplates.pathFilter()
        );
        toast.success("Status visibilitas template diperbarui.");
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengubah status template.");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.admin.deleteTemplate.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.listTemplates.pathFilter()
        );
        toast.success("Template berhasil dihapus.");
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus template.");
      },
    })
  );

  const templates = templatesQuery.data ?? [];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory =
      categoryFilter === "ALL" || tpl.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreate = () => {
    setForm(DEFAULT_TEMPLATE_FORM_STATE);
    setDialogOpen(true);
  };

  const handleOpenEdit = (tpl: (typeof templates)[number]) => {
    setForm({
      id: tpl.id,
      name: tpl.name,
      slug: tpl.slug,
      category: tpl.category,
      thumbnail: tpl.thumbnail,
      previewUrl: tpl.previewUrl ?? `/template/${tpl.slug}`,
      price: tpl.price,
      isPremium: tpl.isPremium,
      isActive: tpl.isActive,
      tagsInput: tpl.tags.join(", "),
    });
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    upsertMutation.mutate({
      id: form.id,
      name: form.name.trim(),
      slug: form.slug.trim(),
      category: form.category,
      thumbnail: form.thumbnail.trim(),
      previewUrl: form.previewUrl.trim() || `/template/${form.slug.trim()}`,
      price: Number(form.price) || 0,
      isPremium: form.isPremium,
      isActive: form.isActive,
      tags,
    });
  };

  return (
    <div className="space-y-6 min-w-0 w-full">
      <PageHeader
        badgeText="Master Katalog"
        badgeIcon={Palette}
        title="Manajemen Template & Kategori"
        description="Tambah tema baru, atur harga lisensi, tag gaya desain, dan visibilitas di galeri pengguna."
        actions={
          <Button onClick={handleOpenCreate} className="gap-1.5">
            <Plus className="size-4" />
            <span>Tambah Template Baru</span>
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama atau slug tema..."
        tabs={CATEGORY_TABS}
        activeTab={categoryFilter}
        onTabChange={setCategoryFilter}
      />

      {templatesQuery.isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <EmptyState
          icon={Palette}
          title="Belum ada template yang sesuai filter"
          description="Klik tombol Tambah Template Baru untuk membuat katalog tema pertama."
        />
      ) : (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((tpl) => (
            <Card
              key={tpl.id}
              className={`overflow-hidden transition-all ${
                tpl.isActive ? "" : "opacity-65"
              }`}
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                <Image
                  src={tpl.thumbnail}
                  alt={tpl.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <Badge className="bg-black/70 text-white backdrop-blur-xs">
                    {CATEGORY_LABELS[tpl.category]}
                  </Badge>
                  {tpl.isPremium ? (
                    <Badge className="bg-amber-500 text-amber-950">
                      <Crown className="mr-1 size-3" />
                      Premium
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Gratis</Badge>
                  )}
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <Badge variant={tpl.isActive ? "default" : "outline"}>
                    {tpl.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{tpl.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      slug: {tpl.slug}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-sm font-bold">
                      {tpl.price > 0 ? formatCurrency(tpl.price) : "Rp 0"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {tpl._count.invitations} undangan
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {tpl.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {tpl.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] font-normal"
                      >
                        <Sparkles className="mr-1 size-2.5" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={tpl.isActive}
                      onCheckedChange={(checked) =>
                        toggleActiveMutation.mutate({
                          id: tpl.id,
                          isActive: checked,
                        })
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      Tampilkan di Katalog
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        window.open(`/template/${tpl.slug}`, "_blank")
                      }
                      title="Pratinjau"
                    >
                      <ExternalLink className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(tpl)}
                      title="Edit Template"
                    >
                      <Edit3 className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() =>
                        setDeleteTarget({ id: tpl.id, name: tpl.name })
                      }
                      title="Hapus Template"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TemplateFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        setForm={setForm}
        isPending={upsertMutation.isPending}
        onSubmit={handleSave}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Master Template?"
        description={
          <>
            Apakah Anda yakin ingin menghapus template{" "}
            <strong>&ldquo;{deleteTarget?.name}&rdquo;</strong> secara permanen
            dari katalog Senara?
          </>
        }
        confirmLabel="Ya, Hapus Template"
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

