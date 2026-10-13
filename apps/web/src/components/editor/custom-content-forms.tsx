"use client";

import { useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ExternalLink,
  Heading,
  Image as ImageIcon,
  Link2,
  Loader2,
  MapPin,
  MousePointerClick,
  Type,
  Video,
} from "lucide-react";

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

import { Alert, AlertDescription } from "@senara/ui/components/alert";
import { Button } from "@senara/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@senara/ui/components/field";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@senara/ui/components/native-select";
import { Switch } from "@senara/ui/components/switch";
import { Textarea } from "@senara/ui/components/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@senara/ui/components/toggle-group";
import { cn } from "@senara/ui/lib/utils";

export type CustomContentType =
  "TITLE" | "TEXT" | "PHOTO" | "VIDEO" | "BUTTON" | "LINK" | "YOUTUBE" | "MAP";

export interface CustomContentFormProps {
  type: CustomContentType;
  initialData?: Record<string, unknown>;
  onSubmit: (contentPayload: Record<string, unknown>) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CustomContentForm({
  type,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CustomContentFormProps) {
  // 1. TITLE (Judul)
  const [title, setTitle] = useState<string>(
    (initialData?.title as string) || ""
  );
  const [titleAlign, setTitleAlign] = useState<"left" | "center" | "right">(
    (initialData?.align as "left" | "center" | "right") || "center"
  );
  const [fontSize, setFontSize] = useState<string>(
    (initialData?.fontSize as string) || "text-xl"
  );

  // 2. TEXT (Teks Paragraf)
  const [text, setText] = useState<string>((initialData?.text as string) || "");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    (initialData?.align as "left" | "center" | "right") || "center"
  );

  // 3. PHOTO (Foto Tunggal / Banner)
  const [imageUrl, setImageUrl] = useState<string>(
    (initialData?.imageUrl as string) || ""
  );
  const [photoCaption, setPhotoCaption] = useState<string>(
    (initialData?.caption as string) || ""
  );
  const [aspectRatio, setAspectRatio] = useState<string>(
    (initialData?.aspectRatio as string) || "16:9"
  );

  // 4. VIDEO (Self-Hosted / Storage URL)
  const [videoUrl, setVideoUrl] = useState<string>(
    (initialData?.videoUrl as string) || ""
  );
  const [posterUrl, setPosterUrl] = useState<string>(
    (initialData?.posterUrl as string) || ""
  );
  const [isMuted, setIsMuted] = useState<boolean>(
    typeof initialData?.isMuted === "boolean" ? initialData.isMuted : true
  );

  // 5. BUTTON (Tombol Aksi CTA)
  const [buttonLabel, setButtonLabel] = useState<string>(
    (initialData?.label as string) || ""
  );
  const [buttonUrl, setButtonUrl] = useState<string>(
    (initialData?.url as string) || ""
  );
  const [buttonStyle, setButtonStyle] = useState<"solid" | "outline">(
    (initialData?.style as "solid" | "outline") || "solid"
  );
  const [buttonOpenNewTab, setButtonOpenNewTab] = useState<boolean>(
    typeof initialData?.openNewTab === "boolean" ? initialData.openNewTab : true
  );

  // 6. LINK (Tautan Teks)
  const [linkLabel, setLinkLabel] = useState<string>(
    (initialData?.label as string) || ""
  );
  const [linkUrl, setLinkUrl] = useState<string>(
    (initialData?.url as string) || ""
  );

  // 7. YOUTUBE (YouTube Embed)
  const [youtubeUrl, setYoutubeUrl] = useState<string>(
    (initialData?.youtubeUrl as string) || ""
  );
  const [youtubeAutoplay, setYoutubeAutoplay] = useState<boolean>(
    typeof initialData?.autoPlay === "boolean" ? initialData.autoPlay : false
  );

  // 8. MAP (Peta Lokasi Tambahan)
  const [mapLocationName, setMapLocationName] = useState<string>(
    (initialData?.locationName as string) || ""
  );
  const [mapAddress, setMapAddress] = useState<string>(
    (initialData?.address as string) || ""
  );
  const [mapsUrl, setMapsUrl] = useState<string>(
    (initialData?.mapsUrl as string) || ""
  );

  // Error validation state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let payload: Record<string, unknown> = {};

    switch (type) {
      case "TITLE":
        if (!title.trim()) {
          setErrorMsg("Judul wajib diisi.");
          return;
        }
        payload = { title: title.trim(), align: titleAlign, fontSize };
        break;

      case "TEXT":
        if (!text.trim()) {
          setErrorMsg("Isi teks paragraf wajib diisi.");
          return;
        }
        payload = { text: text.trim(), align: textAlign };
        break;

      case "PHOTO":
        if (!imageUrl.trim()) {
          setErrorMsg("URL foto wajib diisi.");
          return;
        }
        payload = {
          imageUrl: imageUrl.trim(),
          caption: photoCaption.trim() || undefined,
          aspectRatio,
        };
        break;

      case "VIDEO":
        if (!videoUrl.trim()) {
          setErrorMsg("URL video wajib diisi.");
          return;
        }
        payload = {
          videoUrl: videoUrl.trim(),
          posterUrl: posterUrl.trim() || undefined,
          isMuted,
        };
        break;

      case "BUTTON":
        if (!buttonLabel.trim()) {
          setErrorMsg("Label tombol wajib diisi.");
          return;
        }
        if (!buttonUrl.trim()) {
          setErrorMsg("URL tujuan tombol wajib diisi.");
          return;
        }
        payload = {
          label: buttonLabel.trim(),
          url: buttonUrl.trim(),
          style: buttonStyle,
          openNewTab: buttonOpenNewTab,
        };
        break;

      case "LINK":
        if (!linkLabel.trim()) {
          setErrorMsg("Label tautan wajib diisi.");
          return;
        }
        if (!linkUrl.trim()) {
          setErrorMsg("URL tautan wajib diisi.");
          return;
        }
        payload = {
          label: linkLabel.trim(),
          url: linkUrl.trim(),
        };
        break;

      case "YOUTUBE":
        if (!youtubeUrl.trim()) {
          setErrorMsg("URL video YouTube wajib diisi.");
          return;
        }
        payload = {
          youtubeUrl: youtubeUrl.trim(),
          autoPlay: youtubeAutoplay,
        };
        break;

      case "MAP":
        if (!mapLocationName.trim()) {
          setErrorMsg("Nama lokasi wajib diisi.");
          return;
        }
        payload = {
          locationName: mapLocationName.trim(),
          address: mapAddress.trim() || undefined,
          mapsUrl: mapsUrl.trim() || undefined,
        };
        break;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
      {errorMsg ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      ) : null}

      {/* Form: TITLE */}
      {type === "TITLE" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title-text" className="text-xs font-medium">
              Judul / Heading <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title-text"
              placeholder="Contoh: Dress Code & Busana Acara"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Perataan Teks</Label>
              <ToggleGroup
                value={[titleAlign]}
                onValueChange={(val) => {
                  const first = val[0];
                  if (first) {
                    setTitleAlign(first as "left" | "center" | "right");
                  }
                }}
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <ToggleGroupItem value="left" aria-label="Rata Kiri">
                  <AlignLeft className="size-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Rata Tengah">
                  <AlignCenter className="size-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Rata Kanan">
                  <AlignRight className="size-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Ukuran Teks</Label>
              <NativeSelect
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full"
              >
                <NativeSelectOption value="text-lg">
                  Sedang (18px)
                </NativeSelectOption>
                <NativeSelectOption value="text-xl">
                  Besar (20px)
                </NativeSelectOption>
                <NativeSelectOption value="text-2xl">
                  Sangat Besar (24px)
                </NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
        </div>
      )}

