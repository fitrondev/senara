import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import type { ThemeConfig } from "@/components/editor/theme-modal";

import type { BankAccountItem } from "./digital-gift-section";
import type { EditorRegionKey } from "./edit-context";
import type { EventScheduleItem } from "./event-section";
import type { PublicCustomContentItem } from "./public-custom-content-slot";
import { BLUSH_CONFETTI_PRESET } from "./templates/blush-confetti";
import { CRESCENT_LINEN_PRESET } from "./templates/crescent-linen";
import { JAWA_BIRU_PRESET } from "./templates/jawa-biru";
import { KARTU_POS_PRESET, type TemplateThemePreset } from "./templates/kartu-pos";

export interface UnifiedSectionConfig {
  sectionKey: string;
  title?: string | null;
  sortOrder: number;
  isVisible: boolean;
  isLocked?: boolean;
}

export interface UnifiedStoryItem {
  id: string;
  yearOrDate: string;
  title: string;
  story: string;
  imageUrl?: string | null;
}

export interface UnifiedGalleryItem {
  id: string;
  mediaUrl: string;
  mediaType?: string;
  caption?: string | null;
}

export interface UnifiedInvitationProps {
  invitationId?: string;
  templateSlug: string;
  title: string;
  eventDate?: Date | string | null;
  coverImageUrl?: string | null;
  musicUrl?: string | null;
  musicStartAt?: number;
  fontScale?: number;
  scriptFont?: string;
  themeConfig?: ThemeConfig;
  sections?: UnifiedSectionConfig[];
  schedules?: EventScheduleItem[];
  bankAccounts?: BankAccountItem[];
  galleries?: UnifiedGalleryItem[];
  loveStories?: UnifiedStoryItem[];
  customContents?: CustomContentItemData[] | PublicCustomContentItem[];
  guestId?: string;
  guestName?: string;
  isGroupLink?: boolean;
  resellerBrandName?: string | null;
  resellerLogoUrl?: string | null;
  withPhotos?: boolean;
  editing?: boolean;
  demo?: boolean;
  live?: boolean;
  showCoverGateInitially?: boolean;
  fields?: Record<string, string>;
  onPatchField?: (key: string, value: string) => void;
  onOpenRegion?: (region: EditorRegionKey) => void;
  onOpenTextEditor?: (params: { field: string; label?: string; fallback: string }) => void;
  onToggleSection?: (sectionKey: string, nextVisible: boolean) => void;
  onOpenCustomSlot?: (slotId: string) => void;
}

const fullEventDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatInvitationEventDate(
  eventDate?: Date | string | null
): string {
  if (!eventDate) return "Sabtu, 24 Oktober 2026";
  const parsed = typeof eventDate === "string" ? new Date(eventDate) : eventDate;
  if (Number.isNaN(parsed.getTime())) return "Sabtu, 24 Oktober 2026";
  return fullEventDateFormatter.format(parsed);
}

export function resolveTemplatePreset(templateSlug: string): TemplateThemePreset {
  if (templateSlug.includes("jawa-biru")) return JAWA_BIRU_PRESET;
  if (templateSlug.includes("blush-confetti")) return BLUSH_CONFETTI_PRESET;
  if (templateSlug.includes("crescent-linen")) return CRESCENT_LINEN_PRESET;
  return KARTU_POS_PRESET;
}

export const DEFAULT_DEMO_SCHEDULES: EventScheduleItem[] = [
  {
    id: "sched-1",
    title: "Akad / Acara Utama",
    date: new Date("2026-10-24T08:00:00Z"),
    startTime: "08:00",
    endTime: "10:00",
    timezone: "WIB",
    venueName: "Pendopo Agung Senara Heritage",
    address: "Jl. Taman Kebon Sirih No. 18, Jakarta Pusat",
    mapsUrl: "https://maps.google.com",
  },
  {
    id: "sched-2",
    title: "Resepsi & Ramah Tamah",
    date: new Date("2026-10-24T11:00:00Z"),
    startTime: "11:00",
    endTime: "14:00",
    timezone: "WIB",
    venueName: "Grand Ballroom Senara",
    address: "Jl. Taman Kebon Sirih No. 18, Jakarta Pusat",
    mapsUrl: "https://maps.google.com",
  },
];

export const DEFAULT_DEMO_STORIES: UnifiedStoryItem[] = [
  {
    id: "story-1",
    yearOrDate: "Oktober 2022",
    title: "Awal Perjumpaan",
    story: "Pertemuan hangat yang mengawali kisah indah penuh rasa syukur.",
  },
  {
    id: "story-2",
    yearOrDate: "Mei 2025",
    title: "Mengikat Janji",
    story: "Melangkah bersama keluarga besar menuju hari bahagia yang dinanti.",
  },
];

export const DEFAULT_DEMO_GALLERIES: UnifiedGalleryItem[] = [
  {
    id: "gal-1",
    mediaUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    caption: "Momen Bahagia 1",
  },
  {
    id: "gal-2",
    mediaUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    caption: "Momen Bahagia 2",
  },
  {
    id: "gal-3",
    mediaUrl:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
    caption: "Momen Bahagia 3",
  },
  {
    id: "gal-4",
    mediaUrl:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    caption: "Momen Bahagia 4",
  },
];

export const DEFAULT_DEMO_BANKS: BankAccountItem[] = [
  {
    id: "bank-1",
    bankName: "BCA",
    accountNo: "8720194821",
    accountName: "Adinda Rahma",
    qrisImageUrl: null,
  },
  {
    id: "bank-2",
    bankName: "Mandiri",
    accountNo: "1370029184712",
    accountName: "Bagas Pratama",
    qrisImageUrl: null,
  },
];

