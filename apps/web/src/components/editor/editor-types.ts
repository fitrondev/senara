import type { PageBackgroundSetting } from "@/components/editor/background-types";
import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import type { PhotoFocusConfig } from "@/components/editor/photo-framer-modal";
import type { ThemeConfig } from "@/components/editor/theme-modal";
import type { EditorRegionKey } from "@/components/invitation/edit-context";

export interface ExtendedThemeConfig extends ThemeConfig {
  withPhotos?: boolean;
  fields?: Record<string, string>;
  fontSet?: string;
  fontScale?: number;
  scriptFont?: string;
  musicStartAt?: number;
  musicSourceType?: "library" | "upload" | "youtube";
  photoFocus?: PhotoFocusConfig;
  uploads?: string[];
  pageBackgrounds?: Record<string, PageBackgroundSetting>;
  previewSharedAt?: string;
}

export interface MediaPickerTarget {
  currentUrl?: string;
  onSelect: (newUrl: string) => void;
  onDelete?: () => void;
  label?: string;
}

export interface TextEditorTarget {
  field: string;
  label?: string;
  fallback: string;
}

export interface CustomTextBlockTarget {
  item: CustomContentItemData;
  label: string;
  initialValue: string;
}

export type { EditorRegionKey };
