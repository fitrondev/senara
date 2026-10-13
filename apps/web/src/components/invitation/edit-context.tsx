"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type EditorRegionKey =
  | "cover"
  | "quote"
  | "couple"
  | "event"
  | "story"
  | "gallery"
  | "gift"
  | "rsvp"
  | "closing";

export interface EditContextValue {
  editing: boolean;
  demo: boolean;
  live: boolean;
  withPhotos: boolean;
  guestName?: string;
  fields: Record<string, string>;
  getField: (key: string, fallback: string) => string;
  onPatchField?: (key: string, value: string) => void;
  onOpenRegion?: (region: EditorRegionKey) => void;
  onOpenTextEditor?: (params: { field: string; label?: string; fallback: string }) => void;
  isSectionVisible: (sectionKey: string) => boolean;
  onToggleSection?: (sectionKey: string, nextVisible: boolean) => void;
  guestHintOpen: boolean;
  setGuestHintOpen: (open: boolean) => void;
}

const DEFAULT_EDIT_CONTEXT: EditContextValue = {
  editing: false,
  demo: false,
  live: true,
  withPhotos: true,
  guestName: undefined,
  fields: {},
  getField: (_key, fallback) => fallback,
  isSectionVisible: () => true,
  guestHintOpen: false,
  setGuestHintOpen: () => {},
};

const EditContext = createContext<EditContextValue>(DEFAULT_EDIT_CONTEXT);

export function useEditContext(): EditContextValue {
  return useContext(EditContext);
}

/**
 * Viewport Measurement & Android Soft-Keyboard Guard (ala UndangYuk)
 * Mencegah tampilan undangan menyusut ketika tamu mengetik pada kolom input RSVP di HP.
 */
export function useViewportHeightGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lockedWidth = window.innerWidth;
    let lockedHeight = window.innerHeight;

    const applyVh = (h: number) => {
      document.documentElement.style.setProperty("--vh100", `${h}px`);
    };

    applyVh(lockedHeight);

    const handleResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const activeEl = document.activeElement;
      const isTextFocused =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true");

      // Jika lebar layar sama dan tinggi berkurang > 120px saat mengetik (soft-keyboard muncul),
      // pertahankan tinggi sebelumnya agar layout sampul & section tidak gepeng.
      if (
        nextWidth === lockedWidth &&
        lockedHeight - nextHeight > 120 &&
        isTextFocused
      ) {
        return;
      }

      lockedWidth = nextWidth;
      lockedHeight = nextHeight;
      applyVh(lockedHeight);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}

export interface EditProviderProps {
  children: ReactNode;
  editing?: boolean;
  demo?: boolean;
  live?: boolean;
  withPhotos?: boolean;
  guestName?: string;
  fields?: Record<string, string>;
  onPatchField?: (key: string, value: string) => void;
  onOpenRegion?: (region: EditorRegionKey) => void;
  onOpenTextEditor?: (params: { field: string; label?: string; fallback: string }) => void;
  isSectionVisible?: (sectionKey: string) => boolean;
  onToggleSection?: (sectionKey: string, nextVisible: boolean) => void;
}

export function EditProvider({
  children,
  editing = false,
  demo = false,
  live = false,
  withPhotos = true,
  guestName,
  fields = {},
  onPatchField,
  onOpenRegion,
  onOpenTextEditor,
  isSectionVisible = () => true,
  onToggleSection,
}: EditProviderProps) {
  const [guestHintOpen, setGuestHintOpen] = useState(false);

  useViewportHeightGuard();

  const value = useMemo<EditContextValue>(
    () => ({
      editing,
      demo,
      live,
      withPhotos,
      guestName,
      fields,
      getField: (key: string, fallback: string) => {
        const val = fields[key];
        return typeof val === "string" && val.trim().length > 0 ? val : fallback;
      },
      onPatchField,
      onOpenRegion,
      onOpenTextEditor,
      isSectionVisible,
      onToggleSection,
      guestHintOpen,
      setGuestHintOpen,
    }),
    [
      editing,
      demo,
      live,
      withPhotos,
      guestName,
      fields,
      onPatchField,
      onOpenRegion,
      onOpenTextEditor,
      isSectionVisible,
      onToggleSection,
      guestHintOpen,
    ]
  );

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

