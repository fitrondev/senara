"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Loader2, MoveDown } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@senara/ui/components/empty";
import { Label } from "@senara/ui/components/label";
import { cn } from "@senara/ui/lib/utils";

import type { CustomContentItemData } from "./custom-content-modal";
import {
  DraggablePaletteItem,
  PaletteItemPreview,
} from "./custom-content-palette-item";
import {
  SortableCustomContentItem,
  SortableItemPreview,
} from "./custom-content-sortable-item";
import {
  CONTENT_TYPE_OPTIONS,
  type ContentTypeOption,
  type CustomContentType,
} from "./custom-content-types";

export interface CustomContentSlotListProps {
  slotItems: CustomContentItemData[];
  isReordering: boolean;
  isAdding?: boolean;
  onMoveOrder: (index: number, direction: "up" | "down") => void;
  onReorderItems?: (newItems: CustomContentItemData[]) => void;
  onToggleVisible: (itemId: string, currentVisible: boolean) => void;
  onEditItem: (item: CustomContentItemData) => void;
  onDeleteItem: (item: CustomContentItemData) => void;
  onAddDirectly: (type: CustomContentType, targetIndex?: number) => void;
}

export function CustomContentSlotList({
  slotItems,
  isReordering,
  isAdding = false,
  onMoveOrder,
  onReorderItems,
  onToggleVisible,
  onEditItem,
  onDeleteItem,
  onAddDirectly,
}: CustomContentSlotListProps) {
  const [activePaletteOption, setActivePaletteOption] =
    useState<ContentTypeOption | null>(null);
  const [activeSortableItem, setActiveSortableItem] =
    useState<CustomContentItemData | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      // Prioritaskan sortable item spesifik jika ada
      const sortableCollision = pointerCollisions.find(
        (c) => c.id !== "custom-content-slot-dropzone"
      );
      if (sortableCollision) {
        return [
          sortableCollision,
          ...pointerCollisions.filter((c) => c.id !== sortableCollision.id),
        ];
      }
      return pointerCollisions;
    }
    return closestCenter(args);
  };

  const { setNodeRef: setDropZoneRef } = useDroppable({
    id: "custom-content-slot-dropzone",
    data: { isSlotDropZone: true },
  });

  const handleDragStart = (event: DragStartEvent) => {
    hasDraggedRef.current = true;
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.isNewComponent) {
      const option = CONTENT_TYPE_OPTIONS.find(
        (opt) => opt.type === activeData.type
      );
      if (option) setActivePaletteOption(option);
    } else if (activeData?.isSortableItem) {
      setActiveSortableItem(activeData.item as CustomContentItemData);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeData = active.data.current;

    setActivePaletteOption(null);
    setActiveSortableItem(null);
    setOverId(null);

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 200);

    if (!over) return;

    // Skenario 1: Menarik komponen baru langsung masuk ke daftar blok
    if (activeData?.isNewComponent) {
      const type = activeData.type as CustomContentType;
      let targetIndex = slotItems.length;

      if (over.id !== "custom-content-slot-dropzone") {
        const overIndex = slotItems.findIndex((item) => item.id === over.id);
        if (overIndex !== -1) {
          targetIndex = overIndex;
        }
      }

      onAddDirectly(type, targetIndex);
      return;
    }

    // Skenario 2: Mengubah urutan blok yang sudah ada
    if (activeData?.isSortableItem && over.id !== active.id) {
      const oldIndex = slotItems.findIndex((item) => item.id === active.id);
      const newIndex = slotItems.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(slotItems, oldIndex, newIndex);
        if (onReorderItems) {
          onReorderItems(reordered);
        } else {
          onMoveOrder(oldIndex, newIndex > oldIndex ? "down" : "up");
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActivePaletteOption(null);
    setActiveSortableItem(null);
    setOverId(null);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 200);
  };

  const isDraggingNew = Boolean(activePaletteOption);
  const isOverSlotArea = Boolean(
    overId &&
      (overId === "custom-content-slot-dropzone" ||
        slotItems.some((item) => item.id === overId))
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex w-full min-w-0 max-w-full flex-col gap-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground">
            Daftar Blok di Posisi Ini:
          </Label>
          <span
            className={cn(
              "text-[11px] transition-colors",
              isDraggingNew
                ? "font-semibold text-primary"
                : "text-muted-foreground"
            )}
          >
            {isDraggingNew
              ? isOverSlotArea
                ? "✨ Lepaskan mouse untuk meletakkan blok"
                : "Arahkan mouse ke area daftar"
              : "Tarik baris ☰ untuk atur urutan"}
          </span>
        </div>

        {/* Zona Droppable Daftar Blok Tanpa Pergeseran Layout */}
        <div
          ref={setDropZoneRef}
          className={cn(
            "relative w-full min-w-0 max-w-full rounded-xl p-1.5 transition-all duration-150 overflow-hidden border-2",
            isDraggingNew
              ? isOverSlotArea
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-dashed border-primary/40 bg-primary/5"
              : "border-transparent"
          )}
        >
          {isAdding ? (
            <div className="mb-2 flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2.5 text-xs font-medium text-primary">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menambahkan blok baru ke daftar...</span>
            </div>
          ) : null}

          {slotItems.length === 0 ? (
            <Empty
              className={cn(
                "w-full rounded-xl border-2 border-dashed p-6 transition-colors",
                isDraggingNew
                  ? isOverSlotArea
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-primary/40 bg-primary/5"
                  : "border-muted-foreground/30"
              )}
            >
              <EmptyHeader>
                <div className="mx-auto mb-1 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MoveDown className="size-4.5" />
                </div>
                <EmptyTitle className="text-xs font-medium text-foreground">
                  {isDraggingNew
                    ? isOverSlotArea
                      ? "Lepaskan di sini!"
                      : "Arahkan ke sini"
                    : "Posisi ini masih kosong"}
                </EmptyTitle>
                <EmptyDescription className="text-[11px] text-muted-foreground">
                  {isDraggingNew
                    ? `Lepaskan mouse untuk langsung menyisipkan blok ${activePaletteOption?.label}.`
                    : "Tarik (drag) salah satu komponen di bawah ke sini untuk menambahkan ke daftar."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <SortableContext
              items={slotItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex w-full min-w-0 max-w-full flex-col gap-2 overflow-hidden">
                {slotItems.map((item, idx) => (
                  <SortableCustomContentItem
                    key={item.id}
                    item={item}
                    index={idx}
                    totalCount={slotItems.length}
                    isReordering={isReordering}
                    onMoveOrder={onMoveOrder}
                    onToggleVisible={onToggleVisible}
                    onEditItem={onEditItem}
                    onDeleteItem={onDeleteItem}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>

      {/* Bagian Palet Komponen Draggable */}
      <div className="flex flex-col gap-2 border-t pt-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground">
            Tambah Komponen Baru ke Slot Ini:
          </Label>
          <span className="text-[11px] text-muted-foreground">
            Tarik (drag) ke atas untuk meletakkan
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CONTENT_TYPE_OPTIONS.map((opt) => (
            <DraggablePaletteItem
              key={opt.type}
              option={opt}
              disabled={isAdding}
              onClick={() => {
                if (hasDraggedRef.current) return;
                onAddDirectly(opt.type);
              }}
            />
          ))}
        </div>
      </div>

      {/* Drag Overlay di luar konteks modal dengan Portal agar tidak tergeser atau terpotong */}
      {mounted && typeof document !== "undefined"
        ? createPortal(
            <DragOverlay
              dropAnimation={{ duration: 180, easing: "ease" }}
              style={{ pointerEvents: "none" }}
            >
              {activePaletteOption ? (
                <PaletteItemPreview option={activePaletteOption} />
              ) : null}
              {activeSortableItem ? (
                <SortableItemPreview item={activeSortableItem} />
              ) : null}
            </DragOverlay>,
            document.body
          )
        : null}
    </DndContext>
  );
}
