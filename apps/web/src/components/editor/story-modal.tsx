"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Heart,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import { Separator } from "@senara/ui/components/separator";
import { Textarea } from "@senara/ui/components/textarea";

import type { UnifiedStoryItem } from "@/components/invitation/unified-invitation-data";

export interface StoryModalItem {
  id?: string;
  yearOrDate: string;
  title: string;
  story: string;
  imageUrl?: string | null;
}

export interface StoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stories: UnifiedStoryItem[];
  initialBadge?: string;
  initialTitle?: string;
  onSave: (data: {
    stories: StoryModalItem[];
    badge: string;
    title: string;
  }) => Promise<void> | void;
  isSaving?: boolean;
}

export function StoryModal({
  open,
  onOpenChange,
  stories,
  initialBadge = "Catatan Perjalanan",
  initialTitle = "Lembar demi Lembar",
  onSave,
  isSaving = false,
}: StoryModalProps) {
  const [badge, setBadge] = useState(initialBadge);
  const [sectionTitle, setSectionTitle] = useState(initialTitle);
  const [items, setItems] = useState<StoryModalItem[]>([]);

  useEffect(() => {
    if (open) {
      setBadge(initialBadge || "Catatan Perjalanan");
      setSectionTitle(initialTitle || "Lembar demi Lembar");
      if (stories && stories.length > 0) {
        setItems(
          stories.map((s) => ({
            id: s.id,
            yearOrDate: s.yearOrDate,
            title: s.title,
            story: s.story,
            imageUrl: s.imageUrl ?? null,
          }))
        );
      } else {
        setItems([
          {
            yearOrDate: "Oktober 2022",
            title: "Awal Perjumpaan",
            story:
              "Pertemuan hangat yang mengawali kisah indah penuh rasa syukur.",
          },
          {
            yearOrDate: "Mei 2025",
            title: "Mengikat Janji",
            story:
              "Melangkah bersama keluarga besar menuju hari bahagia yang dinanti.",
          },
        ]);
      }
    }
  }, [open, stories, initialBadge, initialTitle]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        yearOrDate: "Tahun / Momen",
        title: "Judul Momen Baru",
        story: "Tuliskan cerita singkat tentang perjalanan indah Anda di sini.",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index]!;
      copy[index] = copy[index - 1]!;
      copy[index - 1] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index]!;
      copy[index] = copy[index + 1]!;
      copy[index + 1] = temp;
      return copy;
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof StoryModalItem,
    val: string
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index]!, [field]: val };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    await onSave({
      stories: items,
      badge: badge.trim() || "Catatan Perjalanan",
      title: sectionTitle.trim() || "Lembar demi Lembar",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Edit Cerita Perjalanan Cinta
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Atur alur kisah perjalanan cinta Anda yang ditampilkan pada
                  bagian timeline undangan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Pengaturan Judul & Badge Bagian */}
          <div className="rounded-xl border bg-muted/20 p-3.5 space-y-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>Judul Bagian Cerita</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="story-badge" className="text-[11px] font-medium">
                  Label / Badge Atas
                </Label>
                <Input
                  id="story-badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Contoh: CATATAN PERJALANAN"
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="story-title" className="text-[11px] font-medium">
                  Judul Utama
                </Label>
                <Input
                  id="story-title"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="Contoh: Lembar demi Lembar"
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>

          {/* Daftar Momen / Cerita */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Heart className="size-3.5 text-rose-500" />
                <span>Rangkaian Momen ({items.length})</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5"
              >
                <Plus className="size-3" />
                <span>Tambah Momen</span>
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <Card
                  key={item.id ?? `story-item-${idx}`}
                  className="border shadow-xs bg-card/60"
                >
                  <CardHeader className="p-3.5 pb-2 border-b bg-muted/10 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold px-2 py-0.5"
                      >
                        Kisah #{idx + 1}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground truncate max-w-[180px]">
                        {item.title || "Tanpa Judul"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-foreground"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        title="Geser Ke Atas"
                      >
                        <ChevronUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-foreground"
                        disabled={idx === items.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        title="Geser Ke Bawah"
                      >
                        <ChevronDown className="size-3.5" />
                      </Button>
                      {items.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(idx)}
                          title="Hapus Kisah Ini"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      ) : null}
                    </div>
                  </CardHeader>

                  <CardContent className="p-3.5 space-y-2.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <Label
                          htmlFor={`story-year-${idx}`}
                          className="text-[11px] font-medium"
                        >
                          Waktu / Tahun / Momen
                        </Label>
                        <Input
                          id={`story-year-${idx}`}
                          value={item.yearOrDate}
                          onChange={(e) =>
                            handleItemChange(idx, "yearOrDate", e.target.value)
                          }
                          placeholder="Contoh: Oktober 2022"
                          className="text-xs h-8"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`story-title-${idx}`}
                          className="text-[11px] font-medium"
                        >
                          Judul Kisah
                        </Label>
                        <Input
                          id={`story-title-${idx}`}
                          value={item.title}
                          onChange={(e) =>
                            handleItemChange(idx, "title", e.target.value)
                          }
                          placeholder="Contoh: Awal Perjumpaan"
                          className="text-xs h-8"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor={`story-desc-${idx}`}
                        className="text-[11px] font-medium"
                      >
                        Isi Cerita
                      </Label>
                      <Textarea
                        id={`story-desc-${idx}`}
                        rows={2}
                        value={item.story}
                        onChange={(e) =>
                          handleItemChange(idx, "story", e.target.value)
                        }
                        placeholder="Tuliskan cerita singkat tentang momen ini..."
                        className="text-xs leading-relaxed"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="w-full text-xs gap-1.5 border-dashed border-primary/40 text-primary hover:bg-primary/5 py-3"
            >
              <Plus className="size-3.5" />
              <span>Tambah Momen Cerita Baru</span>
            </Button>
          </div>

          <DialogFooter className="flex-row items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

