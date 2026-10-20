"use client";

import { useState } from "react";
import { ExternalLink, Monitor, Smartphone, X } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";

import type { TemplateGeneratorItem } from "./template-generator-types";
import { UnifiedInvitation } from "@/components/invitation/unified-invitation";
import type { ExtendedThemeConfig } from "@/components/editor/editor-types";
import { DEFAULT_THEME_CONFIG } from "@/components/editor/theme-modal";

export interface TemplatePreviewModalProps {
  template: TemplateGeneratorItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplatePreviewModal({
  template,
  open,
  onOpenChange,
}: TemplatePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b px-4 py-3 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <span>Pratinjau: {template.name}</span>
              <span className="font-mono text-xs text-muted-foreground font-normal">
                ({template.slug})
              </span>
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border bg-muted/60 p-0.5">
              <Button
                variant={deviceMode === "mobile" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setDeviceMode("mobile")}
              >
                <Smartphone className="size-3.5 mr-1" />
                <span>Mobile</span>
              </Button>
              <Button
                variant={deviceMode === "desktop" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setDeviceMode("desktop")}
              >
                <Monitor className="size-3.5 mr-1" />
                <span>Desktop</span>
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => {
                window.open(`/template/${template.slug}`, "_blank");
              }}
            >
              <ExternalLink className="size-3" />
              <span>Buka Tab Baru</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-zinc-950/80 p-4 flex items-start justify-center">
          <div
            className={`transition-all duration-300 overflow-hidden bg-background ${
              deviceMode === "mobile"
                ? "w-full max-w-[395px] rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl"
                : "w-full max-w-2xl rounded-2xl border shadow-lg"
            }`}
          >
            {deviceMode === "mobile" ? (
              <div className="flex h-5 w-full items-center justify-center bg-zinc-800">
                <div className="h-1 w-12 rounded-full bg-zinc-600" />
              </div>
            ) : null}

            <UnifiedInvitation
              templateSlug={template.slug}
              title={`The Wedding of ${template.name}`}
              coverImageUrl={template.thumbnail}
              withPhotos={true}
              demo={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

