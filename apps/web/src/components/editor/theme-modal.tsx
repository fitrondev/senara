"use client";

import { useState } from "react";
import { Check, Palette, Sparkles, Type } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@senara/ui/components/field";
import { Input } from "@senara/ui/components/input";
import { Separator } from "@senara/ui/components/separator";
import { cn } from "@senara/ui/lib/utils";

export interface ThemeConfig {
  palette: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  buttonStyle?: "rounded" | "pill" | "sharp";
  pageBackgrounds?: Record<
    string,
    {
      type: "default" | "custom";
      customUrl?: string;
    }
  >;
}

// Vercel Best Practice: Hoist static preset configurations outside render
export const THEME_COLOR_PRESETS = [
  {
    name: "Rose Romance",
    palette: {
      primary: "#be185d",
      secondary: "#fdf2f8",
      background: "#fffafb",
      accent: "#fb7185",
    },
  },
  {
    name: "Sage & Emerald",
    palette: {
      primary: "#065f46",
      secondary: "#ecfdf5",
      background: "#f8fcf9",
      accent: "#10b981",
    },
  },
  {
    name: "Classic Monochrome",
    palette: {
      primary: "#18181b",
      secondary: "#f4f4f5",
      background: "#ffffff",
      accent: "#71717a",
    },
  },
  {
    name: "Royal Navy & Gold",
    palette: {
      primary: "#1e3a8a",
      secondary: "#eff6ff",
      background: "#fafcff",
      accent: "#d97706",
    },
  },
  {
    name: "Terracotta Warmth",
    palette: {
      primary: "#c2410c",
      secondary: "#fff7ed",
      background: "#fefcf9",
      accent: "#ea580c",
    },
  },
  {
    name: "Lavender Dream",
    palette: {
      primary: "#6d28d9",
      secondary: "#f5f3ff",
      background: "#faf9ff",
      accent: "#8b5cf6",
    },
  },
] as const;

export const TYPOGRAPHY_PRESETS = [
  {
    name: "Serif Elegan (Modern)",
    headingFont: "Playfair Display, serif",
    bodyFont: "Plus Jakarta Sans, sans-serif",
  },
  {
    name: "Romantis Latin (Cursive)",
    headingFont: "Great Vibes, cursive",
    bodyFont: "Lora, serif",
  },
  {
    name: "Modern Minimalis",
    headingFont: "Montserrat, sans-serif",
    bodyFont: "Inter, sans-serif",
  },
  {
    name: "Sakral Klasik",
    headingFont: "Cormorant Garamond, serif",
    bodyFont: "Merriweather, serif",
  },
] as const;

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  palette: {
    primary: "#be185d",
    secondary: "#fdf2f8",
    background: "#ffffff",
    accent: "#fb7185",
  },
  typography: {
    headingFont: "Playfair Display, serif",
    bodyFont: "Plus Jakarta Sans, sans-serif",
  },
  buttonStyle: "pill",
};

interface ThemeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: ThemeConfig;
  onSaveTheme: (theme: ThemeConfig) => void;
}

