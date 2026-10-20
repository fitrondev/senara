"use client";

import dynamic from "next/dynamic";

import {
  DEFAULT_PHOTO_FOCUS,
} from "@/components/editor/photo-framer-modal";
import type { EditorInvitationData, EditorState } from "./use-editor-state";
import type { EditorModalsController } from "./use-editor-modals";
import { EditorRegionDialog } from "./editor-region-dialog";
import type { UnifiedGalleryItem, UnifiedStoryItem } from "@/components/invitation/unified-invitation";

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
const StoryModal = dynamic(() =>
  import("@/components/editor/story-modal").then((m) => m.StoryModal)
);
const MediaModal = dynamic(() =>
  import("@/components/editor/media-modal").then((m) => m.MediaModal)
);
const LayoutLibraryModal = dynamic(() =>
  import("@/components/editor/layout-library-modal").then(
    (m) => m.LayoutLibraryModal
  )
);
const BackgroundModal = dynamic(() =>
  import("@/components/editor/background-modal").then((m) => m.BackgroundModal)
);

export interface EditorModalsHostProps {
  modals: EditorModalsController;
  editorState: EditorState;
  invitation: EditorInvitationData;
}

/**
 * Deep module that encapsulates the loading, state coordination,
 * and rendering of all 14+ modal dialogs in the Senara invitation editor.
 */
