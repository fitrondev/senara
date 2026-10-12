"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Edit2,
  ExternalLink,
  Heading,
  Image as ImageIcon,
  Info,
  Layers,
  Link2,
  Loader2,
  MapPin,
  MousePointerClick,
  Plus,
  Trash2,
  Type,
  Video,
} from "lucide-react";

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@senara/ui/components/alert";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@senara/ui/components/empty";
import { Label } from "@senara/ui/components/label";
import { NativeSelect, NativeSelectOption } from "@senara/ui/components/native-select";
import { Separator } from "@senara/ui/components/separator";
import { Switch } from "@senara/ui/components/switch";
import { cn } from "@senara/ui/lib/utils";

import {
  CustomContentForm,
  type CustomContentType,
} from "@/components/editor/custom-content-forms";
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

  // State Slot Terpilih
  const [currentSlotId, setCurrentSlotId] = useState<string>(initialSlotId);

  // State Form Mode (menambah atau mengedit item)
  const [formMode, setFormMode] = useState<"idle" | "create" | "edit">("idle");
  const [activeType, setActiveType] = useState<CustomContentType>("TITLE");
  const [editingItem, setEditingItem] = useState<CustomContentItemData | null>(null);

  // State Dialog Konfirmasi Hapus Bersih Slot
  const [wipeSlotDialogOpen, setWipeSlotDialogOpen] = useState(false);

  // State Dialog Konfirmasi Hapus Satuan
  const [deleteItemTarget, setDeleteItemTarget] = useState<CustomContentItemData | null>(null);

  // Filter & Urutkan item untuk slot aktif
  const slotItems = useMemo(() => {
    return items
      .filter((item) => item.slotId === currentSlotId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [items, currentSlotId]);

  const currentSlotInfo = useMemo(() => {
    return (
      AVAILABLE_SLOTS.find((s) => s.slotId === currentSlotId) ?? AVAILABLE_SLOTS[0]
    );
  }, [currentSlotId]);

  // Mutasi: Tambah Konten Baru
  const addMutation = useMutation(
    trpc.customContent.add.mutationOptions({
      onSuccess: () => {
        toast.success("Komponen isian berhasil ditambahkan.");
        queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
        setFormMode("idle");
        setEditingItem(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menambahkan komponen isian.");
      },
    })
  );

  // Mutasi: Perbarui Konten
  const updateMutation = useMutation(
    trpc.customContent.update.mutationOptions({
      onSuccess: () => {
        toast.success("Isian berhasil diperbarui.");
        queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
        setFormMode("idle");
        setEditingItem(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui isian.");
      },
    })
  );

  // Mutasi: Urutan Internal Slot
  const reorderMutation = useMutation(
    trpc.customContent.reorder.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengubah urutan isian.");
      },
    })
  );

  // Mutasi: Hapus Satuan
  const deleteItemMutation = useMutation(
    trpc.customContent.deleteItem.mutationOptions({
      onSuccess: () => {
        toast.success("Komponen isian dihapus.");
        queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
        setDeleteItemTarget(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus komponen.");
      },
    })
  );

  // Mutasi: Hapus Seluruh Slot
  const deleteSlotMutation = useMutation(
    trpc.customContent.deleteSlot.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Seluruh ${data.deletedCount} isian di slot ini berhasil dibersihkan.`);
        queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
        setWipeSlotDialogOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus slot.");
      },
    })
  );

  // Handler: Geser Urutan Internal (Intra-slot Reordering)
  const handleMoveOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slotItems.length) return;

    const newItems = [...slotItems];
    const [moved] = newItems.splice(index, 1);
    if (!moved) return;
    newItems.splice(targetIndex, 0, moved);

    const reorderedPayload = newItems.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    reorderMutation.mutate({
      invitationId,
      slotId: currentSlotId,
      items: reorderedPayload,
    });
  };

  // Handler: Toggle Visibilitas
  const handleToggleVisible = (itemId: string, currentVisible: boolean) => {
    updateMutation.mutate({
      id: itemId,
      invitationId,
      isVisible: !currentVisible,
    });
  };

  // Handler: Mulai Edit
  const handleStartEdit = (item: CustomContentItemData) => {
    setEditingItem(item);
    setActiveType(item.type as CustomContentType);
    setFormMode("edit");
  };

  // Handler: Submit Form Isian
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

  // Ringkasan Tampilan per Tipe Konten
  const renderItemPreview = (item: CustomContentItemData) => {
    const content = (item.content as Record<string, unknown>) || {};
    switch (item.type) {
      case "TITLE":
        return (
          <div className="flex items-center gap-2">
            <Heading className="size-4 text-primary shrink-0" />
            <span className="font-semibold text-sm truncate">
              {(content.title as string) || "Judul Tanpa Nama"}
            </span>
          </div>
        );
      case "TEXT":
        return (
          <div className="flex items-center gap-2">
            <Type className="size-4 text-blue-500 shrink-0" />
            <span className="text-xs text-muted-foreground truncate line-clamp-1">
              {(content.text as string) || "Teks paragraf..."}
            </span>
          </div>
        );
      case "PHOTO":
        return (
          <div className="flex items-center gap-2">
            <ImageIcon className="size-4 text-emerald-500 shrink-0" />
            <span className="text-xs truncate">
              {(content.caption as string) || (content.imageUrl as string) || "Foto"}
            </span>
          </div>
        );
      case "VIDEO":
        return (
          <div className="flex items-center gap-2">
            <Video className="size-4 text-purple-500 shrink-0" />
            <span className="text-xs truncate">{(content.videoUrl as string) || "Video Clip"}</span>
          </div>
        );
      case "BUTTON":
        return (
          <div className="flex items-center gap-2">
            <MousePointerClick className="size-4 text-amber-500 shrink-0" />
            <span className="font-medium text-xs truncate">
              {(content.label as string) || "Tombol CTA"}
            </span>
          </div>
        );
      case "LINK":
        return (
          <div className="flex items-center gap-2">
            <Link2 className="size-4 text-cyan-500 shrink-0" />
            <span className="text-xs truncate">{(content.label as string) || "Tautan"}</span>
          </div>
        );
      case "YOUTUBE":
        return (
          <div className="flex items-center gap-2">
            <YoutubeIcon className="size-4 text-red-500 shrink-0" />
            <span className="text-xs truncate">
              {(content.youtubeUrl as string) || "YouTube Video"}
            </span>
          </div>
        );
      case "MAP":
        return (
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-rose-500 shrink-0" />
            <span className="font-medium text-xs truncate">
              {(content.locationName as string) || "Lokasi Peta"}
            </span>
          </div>
        );
      default:
        return <span className="text-xs text-muted-foreground">Komponen Isian</span>;
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
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                <Layers className="size-5" />
              </div>
              <div>
                <DialogTitle>Isian Kamu</DialogTitle>
                <DialogDescription className="text-xs">
                  Sisipkan komponen kustom di titik jangkar slot tanpa merusak keindahan template.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* 1. Pemilih Titik Jangkar Slot (Muncul Setelah) */}
          {formMode === "idle" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Muncul setelah:
                </Label>
                <NativeSelect
                  value={currentSlotId}
                  onChange={(e) => {
                    setCurrentSlotId(e.target.value);
                  }}
                  className="w-full"
                >
                  {AVAILABLE_SLOTS.map((slot) => (
                    <NativeSelectOption key={slot.slotId} value={slot.slotId}>
                      {slot.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              {/* Banner Aturan Persistent Slot (PRD Bab 13.1) */}
              <Alert className="border-primary/20 bg-primary/5 text-primary">
                <Info className="size-4 shrink-0 text-primary" />
                <AlertTitle className="text-primary font-medium text-xs">Persistent Slot Rule Aktif</AlertTitle>
                <AlertDescription className="text-muted-foreground dark:text-zinc-300 text-[11px]">
                  Isian tetap berada di posisi ini meskipun section sebelumnya dinonaktifkan
                  atau disembunyikan.
                </AlertDescription>
              </Alert>

              {/* Status & Indikator Urutan Slot */}
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b pb-2">
                <span>
                  Total isian di slot ini:{" "}
                  <strong className="text-foreground">{slotItems.length} komponen</strong>
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Slot ID: {currentSlotInfo?.slotId}
                </Badge>
              </div>

              {/* 2. Daftar Komponen di Slot Ini */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold text-foreground">
                  Daftar Konten di Slot Ini:
                </Label>

                {slotItems.length === 0 ? (
                  <Empty className="rounded-xl border border-dashed border-muted-foreground/30 p-6">
                    <EmptyHeader>
                      <EmptyTitle className="text-xs font-medium text-foreground">Slot ini masih kosong</EmptyTitle>
                      <EmptyDescription className="text-[11px] text-muted-foreground">
                        Pilih salah satu tombol tipe konten di bawah untuk mulai menambahkan isian.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="flex flex-col gap-2">
                    {slotItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-3 transition-colors",
                          item.isVisible ? "bg-card" : "bg-muted/40 opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {/* Indikator Posisi (Contoh: 1/3) */}
                          <Badge
                            variant="secondary"
                            className="text-[10px] size-6 rounded-full flex items-center justify-center p-0 shrink-0"
                          >
                            {idx + 1}
                          </Badge>

                          <div className="min-w-0 flex-1">{renderItemPreview(item)}</div>
                        </div>

                        {/* Tombol Kontrol: Urutan Internal, Edit, Switch, Hapus */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {/* Tombol Urutan Internal */}
                          <div className="flex items-center rounded border bg-background p-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleMoveOrder(idx, "up")}
                              disabled={idx === 0 || reorderMutation.isPending}
                              title="Geser Naik"
                              className="size-5 rounded-none"
                            >
                              <ArrowUp className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleMoveOrder(idx, "down")}
                              disabled={
                                idx === slotItems.length - 1 || reorderMutation.isPending
                              }
                              title="Geser Turun"
                              className="size-5 rounded-none"
                            >
                              <ArrowDown className="size-3" />
                            </Button>
                          </div>

                          {/* Sakelar Tampilkan / Sembunyikan */}
                          <div title={item.isVisible ? "Tampilkan" : "Sembunyikan"}>
                            <Switch
                              checked={item.isVisible}
                              onCheckedChange={() =>
                                handleToggleVisible(item.id, item.isVisible)
                              }
                              size="sm"
                            />
                          </div>

                          {/* Tombol Edit */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleStartEdit(item)}
                            title="Edit Komponen"
                          >
                            <Edit2 className="size-3" />
                          </Button>

                          {/* Tombol Hapus Satuan */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteItemTarget(item)}
                            title="Hapus Komponen"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Tombol Cepat Tambah 8 Tipe Komponen (PRD 13.2) */}
              <div className="flex flex-col gap-2 pt-2 border-t">
                <label className="text-xs font-semibold text-foreground">
                  Tambah Komponen Baru ke Slot Ini:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 justify-start gap-1.5 text-xs"
                    onClick={() => {
                      setActiveType("TITLE");
                      setEditingItem(null);
                      setFormMode("create");
                    }}
                  >
                    <Heading className="size-3.5 text-primary" />
                    <span>+ Judul</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 justify-start gap-1.5 text-xs"
                    onClick={() => {
                      setActiveType("TEXT");
                      setEditingItem(null);
                      setFormMode("create");
                    }}
                  >
                    <Type className="size-3.5 text-blue-500" />
                    <span>+ Teks</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 justify-start gap-1.5 text-xs"
                    onClick={() => {
                      setActiveType("PHOTO");
                      setEditingItem(null);
                      setFormMode("create");
                    }}
                  >
                    <ImageIcon className="size-3.5 text-emerald-500" />
                    <span>+ Foto</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 justify-start gap-1.5 text-xs"
                    onClick={() => {
                      setActiveType("VIDEO");
                      setEditingItem(null);
                      setFormMode("create");
                    }}
                  >
                    <Video className="size-3.5 text-purple-500" />
                    <span>+ Video</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 justify-start gap-1.5 text-xs"
                    onClick={() => {
                      setActiveType("BUTTON");
                      setEditingItem(null);
                      setFormMode("create");
                    }}
                  >
                    <MousePointerClick className="size-3.5 text-amber-500" />
                    <span>+ Tombol</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 justify-start gap-1.5 text-xs"
                    onClick={() => {
                      setActiveType("LINK");
                      setEditingItem(null);
                      setFormMode("create");
                    }}
                  >
                    <Link2 className="size-3.5 text-cyan-500" />
                    <span>+ Tautan</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 justify-start gap-1.5 text-xs"
                    onClick={() => {
                      setActiveType("YOUTUBE");
                      setEditingItem(null);
                      setFormMode("create");
                    }}
                  >
                    <YoutubeIcon className="size-3.5 text-red-500" />
                    <span>+ YouTube</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 justify-start gap-1.5 text-xs"
                    onClick={() => {
                      setActiveType("MAP");
                      setEditingItem(null);
                      setFormMode("create");
                    }}
                  >
                    <MapPin className="size-3.5 text-rose-500" />
                    <span>+ Peta Lokasi</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mode Form Pengisian Konten */}
          {formMode !== "idle" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-sm">
                  {formMode === "edit" ? "Edit Komponen" : "Tambah Komponen Baru"}:{" "}
                  <Badge variant="secondary" className="ml-1 uppercase text-[10px]">
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
                  editingItem ? (editingItem.content as Record<string, unknown>) : undefined
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

          {/* Footer Modal: Tombol Hapus Bersih Slot & Selesai */}
          {formMode === "idle" && (
            <DialogFooter className="flex-col sm:flex-row items-center justify-between gap-2 border-t pt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setWipeSlotDialogOpen(true)}
                disabled={slotItems.length === 0 || deleteSlotMutation.isPending}
                className="gap-1.5 text-xs w-full sm:w-auto"
              >
                <Trash2 className="size-3.5" />
                <span>Hapus Seluruh Isian di Slot Ini</span>
              </Button>

              <DialogClose render={<Button size="sm" className="w-full sm:w-auto" />}>
                Selesai
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus Seluruh Isian di Slot (Task 5.3) */}
      <AlertDialog
        open={wipeSlotDialogOpen}
        onOpenChange={(isOpen) => setWipeSlotDialogOpen(isOpen)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Seluruh Isian di Slot Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus seluruh <strong>{slotItems.length}</strong> isian
              pada posisi <strong>"{currentSlotInfo?.label}"</strong>? Tindakan ini permanen dan
              seluruh blok kustom di slot ini akan terhapus bersih.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSlotMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteSlotMutation.isPending}
              onClick={() =>
                deleteSlotMutation.mutate({
                  invitationId,
                  slotId: currentSlotId,
                })
              }
            >
              {deleteSlotMutation.isPending ? "Menghapus..." : "Ya, Hapus Seluruh Isian"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Hapus Satuan */}
      <AlertDialog
        open={!!deleteItemTarget}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteItemTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Komponen Isian Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Komponen ini akan dihapus dari undangan Anda. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteItemMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteItemMutation.isPending}
              onClick={() => {
                if (deleteItemTarget) {
                  deleteItemMutation.mutate({
                    id: deleteItemTarget.id,
                    invitationId,
                  });
                }
              }}
            >
              {deleteItemMutation.isPending ? "Menghapus..." : "Ya, Hapus Komponen"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
