"use client";

import type { ThemeConfig } from "@/components/editor/theme-modal";
import { CustomContentItemRenderer } from "@/components/invitation/custom-content-item-renderer";

export interface PublicCustomContentItem {
  id: string;
  slotId: string;
  type: string;
  content: unknown;
  sortOrder: number;
  isVisible: boolean;
}

interface PublicCustomContentSlotProps {
  slotId: string;
  items: PublicCustomContentItem[];
  themeConfig: ThemeConfig;
}

export function PublicCustomContentSlot({
  slotId,
  items,
  themeConfig,
}: PublicCustomContentSlotProps) {
  const slotItems = items
    .filter((item) => item.slotId === slotId && item.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (slotItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 bg-background/50 p-6">
      {slotItems.map((item) => (
        <CustomContentItemRenderer
          key={item.id}
          item={item}
          themeConfig={themeConfig}
        />
      ))}
    </div>
  );
}