export function EditorModalsHost({
  modals,
  editorState,
  invitation,
}: EditorModalsHostProps) {
  const { state: mState } = modals;
  const { draft, actions } = editorState;

  const invitationId = invitation.id;
  const templateSlug = invitation.template?.slug ?? "kartu-pos-vintage";

  return (
    <>
      <EditorRegionDialog
        activeRegion={mState.activeRegion}
        onClose={() => modals.setActiveRegion(null)}
        title={draft.title}
        onTitleChange={(nextTitle) => {
          actions.setTitle(nextTitle);
          actions.patchField("title", nextTitle);
        }}
        eventDateInput={draft.eventDateInput}
        onEventDateChange={actions.changeEventDate}
        withPhotos={draft.themeConfig.withPhotos ?? true}
        onToggleWithPhotos={actions.toggleWithPhotos}
      />

      {mState.fontOpen ? (
        <FontModal
          open={mState.fontOpen}
          onOpenChange={modals.setFontOpen}
          templateSlug={templateSlug}
          currentFontSet={draft.themeConfig.fontSet}
          currentFontScale={draft.themeConfig.fontScale ?? 1}
          onSaveFont={actions.saveFont}
        />
      ) : null}

      {mState.musicOpen ? (
        <MusicModal
          open={mState.musicOpen}
          onOpenChange={modals.setMusicOpen}
          currentMusicUrl={draft.musicUrl}
          currentMusicTitle={draft.musicTitle}
          currentAutoplay={draft.isMusicAutoplay}
          currentStartAt={draft.themeConfig.musicStartAt ?? 0}
          onSaveMusic={actions.saveMusic}
        />
      ) : null}

      {mState.changeThemeOpen ? (
        <ChangeThemeModal
          open={mState.changeThemeOpen}
          onOpenChange={modals.setChangeThemeOpen}
          invitationId={invitationId}
          currentTemplateId={invitation.templateId}
        />
      ) : null}

      {mState.photoFramerOpen ? (
        <PhotoFramerModal
          open={mState.photoFramerOpen}
          onOpenChange={modals.setPhotoFramerOpen}
          currentImageUrl={draft.coverImageUrl}
          currentFocus={draft.themeConfig.photoFocus ?? DEFAULT_PHOTO_FOCUS}
          uploadedPhotos={draft.themeConfig.uploads ?? []}
          onSavePhoto={actions.savePhotoFocus}
        />
      ) : null}

      {mState.themeOpen ? (
        <ThemeModal
          open={mState.themeOpen}
          onOpenChange={modals.setThemeOpen}
          currentTheme={draft.themeConfig}
          onSaveTheme={actions.saveTheme}
        />
      ) : null}

      {mState.reorderOpen ? (
        <SectionReorderModal
          open={mState.reorderOpen}
          onOpenChange={modals.setReorderOpen}
          invitationId={invitationId}
          sections={draft.sections}
          onSectionsChange={actions.setSections}
        />
      ) : null}

      {mState.customContentOpen ? (
        <CustomContentModal
          open={mState.customContentOpen}
          onOpenChange={(isOpen) => {
            modals.setCustomContentOpen(isOpen);
          }}
          invitationId={invitationId}
          selectedSlotId={mState.activeSlotId}
          initialEditingItem={mState.editingCustomItem}
          onEditTextBlock={(item) => {
            modals.setCustomContentOpen(false);
            modals.handleEditCustomItem(item);
          }}
          items={draft.customContentsList}
          onOpenLayoutLibrary={() =>
            modals.openLayoutLibrary(mState.activeSlotId)
          }
        />
      ) : null}

      {mState.layoutLibraryOpen ? (
        <LayoutLibraryModal
          open={mState.layoutLibraryOpen}
          onOpenChange={modals.setLayoutLibraryOpen}
          invitationId={invitationId}
          initialSlotId={mState.layoutLibrarySlotId}
        />
      ) : null}

      {mState.backgroundTarget ? (
        <BackgroundModal
          open={Boolean(mState.backgroundTarget)}
          onOpenChange={(open) => {
            if (!open) modals.setBackgroundTarget(null);
          }}
          pageKey={mState.backgroundTarget}
          currentSetting={
            draft.themeConfig.pageBackgrounds?.[mState.backgroundTarget]
          }
          onSaveBackground={actions.savePageBackground}
        />
      ) : null}

      {mState.publishOpen ? (
        <PublishModal
          open={mState.publishOpen}
          onOpenChange={modals.setPublishOpen}
          invitationId={invitationId}
          title={draft.title || invitation.title}
          slug={invitation.slug}
          status={invitation.status}
          packageTier={invitation.packageTier}
          enabledAddons={(invitation.enabledAddons as string[]) ?? []}
          isSlugLocked={Boolean(
            invitation.publishedAt ||
              invitation.status === "PUBLISHED" ||
              draft.themeConfig.previewSharedAt
          )}
          fields={draft.themeConfig.fields ?? {}}
          onOpenPricingModal={() => modals.setPricingOpen(true)}
        />
      ) : null}

      {mState.pricingOpen ? (
        <PricingModal
          open={mState.pricingOpen}
          onOpenChange={modals.setPricingOpen}
          invitationId={invitationId}
          invitationTitle={draft.title || invitation.title}
          isAlreadyPremium={invitation.packageTier === "PREMIUM"}
          enabledAddons={(invitation.enabledAddons as string[]) ?? []}
        />
      ) : null}

      {mState.textEditorTarget ? (
        <TextEditorModal
          open={Boolean(mState.textEditorTarget)}
          onOpenChange={(open) => {
            if (!open) modals.setTextEditorTarget(null);
          }}
          field={mState.textEditorTarget.field}
          label={mState.textEditorTarget.label}
          initialValue={
            (draft.themeConfig.fields?.[mState.textEditorTarget.field] ??
              (mState.textEditorTarget.field === "title"
                ? draft.title
                : mState.textEditorTarget.fallback)) ||
            ""
          }
          onSave={(fieldKey, value) => {
            actions.patchField(fieldKey, value);
          }}
        />
      ) : null}

      {mState.customTextBlockTarget ? (
        <TextEditorModal
          open={Boolean(mState.customTextBlockTarget)}
          onOpenChange={(open) => {
            if (!open) modals.setCustomTextBlockTarget(null);
          }}
          field={mState.customTextBlockTarget.item.id}
          label={mState.customTextBlockTarget.label}
          initialValue={mState.customTextBlockTarget.initialValue}
          onSave={async (_fieldKey, value) => {
            const item = mState.customTextBlockTarget!.item;
            const textAlignMatch = value.match(
              /text-align:\s*(left|center|right)/i
            );
            const align = (textAlignMatch?.[1]?.toLowerCase() as
              | "left"
              | "center"
              | "right") || "center";
            const existingContent =
              (item.content as Record<string, unknown>) || {};

            let newContent: Record<string, unknown>;
            if (item.type === "TITLE") {
              newContent = {
                ...existingContent,
                title: value,
                align,
              };
            } else {
              newContent = {
                ...existingContent,
                text: value,
                align,
              };
            }

            await actions.updateCustomContentMutation.mutateAsync({
              id: item.id,
              invitationId,
              content: newContent,
            });
            modals.setCustomTextBlockTarget(null);
          }}
        />
      ) : null}

      {mState.storyOpen ? (
        <StoryModal
          open={mState.storyOpen}
          onOpenChange={modals.setStoryOpen}
          stories={
            draft.localStories.length > 0
              ? draft.localStories
              : ((invitation.loveStories as unknown as UnifiedStoryItem[]) || [])
          }
          initialBadge={draft.themeConfig.fields?.storyBadge || "Catatan Perjalanan"}
          initialTitle={draft.themeConfig.fields?.storyTitle || "Lembar demi Lembar"}
          onSave={actions.saveStories}
          isSaving={false}
        />
      ) : null}

      {mState.mediaTarget ? (
        <MediaModal
          open={Boolean(mState.mediaTarget)}
          onOpenChange={(open) => {
            if (!open) modals.setMediaTarget(null);
          }}
          title={
            mState.mediaTarget.label
              ? `Media - ${mState.mediaTarget.label}`
              : "Media"
          }
          currentImageUrl={mState.mediaTarget.currentUrl}
          uploadedPhotos={draft.themeConfig.uploads ?? []}
          onSelectImage={(newUrl) => {
            mState.mediaTarget?.onSelect(newUrl);
            modals.setMediaTarget(null);
          }}
          onDeleteImage={mState.mediaTarget.onDelete}
          onUpdateUploadedPhotos={(nextUploads) => {
            const nextTheme = {
              ...draft.themeConfig,
              uploads: nextUploads,
            };
            actions.saveTheme(nextTheme);
          }}
        />
      ) : null}
    </>
  );
}
