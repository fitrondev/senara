"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AutoSaveStatus = "saved" | "saving" | "error" | "unsaved";

interface UseEditorAutosaveOptions<T> {
  saveFn: (data: T) => Promise<unknown>;
  debounceMs?: number;
  storageKey?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useEditorAutosave<T>({
  saveFn,
  debounceMs = 600,
  storageKey,
  onSuccess,
  onError,
}: UseEditorAutosaveOptions<T>) {
  const [status, setStatus] = useState<AutoSaveStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pendingDataRef = useRef<T | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveFnRef = useRef(saveFn);
  saveFnRef.current = saveFn;

  const performSave = useCallback(
    async (data: T) => {
      setStatus("saving");
      setErrorMessage(null);

      try {
        await saveFnRef.current(data);
        setStatus("saved");
        setLastSavedAt(new Date());
        pendingDataRef.current = null;

        // Bersihkan cadangan localStorage jika berhasil disimpan ke server
        if (storageKey && typeof window !== "undefined") {
          try {
            window.localStorage.removeItem(storageKey);
          } catch {
            // Abaikan kesalahan localStorage quota
          }
        }

        onSuccess?.();
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Gagal menyimpan perubahan ke server."
        );

        // Fallback simpan ke localStorage cadangan
        if (storageKey && typeof window !== "undefined") {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(data));
          } catch {
            // Abaikan
          }
        }

        onError?.(err);
      }
    },
    [storageKey, onSuccess, onError]
  );

  const triggerSave = useCallback(
    (data: T) => {
      pendingDataRef.current = data;
      setStatus("unsaved");

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        performSave(data);
      }, debounceMs);
    },
    [debounceMs, performSave]
  );

  const forceSave = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (pendingDataRef.current !== null) {
      await performSave(pendingDataRef.current);
    }
  }, [performSave]);

  const retry = useCallback(() => {
    if (pendingDataRef.current !== null) {
      performSave(pendingDataRef.current);
    }
  }, [performSave]);

  // Bersihkan timer saat unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    status,
    lastSavedAt,
    errorMessage,
    triggerSave,
    forceSave,
    retry,
  };
}

