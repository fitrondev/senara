"use client";

import { useMemo, useState } from "react";

import { EditorModalsHost } from "@/components/editor/editor-modals-host";
import { useEditorModals } from "@/components/editor/use-editor-modals";
import type { EditorInvitationData, EditorState } from "@/components/editor/use-editor-state";
import type { EditorSectionItem } from "@/components/editor/section-reorder-modal";
import type { BankAccountItem } from "@/components/invitation/digital-gift-section";
import type { EventScheduleItem } from "@/components/invitation/event-section";
import {
  UnifiedInvitation,
  type UnifiedGalleryItem,
  type UnifiedStoryItem,
} from "@/components/invitation/unified-invitation";
import { TemplateMetaDialog } from "./template-meta-dialog";
import { TemplateGeneratorToolbar } from "./template-generator-toolbar";
import {
  useTemplateGeneratorState,
  type LoadedTemplateData,
} from "./use-template-generator-state";
import { TemplatePreviewModal } from "../template-preview-modal";
import type { TemplateGeneratorItem } from "../template-generator-types";

export interface TemplateGeneratorEditorProps {
  template: LoadedTemplateData;
}

export function TemplateGeneratorEditor({ template }: TemplateGeneratorEditorProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [metaDialogOpen, setMetaDialogOpen] = useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);

  const state = useTemplateGeneratorState({ template });
  const modals = useEditorModals();

  const { draft, actions, metadata, status } = state;

  // Synthesize adapter for EditorModalsHost to fully reuse existing modal systems
  const invitationAdapter = useMemo<EditorInvitationData>(() => {
    return {
      id: template.id,
      userId: template.createdBy || "superadmin",
      templateId: template.id,
      title: metadata.name,
      slug: metadata.slug,
      status: status.status,
      packageTier: metadata.isPremium ? "PREMIUM" : "FREE",
      coverImageUrl: metadata.thumbnail,
      themeConfig: draft.themeConfig,
      sections: draft.sections,
      customContents: draft.customContentsList,
      template: {
        id: template.id,
        slug: template.slug,
        name: metadata.name,
        thumbnail: metadata.thumbnail,
      },
    };
  }, [template.id, template.createdBy, template.slug, metadata, status.status, draft.themeConfig, draft.sections, draft.customContentsList]);

  const editorStateAdapter = useMemo<EditorState>(() => {
    return {
      draft: {
        ...draft,
        eventDateInput: "2026-10-24",
      },
      status: {
        autoSaveStatus: status.autoSaveStatus,
        hasMultiTabConflict: false,
        isPublishing: status.isPublishing,
        isPublished: status.isPublished,
      },
      actions: {
        setTitle: (val: React.SetStateAction<string>) => {
          const resolved = typeof val === "function" ? val(draft.title) : val;
          actions.setTitle(resolved);
        },
        setCoverImageUrl: (val: React.SetStateAction<string>) => {
          const resolved = typeof val === "function" ? val(draft.coverImageUrl) : val;
          actions.setCoverImageUrl(resolved);
        },
        setSections: (val: React.SetStateAction<EditorSectionItem[]>) => {
          const resolved = typeof val === "function" ? val(draft.sections) : val;
          actions.setSections(resolved);
        },
        patchField: actions.patchField,
        patchFields: actions.patchFields,
        toggleWithPhotos: actions.toggleWithPhotos,
        savePageBackground: actions.savePageBackground,
        changeEventDate: actions.changeEventDate,
        saveStories: actions.saveStories,
        updateGalleries: actions.updateGalleries,
        toggleSection: actions.toggleSection,
        saveTheme: actions.saveTheme,
        saveFont: actions.saveFont,
        saveMusic: actions.saveMusic,
        savePhotoFocus: actions.savePhotoFocus,
        retrySave: actions.retrySave,
        resolveConflict: async () => {},
        triggerSave: () => {},
        updateCustomContentMutation: {
          mutateAsync: async (input: { id: string; content: unknown }) => {
            const nextList = draft.customContentsList.map((item) =>
              item.id === input.id
                ? { ...item, content: input.content as Record<string, unknown> }
                : item
            );
            actions.insertLayoutBatch(nextList);
          },
        } as unknown as EditorState["actions"]["updateCustomContentMutation"],
        publishMutation: {
          isPending: status.isPublishing,
        } as unknown as EditorState["actions"]["publishMutation"],
      },
    };
  }, [draft, status, actions]);

  const previewItem: TemplateGeneratorItem = useMemo(() => {
    return {
      id: template.id,
      slug: metadata.slug,
      name: metadata.name,
      description: metadata.description,
      category: metadata.category,
      thumbnail: metadata.thumbnail,
      previewUrl: `/template/${metadata.slug}`,
      isPremium: metadata.isPremium,
      price: metadata.price,
      isActive: status.isPublished,
      status: status.status,
      tags: metadata.tags,
      defaultSectionsCount: draft.sections.length,
      invitationsCount: template.invitationsCount,
      createdBy: template.createdBy,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }, [template, metadata, status, draft.sections.length]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-xl border border-border/80 bg-background shadow-md">
      <TemplateGeneratorToolbar
        state={state}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        onOpenMetaDialog={() => setMetaDialogOpen(true)}
        onOpenThemeModal={() => modals.setThemeOpen(true)}
        onOpenFontModal={() => modals.setFontOpen(true)}
        onOpenMusicModal={() => modals.setMusicOpen(true)}
        onOpenPhotoFramer={() => modals.setPhotoFramerOpen(true)}
        onOpenReorderModal={() => modals.setReorderOpen(true)}
        onOpenLayoutLibrary={() => modals.openLayoutLibrary("after-hero")}
        onOpenPreview={() => setFullPreviewOpen(true)}
      />

      {/* Editor Center Preview Canvas */}
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
            invitationId={template.id}
            templateSlug={template.slug}
            title={draft.title}
            coverImageUrl={draft.coverImageUrl}
            musicUrl={draft.musicUrl}
            musicStartAt={draft.themeConfig.musicStartAt ?? 0}
            fontScale={draft.themeConfig.fontScale ?? 1}
            scriptFont={draft.themeConfig.scriptFont}
            themeConfig={draft.themeConfig}
            sections={draft.sections}
            customContents={draft.customContentsList}
            withPhotos={draft.themeConfig.withPhotos ?? true}
            fields={draft.themeConfig.fields ?? {}}
            editing={true}
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
                  },
                });
              } else if (region === "story") {
                modals.setStoryOpen(true);
              } else if (region === "gallery") {
                modals.setMediaTarget({
                  label: "Foto Galeri Baru",
                  onSelect: (newUrl) => {
                    actions.updateGalleries([
                      ...draft.localGalleries,
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
        editorState={editorStateAdapter}
        invitation={invitationAdapter}
      />

      <TemplateMetaDialog
        open={metaDialogOpen}
        onOpenChange={setMetaDialogOpen}
        metadata={{
          name: metadata.name,
          slug: metadata.slug,
          description: metadata.description,
          category: metadata.category,
          thumbnail: metadata.thumbnail,
          isPremium: metadata.isPremium,
          price: metadata.price,
          tags: metadata.tags,
        }}
        onSave={actions.updateMetadata}
      />

      <TemplatePreviewModal
        template={previewItem}
        open={fullPreviewOpen}
        onOpenChange={setFullPreviewOpen}
      />
    </div>
  );
}
