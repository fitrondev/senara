"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  Coins,
  Loader2,
  Rocket,
  Save,
  Sparkles,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@senara/ui/components/select";

import { CREDIT_PACKAGES } from "@/components/reseller/reseller-constants";
import { formatCurrency } from "@/lib/format";
import { queryClient, trpc } from "@/utils/trpc";

interface DraftInvitationItem {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface ResellerBrandingCardProps {
  creditBalance: number;
  initialBrandName?: string | null;
  initialLogoUrl?: string | null;
  invitations: DraftInvitationItem[];
}

export function ResellerBrandingCard({
  creditBalance,
  initialBrandName,
  initialLogoUrl,
  invitations,
}: ResellerBrandingCardProps) {
  const [brandName, setBrandName] = useState(initialBrandName ?? "");
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl ?? "");
  const [selectedCredits, setSelectedCredits] = useState<number>(5);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>("");

  const draftInvitations = invitations.filter((inv) => inv.status !== "PUBLISHED");
  const selectedDraftInvitation = draftInvitations.find(
    (inv) => inv.id === selectedInvitationId
  );

  useEffect(() => {
    setBrandName(initialBrandName ?? "");
    setLogoUrl(initialLogoUrl ?? "");
  }, [initialBrandName, initialLogoUrl]);

  useEffect(() => {
    if (!selectedInvitationId && draftInvitations[0]?.id) {
      setSelectedInvitationId(draftInvitations[0].id);
    }
  }, [draftInvitations, selectedInvitationId]);

  const updateBrandingMutation = useMutation(
    trpc.reseller.updateBranding.mutationOptions({
      onSuccess: () => {
        toast.success("Identitas White-Label berhasil disimpan!");
        queryClient.invalidateQueries(
          trpc.reseller.getDashboard.queryOptions()
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menyimpan pengaturan white-label.");
      },
    })
  );

  const topUpMutation = useMutation(
    trpc.reseller.topUpCredits.mutationOptions({
      onSuccess: (res) => {
        toast.success(
          `Paket kredit berhasil ditambahkan! Saldo saat ini: ${res.creditBalance} kredit.`
        );
        queryClient.invalidateQueries(
          trpc.reseller.getDashboard.queryOptions()
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal melakukan top-up kredit.");
      },
    })
  );

  const publishMutation = useMutation(
    trpc.reseller.publishWithCredit.mutationOptions({
      onSuccess: (res) => {
        toast.success(
          `Undangan "${res.invitation.title}" berhasil diterbitkan!`
        );
        queryClient.invalidateQueries(
          trpc.reseller.getDashboard.queryOptions()
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menerbitkan undangan.");
      },
    })
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 min-w-0 w-full">
      {/* Kolom Kiri: Pengaturan White-Label */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <Store className="size-4 text-primary" />
              <span>White-Label Merek Sendiri</span>
            </CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              100% Tanpa Nama Senara
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Ganti kredit footer &ldquo;Senara Invitation Platform&rdquo; pada seluruh
            undangan publik milikmu dengan nama dan logo bisnismu sendiri.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reseller-brand-name" className="text-xs">
              Nama Bisnis / Studio Undangan
            </Label>
            <Input
              id="reseller-brand-name"
              placeholder="Contoh: Lembayung Invitation Studio"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reseller-logo-url" className="text-xs">
              URL Logo Bisnis (Opsional, PNG/SVG persegi)
            </Label>
            <Input
              id="reseller-logo-url"
              placeholder="https://..."
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Live Preview Footer */}
          <div className="rounded-xl border bg-muted/40 p-3.5 text-center">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pratinjau Footer Undangan Klien
            </p>
            <div className="flex flex-col items-center gap-1 rounded-lg border bg-background p-3 text-[11px]">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                {logoUrl.trim() ? (
                  <img
                    src={logoUrl.trim()}
                    alt={brandName || "Logo"}
                    className="size-4 rounded-sm object-contain"
                  />
                ) : (
                  <Sparkles className="size-3 text-primary" />
                )}
                <span>
                  {brandName.trim() || "Senara Invitation Platform"}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {brandName.trim()
                  ? `Undangan Digital Eksklusif oleh ${brandName.trim()}`
                  : "Dibuat dengan cinta untuk momen terindah hidup Anda."}
              </span>
            </div>
          </div>

          <Button
            className="w-full gap-1.5 text-xs"
            disabled={updateBrandingMutation.isPending}
            onClick={() =>
              updateBrandingMutation.mutate({
                resellerBrandName: brandName.trim() || null,
                resellerLogoUrl: logoUrl.trim() || null,
              })
            }
          >
            {updateBrandingMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>Simpan Identitas White-Label</span>
          </Button>
        </CardContent>
      </Card>

      {/* Kolom Kanan: Top-Up Paket Kredit & Terbitkan dengan Kredit */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <Coins className="size-4 text-primary" />
              <span>Saldo & Paket Kredit Reseller</span>
            </CardTitle>
            <Badge className="gap-1 text-xs">
              <span>{creditBalance} Kredit Aktif</span>
            </Badge>
          </div>
          <CardDescription className="text-xs">
            1 kredit = Rp 1.000. Pembuatan undangan reseller membutuhkan 5 kredit (Rp 5.000) dan langsung berstatus Premium.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {CREDIT_PACKAGES.map((pack) => {
              const active = selectedCredits === pack.credits;
              return (
                <button
                  key={pack.credits}
                  type="button"
                  onClick={() => setSelectedCredits(pack.credits)}
                  className={`flex min-w-0 flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                    active
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-bold text-xs text-foreground">
                      {pack.credits} Kredit
                    </span>
                    {pack.discountBadge ? (
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
                        {pack.discountBadge}
                      </span>
                    ) : null}
                  </div>
                  <span className="mt-1 font-semibold text-primary text-xs">
                    {formatCurrency(pack.totalPrice)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatCurrency(pack.pricePerCredit)} / kredit
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            className="w-full gap-1.5 border-primary/40 text-primary text-xs hover:bg-primary/5"
            disabled={topUpMutation.isPending}
            onClick={() => topUpMutation.mutate({ credits: selectedCredits })}
          >
            {topUpMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            <span>Beli Paket {selectedCredits} Kredit Sekarang</span>
          </Button>

          {/* Terbitkan Draf Undangan Menggunakan 5 Kredit */}
          <div className="space-y-2 border-t pt-3">
            <Label className="text-xs font-semibold">
              Terbitkan Draf Undangan dengan Saldo Kredit (5 Kredit)
            </Label>
            {draftInvitations.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                Semua undanganmu sudah terbit atau belum ada draf baru.
              </p>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  value={selectedInvitationId}
                  onValueChange={(val) => {
                    if (val) setSelectedInvitationId(val);
                  }}
                >
                  <SelectTrigger className="flex-1 text-xs">
                    <SelectValue placeholder="Pilih judul draf undangan">
                      {selectedDraftInvitation
                        ? `${selectedDraftInvitation.title} (/${selectedDraftInvitation.slug})`
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {draftInvitations.map((inv) => (
                      <SelectItem
                        key={inv.id}
                        value={inv.id}
                        className="text-xs"
                      >
                        {inv.title} (/{inv.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="gap-1.5 text-xs"
                  disabled={
                    creditBalance < 1 ||
                    !selectedInvitationId ||
                    publishMutation.isPending
                  }
                  onClick={() =>
                    publishMutation.mutate({
                      invitationId: selectedInvitationId,
                    })
                  }
                >
                  {publishMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Rocket className="size-3.5" />
                  )}
                  <span>Terbitkan (1 Kredit)</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