      {/* Form: TEXT */}
      {type === "TEXT" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="text-body" className="text-xs font-medium">
              Isi Teks Paragraf <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="text-body"
              rows={4}
              placeholder="Tuliskan keterangan pengumuman, panduan dress code, atau permohonan doa..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Perataan Teks</Label>
            <ToggleGroup
              value={[textAlign]}
              onValueChange={(val) => {
                const first = val[0];
                if (first) {
                  setTextAlign(first as "left" | "center" | "right");
                }
              }}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <ToggleGroupItem value="left" aria-label="Rata Kiri">
                <AlignLeft className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Rata Tengah">
                <AlignCenter className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Rata Kanan">
                <AlignRight className="size-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      )}

      {/* Form: PHOTO */}
      {type === "PHOTO" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="photo-url" className="text-xs font-medium">
              URL Foto / Gambar <span className="text-destructive">*</span>
            </Label>
            <Input
              id="photo-url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="photo-caption" className="text-xs font-medium">
                Teks Keterangan (Opsional)
              </Label>
              <Input
                id="photo-caption"
                placeholder="Denah Lokasi / Panduan Busana"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Rasio Foto</Label>
              <NativeSelect
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full"
              >
                <NativeSelectOption value="16:9">
                  Landscape (16:9)
                </NativeSelectOption>
                <NativeSelectOption value="4:5">
                  Potret (4:5)
                </NativeSelectOption>
                <NativeSelectOption value="1:1">
                  Kotak Persegi (1:1)
                </NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          {imageUrl ? (
            <div className="bg-muted relative mt-1 h-32 w-full overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Pratinjau Foto"
                className="h-full w-full object-cover"
                onError={() =>
                  setErrorMsg(
                    "Gagal memuat URL foto. Periksa kembali tautan Anda."
                  )
                }
              />
            </div>
          ) : null}
        </div>
      )}

