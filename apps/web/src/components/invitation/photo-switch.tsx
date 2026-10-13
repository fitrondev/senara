"use client";

import { Camera, CameraOff } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@senara/ui/components/tabs";

export interface PhotoSwitchProps {
  withPhotos: boolean;
  onChange: (withPhotos: boolean) => void;
  className?: string;
}

/**
  * Sakelar interaktif "Foto / Tanpa foto" (PhotoChoice ala UndangYuk)
  * Menggunakan komponen Tabs resmi dari @senara/ui/components/tabs.
  */
export function PhotoSwitch({
  withPhotos,
  onChange,
  className,
}: PhotoSwitchProps) {
  return (
    <Tabs
      value={withPhotos ? "with" : "without"}
      onValueChange={(val) => onChange(val === "with")}
      className={className}
    >
      <TabsList>
        <TabsTrigger value="with" className="gap-1.5">
          <Camera className="size-3.5" />
          <span>Dengan Foto</span>
        </TabsTrigger>
        <TabsTrigger value="without" className="gap-1.5">
          <CameraOff className="size-3.5" />
          <span>Tanpa Foto</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
