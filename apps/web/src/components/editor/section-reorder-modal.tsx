"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
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
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    // Urutkan berdasarkan sortOrder saat props sections berubah
    const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
    setLocalSections(sorted);
  }, [sections]);

  const reorderMutation = useMutation(
    trpc.section.reorderAndToggle.mutationOptions({
      onSuccess: () => {
        toast.success("Urutan dan visibilitas layout berhasil disimpan");
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menyimpan urutan layout");
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

  const handleDrop = (dropIndex: number) => {
    if (draggedIdx === null || draggedIdx === dropIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }
    const items = [...localSections];
    const [moved] = items.splice(draggedIdx, 1);
    if (!moved) return;
    items.splice(dropIndex, 0, moved);

    const normalized = items.map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }));
    saveBatch(normalized);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleToggleVisible = (id: string, isVisible: boolean) => {
    const updated = localSections.map((item) => {
      if (item.id === id) {
        if (item.isLocked) return item; // Layout yang terkunci wajib tampil
        return { ...item, isVisible };
      }
      return item;
    });
    saveBatch(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="text-primary size-5" />
            <span>Urutan & Visibilitas Layout</span>
          </DialogTitle>
          <DialogDescription>
            Tarik & geser (drag & drop) untuk mengatur susunan layout undangan, atau gunakan tombol panah dan toggle aktif.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2">
          {localSections.map((section, index) => {
            const isFirst = index === 0;
            const isLast = index === localSections.length - 1;
            const isDragging = draggedIdx === index;
            const isOver = dragOverIdx === index;

            return (
              <Card
                key={section.id}
                draggable
                onDragStart={(e) => {
                  setDraggedIdx(index);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(index));
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverIdx !== index) {
                    setDragOverIdx(index);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverIdx === index) {
                    setDragOverIdx(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(index);
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className={cn(
                  "flex select-none flex-row items-center justify-between gap-3 p-3 transition-all duration-150",
                  isDragging
                    ? "opacity-40 border-dashed border-primary scale-[0.98]"
                    : isOver
                    ? "border-primary ring-2 ring-primary/30 bg-primary/5 scale-[1.01]"
                    : section.isVisible
                    ? "bg-card border-border hover:border-primary/50"
                    : "bg-muted/40 border-border/70 border-dashed opacity-70"
                )}
              >
                {/* Grip Handle, Nomor Urut & Informasi Layout */}
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div
                    className="cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground touch-none pr-0.5 transition-colors"
                    title="Tarik untuk memindahkan urutan"
                  >
                    <GripVertical className="size-4" />
                  </div>

                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold">
                    {index + 1}
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">
                        {section.title || section.sectionKey}
                      </span>
                      {section.isLocked && (
                        <Badge
                          variant="outline"
                          className="h-4 gap-1 px-1.5 py-0 text-[10px]"
                        >
                          <Lock className="size-2.5" />
                          <span>Wajib</span>
                        </Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground truncate font-mono text-[11px]">
                      {section.sectionKey}
                    </span>
                  </div>
                </div>

                {/* Kontrol Aksi: Panah Geser & Switch Toggle */}
                <div className="flex shrink-0 items-center gap-2">
                  <div className="bg-background flex items-center rounded-md border shadow-xs">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none rounded-l-md hover:bg-muted"
                      disabled={isFirst || reorderMutation.isPending}
                      onClick={() => handleMoveUp(index)}
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none rounded-r-md border-l hover:bg-muted"
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
                          ? "Layout ini wajib ditampilkan"
                          : section.isVisible
                            ? "Sembunyikan layout ini"
                            : "Tampilkan layout ini"
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
