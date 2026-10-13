"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Crown, Palette, RefreshCw, Sparkles } from "lucide-react";
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
import { cn } from "@senara/ui/lib/utils";

import { trpc } from "@/utils/trpc";

interface ChangeThemeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: string;
  currentTemplateId: string;
  onTemplateChanged?: (newSlug: string) => void;
}

const CATEGORY_TABS = [
  { key: "ALL", label: "Semua" },
  { key: "WEDDING", label: "Pernikahan" },
  { key: "BIRTHDAY", label: "Ulang Tahun" },
  { key: "KHITANAN", label: "Khitanan" },
] as const;

export function ChangeThemeModal({
  open,
  onOpenChange,
  invitationId,
  currentTemplateId,
  onTemplateChanged,
}: ChangeThemeModalProps) {
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>(currentTemplateId);

  const templatesQuery = useQuery(trpc.template.getAll.queryOptions());

  const changeTemplateMutation = useMutation(
    trpc.invitation.changeTemplate.mutationOptions({
      onSuccess: async (updated) => {
        await queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
        toast.success(
          `Tema berhasil diganti ke "${updated.template.name}" tanpa menghapus data acara & layout kustom Anda!`
        );
        onTemplateChanged?.(updated.template.slug);
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengganti tema desain.");
      },
    })
  );

  const templates = templatesQuery.data ?? [];
  const filteredTemplates = templates.filter(
    (t) => categoryFilter === "ALL" || t.category === categoryFilter
  );

  const handleApply = () => {
    if (!selectedTemplateId || selectedTemplateId === currentTemplateId) {
      onOpenChange(false);
      return;
    }
    changeTemplateMutation.mutate({
      invitationId,
      newTemplateId: selectedTemplateId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              <Palette className="mr-1 size-3" />
              Ganti Desain Instan
            </Badge>
          </div>
          <DialogTitle>Ganti Tema Desain Undangan</DialogTitle>
          <DialogDescription>
            Seluruh teks nama, tanggal, jadwal acara, rekening, dan foto yang sudah Anda isi tetap terjaga saat berpindah tema.
          </DialogDescription>
        </DialogHeader>

        {/* Filter Kategori */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_TABS.map((tab) => (
            <Button
              key={tab.key}
              type="button"
              size="xs"
              variant={categoryFilter === tab.key ? "default" : "outline"}
              onClick={() => setCategoryFilter(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Grid Pilihan Template */}
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredTemplates.map((tpl) => {
            const isCurrent = tpl.id === currentTemplateId;
            const isSelected = tpl.id === selectedTemplateId;

            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={cn(
                  "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-primary/30 ring-2"
                    : "hover:border-foreground/30"
                )}
              >
                <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={tpl.thumbnail}
                    alt={tpl.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className="bg-black/70 text-[10px] text-white">
                      {tpl.category}
                    </Badge>
                    {tpl.isPremium ? (
                      <Badge className="bg-amber-500 text-[10px] text-amber-950">
                        <Crown className="mr-0.5 size-2.5" />
                        Premium
                      </Badge>
                    ) : null}
                  </div>
                  {isCurrent ? (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-emerald-600 text-[10px] text-white">
                        ★ Tema Aktif
                      </Badge>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="text-xs font-bold">{tpl.name}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {tpl.tags.slice(0, 3).join(" • ") || "Siap pakai"}
                    </p>
                  </div>
                  {isSelected ? (
                    <Check className="text-primary size-4 shrink-0" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={
              changeTemplateMutation.isPending ||
              selectedTemplateId === currentTemplateId
            }
            onClick={handleApply}
          >
            {changeTemplateMutation.isPending ? (
              <>
                <RefreshCw className="mr-1.5 size-3.5 animate-spin" />
                Mengganti Tema...
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 size-3.5" />
                Terapkan Tema Ini
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

