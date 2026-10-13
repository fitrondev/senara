"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@senara/ui/components/button";

import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import { EditorRegionDialog } from "@/components/editor/editor-region-dialog";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import type { FontModalSelection } from "@/components/editor/font-modal";
import type { MusicConfigSelection } from "@/components/editor/music-modal";
import {
  DEFAULT_PHOTO_FOCUS,
  type PhotoFocusConfig,
} from "@/components/editor/photo-framer-modal";
import type { EditorSectionItem } from "@/components/editor/section-reorder-modal";
import {
  DEFAULT_THEME_CONFIG,
  type ThemeConfig,
} from "@/components/editor/theme-modal";
import type { BankAccountItem } from "@/components/invitation/digital-gift-section";
import type { EditorRegionKey } from "@/components/invitation/edit-context";
import type { EventScheduleItem } from "@/components/invitation/event-section";
import {
  UnifiedInvitation,
  type UnifiedGalleryItem,
  type UnifiedStoryItem,
} from "@/components/invitation/unified-invitation";
import { useEditorAutosave } from "@/hooks/use-editor-autosave";
import { trpc } from "@/utils/trpc";

// Vercel Best Practice (bundle-dynamic-imports): Load heavy editor modals lazily on demand
const FontModal = dynamic(() =>
  import("@/components/editor/font-modal").then((m) => m.FontModal)
);
const MusicModal = dynamic(() =>
  import("@/components/editor/music-modal").then((m) => m.MusicModal)
);
const ChangeThemeModal = dynamic(() =>
  import("@/components/editor/change-theme-modal").then(
    (m) => m.ChangeThemeModal
  )
);
const PhotoFramerModal = dynamic(() =>
  import("@/components/editor/photo-framer-modal").then(
    (m) => m.PhotoFramerModal
  )
);
const ThemeModal = dynamic(() =>
  import("@/components/editor/theme-modal").then((m) => m.ThemeModal)
);
const SectionReorderModal = dynamic(() =>
  import("@/components/editor/section-reorder-modal").then(
    (m) => m.SectionReorderModal
  )
);
const CustomContentModal = dynamic(() =>
  import("@/components/editor/custom-content-modal").then(
    (m) => m.CustomContentModal
  )
);
const PublishModal = dynamic(() =>
  import("@/components/editor/publish-modal").then((m) => m.PublishModal)
);
const PricingModal = dynamic(() =>
  import("@/components/billing/pricing-modal").then((m) => m.PricingModal)
);
const TextEditorModal = dynamic(() =>
  import("@/components/editor/text-editor-modal").then((m) => m.TextEditorModal)
);

interface EditorPageProps {
  params: Promise<{
    invitationId: string;
  }>;
}

interface ExtendedThemeConfig extends ThemeConfig {
  withPhotos?: boolean;
  fields?: Record<string, string>;
  fontSet?: string;
  fontScale?: number;
  scriptFont?: string;
  musicStartAt?: number;
  musicSourceType?: "library" | "upload" | "youtube";
  photoFocus?: PhotoFocusConfig;
  uploads?: string[];
  previewSharedAt?: string;
}

