"use client";

import { Lock, ShieldCheck, Smartphone, Unlock } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent } from "@senara/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@senara/ui/components/select";
import { cn } from "@senara/ui/lib/utils";

interface PrivateModeCardProps {
  isPrivateMode: boolean;
  maxDevicesPerGuest: number;
  isUpdating: boolean;
  onTogglePrivateMode: (nextValue: boolean) => void;
  onChangeMaxDevices: (nextMax: number) => void;
}

const DEVICE_LIMIT_OPTIONS = [
  { value: "1", label: "Maks. 1 HP / Tamu" },
  { value: "2", label: "Maks. 2 HP / Tamu (Disarankan)" },
  { value: "3", label: "Maks. 3 HP / Tamu" },
  { value: "5", label: "Maks. 5 HP / Tamu" },
] as const;

export function PrivateModeCard({
  isPrivateMode,
  maxDevicesPerGuest,
  isUpdating,
  onTogglePrivateMode,
  onChangeMaxDevices,
}: PrivateModeCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-colors",
        isPrivateMode
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card"
      )}
    >
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              isPrivateMode
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isPrivateMode ? (
              <Lock className="size-5" />
            ) : (
              <Unlock className="size-5" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-foreground text-sm">
                Mode Privat & Pembatasan Perangkat HP
              </h3>
              <Badge
                variant={isPrivateMode ? "default" : "outline"}
                className="text-[10px]"
              >
                {isPrivateMode ? "🔒 Mode Privat Aktif" : "Terbuka untuk Umum"}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                Fitur Keamanan Eksklusif
              </Badge>
            </div>
            <p className="max-w-2xl text-muted-foreground text-xs leading-relaxed">
              Saat aktif, tautan umum tanpa kode tamu yang terdaftar akan menampilkan layar{" "}
              <strong>Undangan Terkunci</strong>, dan setiap link tamu pribadi dibatasi maksimal{" "}
              <strong>{maxDevicesPerGuest} perangkat HP</strong>. Gunakan tombol{" "}
              <strong>Reset HP</strong> pada tabel jika tamu berganti ponsel.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Smartphone className="size-3.5 text-muted-foreground" />
            <Select
              value={String(maxDevicesPerGuest)}
              onValueChange={(val) => {
                if (val) onChangeMaxDevices(Number(val));
              }}
            >
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Batas Perangkat">
                  {DEVICE_LIMIT_OPTIONS.find(
                    (opt) => opt.value === String(maxDevicesPerGuest)
                  )?.label ?? `${maxDevicesPerGuest} Perangkat`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DEVICE_LIMIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant={isPrivateMode ? "default" : "outline"}
            size="sm"
            disabled={isUpdating}
            onClick={() => onTogglePrivateMode(!isPrivateMode)}
            className="h-8 gap-1.5 text-xs"
          >
            <ShieldCheck className="size-3.5" />
            <span>
              {isPrivateMode ? "Nonaktifkan Mode Privat" : "Aktifkan Mode Privat"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

