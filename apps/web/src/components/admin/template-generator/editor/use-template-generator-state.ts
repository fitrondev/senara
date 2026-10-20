"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { PageBackgroundSetting } from "@/components/editor/background-types";
import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import type { ExtendedThemeConfig } from "@/components/editor/editor-types";
import type { FontModalSelection } from "@/components/editor/font-modal";
import type { MusicConfigSelection } from "@/components/editor/music-modal";
import type { PhotoFocusConfig } from "@/components/editor/photo-framer-modal";
import type { EditorSectionItem } from "@/components/editor/section-reorder-modal";
import type { StoryModalItem } from "@/components/editor/story-modal";
import { DEFAULT_THEME_CONFIG, type ThemeConfig } from "@/components/editor/theme-modal";
import type {
  UnifiedGalleryItem,
  UnifiedStoryItem,
} from "@/components/invitation/unified-invitation";
import { useEditorAutosave } from "@/hooks/use-editor-autosave";
import { trpc } from "@/utils/trpc";
import type { TemplateStatus } from "../template-generator-types";

export interface LoadedTemplateData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail: string;
  previewUrl: string;
  isPremium: boolean;
  price: number;
  isActive: boolean;
  status: TemplateStatus;
  tags: string[];
  defaultSections: Array<Record<string, unknown>>;
  themeConfig: Record<string, unknown> | null;
  defaultFields: Record<string, string>;
  defaultCustomContents: Array<Record<string, unknown>>;
  invitationsCount: number;
  createdBy: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface UseTemplateGeneratorStateProps {
  template: LoadedTemplateData;
}

