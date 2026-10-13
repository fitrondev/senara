"use client";

import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";

import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import { CustomContentSlot } from "@/components/editor/custom-content-slot";
import { DEFAULT_THEME_CONFIG } from "@/components/editor/theme-modal";

import { CountdownTimer } from "./countdown-timer";
import { CoverGate } from "./cover-gate";
import { DigitalGiftSection } from "./digital-gift-section";
import { EditProvider } from "./edit-context";
import { EventSection } from "./event-section";
import {
  EditableField,
  EditableRegion,
  GuestHintModal,
  SectionSwitch,
} from "./primitives";
import {
  PublicCustomContentSlot,
  type PublicCustomContentItem,
} from "./public-custom-content-slot";
import { RSVPSection } from "./rsvp-section";
import { InvitationCoupleSection } from "./sections/invitation-couple-section";
import { InvitationHeroSection } from "./sections/invitation-hero-section";
import {
  InvitationGallerySection,
  InvitationStorySection,
} from "./sections/invitation-story-gallery-section";
import {
  DEFAULT_DEMO_BANKS,
  DEFAULT_DEMO_GALLERIES,
  DEFAULT_DEMO_SCHEDULES,
  DEFAULT_DEMO_STORIES,
  formatInvitationEventDate,
  resolveTemplatePreset,
  type UnifiedGalleryItem,
  type UnifiedInvitationProps,
  type UnifiedSectionConfig,
  type UnifiedStoryItem,
} from "./unified-invitation-data";

export type {
  UnifiedGalleryItem,
  UnifiedInvitationProps,
  UnifiedSectionConfig,
  UnifiedStoryItem,
};

