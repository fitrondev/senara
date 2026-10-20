"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { PageBackgroundSetting } from "@/components/editor/background-types";
import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import type {
  ExtendedThemeConfig,
} from "@/components/editor/editor-types";
import type { FontModalSelection } from "@/components/editor/font-modal";
import type { MusicConfigSelection } from "@/components/editor/music-modal";
import {
  type PhotoFocusConfig,
} from "@/components/editor/photo-framer-modal";
import type { EditorSectionItem } from "@/components/editor/section-reorder-modal";
import type { StoryModalItem } from "@/components/editor/story-modal";
import {
  DEFAULT_THEME_CONFIG,
  type ThemeConfig,
} from "@/components/editor/theme-modal";
import type {
  UnifiedGalleryItem,
  UnifiedStoryItem,
} from "@/components/invitation/unified-invitation";
import { useEditorAutosave } from "@/hooks/use-editor-autosave";
import { trpc } from "@/utils/trpc";

export interface EditorInvitationData {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED" | "ARCHIVED";
  packageTier: "FREE" | "PREMIUM";
  eventDate?: string | Date | null;
  coverImageUrl?: string | null;
  musicUrl?: string | null;
  musicTitle?: string | null;
  isMusicAutoplay?: boolean | null;
  themeConfig?: unknown;
  sections?: unknown[];
  loveStories?: unknown[];
  galleries?: unknown[];
  customContents?: unknown[];
  enabledAddons?: string[] | unknown;
  publishedAt?: string | Date | null;
  template?: {
    id: string;
    slug: string;
    name: string;
    thumbnail?: string | null;
  } | null;
  updatedAt?: string | Date | null;
}

interface UseEditorStateProps {
  invitationId: string;
  invitation?: EditorInvitationData | null;
  onRefetch: () => Promise<unknown>;
}

