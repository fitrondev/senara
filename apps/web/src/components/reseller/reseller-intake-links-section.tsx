"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Link2,
  Loader2,
  MessageCircle,
  Plus,
  Trash2,
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

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/format";
import { queryClient, trpc } from "@/utils/trpc";

export interface ResellerIntakeLinkItem {
  id: string;
  token: string;
  clientName: string;
  clientPhone: string | null;
  templateId: string;
  status: string;
  createdInvitationId: string | null;
  submittedAt: Date | string | null;
  createdAt: Date | string;
  template: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
  };
}

export interface ResellerTemplateOption {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface ResellerIntakeLinksSectionProps {
  intakeLinks: ResellerIntakeLinkItem[];
  templates: ResellerTemplateOption[];
}

export function ResellerIntakeLinksSection({
  intakeLinks,
  templates,
}: ResellerIntakeLinksSectionProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<ResellerIntakeLinkItem | null>(null);

  const selectedTemplate = templates.find(
    (tpl) => tpl.id === selectedTemplateId
  );

  useEffect(() => {
    if (!selectedTemplateId && templates[0]?.id) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [templates, selectedTemplateId]);

  const createMutation = useMutation(
    trpc.reseller.createIntakeLink.mutationOptions({
      onSuccess: () => {
        toast.success(
          "Tautan Formulir Klien berhasil dibuat! Siap dikirim via WhatsApp."
        );
        setClientName("");
        setClientPhone("");
        queryClient.invalidateQueries(
          trpc.reseller.getDashboard.queryOptions()
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal membuat tautan formulir klien.");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.reseller.deleteIntakeLink.mutationOptions({
      onSuccess: () => {
        toast.success("Tautan Formulir Klien berhasil dihapus.");
        setDeleteTarget(null);
        queryClient.invalidateQueries(
          trpc.reseller.getDashboard.queryOptions()
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus tautan formulir.");
      },
    })
  );

  const buildIntakeUrl = (token: string) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://senara.id";
    return `${origin}/intake/${token}`;
  };

  const handleCopy = async (item: ResellerIntakeLinkItem) => {
    const url = buildIntakeUrl(item.token);
    await navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    toast.success(`Tautan formulir untuk ${item.clientName} disalin!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const buildWhatsAppShareUrl = (item: ResellerIntakeLinkItem) => {
    const url = buildIntakeUrl(item.token);
    const cleanPhone = (item.clientPhone ?? "").replace(/[^0-9]/g, "");
    const normalizedPhone = cleanPhone.startsWith("0")
      ? `62${cleanPhone.slice(1)}`
      : cleanPhone;
    const message = `Halo Kak *${item.clientName}*,\n\nSilakan lengkapi data mempelai, jadwal akad/resepsi, dan lokasi acara untuk undangan digital tema *${item.template.name}* melalui formulir berikut:\n\n${url}\n\nBegitu selesai dikirim, draf undangan akan langsung kami proses. Terima kasih!`;
    return normalizedPhone
      ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <Link2 className="size-4 text-primary" />
              <span>Tautan Formulir Klien (Auto-Draft Builder)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Kirimkan tautan formulir khusus ke klien via WhatsApp. Saat klien
              melengkapi data mempelai & jadwal acara, draf undangan langsung
              terbentuk otomatis di akunmu!
            </CardDescription>
          </div>
          <Badge variant="outline" className="w-fit text-[10px]">
            Hemat 80% Waktu Input Data
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Form Buat Tautan Formulir Klien Baru */}
        <form
          className="grid grid-cols-1 gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2 xl:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!clientName.trim() || !selectedTemplateId) return;
            createMutation.mutate({
              clientName: clientName.trim(),
              clientPhone: clientPhone.trim() || undefined,
              templateId: selectedTemplateId,
            });
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="intake-client-name" className="text-xs">
              Nama Klien / Pasangan
            </Label>
            <Input
              id="intake-client-name"
              placeholder="Contoh: Kak Rania & Dimas"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-background text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="intake-client-phone" className="text-xs">
              No. WhatsApp Klien (Opsional)
            </Label>
            <Input
              id="intake-client-phone"
              placeholder="0812xxxx"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="bg-background text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Pilih Desain Template</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={(val) => {
                if (val) setSelectedTemplateId(val);
              }}
            >
              <SelectTrigger className="w-full bg-background text-xs">
                <SelectValue placeholder="Pilih nama template">
                  {selectedTemplate?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {templates.map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id} className="text-xs">
                    {tpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full gap-1.5 text-xs"
              disabled={createMutation.isPending || !clientName.trim()}
            >
              {createMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              <span>Buat Tautan Formulir</span>
            </Button>
          </div>
        </form>

        {/* Daftar Tautan Formulir Klien */}
        {intakeLinks.length === 0 ? (
          <EmptyState
            icon={FileSpreadsheet}
            title="Belum Ada Tautan Formulir Klien"
            description="Buat tautan formulir di atas lalu kirimkan ke WhatsApp klien agar mereka melengkapi sendiri data mempelai dan lokasi acara."
          />
        ) : (
          <div className="divide-y rounded-xl border">
            {intakeLinks.map((item) => {
              const isSubmitted = item.status === "SUBMITTED";
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {item.clientName}
                      </span>
                      <Badge
                        variant={isSubmitted ? "default" : "outline"}
                        className="gap-1 text-[10px]"
                      >
                        {isSubmitted ? (
                          <>
                            <CheckCircle2 className="size-3" />
                            <span>Data Masuk (Draf Siap)</span>
                          </>
                        ) : (
                          <>
                            <Clock className="size-3" />
                            <span>Menunggu Klien Melengkapi</span>
                          </>
                        )}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        Tema: {item.template.name}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Dibuat {formatDate(item.createdAt)} • Formulir:{" "}
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
                        /intake/{item.token}
                      </code>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="xs"
                      variant="outline"
                      className="gap-1.5 text-xs"
                      onClick={() => handleCopy(item)}
                    >
                      {copiedId === item.id ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      <span>Salin Tautan</span>
                    </Button>

                    <Button
                      size="xs"
                      variant="outline"
                      className="gap-1.5 border-emerald-600/30 text-emerald-600 text-xs hover:bg-emerald-500/10"
                      render={
                        <a
                          href={buildWhatsAppShareUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <MessageCircle className="size-3.5" />
                      <span>Kirim ke WA Klien</span>
                    </Button>

                    {isSubmitted && item.createdInvitationId ? (
                      <Button
                        size="xs"
                        className="gap-1.5 text-xs"
                        render={
                          <Link
                            href={
                              `/editor/${item.createdInvitationId}` as Route
                            }
                          />
                        }
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Buka Draf di Editor</span>
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        variant="ghost"
                        className="gap-1 text-xs"
                        render={
                          <Link
                            href={`/intake/${item.token}` as Route}
                            target="_blank"
                          />
                        }
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Lihat Formulir</span>
                      </Button>
                    )}

                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(item)}
                      aria-label="Hapus tautan formulir"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Tautan Formulir Klien?"
        description={
          deleteTarget
            ? `Apakah Anda yakin ingin menghapus tautan formulir untuk "${deleteTarget.clientName}"? Draf undangan yang sudah terbentuk tidak akan ikut terhapus.`
            : ""
        }
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({ id: deleteTarget.id });
          }
        }}
      />
    </Card>
  );
}

