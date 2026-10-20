"use client";

import { use, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@senara/ui/components/button";

import { EditorModalsHost } from "@/components/editor/editor-modals-host";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { useEditorModals } from "@/components/editor/use-editor-modals";
import { useEditorState } from "@/components/editor/use-editor-state";
import type { BankAccountItem } from "@/components/invitation/digital-gift-section";
import type { EventScheduleItem } from "@/components/invitation/event-section";
import {
  UnifiedInvitation,
  type UnifiedGalleryItem,
  type UnifiedStoryItem,
} from "@/components/invitation/unified-invitation";
import { trpc } from "@/utils/trpc";

interface EditorPageProps {
  params: Promise<{
    invitationId: string;
  }>;
}

export default function InvitationEditorPage({ params }: EditorPageProps) {
  const resolvedParams = use(params);
  const invitationId = resolvedParams.invitationId;

  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  const {
    data: invitation,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.invitation.getById.queryOptions({ id: invitationId }));

  const editorState = useEditorState({
    invitationId,
    invitation,
    onRefetch: refetch,
  });

  const modals = useEditorModals();

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

  const { draft, status, actions } = editorState;
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${invitation.slug}`
      : `/${invitation.slug}`;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {status.hasMultiTabConflict ? (
        <div
          onClick={actions.resolveConflict}
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
        autoSaveStatus={status.autoSaveStatus}
        onRetrySave={actions.retrySave}
        withPhotos={draft.themeConfig.withPhotos ?? true}
        onToggleWithPhotos={actions.toggleWithPhotos}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        customContentsCount={draft.customContentsList.length}
        publicUrl={publicUrl}
        isPublished={status.isPublished}
        isPublishing={status.isPublishing}
        onTogglePublish={() => modals.setPublishOpen(true)}
        onOpenChangeTheme={() => modals.setChangeThemeOpen(true)}
        onOpenFontModal={() => modals.setFontOpen(true)}
        onOpenMusicModal={() => modals.setMusicOpen(true)}
        onOpenPhotoFramer={() => modals.setPhotoFramerOpen(true)}
        onOpenLayoutLibrary={() => modals.openLayoutLibrary("after-hero")}
        onOpenCustomContent={() => modals.openCustomContent("after-hero")}
        onOpenThemePalette={() => modals.setThemeOpen(true)}
        onOpenReorderModal={() => modals.setReorderOpen(true)}
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
              "--editor-primary": draft.themeConfig.palette.primary,
              "--editor-bg": draft.themeConfig.palette.background,
              "--editor-accent": draft.themeConfig.palette.accent,
              "--editor-font-heading": draft.themeConfig.typography.headingFont,
              "--editor-font-body": draft.themeConfig.typography.bodyFont,
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
            title={draft.title}
            eventDate={invitation.eventDate}
            coverImageUrl={draft.coverImageUrl}
            musicUrl={draft.musicUrl}
            musicStartAt={draft.themeConfig.musicStartAt ?? 0}
            fontScale={draft.themeConfig.fontScale ?? 1}
            scriptFont={draft.themeConfig.scriptFont}
            themeConfig={draft.themeConfig}
            sections={draft.sections}
            schedules={invitation.schedules as unknown as EventScheduleItem[]}
            bankAccounts={
              invitation.bankAccounts as unknown as BankAccountItem[]
            }
            galleries={
              draft.localGalleries.length > 0
                ? draft.localGalleries
                : (invitation.galleries as unknown as UnifiedGalleryItem[])
            }
            loveStories={
              draft.localStories.length > 0
                ? draft.localStories
                : (invitation.loveStories as unknown as UnifiedStoryItem[])
            }
            customContents={draft.customContentsList}
            withPhotos={draft.themeConfig.withPhotos ?? true}
            fields={draft.themeConfig.fields ?? {}}
            editing
            onPatchField={actions.patchField}
            onPatchFields={actions.patchFields}
            onEventDateChange={actions.changeEventDate}
            onUpdateGalleries={actions.updateGalleries}
            onOpenImagePicker={modals.setMediaTarget}
            onOpenRegion={(region) => {
              if (region === "cover") {
                modals.setMediaTarget({
                  currentUrl: draft.coverImageUrl,
                  label: "Foto Sampul Utama",
                  onSelect: (newUrl) => {
                    actions.setCoverImageUrl(newUrl);
                    actions.patchField("coverImageUrl", newUrl);
                    actions.triggerSave({
                      title: draft.title,
                      coverImageUrl: newUrl,
                      musicUrl: draft.musicUrl,
                      musicTitle: draft.musicTitle,
                      isMusicAutoplay: draft.isMusicAutoplay,
                      themeConfig: draft.themeConfig,
                    });
                  },
                });
              } else if (region === "story") {
                modals.setStoryOpen(true);
              } else if (region === "gallery") {
                modals.setMediaTarget({
                  label: "Foto Galeri Baru",
                  onSelect: (newUrl) => {
                    const current =
                      draft.localGalleries.length > 0
                        ? draft.localGalleries
                        : (invitation.galleries as unknown as UnifiedGalleryItem[]) || [];
                    actions.updateGalleries([
                      ...current,
                      {
                        id: `gal-local-${Date.now()}`,
                        mediaUrl: newUrl,
                        mediaType: "IMAGE",
                        caption: "Foto Kenangan",
                      },
                    ]);
                  },
                });
              } else {
                modals.setActiveRegion(region);
              }
            }}
            onToggleSection={actions.toggleSection}
            onOpenCustomSlot={modals.openCustomContent}
            onOpenLayoutLibrary={modals.openLayoutLibrary}
            onOpenBackgroundModal={(pageKey) =>
              modals.setBackgroundTarget(pageKey)
            }
            onEditCustomItem={modals.handleEditCustomItem}
            onOpenTextEditor={modals.setTextEditorTarget}
          />
        </div>
      </main>

      <EditorModalsHost
        modals={modals}
        editorState={editorState}
        invitation={invitation}
      />
    </div>
  );
}