export function useEditorState({
  invitationId,
  invitation,
  onRefetch,
}: UseEditorStateProps) {
  const queryClient = useQueryClient();
  const localUpdatedAtRef = useRef<number>(0);
  const [hasMultiTabConflict, setHasMultiTabConflict] = useState(false);

  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [isMusicAutoplay, setIsMusicAutoplay] = useState(true);
  const [eventDateInput, setEventDateInput] = useState("2026-10-24");
  const [themeConfig, setThemeConfig] =
    useState<ExtendedThemeConfig>(DEFAULT_THEME_CONFIG);
  const [sections, setSections] = useState<EditorSectionItem[]>([]);
  const [localStories, setLocalStories] = useState<UnifiedStoryItem[]>([]);
  const [localGalleries, setLocalGalleries] = useState<UnifiedGalleryItem[]>([]);

  // Polling timestamp cek multi-tab conflict
  const lastUpdatedQuery = useQuery({
    ...trpc.invitation.checkLastUpdated.queryOptions({ id: invitationId }),
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (lastUpdatedQuery.data?.updatedAt && localUpdatedAtRef.current > 0) {
      const serverTs = new Date(lastUpdatedQuery.data.updatedAt).getTime();
      if (serverTs - localUpdatedAtRef.current > 3000) {
        setHasMultiTabConflict(true);
      }
    }
  }, [lastUpdatedQuery.data?.updatedAt]);

  const customContentsList = useMemo(() => {
    return (invitation?.customContents ??
      []) as unknown as CustomContentItemData[];
  }, [invitation?.customContents]);

  useEffect(() => {
    if (invitation) {
      setTitle(invitation.title);
      setCoverImageUrl(
        invitation.coverImageUrl ||
          invitation.template?.thumbnail ||
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
      );
      setMusicUrl(invitation.musicUrl ?? "");
      setMusicTitle(invitation.musicTitle ?? "");
      setIsMusicAutoplay(invitation.isMusicAutoplay ?? true);
      if (invitation.eventDate) {
        setEventDateInput(
          new Date(invitation.eventDate).toISOString().slice(0, 10)
        );
      }
      if (invitation.themeConfig) {
        setThemeConfig({
          ...DEFAULT_THEME_CONFIG,
          ...(invitation.themeConfig as unknown as Partial<ExtendedThemeConfig>),
        });
      }
      if (invitation.sections) {
        setSections(invitation.sections as EditorSectionItem[]);
      }
      if (invitation.loveStories) {
        setLocalStories(invitation.loveStories as unknown as UnifiedStoryItem[]);
      }
      if (invitation.galleries) {
        setLocalGalleries(invitation.galleries as unknown as UnifiedGalleryItem[]);
      }
      if (invitation.updatedAt) {
        localUpdatedAtRef.current = new Date(invitation.updatedAt).getTime();
      }
    }
  }, [invitation]);

  // Mutations
  const updateMetadataMutation = useMutation(
    trpc.invitation.updateMetadata.mutationOptions({
      onSuccess: (updated) => {
        if (updated.updatedAt) {
          localUpdatedAtRef.current = new Date(updated.updatedAt).getTime();
        }
        setHasMultiTabConflict(false);
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
    })
  );

  const reorderSectionMutation = useMutation(
    trpc.section.reorderAndToggle.mutationOptions({
      onSuccess: () => {
        localUpdatedAtRef.current = Date.now();
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
    })
  );

  const updateCustomContentMutation = useMutation(
    trpc.customContent.update.mutationOptions({
      onSuccess: () => {
        localUpdatedAtRef.current = Date.now();
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
        toast.success("Konten blok berhasil diperbarui!");
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui blok konten.");
      },
    })
  );

  const updateLoveStoriesMutation = useMutation(
    trpc.invitation.updateLoveStories.mutationOptions({
      onSuccess: () => {
        localUpdatedAtRef.current = Date.now();
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
    })
  );

  const updateGalleriesMutation = useMutation(
    trpc.invitation.updateGalleries.mutationOptions({
      onSuccess: () => {
        localUpdatedAtRef.current = Date.now();
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
    })
  );

  const publishMutation = useMutation(
    trpc.invitation.updateMetadata.mutationOptions({
      onSuccess: () => {
        toast.success("Status publikasi undangan berhasil diperbarui!");
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menerbitkan undangan");
      },
    })
  );

  // Autosave
  const {
    status: autoSaveStatus,
    triggerSave,
    retry: retrySave,
  } = useEditorAutosave({
    storageKey: `senara_editor_${invitationId}`,
    saveFn: async (updatedData: {
      title: string;
      coverImageUrl?: string;
      musicUrl?: string;
      musicTitle?: string;
      isMusicAutoplay?: boolean;
      themeConfig?: ExtendedThemeConfig;
    }) => {
      await updateMetadataMutation.mutateAsync({
        id: invitationId,
        title: updatedData.title,
        coverImageUrl: updatedData.coverImageUrl,
        musicUrl: updatedData.musicUrl || null,
        musicTitle: updatedData.musicTitle || null,
        isMusicAutoplay: updatedData.isMusicAutoplay,
        themeConfig:
          updatedData.themeConfig as unknown as Record<string, unknown>,
      });
    },
  });

  const handlePatchField = (fieldKey: string, value: string) => {
    const plainTextValue = value.replace(/<[^>]*>?/gm, "").trim();
    const nextTitle =
      fieldKey === "title" && plainTextValue ? plainTextValue : title;
    if (fieldKey === "title" && plainTextValue) {
      setTitle(plainTextValue);
    }
    const nextCoverImageUrl =
      fieldKey === "coverImageUrl" ? value : coverImageUrl;
    if (fieldKey === "coverImageUrl") {
      setCoverImageUrl(value);
    }
    const nextTheme: ExtendedThemeConfig = {
      ...themeConfig,
      fields: {
        ...(themeConfig.fields ?? {}),
        [fieldKey]: value,
      },
    };
    setThemeConfig(nextTheme);
    triggerSave({
      title: nextTitle,
      coverImageUrl: nextCoverImageUrl,
      musicUrl,
      musicTitle,
      isMusicAutoplay,
      themeConfig: nextTheme,
    });
  };

  const handlePatchFields = (newFields: Record<string, string>) => {
    let nextTitle = title;
    if (newFields.title) {
      const plainTextValue = newFields.title.replace(/<[^>]*>?/gm, "").trim();
      if (plainTextValue) {
        nextTitle = plainTextValue;
        setTitle(plainTextValue);
      }
    }
    let nextCoverImageUrl = coverImageUrl;
    if (newFields.coverImageUrl) {
      nextCoverImageUrl = newFields.coverImageUrl;
      setCoverImageUrl(newFields.coverImageUrl);
    }
    const nextTheme: ExtendedThemeConfig = {
      ...themeConfig,
      fields: {
        ...(themeConfig.fields ?? {}),
        ...newFields,
      },
    };
    setThemeConfig(nextTheme);
    triggerSave({
      title: nextTitle,
      coverImageUrl: nextCoverImageUrl,
      musicUrl,
      musicTitle,
      isMusicAutoplay,
      themeConfig: nextTheme,
    });
  };

  const handleToggleWithPhotos = (nextWithPhotos: boolean) => {
    const nextTheme: ExtendedThemeConfig = {
      ...themeConfig,
      withPhotos: nextWithPhotos,
    };
    setThemeConfig(nextTheme);
    triggerSave({
      title,
      coverImageUrl,
      musicUrl,
      musicTitle,
      isMusicAutoplay,
      themeConfig: nextTheme,
    });
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
    triggerSave({
      title,
      coverImageUrl,
      musicUrl,
      musicTitle,
      isMusicAutoplay,
      themeConfig: nextTheme,
    });
  };

  const handleEventDateChange = (nextDate: string) => {
    setEventDateInput(nextDate);
    if (nextDate) {
      updateMetadataMutation.mutate({
        id: invitationId,
        eventDate: new Date(nextDate),
      });
    }
  };

  const handleSaveStories = async (data: {
    stories: StoryModalItem[];
    badge: string;
    title: string;
  }) => {
    try {
      const formattedStories: UnifiedStoryItem[] = data.stories.map((s, idx) => ({
        id: s.id || `story-local-${idx}`,
        yearOrDate: s.yearOrDate,
        title: s.title,
        story: s.story,
        imageUrl: s.imageUrl ?? null,
      }));

      setLocalStories(formattedStories);

      await updateLoveStoriesMutation.mutateAsync({
        invitationId,
        stories: data.stories.map((s) => ({
          yearOrDate: s.yearOrDate,
          title: s.title,
          story: s.story,
          imageUrl: s.imageUrl ?? null,
        })),
      });

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

      toast.success("Cerita perjalanan cinta berhasil disimpan!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan cerita.";
      toast.error(msg);
    }
  };

  const handleUpdateGalleries = async (newGalleries: UnifiedGalleryItem[]) => {
    setLocalGalleries(newGalleries);
    try {
      await updateGalleriesMutation.mutateAsync({
        invitationId,
        galleries: newGalleries.map((g) => ({
          mediaUrl: g.mediaUrl,
          mediaType: g.mediaType || "IMAGE",
          caption: g.caption ?? null,
        })),
      });
      toast.success("Galeri foto berhasil diperbarui!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui galeri.";
      toast.error(msg);
    }
  };

  const handleToggleSection = (sectionKey: string, nextVisible: boolean) => {
    const updated = sections.map((sec) =>
      sec.sectionKey === sectionKey ? { ...sec, isVisible: nextVisible } : sec
    );
    setSections(updated);
    reorderSectionMutation.mutate({
      invitationId,
      sections: updated.map((s, idx) => ({
        id: s.id,
        sortOrder: idx,
        isVisible: s.isVisible,
      })),
    });
    toast.success(
      nextVisible
        ? "Bagian ditampilkan kembali di undangan."
        : "Bagian disembunyikan dari tampilan tamu."
    );
  };

  const handleSaveTheme = (newTheme: ThemeConfig) => {
    const merged: ExtendedThemeConfig = {
      ...themeConfig,
      ...newTheme,
    };
    setThemeConfig(merged);
    triggerSave({
      title,
      coverImageUrl,
      musicUrl,
      musicTitle,
      isMusicAutoplay,
      themeConfig: merged,
    });
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
    triggerSave({
      title,
      coverImageUrl,
      musicUrl,
      musicTitle,
      isMusicAutoplay,
      themeConfig: merged,
    });
    toast.success("Pasangan huruf dan skala tipografi berhasil diperbarui!");
  };

  const handleSaveMusic = (selection: MusicConfigSelection) => {
    const nextUrl = selection.musicUrl ?? "";
    setMusicUrl(nextUrl);
    setMusicTitle(selection.musicTitle);
    setIsMusicAutoplay(selection.isMusicAutoplay);

    const merged: ExtendedThemeConfig = {
      ...themeConfig,
      musicStartAt: selection.musicStartAt,
      musicSourceType: selection.musicSourceType,
    };
    setThemeConfig(merged);
    triggerSave({
      title,
      coverImageUrl,
      musicUrl: nextUrl,
      musicTitle: selection.musicTitle,
      isMusicAutoplay: selection.isMusicAutoplay,
      themeConfig: merged,
    });
    toast.success("Pengaturan musik latar berhasil disimpan!");
  };

  const handleSavePhotoFocus = (result: {
    imageUrl: string;
    focus: PhotoFocusConfig;
    withPhotos: boolean;
    updatedUploads: string[];
  }) => {
    setCoverImageUrl(result.imageUrl);
    const merged: ExtendedThemeConfig = {
      ...themeConfig,
      withPhotos: result.withPhotos,
      photoFocus: result.focus,
      uploads: result.updatedUploads,
    };
    setThemeConfig(merged);
    triggerSave({
      title,
      coverImageUrl: result.imageUrl,
      musicUrl,
      musicTitle,
      isMusicAutoplay,
      themeConfig: merged,
    });
    toast.success("Posisi fokus dan zoom foto berhasil disimpan!");
  };

  const handleResolveConflict = async () => {
    await onRefetch();
    setHasMultiTabConflict(false);
    toast.success("Data undangan terbaru telah dimuat ulang.");
  };

  return {
    draft: {
      title,
      coverImageUrl,
      musicUrl,
      musicTitle,
      isMusicAutoplay,
      eventDateInput,
      themeConfig,
      sections,
      localStories,
      localGalleries,
      customContentsList,
    },
    status: {
      autoSaveStatus,
      hasMultiTabConflict,
      isPublishing: publishMutation.isPending,
      isPublished: invitation?.status === "PUBLISHED",
    },
    actions: {
      setTitle,
      setCoverImageUrl,
      setSections,
      patchField: handlePatchField,
      patchFields: handlePatchFields,
      toggleWithPhotos: handleToggleWithPhotos,
      savePageBackground: handleSavePageBackground,
      changeEventDate: handleEventDateChange,
      saveStories: handleSaveStories,
      updateGalleries: handleUpdateGalleries,
      toggleSection: handleToggleSection,
      saveTheme: handleSaveTheme,
      saveFont: handleSaveFont,
      saveMusic: handleSaveMusic,
      savePhotoFocus: handleSavePhotoFocus,
      retrySave,
      resolveConflict: handleResolveConflict,
      triggerSave,
      updateCustomContentMutation,
      publishMutation,
    },
  };
}

export type EditorState = ReturnType<typeof useEditorState>;
