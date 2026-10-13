"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Info, Layers, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@senara/ui/components/alert";
import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import {
  CustomContentForm,
  type CustomContentType,
} from "@/components/editor/custom-content-forms";
import { CustomContentSlotList } from "@/components/editor/custom-content-slot-list";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { trpc } from "@/utils/trpc";

export interface SlotDefinition {
  slotId: string;
  label: string;
  description: string;
  sectionKey?: string;
}

export const AVAILABLE_SLOTS: SlotDefinition[] = [
  {
    slotId: "after-hero",
    label: "Setelah Sampul / Cover (Hero)",
    description: "Muncul tepat setelah cover pembuka",
    sectionKey: "hero",
  },
  {
    slotId: "after-quote",
    label: "Setelah Untaian Doa",
    description: "Muncul setelah ayat suci / kata mutiara",
    sectionKey: "quote",
  },
  {
    slotId: "after-couple",
    label: "Setelah Profil Mempelai",
    description: "Muncul setelah profil mempelai / tokoh acara",
    sectionKey: "couple",
  },
  {
    slotId: "after-event",
    label: "Setelah Rincian Acara",
    description: "Muncul setelah agenda akad & resepsi",
    sectionKey: "event",
  },
  {
    slotId: "after-story",
    label: "Setelah Kisah Klasik (Love Story)",
    description: "Muncul setelah linimasa perjalanan cinta",
    sectionKey: "love-story",
  },
  {
    slotId: "after-gallery",
    label: "Setelah Potret Kenangan (Galeri)",
    description: "Muncul setelah dokumentasi foto & video",
    sectionKey: "gallery",
  },
  {
    slotId: "after-gift",
    label: "Setelah Tanda Kasih & Amplop",
    description: "Muncul setelah nomor rekening & QRIS",
    sectionKey: "gift",
  },
  {
    slotId: "before-footer",
    label: "Sebelum Penutup Undangan",
    description: "Muncul sebelum ucapan terima kasih di bagian bawah",
    sectionKey: "closing",
  },
];

export interface CustomContentItemData {
  id: string;
  invitationId: string;
  slotId: string;
  type: string;
  content: unknown;
  sortOrder: number;
  isVisible: boolean;
}

interface CustomContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: string;
  selectedSlotId?: string;
  items: CustomContentItemData[];
}

