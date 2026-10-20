import type * as React from "react";
import {
  Heading,
  Image as ImageIcon,
  Link2,
  MapPin,
  MousePointerClick,
  Type,
  Video,
} from "lucide-react";

export type CustomContentType =
  | "TITLE"
  | "TEXT"
  | "PHOTO"
  | "VIDEO"
  | "BUTTON"
  | "LINK"
  | "YOUTUBE"
  | "MAP";

export function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
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

export interface ContentTypeOption {
  type: CustomContentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass: string;
  description: string;
}

export const CONTENT_TYPE_OPTIONS: readonly ContentTypeOption[] = [
  {
    type: "TITLE",
    label: "Judul",
    icon: Heading,
    iconColorClass: "text-primary",
    description: "Header teks tebal",
  },
  {
    type: "TEXT",
    label: "Teks",
    icon: Type,
    iconColorClass: "text-blue-500",
    description: "Paragraf narasi",
  },
  {
    type: "PHOTO",
    label: "Foto",
    icon: ImageIcon,
    iconColorClass: "text-emerald-500",
    description: "Banner gambar",
  },
  {
    type: "VIDEO",
    label: "Video",
    icon: Video,
    iconColorClass: "text-purple-500",
    description: "Video klip MP4",
  },
  {
    type: "BUTTON",
    label: "Tombol",
    icon: MousePointerClick,
    iconColorClass: "text-amber-500",
    description: "Aksi tombol CTA",
  },
  {
    type: "LINK",
    label: "Tautan",
    icon: Link2,
    iconColorClass: "text-cyan-500",
    description: "Tautan eksternal",
  },
  {
    type: "YOUTUBE",
    label: "YouTube",
    icon: YoutubeIcon,
    iconColorClass: "text-red-500",
    description: "Embed pemutar YouTube",
  },
  {
    type: "MAP",
    label: "Peta Lokasi",
    icon: MapPin,
    iconColorClass: "text-rose-500",
    description: "Petunjuk Google Maps",
  },
] as const;

export function getDefaultContentPayload(
  type: CustomContentType
): Record<string, unknown> {
  switch (type) {
    case "TITLE":
      return {
        title: "Judul Tambahan Baru",
        align: "center",
        fontSize: "text-xl",
      };
    case "TEXT":
      return {
        text: "Tuliskan catatan, ucapan terima kasih, atau informasi penting lainnya di sini.",
        align: "center",
      };
    case "PHOTO":
      return {
        imageUrl:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        caption: "Foto Momen Bahagia",
        aspectRatio: "16:9",
      };
    case "VIDEO":
      return {
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        isMuted: true,
      };
    case "BUTTON":
      return {
        label: "Buka Tautan Acara",
        url: "#",
        style: "solid",
        openNewTab: false,
      };
    case "LINK":
      return {
        label: "Petunjuk / Informasi Tambahan",
        url: "https://google.com",
      };
    case "YOUTUBE":
      return {
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        autoPlay: false,
      };
    case "MAP":
      return {
        locationName: "Lokasi Acara / Gedung Pertemuan",
        address: "Jl. Utama No. 123, Kota",
        mapsUrl: "https://maps.google.com",
      };
  }
}
