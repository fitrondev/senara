export type LayoutCategory =
  | "all"
  | "opening"
  | "love-story"
  | "quotes"
  | "profile"
  | "salam"
  | "couple"
  | "event"
  | "maps"
  | "countdown"
  | "filter"
  | "live"
  | "gallery"
  | "gift"
  | "contact"
  | "video"
  | "rsvp"
  | "dresscode"
  | "invitation"
  | "protocol";

export interface LayoutCategoryOption {
  id: LayoutCategory;
  label: string;
}

export const LAYOUT_CATEGORIES: LayoutCategoryOption[] = [
  { id: "all", label: "Semua Layout" },
  { id: "opening", label: "Opening" },
  { id: "love-story", label: "Love Story" },
  { id: "quotes", label: "Quotes" },
  { id: "profile", label: "Profil" },
  { id: "salam", label: "Salam" },
  { id: "couple", label: "Mempelai" },
  { id: "event", label: "Acara" },
  { id: "maps", label: "Maps" },
  { id: "countdown", label: "Rundown" },
  { id: "filter", label: "Filter" },
  { id: "live", label: "Live" },
  { id: "gallery", label: "Gallery" },
  { id: "gift", label: "Gift" },
  { id: "contact", label: "Contact" },
  { id: "video", label: "Video" },
  { id: "rsvp", label: "RSVP" },
  { id: "dresscode", label: "Dresscode" },
  { id: "invitation", label: "Mengundang" },
  { id: "protocol", label: "Protokol" },
];

export interface LayoutBlockDefinition {
  type:
    | "TITLE"
    | "TEXT"
    | "PHOTO"
    | "VIDEO"
    | "BUTTON"
    | "LINK"
    | "YOUTUBE"
    | "MAP";
  content: Record<string, unknown>;
  isVisible?: boolean;
}

export interface LayoutTemplateItem {
  id: string;
  name: string;
  category: LayoutCategory;
  defaultSlot: string;
  isPremium?: boolean;
  description?: string;
  previewVariant: string;
  blocks: LayoutBlockDefinition[];
}