export function CustomContentModal({
  open,
  onOpenChange,
  invitationId,
  selectedSlotId: initialSlotId = "after-hero",
  items,
}: CustomContentModalProps) {
  const queryClient = useQueryClient();

  const [currentSlotId, setCurrentSlotId] = useState<string>(initialSlotId);
  const [formMode, setFormMode] = useState<"idle" | "create" | "edit">("idle");
  const [activeType, setActiveType] = useState<CustomContentType>("TITLE");
  const [editingItem, setEditingItem] =
    useState<CustomContentItemData | null>(null);
  const [wipeSlotDialogOpen, setWipeSlotDialogOpen] = useState(false);
  const [deleteItemTarget, setDeleteItemTarget] =
    useState<CustomContentItemData | null>(null);

  const slotItems = useMemo(() => {
    return items
      .filter((item) => item.slotId === currentSlotId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [items, currentSlotId]);

  const currentSlotInfo = useMemo(() => {
    return (
      AVAILABLE_SLOTS.find((s) => s.slotId === currentSlotId) ??
      AVAILABLE_SLOTS[0]
    );
  }, [currentSlotId]);

  const invalidateInvitation = () => {
    queryClient.invalidateQueries(
      trpc.invitation.getById.queryFilter({ id: invitationId })
    );
  };

  const addMutation = useMutation(
    trpc.customContent.add.mutationOptions({
      onSuccess: () => {
        toast.success("Blok layout kustom berhasil ditambahkan.");
        invalidateInvitation();
        setFormMode("idle");
        setEditingItem(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menambahkan blok layout kustom.");
      },
    })
  );

  const updateMutation = useMutation(
    trpc.customContent.update.mutationOptions({
      onSuccess: () => {
        toast.success("Layout kustom berhasil diperbarui.");
        invalidateInvitation();
        setFormMode("idle");
        setEditingItem(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui layout kustom.");
      },
    })
  );

  const reorderMutation = useMutation(
    trpc.customContent.reorder.mutationOptions({
      onSuccess: () => {
        invalidateInvitation();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengubah urutan layout kustom.");
      },
    })
  );

  const deleteItemMutation = useMutation(
    trpc.customContent.deleteItem.mutationOptions({
      onSuccess: () => {
        toast.success("Blok layout kustom dihapus.");
        invalidateInvitation();
        setDeleteItemTarget(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus komponen.");
      },
    })
  );

  const deleteSlotMutation = useMutation(
    trpc.customContent.deleteSlot.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          `Seluruh ${data.deletedCount} blok kustom di posisi ini berhasil dibersihkan.`
        );
        invalidateInvitation();
        setWipeSlotDialogOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal membersihkan posisi layout.");
      },
    })
  );

  const handleMoveOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slotItems.length) return;

    const newItems = [...slotItems];
    const [moved] = newItems.splice(index, 1);
    if (!moved) return;
    newItems.splice(targetIndex, 0, moved);

    reorderMutation.mutate({
      invitationId,
      slotId: currentSlotId,
      items: newItems.map((item, idx) => ({
        id: item.id,
        sortOrder: idx,
      })),
    });
  };

  const handleToggleVisible = (itemId: string, currentVisible: boolean) => {
    updateMutation.mutate({
      id: itemId,
      invitationId,
      isVisible: !currentVisible,
    });
  };

  const handleStartEdit = (item: CustomContentItemData) => {
    setEditingItem(item);
    setActiveType(item.type as CustomContentType);
    setFormMode("edit");
  };

  const handleFormSubmit = async (payload: Record<string, unknown>) => {
    if (formMode === "edit" && editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        invitationId,
        content: payload,
      });
    } else {
      await addMutation.mutateAsync({
        invitationId,
        slotId: currentSlotId,
        type: activeType,
        content: payload,
        sortOrder: slotItems.length,
      });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          onOpenChange(isOpen);
          if (!isOpen) {
            setFormMode("idle");
            setEditingItem(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                <Layers className="size-5" />
              </div>
              <div>
                <DialogTitle>Layout Kustom</DialogTitle>
                <DialogDescription className="text-xs">
                  Sisipkan blok konten tambahan di titik posisi pilihan tanpa
                  merusak estetika template.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {formMode === "idle" ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Muncul setelah:
                </Label>
                <Select
                  value={currentSlotId}
                  onValueChange={(val) => {
                    if (val) setCurrentSlotId(val);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Posisi Layout">
                      {currentSlotInfo?.label}
                    </SelectValue>
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

              <Alert className="border-primary/20 bg-primary/5 text-primary">
                <Info className="size-4 shrink-0 text-primary" />
                <AlertTitle className="text-xs font-medium text-primary">
                  Posisi Layout Persisten Aktif
                </AlertTitle>
                <AlertDescription className="text-[11px] text-muted-foreground dark:text-zinc-300">
                  Layout kustom tetap berada di posisi ini meskipun bagian
                  sebelumnya dinonaktifkan atau disembunyikan.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between border-b pb-2 text-xs text-muted-foreground">
                <span>
                  Total layout kustom di posisi ini:{" "}
                  <strong className="text-foreground">
                    {slotItems.length} blok
                  </strong>
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {currentSlotInfo?.label}
                </Badge>
              </div>

              <CustomContentSlotList
                slotItems={slotItems}
                isReordering={reorderMutation.isPending}
                onMoveOrder={handleMoveOrder}
                onToggleVisible={handleToggleVisible}
                onEditItem={handleStartEdit}
                onDeleteItem={(item) => setDeleteItemTarget(item)}
                onCreateType={(type) => {
                  setActiveType(type);
                  setEditingItem(null);
                  setFormMode("create");
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm font-semibold">
                  {formMode === "edit"
                    ? "Edit Blok Kustom"
                    : "Tambah Blok Kustom Baru"}
                  :{" "}
                  <Badge
                    variant="secondary"
                    className="ml-1 text-[10px] uppercase"
                  >
                    {activeType}
                  </Badge>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFormMode("idle");
                    setEditingItem(null);
                  }}
                  className="text-xs text-muted-foreground"
                >
                  Kembali ke Daftar
                </Button>
              </div>

              <CustomContentForm
                type={activeType}
                initialData={
                  editingItem
                    ? (editingItem.content as Record<string, unknown>)
                    : undefined
                }
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setFormMode("idle");
                  setEditingItem(null);
                }}
                isSubmitting={addMutation.isPending || updateMutation.isPending}
              />
            </div>
          )}

          {formMode === "idle" ? (
            <DialogFooter className="flex-col items-center justify-between gap-2 border-t pt-3 sm:flex-row">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setWipeSlotDialogOpen(true)}
                disabled={
                  slotItems.length === 0 || deleteSlotMutation.isPending
                }
                className="w-full gap-1.5 text-xs sm:w-auto"
              >
                <Trash2 className="size-3.5" />
                <span>Bersihkan Seluruh Blok di Posisi Ini</span>
              </Button>

              <DialogClose
                render={<Button size="sm" className="w-full sm:w-auto" />}
              >
                Selesai
              </DialogClose>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={wipeSlotDialogOpen}
        onOpenChange={setWipeSlotDialogOpen}
        title="Bersihkan Seluruh Blok di Posisi Ini?"
        description={
          <>
            Apakah Anda yakin ingin menghapus seluruh{" "}
            <strong>{slotItems.length}</strong> blok kustom pada posisi{" "}
            <strong>&ldquo;{currentSlotInfo?.label}&rdquo;</strong>? Tindakan
            ini permanen dan seluruh blok kustom di posisi ini akan dibersihkan.
          </>
        }
        confirmLabel="Ya, Bersihkan Semua"
        isPending={deleteSlotMutation.isPending}
        onConfirm={() =>
          deleteSlotMutation.mutate({
            invitationId,
            slotId: currentSlotId,
          })
        }
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteItemTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteItemTarget(null);
        }}
        title="Hapus Blok Layout Kustom Ini?"
        description="Blok konten ini akan dihapus dari undangan Anda. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus Blok"
        isPending={deleteItemMutation.isPending}
        onConfirm={() => {
          if (deleteItemTarget) {
            deleteItemMutation.mutate({
              id: deleteItemTarget.id,
              invitationId,
            });
          }
        }}
      />
    </>
  );
}
