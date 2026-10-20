"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

import { cn } from "@senara/ui/lib/utils";
import type { ThemeConfig } from "@/components/editor/theme-modal";

import { useEditContext } from "../edit-context";
import {
  EditableField,
  EditableImage,
  EditableRegion,
  SectionSwitch,
} from "../primitives";
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
  const { editing, onOpenRegion } = useEditContext();

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
                onClick={editing ? () => onOpenRegion?.("story") : undefined}
                className={cn(
                  "relative border-l-2 py-1 pl-4 text-xs transition-all",
                  editing &&
                    "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-r"
                )}
                style={{ borderColor: preset.accentColor }}
                title={editing ? "Klik untuk mengedit cerita perjalanan" : undefined}
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
  const { editing, onOpenImagePicker, onUpdateGalleries } = useEditContext();

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
            {galleries.map((item, idx) => (
              <div
                key={item.id || `gallery-item-${idx}`}
                className="relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-2xs"
              >
                <EditableImage
                  src={item.mediaUrl}
                  alt={item.caption || `Foto Kenangan ${idx + 1}`}
                  fill
                  className="object-cover"
                  label={`Foto Galeri #${idx + 1}`}
                  onSave={(newUrl) => {
                    const updated = [...galleries];
                    updated[idx] = { ...updated[idx]!, mediaUrl: newUrl };
                    onUpdateGalleries?.(updated);
                  }}
                />
              </div>
            ))}

            {editing ? (
              <button
                type="button"
                onClick={() => {
                  onOpenImagePicker?.({
                    label: "Foto Galeri Baru",
                    onSelect: (newUrl) => {
                      const newPhoto: UnifiedGalleryItem = {
                        id: `gal-local-${Date.now()}`,
                        mediaUrl: newUrl,
                        mediaType: "IMAGE",
                        caption: "Foto Kenangan",
                      };
                      onUpdateGalleries?.([...galleries, newPhoto]);
                    },
                  });
                }}
                className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all p-3 text-center cursor-pointer group"
                title="Tambah foto baru ke galeri"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary group-hover:scale-110 transition-transform">
                  <Plus className="size-5" />
                </div>
                <span className="text-[10px] font-semibold text-primary mt-1.5">
                  Tambah Foto
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </EditableRegion>
    </SectionSwitch>
  );
}