export function UnifiedInvitation({
  invitationId = "demo-invitation",
  templateSlug,
  title,
  eventDate,
  coverImageUrl,
  musicUrl,
  musicStartAt = 0,
  fontScale = 1,
  scriptFont,
  themeConfig = DEFAULT_THEME_CONFIG,
  sections,
  schedules,
  bankAccounts,
  galleries,
  loveStories,
  customContents = [],
  guestId,
  guestName,
  isGroupLink = false,
  resellerBrandName,
  resellerLogoUrl,
  withPhotos = true,
  editing = false,
  demo = false,
  live = false,
  showCoverGateInitially = false,
  fields = {},
  onPatchField,
  onOpenRegion,
  onToggleSection,
  onOpenCustomSlot,
  onOpenTextEditor,
}: UnifiedInvitationProps) {
  const preset = resolveTemplatePreset(templateSlug);
  const [isCoverGateOpen, setIsCoverGateOpen] = useState(
    !showCoverGateInitially
  );

  const isSectionVisible = (sectionKey: string) => {
    if (!sections || sections.length === 0) return true;
    const match = sections.find((s) => s.sectionKey === sectionKey);
    return match ? match.isVisible : true;
  };

  const resolvedTitle = title || preset.labels.defaultTitle;
  const resolvedCoverImage =
    coverImageUrl ||
    preset.labels.person1Photo ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

  const eventDateFormatted = formatInvitationEventDate(eventDate);

  const activeSchedules =
    schedules && schedules.length > 0 ? schedules : DEFAULT_DEMO_SCHEDULES;
  const activeStories =
    loveStories && loveStories.length > 0 ? loveStories : DEFAULT_DEMO_STORIES;
  const activeGalleries =
    galleries && galleries.length > 0 ? galleries : DEFAULT_DEMO_GALLERIES;
  const activeBanks =
    bankAccounts && bankAccounts.length > 0
      ? bankAccounts
      : DEFAULT_DEMO_BANKS;

  const renderSlot = (slotId: string, slotLabel: string) => {
    if (editing && onOpenCustomSlot) {
      return (
        <CustomContentSlot
          slotId={slotId}
          slotLabel={slotLabel}
          items={customContents as CustomContentItemData[]}
          themeConfig={themeConfig}
          onOpenSlotModal={onOpenCustomSlot}
        />
      );
    }
    return (
      <PublicCustomContentSlot
        slotId={slotId}
        items={customContents as PublicCustomContentItem[]}
        themeConfig={themeConfig}
      />
    );
  };

  return (
    <EditProvider
      editing={editing}
      demo={demo}
      live={live}
      withPhotos={withPhotos}
      guestName={guestName}
      fields={fields}
      onPatchField={onPatchField}
      onOpenRegion={onOpenRegion}
      onOpenTextEditor={onOpenTextEditor}
      isSectionVisible={isSectionVisible}
      onToggleSection={onToggleSection}
    >
      {!editing && showCoverGateInitially ? (
        <CoverGate
          title={resolvedTitle}
          coverImageUrl={withPhotos ? resolvedCoverImage : ""}
          guestName={guestName}
          eventDate={eventDate ? new Date(eventDate) : undefined}
          audioUrl={musicUrl}
          startAt={musicStartAt}
          isOpen={isCoverGateOpen}
          onOpen={() => setIsCoverGateOpen(true)}
          themeConfig={themeConfig}
        />
      ) : null}

      <div
        className="inv-canvas relative flex flex-col text-center"
        style={
          {
            backgroundColor: preset.bgMain,
            color: preset.textMain,
            fontFamily: themeConfig.typography.bodyFont,
            fontSize:
              fontScale && fontScale !== 1 ? `${fontScale * 100}%` : undefined,
            "--f-display": themeConfig.typography.headingFont,
            "--f-script": scriptFont || themeConfig.typography.headingFont,
            "--f-body": themeConfig.typography.bodyFont,
          } as React.CSSProperties
        }
      >
        <InvitationHeroSection
          templateSlug={templateSlug}
          title={resolvedTitle}
          coverImageUrl={resolvedCoverImage}
          eventDateFormatted={eventDateFormatted}
          preset={preset}
          themeConfig={themeConfig}
          withPhotos={withPhotos}
          editing={editing}
        />

        {renderSlot("after-hero", "Sampul / Hero")}

        <SectionSwitch sectionKey="quote" label={preset.labels.quoteTitle}>
          <EditableRegion region="quote" label="Ubah Kutipan Doa">
            <div
              className="flex flex-col gap-2.5 border-b px-7 py-8"
              style={{
                backgroundColor: preset.bgCard,
                borderColor: `${preset.borderStyle}66`,
              }}
            >
              <Heart
                className="mx-auto mb-1 size-4 opacity-75"
                style={{ color: preset.accentColor }}
              />
              <EditableField
                as="p"
                multiline
                field="quoteBody"
                fallback={preset.labels.defaultQuote}
                className="text-xs leading-relaxed italic opacity-90"
              />
              <EditableField
                as="span"
                field="quoteSource"
                fallback={`— ${preset.labels.defaultQuoteSource}`}
                className="mt-1 text-[11px] font-semibold"
                style={{ color: preset.accentColor }}
              />
            </div>
          </EditableRegion>
        </SectionSwitch>

        {renderSlot("after-quote", preset.labels.quoteTitle)}

        <InvitationCoupleSection
          preset={preset}
          themeConfig={themeConfig}
          withPhotos={withPhotos}
        />

        {renderSlot("after-couple", preset.labels.profileTitle)}

        <SectionSwitch sectionKey="event" label={preset.labels.eventTitle}>
          <EditableRegion region="event" label="Atur Acara & Tempat">
            <div className="bg-background text-foreground">
              <EventSection
                schedules={activeSchedules}
                themeConfig={themeConfig}
              />
              <div className="px-6 pb-6">
                <CountdownTimer
                  targetDate={
                    eventDate
                      ? new Date(eventDate)
                      : new Date("2026-10-24T08:00:00Z")
                  }
                  themeConfig={themeConfig}
                />
              </div>
            </div>
          </EditableRegion>
        </SectionSwitch>

        {renderSlot("after-event", preset.labels.eventTitle)}

        <InvitationStorySection
          preset={preset}
          themeConfig={themeConfig}
          stories={activeStories}
        />

        {renderSlot("after-story", preset.labels.storyTitle)}

        {withPhotos ? (
          <InvitationGallerySection
            preset={preset}
            themeConfig={themeConfig}
            galleries={activeGalleries}
          />
        ) : null}

        {renderSlot("after-gallery", preset.labels.galleryTitle)}

        <SectionSwitch sectionKey="gift" label={preset.labels.giftTitle}>
          <EditableRegion region="gift" label="Atur Rekening & QRIS">
            <div className="bg-background text-foreground">
              <DigitalGiftSection
                bankAccounts={activeBanks}
                themeConfig={themeConfig}
              />
            </div>
          </EditableRegion>
        </SectionSwitch>

        {renderSlot("after-gift", preset.labels.giftTitle)}

        <SectionSwitch sectionKey="rsvp" label={preset.labels.rsvpTitle}>
          <EditableRegion region="rsvp" label="Pengaturan RSVP">
            <div className="bg-background text-foreground">
              <RSVPSection
                invitationId={invitationId}
                guestId={guestId}
                initialGuestName={guestName}
                isGroupLink={isGroupLink}
                themeConfig={themeConfig}
              />
            </div>
          </EditableRegion>
        </SectionSwitch>

        {renderSlot("before-footer", "Sebelum Penutup")}

        <SectionSwitch sectionKey="closing" label="Salam Penutup" isLocked>
          <EditableRegion region="closing" label="Ubah Salam Penutup">
            <div
              className="flex flex-col items-center gap-3 border-t p-8 text-xs"
              style={{
                backgroundColor: preset.bgCard,
                borderColor: `${preset.borderStyle}66`,
              }}
            >
              <EditableField
                as="p"
                multiline
                field="closingBody"
                fallback={preset.labels.closingText}
                className="max-w-xs leading-relaxed opacity-85"
              />
              <p
                className="mt-1 text-base font-bold"
                style={{ fontFamily: themeConfig.typography.headingFont }}
              >
                <EditableField field="title" fallback={resolvedTitle} />
              </p>
            </div>
          </EditableRegion>
        </SectionSwitch>

        <footer className="flex flex-col items-center gap-1.5 border-t bg-muted/30 p-5 text-center text-[11px] text-muted-foreground">
          {resellerBrandName ? (
            <>
              <div className="flex items-center gap-1.5 font-semibold text-foreground/85">
                {resellerLogoUrl ? (
                  <img
                    src={resellerLogoUrl}
                    alt={resellerBrandName}
                    className="size-4 rounded-sm object-contain"
                  />
                ) : (
                  <Sparkles className="size-3 text-primary" />
                )}
                <span>{resellerBrandName}</span>
              </div>
              <p className="text-[10px] text-muted-foreground/70">
                Undangan Digital Eksklusif oleh {resellerBrandName}
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1 font-semibold text-foreground/80">
                <Sparkles className="size-3 text-primary" />
                <span>Senara Invitation Platform</span>
              </p>
              <p className="text-[10px] text-muted-foreground/70">
                Dibuat dengan cinta untuk momen terindah hidup Anda.
              </p>
            </>
          )}
        </footer>
      </div>

      <GuestHintModal />
    </EditProvider>
  );
}
