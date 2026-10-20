"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Check,
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Input } from "@senara/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@senara/ui/components/tabs";
import { cn } from "@senara/ui/lib/utils";

import {
  MEDIA_ASSETS_CATALOG,
  type MediaAssetItem,
} from "./media-assets-catalog";

const DEFAULT_CURATED_UPLOADS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
];

export interface MediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  currentImageUrl?: string;
  uploadedPhotos?: string[];
  onSelectImage: (imageUrl: string) => void;
  onDeleteImage?: () => void;
  onUpdateUploadedPhotos?: (updatedPhotos: string[]) => void;
}

export function MediaModal({
  open,
  onOpenChange,
  title = "Media",
  currentImageUrl,
  uploadedPhotos = [],
  onSelectImage,
  onDeleteImage,
  onUpdateUploadedPhotos,
}: MediaModalProps) {
  const fileInputId = useId();
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [selectedUrl, setSelectedUrl] = useState<string>(currentImageUrl ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [uploads, setUploads] = useState<string[]>(() =>
    Array.from(new Set([...uploadedPhotos, ...DEFAULT_CURATED_UPLOADS]))
  );

  const filteredAssets = useMemo(() => {
    return MEDIA_ASSETS_CATALOG.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const dataUrl = reader.result;
        setSelectedUrl(dataUrl);
        const nextUploads = Array.from(new Set([dataUrl, ...uploads]));
        setUploads(nextUploads);
        onUpdateUploadedPhotos?.(nextUploads);
        toast.success("Gambar berhasil diunggah!");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteUpload = (urlToDelete: string) => {
    const nextUploads = uploads.filter((u) => u !== urlToDelete);
    setUploads(nextUploads);
    onUpdateUploadedPhotos?.(nextUploads);
    if (selectedUrl === urlToDelete) {
      setSelectedUrl("");
    }
    toast.success("Foto dihapus dari galeri unggahan.");
  };

  const handleInsert = () => {
    if (!selectedUrl) return;
    onSelectImage(selectedUrl);
    onOpenChange(false);
  };

  const handleDeleteOrCancel = () => {
    if (onDeleteImage && selectedUrl) {
      onDeleteImage();
      onOpenChange(false);
      toast.success("Gambar berhasil dihapus.");
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-lg flex flex-col">
        {/* Header Modal */}
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Tab Navigasi: Gallery & Assets */}
        <div className="px-4 pt-3">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as string)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger
                value="gallery"
                className="text-xs font-semibold py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="text-xs font-semibold py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>Assets</span>
                <Badge
                  variant="destructive"
                  className="text-[9px] px-1 py-0 h-4 bg-rose-500 font-bold"
                >
                  NEW
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: GALLERY */}
            <TabsContent
              value="gallery"
              className="mt-3 focus-visible:outline-none"
            >
              <div className="max-h-[50vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-1">
                  {/* Kartu Unggah Foto Dotted */}
                  <label
                    htmlFor={fileInputId}
                    className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all cursor-pointer p-2 text-center group"
                  >
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary group-hover:scale-110 transition-transform">
                      <Camera className="size-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-primary mt-1.5 leading-tight">
                      Unggah Foto
                    </span>
                    <input
                      id={fileInputId}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* Daftar Foto Yang Diunggah */}
                  {uploads.map((url, idx) => {
                    const isSelected = selectedUrl === url;
                    return (
                      <div
                        key={`upload-${idx}-${url.slice(-10)}`}
                        onClick={() => setSelectedUrl(url)}
                        className={cn(
                          "group relative aspect-square rounded-xl overflow-hidden border bg-muted cursor-pointer transition-all",
                          isSelected
                            ? "ring-3 ring-primary shadow-md border-primary"
                            : "hover:border-foreground/40 hover:shadow-xs"
                        )}
                      >
                        <Image
                          src={url}
                          alt="Uploaded photo"
                          fill
                          className="object-cover"
                          unoptimized={url.startsWith("data:")}
                        />

                        {/* Indikator Terpilih */}
                        {isSelected ? (
                          <div className="absolute top-1.5 left-1.5 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow">
                            <Check className="size-3" />
                          </div>
                        ) : null}

                        {/* Tombol Hapus Merah */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUpload(url);
                          }}
                          className="absolute top-1.5 right-1.5 size-5 rounded-full bg-rose-500/90 text-white flex items-center justify-center opacity-85 hover:opacity-100 hover:scale-110 hover:bg-rose-600 transition-all shadow-md"
                          title="Hapus foto"
                        >
                          <Trash2 className="size-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: ASSETS (NEW) */}
            <TabsContent
              value="assets"
              className="mt-3 focus-visible:outline-none flex flex-col gap-2.5"
            >
              {/* Kolom Pencarian */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari asset (pengantin, bca, mandiri, kaligrafi)..."
                  className="h-8 pl-8 text-xs bg-muted/20"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                ) : null}
              </div>

              {/* Filter Kategori */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: "all", label: "Semua" },
                  { id: "wedding", label: "Pengantin" },
                  { id: "bank", label: "Bank & E-Wallet" },
                  { id: "ornament", label: "Ornamen" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full border text-[10px] font-medium transition-colors shrink-0",
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid Aset */}
              <div className="max-h-[44vh] overflow-y-auto pr-1">
                {filteredAssets.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Tidak ada aset yang cocok dengan pencarian "{searchQuery}".
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-1">
                    {filteredAssets.map((asset) => {
                      const isSelected = selectedUrl === asset.url;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedUrl(asset.url)}
                          className={cn(
                            "flex flex-col items-center justify-between p-2 rounded-xl border bg-card/60 cursor-pointer transition-all aspect-square text-center group",
                            isSelected
                              ? "ring-3 ring-primary border-primary shadow-sm bg-primary/5"
                              : "hover:border-primary/50 hover:bg-muted/40"
                          )}
                          title={asset.name}
                        >
                          <div className="relative size-14 flex items-center justify-center">
                            <Image
                              src={asset.url}
                              alt={asset.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                            {isSelected ? (
                              <div className="absolute top-0 right-0 size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow">
                                <Check className="size-2.5" />
                              </div>
                            ) : null}
                          </div>
                          <span className="text-[10px] font-medium text-foreground truncate w-full px-1">
                            {asset.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Modal: Delete Image & Insert Image */}
        <DialogFooter className="p-3.5 border-t bg-muted/15 flex-row items-center justify-end gap-2 mt-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDeleteOrCancel}
            className="text-xs"
          >
            {onDeleteImage && selectedUrl ? "Delete Image" : "Batal"}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleInsert}
            disabled={!selectedUrl}
            className="text-xs bg-teal-600 hover:bg-teal-700 text-white"
          >
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

