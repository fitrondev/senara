"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@senara/ui/components/alert-dialog";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";

export interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  requireConfirmText?: string;
  isPending?: boolean;
  onConfirm: (typedText?: string) => void;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title = "Konfirmasi Hapus",
  description,
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  requireConfirmText,
  isPending = false,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (!open) {
      setTypedText("");
    }
  }, [open]);

  const isConfirmDisabled =
    isPending ||
    (Boolean(requireConfirmText) &&
      typedText.trim().toUpperCase() !== requireConfirmText?.toUpperCase());

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {requireConfirmText ? (
          <div className="space-y-1.5 py-2">
            <Label className="text-xs">
              Ketik{" "}
              <strong className="font-mono text-destructive">
                {requireConfirmText}
              </strong>{" "}
              untuk melanjutkan penghapusan permanen:
            </Label>
            <Input
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={`Ketik ${requireConfirmText}`}
              className="font-mono text-xs uppercase"
            />
          </div>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isConfirmDisabled}
            onClick={(e) => {
              e.preventDefault();
              if (!isConfirmDisabled) {
                onConfirm(typedText.trim());
              }
            }}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Trash2 className="mr-1.5 size-3.5" />
            )}
            <span>{confirmLabel}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

