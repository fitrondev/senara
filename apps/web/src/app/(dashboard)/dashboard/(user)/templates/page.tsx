"use client";

import { useState } from "react";
import type { Route } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Eye,
  Heart,
  Music,
  Palette,
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
import { Skeleton } from "@senara/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@senara/ui/components/tabs";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  CreateInvitationDialog,
  TemplatePreviewDialog,
  type TemplateItem,
} from "@/components/templates/template-dialogs";
import { trpc } from "@/utils/trpc";

export type { TemplateItem };

// Vercel Best Practice: Hoist static categories configuration outside render
const CATEGORY_TABS = [
  { id: "ALL", label: "Semua Kategori" },
  { id: "WEDDING", label: "Pernikahan (Wedding)" },
  { id: "BIRTHDAY", label: "Ulang Tahun" },
  { id: "KHITANAN", label: "Khitanan" },
] as const;

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [selectedTemplateForCreate, setSelectedTemplateForCreate] =
    useState<TemplateItem | null>(null);

  const [invitationTitle, setInvitationTitle] = useState("");
  const [invitationSlug, setInvitationSlug] = useState("");

  const { data: templates, isLoading } = useQuery(
    trpc.template.getAll.queryOptions(
      selectedCategory === "ALL" ? undefined : { category: selectedCategory }
    )
  );

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
      <PageHeader
        title="Pilih Desain Template"
        description="Pilih gaya desain yang paling mencerminkan kepribadian Anda. Seluruh tema dapat disesuaikan di kanvas editor."
      />

      <Tabs
        value={selectedCategory}
        onValueChange={(val) => {
          if (val) setSelectedCategory(val);
        }}
      >
        <TabsList className="flex-wrap">
          {CATEGORY_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((tpl) => (
            <Card
              key={tpl.id}
              className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                <Image
                  src={tpl.thumbnail}
                  alt={tpl.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="secondary" className="font-medium text-xs">
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

              <CardHeader className="p-5 pb-2">
                <h3 className="font-semibold text-base tracking-tight text-foreground">
                  {tpl.name}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {tpl.isPremium
                    ? "Fitur Musik Kustom, Tanpa Watermark, Tamu Unlimited"
                    : "Paket Gratis Selamanya, Lengkap Amplop & RSVP"}
                </p>
              </CardHeader>

              <CardContent className="flex-1 px-5 pt-1 pb-4 text-muted-foreground text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Music className="size-3.5 text-primary" />
                    <span>Autoplay Gate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5 text-rose-500" />
                    <span>Layout Kustom</span>
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center gap-2 border-t bg-muted/20 px-5 py-3.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => router.push(`/template/${tpl.slug}` as Route)}
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
        <EmptyState
          icon={Palette}
          title="Belum ada template di kategori ini"
          description="Silakan pilih kategori lain atau periksa kembali nanti."
        />
      )}

      <TemplatePreviewDialog
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelectForCreate={handleOpenCreateModal}
      />

      <CreateInvitationDialog
        template={selectedTemplateForCreate}
        title={invitationTitle}
        slug={invitationSlug}
        isPending={createMutation.isPending}
        onTitleChange={handleTitleChange}
        onSlugChange={setInvitationSlug}
        onClose={() => setSelectedTemplateForCreate(null)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