export default function InvitationEditorPage({ params }: EditorPageProps) {
  const resolvedParams = use(params);
  const invitationId = resolvedParams.invitationId;
  const queryClient = useQueryClient();

  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [fontModalOpen, setFontModalOpen] = useState(false);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [changeThemeModalOpen, setChangeThemeModalOpen] = useState(false);
  const [photoFramerModalOpen, setPhotoFramerModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [customContentModalOpen, setCustomContentModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [textEditorTarget, setTextEditorTarget] = useState<{
    field: string;
    label?: string;
    fallback: string;
  } | null>(null);
  const [activeSlotId, setActiveSlotId] = useState<string>("after-hero");
  const [activeRegion, setActiveRegion] = useState<EditorRegionKey | null>(
    null
  );
  const [hasMultiTabConflict, setHasMultiTabConflict] = useState(false);

  const localUpdatedAtRef = useRef<number>(0);

  const {
    data: invitation,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.invitation.getById.queryOptions({ id: invitationId }));

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

  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [isMusicAutoplay, setIsMusicAutoplay] = useState(true);
  const [eventDateInput, setEventDateInput] = useState("2026-10-24");
  const [themeConfig, setThemeConfig] =
    useState<ExtendedThemeConfig>(DEFAULT_THEME_CONFIG);
  const [sections, setSections] = useState<EditorSectionItem[]>([]);

  const customContentsList = useMemo(() => {
    return (invitation?.customContents ??
      []) as unknown as CustomContentItemData[];
  }, [invitation?.customContents]);

  const handleOpenSlot = (slotId: string) => {
    setActiveSlotId(slotId);
    setCustomContentModalOpen(true);
  };

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
      if (invitation.updatedAt) {
        localUpdatedAtRef.current = new Date(invitation.updatedAt).getTime();
      }
    }
  }, [invitation]);

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
    const nextTitle = fieldKey === "title" && value.trim() ? value : title;
    if (fieldKey === "title" && value.trim()) {
      setTitle(value);
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
      coverImageUrl,
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

  const isPublished = invitation?.status === "PUBLISHED";
  const publicUrl =
    typeof window !== "undefined" && invitation
      ? `${window.location.origin}/${invitation.slug}`
      : `/${invitation?.slug ?? ""}`;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-muted/30">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Menyiapkan kanvas editor terpadu Senara...
        </p>
      </div>
    );
  }

  if (isError || !invitation) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-6 text-center">
        <h2 className="font-serif text-xl font-bold">
          Undangan Tidak Ditemukan
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Undangan mungkin telah dihapus atau Anda tidak memiliki hak akses
          untuk mengeditnya.
        </p>
        <Button render={<Link href={"/dashboard" as Route} />} className="gap-2">
          <ArrowLeft className="size-4" />
          <span>Kembali ke Dashboard</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {hasMultiTabConflict ? (
        <div
          onClick={async () => {
            await refetch();
            setHasMultiTabConflict(false);
            toast.success("Data undangan terbaru telah dimuat ulang.");
          }}
          className="flex cursor-pointer items-center justify-center gap-2 bg-amber-500 px-4 py-1.5 text-xs font-semibold text-amber-950 transition-colors hover:bg-amber-400"
        >
          <AlertTriangle className="size-3.5" />
          <span>
            Undangan ini diubah di tab atau perangkat lain. Ketuk di sini untuk
            muat ulang.
          </span>
        </div>
      ) : null}

      <EditorToolbar
        autoSaveStatus={autoSaveStatus}
        onRetrySave={retrySave}
        withPhotos={themeConfig.withPhotos ?? true}
        onToggleWithPhotos={handleToggleWithPhotos}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        customContentsCount={customContentsList.length}
        publicUrl={publicUrl}
        isPublished={isPublished}
        isPublishing={publishMutation.isPending}
        onTogglePublish={() => setPublishModalOpen(true)}
        onOpenChangeTheme={() => setChangeThemeModalOpen(true)}
        onOpenFontModal={() => setFontModalOpen(true)}
        onOpenMusicModal={() => setMusicModalOpen(true)}
        onOpenPhotoFramer={() => setPhotoFramerModalOpen(true)}
        onOpenCustomContent={() => handleOpenSlot("after-hero")}
        onOpenThemePalette={() => setThemeModalOpen(true)}
        onOpenReorderModal={() => setReorderModalOpen(true)}
      />

      <main className="relative flex flex-1 items-start justify-center overflow-y-auto bg-muted/40 p-4 md:py-8">
        <div
          className={`overflow-hidden bg-background transition-all duration-300 ${
            deviceMode === "mobile"
              ? "w-full max-w-[395px] rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl ring-1 ring-black/5"
              : "w-full max-w-2xl rounded-2xl border shadow-lg"
          }`}
          style={
            {
              "--editor-primary": themeConfig.palette.primary,
              "--editor-bg": themeConfig.palette.background,
              "--editor-accent": themeConfig.palette.accent,
              "--editor-font-heading": themeConfig.typography.headingFont,
              "--editor-font-body": themeConfig.typography.bodyFont,
            } as React.CSSProperties
          }
        >
          {deviceMode === "mobile" ? (
            <div className="flex h-5 w-full items-center justify-center bg-zinc-800">
              <div className="h-1 w-12 rounded-full bg-zinc-600" />
            </div>
          ) : null}

          <UnifiedInvitation
            invitationId={invitationId}
            templateSlug={invitation.template?.slug ?? "kartu-pos-vintage"}
            title={title}
            eventDate={invitation.eventDate}
            coverImageUrl={coverImageUrl}
            musicUrl={musicUrl}
            musicStartAt={themeConfig.musicStartAt ?? 0}
            fontScale={themeConfig.fontScale ?? 1}
            scriptFont={themeConfig.scriptFont}
            themeConfig={themeConfig}
            sections={sections}
            schedules={invitation.schedules as unknown as EventScheduleItem[]}
            bankAccounts={
              invitation.bankAccounts as unknown as BankAccountItem[]
            }
            galleries={invitation.galleries as unknown as UnifiedGalleryItem[]}
            loveStories={
              invitation.loveStories as unknown as UnifiedStoryItem[]
            }
            customContents={customContentsList}
            withPhotos={themeConfig.withPhotos ?? true}
            fields={themeConfig.fields ?? {}}
            editing
            onPatchField={handlePatchField}
            onOpenRegion={(region) => {
              if (region === "cover") {
                setPhotoFramerModalOpen(true);
              } else {
                setActiveRegion(region);
              }
            }}
            onToggleSection={handleToggleSection}
            onOpenCustomSlot={handleOpenSlot}
            onOpenTextEditor={setTextEditorTarget}
          />
        </div>
      </main>

      <EditorRegionDialog
        activeRegion={activeRegion}
        onClose={() => setActiveRegion(null)}
        title={title}
        onTitleChange={(nextTitle) => {
          setTitle(nextTitle);
          handlePatchField("title", nextTitle);
        }}
        eventDateInput={eventDateInput}
        onEventDateChange={(nextDate) => {
          setEventDateInput(nextDate);
          if (nextDate) {
            updateMetadataMutation.mutate({
              id: invitationId,
              eventDate: new Date(nextDate),
            });
          }
        }}
        withPhotos={themeConfig.withPhotos ?? true}
        onToggleWithPhotos={handleToggleWithPhotos}
      />

      {fontModalOpen ? (
        <FontModal
          open={fontModalOpen}
          onOpenChange={setFontModalOpen}
          templateSlug={invitation.template?.slug ?? "kartu-pos-vintage"}
          currentFontSet={themeConfig.fontSet}
          currentFontScale={themeConfig.fontScale ?? 1}
          onSaveFont={handleSaveFont}
        />
      ) : null}

      {musicModalOpen ? (
        <MusicModal
          open={musicModalOpen}
          onOpenChange={setMusicModalOpen}
          currentMusicUrl={musicUrl}
          currentMusicTitle={musicTitle}
          currentAutoplay={isMusicAutoplay}
          currentStartAt={themeConfig.musicStartAt ?? 0}
          onSaveMusic={handleSaveMusic}
        />
      ) : null}

      {changeThemeModalOpen ? (
        <ChangeThemeModal
          open={changeThemeModalOpen}
          onOpenChange={setChangeThemeModalOpen}
          invitationId={invitationId}
          currentTemplateId={invitation.templateId}
        />
      ) : null}

      {photoFramerModalOpen ? (
        <PhotoFramerModal
          open={photoFramerModalOpen}
          onOpenChange={setPhotoFramerModalOpen}
          currentImageUrl={coverImageUrl}
          currentFocus={themeConfig.photoFocus ?? DEFAULT_PHOTO_FOCUS}
          uploadedPhotos={themeConfig.uploads ?? []}
          onSavePhoto={handleSavePhotoFocus}
        />
      ) : null}

      {themeModalOpen ? (
        <ThemeModal
          open={themeModalOpen}
          onOpenChange={setThemeModalOpen}
          currentTheme={themeConfig}
          onSaveTheme={handleSaveTheme}
        />
      ) : null}

      {reorderModalOpen ? (
        <SectionReorderModal
          open={reorderModalOpen}
          onOpenChange={setReorderModalOpen}
          invitationId={invitationId}
          sections={sections}
          onSectionsChange={(updated) => setSections(updated)}
        />
      ) : null}

      {customContentModalOpen ? (
        <CustomContentModal
          open={customContentModalOpen}
          onOpenChange={setCustomContentModalOpen}
          invitationId={invitationId}
          selectedSlotId={activeSlotId}
          items={customContentsList}
        />
      ) : null}

      {publishModalOpen ? (
        <PublishModal
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          invitationId={invitationId}
          title={title || invitation.title}
          slug={invitation.slug}
          status={invitation.status}
          packageTier={invitation.packageTier}
          enabledAddons={invitation.enabledAddons ?? []}
          isSlugLocked={Boolean(
            invitation.publishedAt ||
              invitation.status === "PUBLISHED" ||
              themeConfig.previewSharedAt
          )}
          fields={themeConfig.fields ?? {}}
          onOpenPricingModal={() => setPricingModalOpen(true)}
        />
      ) : null}

      {pricingModalOpen ? (
        <PricingModal
          open={pricingModalOpen}
          onOpenChange={setPricingModalOpen}
          invitationId={invitationId}
          invitationTitle={title || invitation.title}
          isAlreadyPremium={invitation.packageTier === "PREMIUM"}
          enabledAddons={invitation.enabledAddons ?? []}
        />
      ) : null}

      {textEditorTarget ? (
        <TextEditorModal
          open={Boolean(textEditorTarget)}
          onOpenChange={(open) => {
            if (!open) setTextEditorTarget(null);
          }}
          field={textEditorTarget.field}
          label={textEditorTarget.label}
          initialValue={
            (themeConfig.fields?.[textEditorTarget.field] ??
              (textEditorTarget.field === "title"
                ? title
                : textEditorTarget.fallback)) ||
            ""
          }
          onSave={(fieldKey, value) => {
            handlePatchField(fieldKey, value);
          }}
        />
      ) : null}
    </div>
  );
}