export function useTemplateGeneratorState({
  template,
}: UseTemplateGeneratorStateProps) {
  const queryClient = useQueryClient();

  // Template Metadata
  const [metadata, setMetadata] = useState({
    name: template.name,
    slug: template.slug,
    description: template.description ?? "",
    category: template.category,
    thumbnail: template.thumbnail,
    isPremium: template.isPremium,
    price: template.price,
    status: template.status,
    tags: template.tags,
  });

  // Visual & Design Draft State
  const [themeConfig, setThemeConfig] = useState<ExtendedThemeConfig>(() => {
    return {
      ...DEFAULT_THEME_CONFIG,
      ...((template.themeConfig as unknown as Partial<ExtendedThemeConfig>) || {}),
      fields: {
        ...((template.themeConfig as unknown as ExtendedThemeConfig)?.fields || {}),
        ...(template.defaultFields || {}),
      },
    };
  });

  const [sections, setSections] = useState<EditorSectionItem[]>(() => {
    if (Array.isArray(template.defaultSections) && template.defaultSections.length > 0) {
      return template.defaultSections.map((s, idx) => ({
        id: (s.id as string) || `tpl-sec-${idx}`,
        sectionKey: (s.sectionKey as string) || `section-${idx}`,
        title: (s.title as string) || "",
        sortOrder: typeof s.sortOrder === "number" ? s.sortOrder : idx,
        isVisible: typeof s.isVisible === "boolean" ? s.isVisible : true,
        isLocked: Boolean(s.isLocked),
      }));
    }
    return [
      { id: "s-hero", sectionKey: "hero", title: "Sampul", sortOrder: 0, isVisible: true, isLocked: true },
      { id: "s-quote", sectionKey: "quote", title: "Untaian Doa", sortOrder: 1, isVisible: true, isLocked: false },
      { id: "s-couple", sectionKey: "couple", title: "Mempelai", sortOrder: 2, isVisible: true, isLocked: true },
      { id: "s-event", sectionKey: "event", title: "Rangkaian Acara", sortOrder: 3, isVisible: true, isLocked: false },
      { id: "s-story", sectionKey: "love-story", title: "Cerita Perjalanan", sortOrder: 4, isVisible: true, isLocked: false },
      { id: "s-gallery", sectionKey: "gallery", title: "Galeri Foto", sortOrder: 5, isVisible: true, isLocked: false },
      { id: "s-gift", sectionKey: "gift", title: "Amplop Digital", sortOrder: 6, isVisible: true, isLocked: false },
      { id: "s-rsvp", sectionKey: "rsvp", title: "Buku Tamu & RSVP", sortOrder: 7, isVisible: true, isLocked: false },
      { id: "s-closing", sectionKey: "closing", title: "Penutup", sortOrder: 8, isVisible: true, isLocked: true },
    ];
  });

  const [customContents, setCustomContents] = useState<CustomContentItemData[]>(() => {
    if (Array.isArray(template.defaultCustomContents)) {
      return template.defaultCustomContents.map((c, idx) => ({
        id: (c.id as string) || `tpl-cust-${idx}`,
        invitationId: template.id,
        slotId: (c.slotId as string) || "after-hero",
        type: (c.type as CustomContentItemData["type"]) || "TEXT",
        sortOrder: typeof c.sortOrder === "number" ? c.sortOrder : idx,
        content: (c.content as Record<string, unknown>) || {},
        isVisible: typeof c.isVisible === "boolean" ? c.isVisible : true,
      }));
    }
    return [];
  });

  const [localStories, setLocalStories] = useState<UnifiedStoryItem[]>([]);
  const [localGalleries, setLocalGalleries] = useState<UnifiedGalleryItem[]>([]);

  // Mutation to persist template changes
  const updateConfigMutation = useMutation(
    trpc.templateGenerator.updateConfig.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.templateGenerator.pathFilter()
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menyimpan perubahan template.");
      },
    })
  );

  const publishMutation = useMutation(
    trpc.templateGenerator.publish.mutationOptions({
      onSuccess: (updated) => {
        setMetadata((prev) => ({ ...prev, status: "PUBLISHED" }));
        queryClient.invalidateQueries(
          trpc.templateGenerator.pathFilter()
        );
        toast.success(`Template "${updated.name}" berhasil dipublikasikan ke katalog pengguna!`);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mempublikasikan template.");
      },
    })
  );

  const archiveMutation = useMutation(
    trpc.templateGenerator.archive.mutationOptions({
      onSuccess: (updated) => {
        setMetadata((prev) => ({ ...prev, status: "ARCHIVED" }));
        queryClient.invalidateQueries(
          trpc.templateGenerator.pathFilter()
        );
        toast.success(`Template "${updated.name}" berhasil diarsipkan.`);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengarsipkan template.");
      },
    })
  );

  // Autosave engine
  const {
    status: autoSaveStatus,
    triggerSave,
    retry: retrySave,
  } = useEditorAutosave({
    storageKey: `senara_template_gen_${template.id}`,
    saveFn: async (updated: {
      themeConfig?: ExtendedThemeConfig;
      metadata?: typeof metadata;
      sections?: EditorSectionItem[];
      customContents?: CustomContentItemData[];
    }) => {
      const currentTheme = updated.themeConfig || themeConfig;
      const currentMeta = updated.metadata || metadata;
      const currentSecs = updated.sections || sections;
      const currentCust = updated.customContents || customContents;

      await updateConfigMutation.mutateAsync({
        id: template.id,
        name: currentMeta.name,
        slug: currentMeta.slug,
        description: currentMeta.description,
        category: currentMeta.category,
        thumbnail: currentMeta.thumbnail,
        isPremium: currentMeta.isPremium,
        price: currentMeta.price,
        tags: currentMeta.tags,
        status: currentMeta.status,
        themeConfig: currentTheme as unknown as Record<string, unknown>,
        defaultFields: (currentTheme.fields as Record<string, string>) || {},
        defaultSections: currentSecs as unknown as Array<Record<string, unknown>>,
        defaultCustomContents: currentCust as unknown as Array<Record<string, unknown>>,
      });
    },
  });

  const handlePatchField = (fieldKey: string, value: string) => {
    const nextTheme: ExtendedThemeConfig = {
      ...themeConfig,
      fields: {
        ...(themeConfig.fields ?? {}),
        [fieldKey]: value,
      },
    };
    setThemeConfig(nextTheme);
    triggerSave({ themeConfig: nextTheme });
  };

  const handlePatchFields = (newFields: Record<string, string>) => {
    const nextTheme: ExtendedThemeConfig = {
      ...themeConfig,
      fields: {
        ...(themeConfig.fields ?? {}),
        ...newFields,
      },
    };
    setThemeConfig(nextTheme);
    triggerSave({ themeConfig: nextTheme });
  };

  const handleSavePageBackground = (
    pageKey: string,
    setting: PageBackgroundSetting
  ) => {
    const nextTheme: ExtendedThemeConfig = {
      ...themeConfig,
      pageBackgrounds: {
        ...(themeConfig.pageBackgrounds ?? {}),
        [pageKey]: setting,
      },
    };
    setThemeConfig(nextTheme);
    triggerSave({ themeConfig: nextTheme });
  };

  const handleToggleSection = (sectionKey: string, nextVisible: boolean) => {
    const updated = sections.map((sec) =>
      sec.sectionKey === sectionKey ? { ...sec, isVisible: nextVisible } : sec
    );
    setSections(updated);
    triggerSave({ sections: updated });
    toast.success(
      nextVisible ? "Bagian template ditampilkan." : "Bagian template disembunyikan."
    );
  };

  const handleSaveTheme = (newTheme: ThemeConfig) => {
    const merged: ExtendedThemeConfig = {
      ...themeConfig,
      ...newTheme,
    };
    setThemeConfig(merged);
    triggerSave({ themeConfig: merged });
  };

  const handleSaveFont = (selection: FontModalSelection) => {
    const merged: ExtendedThemeConfig = {
      ...themeConfig,
      fontSet: selection.fontSet,
      fontScale: selection.fontScale,
      scriptFont: selection.scriptFont,
      typography: {
        headingFont: selection.headingFont,
        bodyFont: selection.bodyFont,
      },
    };
    setThemeConfig(merged);
    triggerSave({ themeConfig: merged });
    toast.success("Pasangan tipografi template diperbarui!");
  };

  const handleSaveMusic = (selection: MusicConfigSelection) => {
    const merged: ExtendedThemeConfig = {
      ...themeConfig,
      musicStartAt: selection.musicStartAt,
      musicSourceType: selection.musicSourceType,
    };
    setThemeConfig(merged);
    triggerSave({ themeConfig: merged });
    toast.success("Musik latar bawaan template diperbarui!");
  };

  const handleSavePhotoFocus = (result: {
    imageUrl: string;
    focus: PhotoFocusConfig;
    withPhotos: boolean;
    updatedUploads: string[];
  }) => {
    const merged: ExtendedThemeConfig = {
      ...themeConfig,
      withPhotos: result.withPhotos,
      photoFocus: result.focus,
      uploads: result.updatedUploads,
    };
    setThemeConfig(merged);
    setMetadata((prev) => ({ ...prev, thumbnail: result.imageUrl }));
    triggerSave({
      themeConfig: merged,
      metadata: { ...metadata, thumbnail: result.imageUrl },
    });
    toast.success("Fokus foto sampul berhasil diperbarui!");
  };

  const handleSaveStories = async (data: {
    stories: StoryModalItem[];
    badge: string;
    title: string;
  }) => {
    const formatted: UnifiedStoryItem[] = data.stories.map((s, idx) => ({
      id: s.id || `story-${idx}`,
      yearOrDate: s.yearOrDate,
      title: s.title,
      story: s.story,
      imageUrl: s.imageUrl ?? null,
    }));
    setLocalStories(formatted);

    const patchUpdates: Record<string, string> = {
      storyBadge: data.badge,
      storyTitle: data.title,
    };
    data.stories.forEach((s, idx) => {
      patchUpdates[`story_${idx}_year`] = s.yearOrDate;
      patchUpdates[`story_${idx}_title`] = s.title;
      patchUpdates[`story_${idx}_body`] = s.story;
    });
    handlePatchFields(patchUpdates);
    toast.success("Cerita perjalanan cinta template disimpan!");
  };

  const handleUpdateGalleries = async (newGalleries: UnifiedGalleryItem[]) => {
    setLocalGalleries(newGalleries);
    toast.success("Galeri foto bawaan template diperbarui!");
  };

  const handleUpdateMetadata = (updated: {
    name: string;
    slug: string;
    description: string;
    category: string;
    thumbnail: string;
    isPremium: boolean;
    price: number;
    tags: string[];
  }) => {
    const nextMeta = { ...metadata, ...updated };
    setMetadata(nextMeta);
    triggerSave({ metadata: nextMeta });
    toast.success("Metadata template berhasil diperbarui!");
  };

  const handleInsertLayoutBatch = (newItems: CustomContentItemData[]) => {
    const updated = [...customContents, ...newItems];
    setCustomContents(updated);
    triggerSave({ customContents: updated });
    toast.success("Layout berhasil disisipkan ke template!");
  };

  return {
    metadata,
    draft: {
      title: metadata.name,
      coverImageUrl: metadata.thumbnail,
      musicUrl: "",
      musicTitle: "",
      isMusicAutoplay: true,
      eventDateInput: "2026-10-24",
      themeConfig,
      sections,
      localStories,
      localGalleries,
      customContentsList: customContents,
    },
    status: {
      autoSaveStatus,
      isPublishing: publishMutation.isPending,
      isArchiving: archiveMutation.isPending,
      isPublished: metadata.status === "PUBLISHED",
      status: metadata.status,
    },
    actions: {
      setSections: (secs: EditorSectionItem[]) => {
        setSections(secs);
        triggerSave({ sections: secs });
      },
      setTitle: (title: string) => {
        handlePatchField("title", title);
      },
      setCoverImageUrl: (url: string) => {
        setMetadata((prev) => ({ ...prev, thumbnail: url }));
        triggerSave({ metadata: { ...metadata, thumbnail: url } });
      },
      patchField: handlePatchField,
      patchFields: handlePatchFields,
      toggleWithPhotos: (withPhotos: boolean) => {
        const nextTheme = { ...themeConfig, withPhotos };
        setThemeConfig(nextTheme);
        triggerSave({ themeConfig: nextTheme });
      },
      savePageBackground: handleSavePageBackground,
      changeEventDate: () => {},
      saveStories: handleSaveStories,
      updateGalleries: handleUpdateGalleries,
      toggleSection: handleToggleSection,
      saveTheme: handleSaveTheme,
      saveFont: handleSaveFont,
      saveMusic: handleSaveMusic,
      savePhotoFocus: handleSavePhotoFocus,
      updateMetadata: handleUpdateMetadata,
      insertLayoutBatch: handleInsertLayoutBatch,
      publish: () => publishMutation.mutate({ id: template.id }),
      archive: () => archiveMutation.mutate({ id: template.id }),
      retrySave,
    },
  };
}

export type TemplateGeneratorState = ReturnType<typeof useTemplateGeneratorState>;
