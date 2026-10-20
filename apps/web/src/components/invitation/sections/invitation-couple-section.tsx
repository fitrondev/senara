"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

import type { ThemeConfig } from "@/components/editor/theme-modal";

import { useEditContext } from "../edit-context";
import {
  EditableField,
  EditableImage,
  EditableRegion,
  SectionSwitch,
} from "../primitives";
import type { TemplateThemePreset } from "../templates/kartu-pos";

interface PersonProfileCardProps {
  nameField: string;
  parentsField: string;
  photoField: string;
  defaultName: string;
  defaultParents: string;
  photoUrl?: string;
  withPhotos: boolean;
  accentColor: string;
  headingFont: string;
}

function PersonProfileCard({
  nameField,
  parentsField,
  photoField,
  defaultName,
  defaultParents,
  photoUrl,
  withPhotos,
  accentColor,
  headingFont,
}: PersonProfileCardProps) {
  const { editing, getField, onOpenImagePicker, onPatchField } = useEditContext();
  const resolvedPhoto = getField(photoField, photoUrl || "");

  return (
    <div className="flex flex-col items-center gap-2">
      {withPhotos && resolvedPhoto ? (
        <div
          className="relative size-24 overflow-hidden rounded-full border-2 shadow-md"
          style={{ borderColor: accentColor }}
        >
          <EditableImage
            src={resolvedPhoto}
            alt={defaultName}
            fill
            className="object-cover"
            field={photoField}
            label={`Foto ${defaultName}`}
          />
        </div>
      ) : editing ? (
        <div
          onClick={() => {
            onOpenImagePicker?.({
              currentUrl: resolvedPhoto,
              label: `Foto ${defaultName}`,
              onSelect: (newUrl) => onPatchField?.(photoField, newUrl),
            });
          }}
          className="group relative flex size-16 items-center justify-center rounded-full border-2 font-serif text-xl font-bold cursor-pointer transition-all hover:bg-primary/10"
          style={{
            borderColor: accentColor,
            color: accentColor,
          }}
          title={`Klik untuk menambahkan foto ${defaultName}`}
        >
          <span>{defaultName.charAt(0)}</span>
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Camera className="size-4" />
          </div>
        </div>
      ) : (
        <div
          className="flex size-16 items-center justify-center rounded-full border-2 font-serif text-xl font-bold"
          style={{
            borderColor: accentColor,
            color: accentColor,
          }}
        >
          {defaultName.charAt(0)}
        </div>
      )}
      <EditableField
        as="h3"
        field={nameField}
        fallback={defaultName}
        className="mt-1 text-base font-bold"
        style={{ fontFamily: headingFont }}
      />
      <EditableField
        as="p"
        multiline
        field={parentsField}
        fallback={defaultParents}
        className="max-w-[220px] text-[11px] leading-snug opacity-80"
      />
    </div>
  );
}

interface InvitationCoupleSectionProps {
  preset: TemplateThemePreset;
  themeConfig: ThemeConfig;
  withPhotos: boolean;
}

export function InvitationCoupleSection({
  preset,
  themeConfig,
  withPhotos,
}: InvitationCoupleSectionProps) {
  return (
    <SectionSwitch
      sectionKey="couple"
      label={preset.labels.profileTitle}
      isLocked
    >
      <EditableRegion
        region="couple"
        label={`Profil ${preset.labels.profileTitle}`}
      >
        <div
          className="flex flex-col gap-6 border-b px-6 py-8"
          style={{
            backgroundColor: preset.bgMain,
            borderColor: `${preset.borderStyle}66`,
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span
              className="rounded-full border px-3 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
              style={{
                borderColor: preset.accentColor,
                color: preset.accentColor,
              }}
            >
              <EditableField
                field="profileBadge"
                fallback={preset.labels.profileBadge}
              />
            </span>
            <h2
              className="mt-1 text-2xl font-bold tracking-tight"
              style={{ fontFamily: themeConfig.typography.headingFont }}
            >
              <EditableField
                field="profileTitle"
                fallback={preset.labels.profileTitle}
              />
            </h2>
          </div>

          <div
            className={
              preset.labels.person2Name
                ? "grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2"
                : "flex flex-col items-center pt-2"
            }
          >
            <PersonProfileCard
              nameField="person1Name"
              parentsField="person1Parents"
              photoField="person1Photo"
              defaultName={preset.labels.person1Name}
              defaultParents={preset.labels.person1Parents}
              photoUrl={preset.labels.person1Photo}
              withPhotos={withPhotos}
              accentColor={preset.accentColor}
              headingFont={themeConfig.typography.headingFont}
            />

            {preset.labels.person2Name ? (
              <PersonProfileCard
                nameField="person2Name"
                parentsField="person2Parents"
                photoField="person2Photo"
                defaultName={preset.labels.person2Name}
                defaultParents={preset.labels.person2Parents ?? ""}
                photoUrl={preset.labels.person2Photo}
                withPhotos={withPhotos}
                accentColor={preset.accentColor}
                headingFont={themeConfig.typography.headingFont}
              />
            ) : null}
          </div>
        </div>
      </EditableRegion>
    </SectionSwitch>
  );
}