export function ThemeModal({
  open,
  onOpenChange,
  currentTheme,
  onSaveTheme,
}: ThemeModalProps) {
  const [theme, setTheme] = useState<ThemeConfig>(currentTheme || DEFAULT_THEME_CONFIG);

  const handleSelectPreset = (preset: (typeof THEME_COLOR_PRESETS)[number]) => {
    const updated: ThemeConfig = {
      ...theme,
      palette: { ...preset.palette },
    };
    setTheme(updated);
    onSaveTheme(updated);
  };

  const handleSelectTypography = (preset: (typeof TYPOGRAPHY_PRESETS)[number]) => {
    const updated: ThemeConfig = {
      ...theme,
      typography: {
        headingFont: preset.headingFont,
        bodyFont: preset.bodyFont,
      },
    };
    setTheme(updated);
    onSaveTheme(updated);
  };

  const handleColorChange = (key: keyof ThemeConfig["palette"], val: string) => {
    const updated: ThemeConfig = {
      ...theme,
      palette: {
        ...theme.palette,
        [key]: val,
      },
    };
    setTheme(updated);
    onSaveTheme(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="size-5 text-primary" />
            <span>Kustomisasi Tema & Tipografi</span>
          </DialogTitle>
          <DialogDescription>
            Pilih palet warna dan kombinasi font. Perubahan langsung tercermin di kanvas preview.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Preset Palet Warna */}
          <div>
            <h4 className="font-semibold text-xs tracking-tight uppercase text-muted-foreground mb-2.5">
              Preset Palet Warna
            </h4>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {THEME_COLOR_PRESETS.map((preset) => {
                const isSelected =
                  theme.palette.primary === preset.palette.primary &&
                  theme.palette.background === preset.palette.background;

                return (
                  <Card
                    key={preset.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectPreset(preset)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectPreset(preset);
                      }
                    }}
                    className={cn(
                      "flex flex-col gap-2 p-2.5 text-left transition-all hover:border-primary/50 cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-4.5 rounded-full shadow-xs"
                        style={{ backgroundColor: preset.palette.primary }}
                      />
                      <span
                        className="size-4.5 rounded-full border border-border shadow-xs"
                        style={{ backgroundColor: preset.palette.background }}
                      />
                      <span
                        className="size-4.5 rounded-full shadow-xs"
                        style={{ backgroundColor: preset.palette.accent }}
                      />
                      {isSelected && (
                        <Check className="ml-auto size-3.5 text-primary" />
                      )}
                    </div>
                    <span className="text-xs font-medium truncate">
                      {preset.name}
                    </span>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Penyesuaian Warna Kustom */}
          <div>
            <h4 className="font-semibold text-xs tracking-tight uppercase text-muted-foreground mb-2.5">
              Warna Spesifik
            </h4>
            <FieldGroup className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel className="text-xs">Warna Utama (Primary)</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.palette.primary}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    className="size-8 cursor-pointer rounded border p-0.5 bg-transparent"
                  />
                  <Input
                    value={theme.palette.primary}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-xs">Aksen Tombol</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.palette.accent}
                    onChange={(e) => handleColorChange("accent", e.target.value)}
                    className="size-8 cursor-pointer rounded border p-0.5 bg-transparent"
                  />
                  <Input
                    value={theme.palette.accent}
                    onChange={(e) => handleColorChange("accent", e.target.value)}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-xs">Latar Belakang</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.palette.background}
                    onChange={(e) => handleColorChange("background", e.target.value)}
                    className="size-8 cursor-pointer rounded border p-0.5 bg-transparent"
                  />
                  <Input
                    value={theme.palette.background}
                    onChange={(e) => handleColorChange("background", e.target.value)}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-xs">Latar Sekunder</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.palette.secondary}
                    onChange={(e) => handleColorChange("secondary", e.target.value)}
                    className="size-8 cursor-pointer rounded border p-0.5 bg-transparent"
                  />
                  <Input
                    value={theme.palette.secondary}
                    onChange={(e) => handleColorChange("secondary", e.target.value)}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </Field>
            </FieldGroup>
          </div>

          <Separator />

          {/* Preset Tipografi & Font */}
          <div>
            <h4 className="font-semibold text-xs tracking-tight uppercase text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <Type className="size-3.5" />
              <span>Gaya Tipografi & Font</span>
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {TYPOGRAPHY_PRESETS.map((typo) => {
                const isSelected =
                  theme.typography.headingFont === typo.headingFont;

                return (
                  <Card
                    key={typo.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectTypography(typo)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectTypography(typo);
                      }
                    }}
                    className={cn(
                      "flex flex-col gap-1 p-3 text-left transition-all hover:border-primary/50 cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{typo.name}</span>
                      {isSelected && <Check className="size-3.5 text-primary" />}
                    </div>
                    <span
                      className="text-sm font-serif"
                      style={{ fontFamily: typo.headingFont }}
                    >
                      Adinda & Bagas
                    </span>
                    <span
                      className="text-[11px] text-muted-foreground"
                      style={{ fontFamily: typo.bodyFont }}
                    >
                      Bersama membagikan hari bahagia
                    </span>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="default" size="sm" />}>
            Selesai
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

