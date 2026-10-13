"use client";

import type * as React from "react";
import { Search, X, type LucideIcon } from "lucide-react";

import { Input } from "@senara/ui/components/input";
import { Tabs, TabsList, TabsTrigger } from "@senara/ui/components/tabs";
import { cn } from "@senara/ui/lib/utils";

export interface FilterTabOption<T extends string = string> {
  value: T;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

export interface SearchFilterBarProps<T extends string = string> {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  tabs?: readonly FilterTabOption<T>[];
  activeTab?: T;
  onTabChange?: (value: T) => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

export function SearchFilterBar<T extends string = string>({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  tabs,
  activeTab,
  onTabChange,
  rightSlot,
  className,
}: SearchFilterBarProps<T>) {
  const hasSearch = typeof onSearchChange === "function";
  const hasTabs = Boolean(tabs && tabs.length > 0 && activeTab && onTabChange);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between min-w-0 w-full",
        className
      )}
    >
      {hasSearch ? (
        <div className="relative w-full lg:max-w-xs xl:max-w-sm">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-8 pl-9"
          />
          {searchValue ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5"
              aria-label="Hapus pencarian"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {hasTabs && tabs && activeTab && onTabChange ? (
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              if (val) onTabChange(val as T);
            }}
          >
            <TabsList className="flex-wrap h-auto gap-1 py-1">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="gap-1.5 text-xs"
                  >
                    {TabIcon ? <TabIcon className="size-3.5" /> : null}
                    <span>{tab.label}</span>
                    {typeof tab.count === "number" ? (
                      <span className="ml-0.5 rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-semibold">
                        {tab.count}
                      </span>
                    ) : null}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        ) : null}

        {rightSlot}
      </div>
    </div>
  );
}

