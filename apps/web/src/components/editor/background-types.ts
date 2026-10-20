export type PageBackgroundType = "default" | "custom";

export interface PageBackgroundSetting {
  type: PageBackgroundType;
  customUrl?: string;
  overlayOpacity?: number;
}

export type PageBackgroundMap = Record<string, PageBackgroundSetting>;

export interface PageBackgroundPreset {
  pageKey: string;
  pageTitle: string;
  modalTitle: string;
  defaultBgUrl: string;
  defaultThumbnailUrl: string;
  description: string;
}