      {/* Form: VIDEO */}
      {type === "VIDEO" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video-url" className="text-xs font-medium">
              URL File Video (MP4 / WebM){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="video-url"
              placeholder="https://storage.senara.id/videos/clip.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="poster-url" className="text-xs font-medium">
              URL Poster Sampul Video (Opsional)
            </Label>
            <Input
              id="poster-url"
              placeholder="https://images.unsplash.com/..."
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">Mute Suara Bawaan</Label>
              <p className="text-muted-foreground text-[11px]">
                Memulai video tanpa suara agar nyaman bagi pengunjung.
              </p>
            </div>
            <Switch
              checked={isMuted}
              onCheckedChange={(val) => setIsMuted(val)}
            />
          </div>
        </div>
      )}

      {/* Form: BUTTON */}
      {type === "BUTTON" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="button-label" className="text-xs font-medium">
                Teks Tombol <span className="text-destructive">*</span>
              </Label>
              <Input
                id="button-label"
                placeholder="Contoh: Gabung Grup WhatsApp"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Gaya Tampilan</Label>
              <NativeSelect
                value={buttonStyle}
                onChange={(e) =>
                  setButtonStyle(e.target.value as "solid" | "outline")
                }
                className="w-full"
              >
                <NativeSelectOption value="solid">
                  Tombol Solid (Warna Penuh)
                </NativeSelectOption>
                <NativeSelectOption value="outline">
                  Tombol Outline (Garis Tepi)
                </NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="button-url" className="text-xs font-medium">
              URL Tujuan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="button-url"
              placeholder="https://chat.whatsapp.com/..."
              value={buttonUrl}
              onChange={(e) => setButtonUrl(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">Buka di Tab Baru</Label>
              <p className="text-muted-foreground text-[11px]">
                Membuka tautan di jendela baru tanpa menutup undangan.
              </p>
            </div>
            <Switch
              checked={buttonOpenNewTab}
              onCheckedChange={(val) => setButtonOpenNewTab(val)}
            />
          </div>
        </div>
      )}

      {/* Form: LINK */}
      {type === "LINK" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-label" className="text-xs font-medium">
              Teks Tautan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="link-label"
              placeholder="Contoh: Kunjungi Instagram Mempelai (@adinda_bagas)"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-url" className="text-xs font-medium">
              URL Tautan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="link-url"
              placeholder="https://instagram.com/adinda_bagas"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {/* Form: YOUTUBE */}
      {type === "YOUTUBE" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="yt-url" className="text-xs font-medium">
              Tautan Video YouTube / Live Streaming{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="yt-url"
              placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
            />
            <p className="text-muted-foreground text-[11px]">
              Mendukung video siaran langsung (Live Akad) atau video sinematik
              prewedding.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">
                Mulai Otomatis (Muted)
              </Label>
              <p className="text-muted-foreground text-[11px]">
                Memutar otomatis dalam mode hening saat pengunjung scroll.
              </p>
            </div>
            <Switch
              checked={youtubeAutoplay}
              onCheckedChange={(val) => setYoutubeAutoplay(val)}
            />
          </div>
        </div>
      )}

      {/* Form: MAP */}
      {type === "MAP" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="map-name" className="text-xs font-medium">
              Nama Lokasi / Gedung <span className="text-destructive">*</span>
            </Label>
            <Input
              id="map-name"
              placeholder="Contoh: Hotel Santika Premiere / Gedung Resepsi Kedua"
              value={mapLocationName}
              onChange={(e) => setMapLocationName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="map-address" className="text-xs font-medium">
              Alamat Lengkap (Opsional)
            </Label>
            <Input
              id="map-address"
              placeholder="Jl. Ahmad Yani No. 12, Bekasi Barat"
              value={mapAddress}
              onChange={(e) => setMapAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="map-url" className="text-xs font-medium">
              Tautan Google Maps (Opsional)
            </Label>
            <Input
              id="map-url"
              placeholder="https://maps.app.goo.gl/..."
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Tombol Aksi Form */}
      <div className="mt-2 flex items-center justify-end gap-2 border-t pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="gap-1.5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Simpan Layout Kustom</span>
          )}
        </Button>
      </div>
    </form>
  );
}
