"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Layers, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Label } from "@senara/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@senara/ui/components/select";
import { cn } from "@senara/ui/lib/utils";

import { AVAILABLE_SLOTS } from "./custom-content-modal";
import { LAYOUT_TEMPLATES_CATALOG } from "./layout-library-catalog";
import {
  LAYOUT_CATEGORIES,
  type LayoutCategory,
  type LayoutTemplateItem,
} from "./layout-library-types";
import { LayoutThumbnailCard } from "./layout-thumbnail-card";
import { trpc } from "@/utils/trpc";

export interface LayoutLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: string;
  initialSlotId?: string;
  onLayoutInserted?: (layoutItem: LayoutTemplateItem) => void;
}

export function LayoutLibraryModal({
  open,
  onOpenChange,
  invitationId,
  initialSlotId = "after-hero",
  onLayoutInserted,
}: LayoutLibraryModalProps) {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] =
    useState<LayoutCategory>("all");
  const [targetSlotId, setTargetSlotId] = useState<string>(initialSlotId);
  const [selectedItem, setSelectedItem] = useState<LayoutTemplateItem | null>(
    null
  );

  const filteredLayouts = useMemo(() => {
    if (selectedCategory === "all") {
      return LAYOUT_TEMPLATES_CATALOG;
    }
    return LAYOUT_TEMPLATES_CATALOG.filter(
      (item) => item.category === selectedCategory
    );
  }, [selectedCategory]);

  const addBatchMutation = useMutation(
    trpc.customContent.addBatch.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menyisipkan layout halaman.");
      },
    })
  );

  const handleSelectAndInsert = async (layout: LayoutTemplateItem) => {
    setSelectedItem(layout);
    const destinationSlot = targetSlotId || layout.defaultSlot || "after-hero";

    try {
      await addBatchMutation.mutateAsync({
        invitationId,
        slotId: destinationSlot,
        items: layout.blocks.map((block) => ({
          type: block.type,
          content: block.content,
          isVisible: block.isVisible ?? true,
        })),
      });

      toast.success(`Layout "${layout.name}" berhasil disisipkan!`);
      if (onLayoutInserted) {
        onLayoutInserted(layout);
      }
      onOpenChange(false);
    } catch {
      // Error handled by mutation onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden p-0 sm:max-w-xl"
        showCloseButton={false}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
              Pilih Layout Halaman
            </DialogTitle>
          </div>
          <DialogClose
            render={
              <button
                type="button"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Tutup Modal"
              >
                <X className="size-4" />
              </button>
            }
          />
        </div>

        {/* Posisi Sisipkan Target Slot */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-2 text-xs">
          <span className="text-muted-foreground">Sisipkan ke posisi:</span>
          <Select
            value={targetSlotId}
            onValueChange={(val) => {
              if (val) setTargetSlotId(val);
            }}
          >
            <SelectTrigger className="h-7 border-none bg-transparent px-2 text-xs font-semibold text-primary hover:bg-muted">
              <SelectValue placeholder="Pilih Posisi Slot" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_SLOTS.map((slot) => (
                <SelectItem key={slot.slotId} value={slot.slotId}>
                  {slot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Galeri Layout: Grid 3 Kolom Responsif dengan Scrollbar */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {addBatchMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="size-8 animate-spin text-primary mb-2" />
              <p className="text-xs font-medium text-muted-foreground">
                Menyisipkan layout ke undangan Anda...
              </p>
            </div>
          ) : filteredLayouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <Sparkles className="size-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-semibold">Tidak ada layout di kategori ini</p>
              <p className="text-xs text-muted-foreground mt-1">
                Silakan pilih kategori lain melalui pemilih di bawah.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {filteredLayouts.map((item) => (
                <LayoutThumbnailCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={handleSelectAndInsert}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Dropdown Kategori (Sesuai Referensi Screenshot) */}
        <div className="border-t bg-background px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Label className="text-xs font-medium text-foreground whitespace-nowrap">
              Kategori
            </Label>

            <div className="flex-1">
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  if (val) setSelectedCategory(val as LayoutCategory);
                }}
              >
                <SelectTrigger className="h-9 w-full rounded-lg border-2 border-cyan-400 bg-background px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:border-cyan-500 focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-400 dark:border-cyan-600">
                  <SelectValue placeholder="Semua Layout" />
                </SelectTrigger>
                <SelectContent side="top" className="max-h-64">
                  {LAYOUT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

