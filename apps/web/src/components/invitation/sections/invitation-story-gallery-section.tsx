"use client";

import Image from "next/image";

import type { ThemeConfig } from "@/components/editor/theme-modal";

import { EditableField, EditableRegion, SectionSwitch } from "../primitives";
import type { TemplateThemePreset } from "../templates/kartu-pos";
import type {
  UnifiedGalleryItem,
  UnifiedStoryItem,
} from "../unified-invitation-data";

interface InvitationStorySectionProps {
  preset: TemplateThemePreset;
  themeConfig: ThemeConfig;
  stories: UnifiedStoryItem[];
}

export function InvitationStorySection({
  preset,
  themeConfig,
  stories,
}: InvitationStorySectionProps) {
  return (
    <SectionSwitch sectionKey="love-story" label={preset.labels.storyTitle}>
      <EditableRegion region="story" label="Edit Cerita">
        <div
          className="flex flex-col gap-5 border-t px-7 py-8 text-left"
          style={{
            backgroundColor: preset.bgCard,
            borderColor: `${preset.borderStyle}66`,
          }}
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <span
              className="rounded-full border px-3 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
              style={{
                borderColor: preset.accentColor,
                color: preset.accentColor,
              }}
            >
              <EditableField
                field="storyBadge"
                fallback={preset.labels.storyBadge}
              />
            </span>
            <h3
              className="mt-1 text-xl font-bold tracking-tight"
              style={{ fontFamily: themeConfig.typography.headingFont }}
            >
              <EditableField
                field="storyTitle"
                fallback={preset.labels.storyTitle}
              />
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {stories.map((story, idx) => (
              <div
                key={story.id}
                className="relative border-l-2 py-1 pl-4 text-xs"
                style={{ borderColor: preset.accentColor }}
              >
                <span
                  className="absolute top-1.5 -left-[5px] size-2 rounded-full"
                  style={{ backgroundColor: preset.accentColor }}
                />
                <p
                  className="text-xs font-bold"
                  style={{ color: preset.accentColor }}
                >
                  <EditableField
                    field={`story_${idx}_year`}
                    fallback={story.yearOrDate}
                  />
                </p>
                <p className="mt-0.5 text-sm font-semibold">
                  <EditableField
                    field={`story_${idx}_title`}
                    fallback={story.title}
                  />
                </p>
                <EditableField
                  as="p"
                  multiline
                  field={`story_${idx}_body`}
                  fallback={story.story}
                  className="mt-1 leading-relaxed opacity-80"
                />
              </div>
            ))}
          </div>
        </div>
      </EditableRegion>
    </SectionSwitch>
  );
}

interface InvitationGallerySectionProps {
  preset: TemplateThemePreset;
  themeConfig: ThemeConfig;
  galleries: UnifiedGalleryItem[];
}

export function InvitationGallerySection({
  preset,
  themeConfig,
  galleries,
}: InvitationGallerySectionProps) {
  return (
    <SectionSwitch sectionKey="gallery" label={preset.labels.galleryTitle}>
      <EditableRegion region="gallery" label="Kelola Galeri Foto">
        <div
          className="flex flex-col gap-5 border-t px-6 py-8"
          style={{
            backgroundColor: preset.bgMain,
            borderColor: `${preset.borderStyle}66`,
          }}
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: themeConfig.typography.headingFont }}
            >
              <EditableField
                field="galleryTitle"
                fallback={preset.labels.galleryTitle}
              />
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {galleries.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-2xs"
              >
                <Image
                  src={item.mediaUrl}
                  alt={item.caption || "Foto Kenangan"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </EditableRegion>
    </SectionSwitch>
  );
}

