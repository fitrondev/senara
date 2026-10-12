"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Switch } from "@senara/ui/components/switch";
import { cn } from "@senara/ui/lib/utils";

import { trpc } from "@/utils/trpc";

export interface EditorSectionItem {
  id: string;
  sectionKey: string;
  title: string | null;
  sortOrder: number;
  isVisible: boolean;
  isLocked: boolean;
}

interface SectionReorderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: string;
  sections: EditorSectionItem[];
  onSectionsChange: (updated: EditorSectionItem[]) => void;
}

export function SectionReorderModal({
  open,
  onOpenChange,
  invitationId,
  sections,
  onSectionsChange,
}: SectionReorderModalProps) {
  const queryClient = useQueryClient();
  const [localSections, setLocalSections] = useState<EditorSectionItem[]>([]);

  useEffect(() => {
    // Urutkan berdasarkan sortOrder saat props sections berubah
    const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
    setLocalSections(sorted);
  }, [sections]);

  const reorderMutation = useMutation(
    trpc.section.reorderAndToggle.mutationOptions({
      onSuccess: () => {
        toast.success("Urutan dan visibilitas section berhasil disimpan");
        queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menyimpan urutan section");
      },
    })
  );

  const saveBatch = (updated: EditorSectionItem[]) => {
    setLocalSections(updated);
    onSectionsChange(updated);

    reorderMutation.mutate({
      invitationId,
      sections: updated.map((s, idx) => ({
        id: s.id,
        sortOrder: idx,
        isVisible: s.isVisible,
      })),
    });
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const items = [...localSections];
    const temp = items[index - 1]!;
    items[index - 1] = items[index]!;
    items[index] = temp;

    // Normalisasi sortOrder
    const normalized = items.map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }));
    saveBatch(normalized);
  };

  const handleMoveDown = (index: number) => {
    if (index >= localSections.length - 1) return;
    const items = [...localSections];
    const temp = items[index + 1]!;
    items[index + 1] = items[index]!;
    items[index] = temp;

    const normalized = items.map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }));
    saveBatch(normalized);
  };

  const handleToggleVisible = (id: string, isVisible: boolean) => {
    const updated = localSections.map((item) => {
      if (item.id === id) {
        if (item.isLocked) return item; // Section yang terkunci wajib tampil
        return { ...item, isVisible };
      }
      return item;
    });
    saveBatch(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            <span>Urutan & Visibilitas Section</span>
          </DialogTitle>
          <DialogDescription>
            Atur susunan vertikal bagian undangan dan aktifkan/sembunyikan bagian tertentu.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2">
          {localSections.map((section, index) => {
            const isFirst = index === 0;
            const isLast = index === localSections.length - 1;

            return (
              <Card
                key={section.id}
                className={cn(
                  "flex flex-row items-center justify-between gap-3 p-3 transition-colors",
                  section.isVisible
                    ? "bg-card border-border"
                    : "bg-muted/40 border-dashed border-border/70 opacity-70"
                )}
              >
                {/* Informasi Section & Nomor Urut */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">
                        {section.title || section.sectionKey}
                      </span>
                      {section.isLocked && (
                        <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0 h-4">
                          <Lock className="size-2.5" />
                          <span>Wajib</span>
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono truncate">
                      {section.sectionKey}
                    </span>
                  </div>
                </div>

                {/* Kontrol Aksi: Panah Geser & Switch Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center rounded-md border bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none rounded-l-md"
                      disabled={isFirst || reorderMutation.isPending}
                      onClick={() => handleMoveUp(index)}
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none rounded-r-md border-l"
                      disabled={isLast || reorderMutation.isPending}
                      onClick={() => handleMoveDown(index)}
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                  </div>

                  {/* Toggle Visibilitas */}
                  <div className="flex items-center gap-1.5 pl-1">
                    <Switch
                      checked={section.isVisible}
                      onCheckedChange={(checked: boolean) =>
                        handleToggleVisible(section.id, checked)
                      }
                      disabled={section.isLocked || reorderMutation.isPending}
                      title={
                        section.isLocked
                          ? "Bagian ini wajib ditampilkan"
                          : section.isVisible
                            ? "Sembunyikan bagian ini"
                            : "Tampilkan bagian ini"
                      }
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="default" size="sm" />}>
            Selesai
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

