"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@senara/ui/components/select";

import { createClerkUser } from "@/app/(admin)/admin/_actions";

export type SystemRole = "USER" | "RESELLER" | "ADMIN" | "SUPERADMIN";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<SystemRole>("USER");
  const [creditBalance, setCreditBalance] = useState("0");
  const [resellerBrandName, setResellerBrandName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole("USER");
    setCreditBalance("0");
    setResellerBrandName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !firstName.trim()) {
      toast.error("Nama depan, email, dan kata sandi wajib diisi.");
      return;
    }

    if (password.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("firstName", firstName.trim());
    formData.set("lastName", lastName.trim());
    formData.set("email", email.trim().toLowerCase());
    formData.set("password", password);
    formData.set("role", role);
    formData.set("creditBalance", creditBalance);
    formData.set("resellerBrandName", resellerBrandName.trim());

    try {
      const res = await createClerkUser(formData);
      if (res.ok) {
        toast.success(res.message);
        resetForm();
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan saat membuat pengguna."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            <span>Tambah Pengguna Baru</span>
          </DialogTitle>
          <DialogDescription>
            Daftarkan akun pengguna langsung ke Clerk Auth dan sinkronkan hak akses
            ke database platform Senara.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first-name">Nama Depan *</Label>
              <Input
                id="first-name"
                placeholder="Rian"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last-name">Nama Belakang</Label>
              <Input
                id="last-name"
                placeholder="Hidayat"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-email">Alamat Email *</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-password">Kata Sandi Akun *</Label>
            <Input
              id="user-password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Kata sandi awal yang akan digunakan pengguna saat login pertama kali.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Hak Akses Sistem (4 Role)</Label>
            <Select
              value={role}
              onValueChange={(val) => {
                if (val) setRole(val as SystemRole);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih role akun">
                  {role === "SUPERADMIN"
                    ? "SUPERADMIN (Pemilik Platform — Otoritas Penuh)"
                    : role === "ADMIN"
                      ? "ADMIN (Admin Operasional — Order, Template & Moderasi)"
                      : role === "RESELLER"
                        ? "RESELLER (Mitra Studio / WO White-Label)"
                        : "USER (Pengguna Reguler / Mempelai)"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="USER">
                    USER (Pengguna Reguler / Mempelai)
                  </SelectItem>
                  <SelectItem value="RESELLER">
                    RESELLER (Mitra Studio / WO White-Label)
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    ADMIN (Admin Operasional — Order, Template & Moderasi)
                  </SelectItem>
                  <SelectItem value="SUPERADMIN">
                    SUPERADMIN (Pemilik Platform — Otoritas Penuh)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {role === "RESELLER" ? (
            <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="space-y-1.5">
                <Label htmlFor="reseller-credits">Saldo Kredit Awal</Label>
                <Input
                  id="reseller-credits"
                  type="number"
                  min={0}
                  value={creditBalance}
                  onChange={(e) => setCreditBalance(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reseller-brand">Nama Brand White-Label</Label>
                <Input
                  id="reseller-brand"
                  placeholder="Contoh: Galipat Story WO"
                  value={resellerBrandName}
                  onChange={(e) => setResellerBrandName(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mendaftarkan..." : "Daftarkan Pengguna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

