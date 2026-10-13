"use client";

import type * as React from "react";
import { FileSpreadsheet, Link2, Loader2, UserPlus, UsersRound } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import { Tabs, TabsList, TabsTrigger } from "@senara/ui/components/tabs";

export interface GuestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  formName: string;
  onFormNameChange: (val: string) => void;
  formPhone: string;
  onFormPhoneChange: (val: string) => void;
  formCategory: string;
  onFormCategoryChange: (val: string) => void;
  isGroupLink: boolean;
  onIsGroupLinkChange: (val: boolean) => void;
  onSwitchToCsv?: () => void;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function GuestFormDialog({
  open,
  onOpenChange,
  isEditing,
  formName,
  onFormNameChange,
  formPhone,
  onFormPhoneChange,
  formCategory,
  onFormCategoryChange,
  isGroupLink,
  onIsGroupLinkChange,
  onSwitchToCsv,
  isPending,
  onSubmit,
}: GuestFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? isGroupLink
                ? "Edit Link Grup WhatsApp"
                : "Edit Data Tamu"
              : isGroupLink
                ? "Buat Link Grup WhatsApp"
                : "Tambah Tamu Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isGroupLink
              ? "Buat satu tautan untuk dibagikan ke Grup WhatsApp. Nama grup akan tampil di sampul dan seluruh balasan anggota grup terkumpul rapi."
              : "Masukkan nama dan nomor WhatsApp untuk membuat tautan undangan personal."}
          </DialogDescription>
        </DialogHeader>

        {!isEditing ? (
          <div className="flex items-center justify-between gap-2 pb-1">
            <Tabs
              value={isGroupLink ? "GROUP" : "MANUAL"}
              onValueChange={(val) => {
                if (val === "GROUP") {
                  onIsGroupLinkChange(true);
                  onFormCategoryChange("Grup WhatsApp");
                } else if (val === "MANUAL") {
                  onIsGroupLinkChange(false);
                  if (formCategory === "Grup WhatsApp") {
                    onFormCategoryChange("Umum");
                  }
                }
              }}
              className="flex-1"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="MANUAL" className="gap-1.5 text-xs">
                  <UserPlus className="size-3.5" />
                  <span>Tamu Manual</span>
                </TabsTrigger>
                <TabsTrigger value="GROUP" className="gap-1.5 text-xs">
                  <UsersRound className="size-3.5" />
                  <span>Link Grup WA</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {onSwitchToCsv ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToCsv();
                }}
                className="h-8 gap-1 text-xs"
              >
                <FileSpreadsheet className="size-3.5 text-primary" />
                <span>CSV</span>
              </Button>
            ) : null}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guest-name" className="font-semibold text-xs">
              {isGroupLink ? "Nama Grup / Komunitas" : "Nama Lengkap Tamu"}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="guest-name"
              placeholder={
                isGroupLink
                  ? "Contoh: Keluarga Besar Bani Hasan / Alumni SMA 1"
                  : "Contoh: Bpk. Budi Santoso & Keluarga"
              }
              value={formName}
              onChange={(e) => onFormNameChange(e.target.value)}
              required
            />
            {isGroupLink ? (
              <p className="text-[10px] text-muted-foreground">
                Teks ini akan tertulis pada bagian &ldquo;Kepada Yth.&rdquo; di sampul
                undangan saat dibuka anggota grup.
              </p>
            ) : null}
          </div>

          {!isGroupLink ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="guest-phone" className="font-semibold text-xs">
                Nomor WhatsApp (Opsional)
              </Label>
              <Input
                id="guest-phone"
                placeholder="Contoh: 081234567890"
                value={formPhone}
                onChange={(e) => onFormPhoneChange(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Format nomor HP Indonesia (08xxx atau 628xxx).
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guest-cat" className="font-semibold text-xs">
              Kategori / Label
            </Label>
            <Input
              id="guest-cat"
              placeholder="Contoh: VIP, Keluarga, Sahabat, Teman Kantor"
              value={formCategory}
              onChange={(e) => onFormCategoryChange(e.target.value)}
            />
          </div>

          <DialogFooter className="border-t pt-3">
            <DialogClose
              render={<Button type="button" variant="outline" size="sm" />}
            >
              Batal
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : isGroupLink ? (
                <>
                  <Link2 className="size-3.5" />
                  <span>{isEditing ? "Simpan Grup" : "Buat Link Grup"}</span>
                </>
              ) : (
                <span>{isEditing ? "Simpan Perubahan" : "Tambah Tamu"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
