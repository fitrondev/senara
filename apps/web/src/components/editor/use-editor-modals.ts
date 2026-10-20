"use client";

import { useState } from "react";

import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import type {
  CustomTextBlockTarget,
  EditorRegionKey,
  MediaPickerTarget,
  TextEditorTarget,
} from "@/components/editor/editor-types";

export function useEditorModals() {
  const [themeOpen, setThemeOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [changeThemeOpen, setChangeThemeOpen] = useState(false);
  const [photoFramerOpen, setPhotoFramerOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [customContentOpen, setCustomContentOpen] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string>("after-hero");
  const [editingCustomItem, setEditingCustomItem] =
    useState<CustomContentItemData | null>(null);
  const [layoutLibraryOpen, setLayoutLibraryOpen] = useState(false);
  const [layoutLibrarySlotId, setLayoutLibrarySlotId] =
    useState<string>("after-hero");
  const [publishOpen, setPublishOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [backgroundTarget, setBackgroundTarget] = useState<string | null>(null);
  const [mediaTarget, setMediaTarget] = useState<MediaPickerTarget | null>(null);
  const [textEditorTarget, setTextEditorTarget] =
    useState<TextEditorTarget | null>(null);
  const [customTextBlockTarget, setCustomTextBlockTarget] =
    useState<CustomTextBlockTarget | null>(null);
  const [activeRegion, setActiveRegion] = useState<EditorRegionKey | null>(null);

  const openCustomContent = (
    slotId = "after-hero",
    item?: CustomContentItemData | null
  ) => {
    setActiveSlotId(slotId);
    setEditingCustomItem(item ?? null);
    setCustomContentOpen(true);
  };

  const openLayoutLibrary = (slotId?: string) => {
    if (slotId) setLayoutLibrarySlotId(slotId);
    setLayoutLibraryOpen(true);
  };

  const handleEditCustomItem = (item: CustomContentItemData) => {
    if (item.type === "TITLE" || item.type === "TEXT") {
      const content = (item.content as Record<string, unknown>) || {};
      const initialValue =
        item.type === "TITLE"
          ? (content.title as string) || ""
          : (content.text as string) || "";
      setCustomTextBlockTarget({
        item,
        label:
          item.type === "TITLE"
            ? "Judul Blok Kustom"
            : "Teks Paragraf Kustom",
        initialValue,
      });
    } else {
      openCustomContent(item.slotId, item);
    }
  };

  return {
    state: {
      themeOpen,
      fontOpen,
      musicOpen,
      changeThemeOpen,
      photoFramerOpen,
      reorderOpen,
      customContentOpen,
      activeSlotId,
      editingCustomItem,
      layoutLibraryOpen,
      layoutLibrarySlotId,
      publishOpen,
      pricingOpen,
      storyOpen,
      backgroundTarget,
      mediaTarget,
      textEditorTarget,
      customTextBlockTarget,
      activeRegion,
    },
    setThemeOpen,
    setFontOpen,
    setMusicOpen,
    setChangeThemeOpen,
    setPhotoFramerOpen,
    setReorderOpen,
    setCustomContentOpen,
    setLayoutLibraryOpen,
    setPublishOpen,
    setPricingOpen,
    setStoryOpen,
    setBackgroundTarget,
    setMediaTarget,
    setTextEditorTarget,
    setCustomTextBlockTarget,
    setActiveRegion,
    openCustomContent,
    openLayoutLibrary,
    handleEditCustomItem,
  };
}

export type EditorModalsController = ReturnType<typeof useEditorModals>;
