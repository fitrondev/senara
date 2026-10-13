"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { Search } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get("search") ?? "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const queryTerm = (formData.get("search") as string)?.trim() ?? "";
        const targetUrl = queryTerm
          ? `${pathname}?search=${encodeURIComponent(queryTerm)}`
          : pathname;
        router.push(targetUrl as Route);
      }}
      className="flex flex-col gap-2 sm:flex-row sm:items-end"
    >
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="search" className="text-xs font-medium">
          Cari Pengguna di Clerk Directory (Nama / Email)
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            name="search"
            type="text"
            defaultValue={defaultQuery}
            placeholder="Ketik nama atau alamat email pengguna Clerk..."
            className="pl-8 text-xs"
          />
        </div>
      </div>
      <Button type="submit" size="default" className="gap-1.5 text-xs">
        <Search className="size-3.5" />
        <span>Cari User Clerk</span>
      </Button>
    </form>
  );
};

