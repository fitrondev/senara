"use client";

import { use, useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  CreditCard,
  ExternalLink,
  Eye,
  Globe,
  Heart,
  ImageIcon,
  Layers,
  Loader2,
  Lock,
  MapPin,
  MessageSquare,
  Music,
  Palette,
  Plus,
  RefreshCw,
  Send,
  Smartphone,
  Sparkles,
  Tablet,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import { Input } from "@senara/ui/components/input";
import { Separator } from "@senara/ui/components/separator";
import { Skeleton } from "@senara/ui/components/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@senara/ui/components/toggle-group";
import { cn } from "@senara/ui/lib/utils";

import { SectionReorderModal } from "@/components/editor/section-reorder-modal";
import type { EditorSectionItem } from "@/components/editor/section-reorder-modal";
import {
  DEFAULT_THEME_CONFIG,
  ThemeModal,
} from "@/components/editor/theme-modal";
import type { ThemeConfig } from "@/components/editor/theme-modal";
import { CustomContentModal } from "@/components/editor/custom-content-modal";
import type { CustomContentItemData } from "@/components/editor/custom-content-modal";
import { CustomContentSlot } from "@/components/editor/custom-content-slot";
import { useEditorAutosave } from "@/hooks/use-editor-autosave";
import { trpc } from "@/utils/trpc";

interface EditorPageProps {
  params: Promise<{
    invitationId: string;
  }>;
}

export default function InvitationEditorPage({ params }: EditorPageProps) {
  const resolvedParams = use(params);
  const invitationId = resolvedParams.invitationId;
  const queryClient = useQueryClient();

  // State Editor Canvas
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [customContentModalOpen, setCustomContentModalOpen] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string>("after-hero");

  // Ambil Data Undangan dari tRPC
  const {
    data: invitation,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.invitation.getById.queryOptions({ id: invitationId }));

  // State Lokal yang Dapat Diedit Langsung di Kanvas
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [sections, setSections] = useState<EditorSectionItem[]>([]);

  // Daftar Isian Kustom
  const customContentsList = useMemo(() => {
    return (invitation?.customContents ?? []) as unknown as CustomContentItemData[];
  }, [invitation?.customContents]);

  // Helper Pengecekan Visibilitas Section Baku
  const isSectionVisible = (key: string) => {
    const sec = sections.find((s) => s.sectionKey === key);
    return sec ? sec.isVisible : true;
  };

  const handleOpenSlot = (slotId: string) => {
    setActiveSlotId(slotId);
    setCustomContentModalOpen(true);
  };

  // Sinkronisasi data saat pertama kali berhasil dimuat dari server
  useEffect(() => {
    if (invitation) {
      setTitle(invitation.title);
      setCoverImageUrl(
        invitation.coverImageUrl ||
          invitation.template?.thumbnail ||
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
      );
      if (invitation.themeConfig) {
        setThemeConfig(invitation.themeConfig as unknown as ThemeConfig);
      }
      if (invitation.sections) {
        setSections(invitation.sections as EditorSectionItem[]);
      }
    }
  }, [invitation]);

  // Mutasi tRPC Pembaruan Metadata
  const updateMetadataMutation = useMutation(
    trpc.invitation.updateMetadata.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
      },
    })
  );

  // Mesin Debounced Auto-Save
  const { status: autoSaveStatus, triggerSave, retry: retrySave } = useEditorAutosave({
    storageKey: `senara_editor_${invitationId}`,
    saveFn: async (updatedData: {
      title: string;
      coverImageUrl?: string;
      themeConfig?: ThemeConfig;
    }) => {
      await updateMetadataMutation.mutateAsync({
        id: invitationId,
        title: updatedData.title,
        coverImageUrl: updatedData.coverImageUrl,
        themeConfig: updatedData.themeConfig as unknown as Record<string, unknown>,
      });
    },
  });

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    triggerSave({
      title: newTitle,
      coverImageUrl,
      themeConfig,
    });
  };

  const handleSaveTheme = (newTheme: ThemeConfig) => {
    setThemeConfig(newTheme);
    triggerSave({
      title,
      coverImageUrl,
      themeConfig: newTheme,
    });
  };

  // Mutasi Publikasi Undangan
  const publishMutation = useMutation(
    trpc.invitation.updateMetadata.mutationOptions({
      onSuccess: () => {
        toast.success("Undangan Anda resmi Diterbitkan! Tautan publik aktif.");
        queryClient.invalidateQueries(trpc.invitation.getById.queryFilter({ id: invitationId }));
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menerbitkan undangan");
      },
    })
  );

  const isPublished = invitation?.status === "PUBLISHED";
  const publicUrl = typeof window !== "undefined" && invitation
    ? `${window.location.origin}/${invitation.slug}`
    : `/${invitation?.slug ?? ""}`;

  // Filter section aktif sesuai urutan
  const activeSections = useMemo(() => {
    return [...sections]
      .filter((s) => s.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [sections]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-muted/30">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">
          Menyiapkan kanvas editor Senara...
        </p>
      </div>
    );
  }

  if (isError || !invitation) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-6 text-center">
        <h2 className="font-bold text-xl">Undangan Tidak Ditemukan</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Undangan mungkin telah dihapus atau Anda tidak memiliki hak akses untuk mengeditnya.
        </p>
        <Button render={<Link href={"/dashboard" as Route} />} className="gap-2">
          <ArrowLeft className="size-4" />
          <span>Kembali ke Dashboard</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* 1. Header Toolbar Editor (Tampilan Fokus Tanpa Sidebar) */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/70 z-30 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur">
        {/* Sisi Kiri: Navigasi Kembali & Status Auto-Save */}
        <div className="flex items-center gap-3">
          <Button
            render={<Link href={"/dashboard" as Route} />}
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          <Separator orientation="vertical" className="h-4" />

          {/* Indikator Status Auto-Save */}
          <div className="flex items-center gap-1.5 text-xs">
            {autoSaveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </span>
            )}
            {autoSaveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Tersimpan</span>
              </span>
            )}
            {autoSaveStatus === "unsaved" && (
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Ada perubahan...</span>
              </span>
            )}
            {autoSaveStatus === "error" && (
              <Button
                variant="ghost"
                size="xs"
                type="button"
                onClick={retrySave}
                className="h-auto p-0 text-destructive hover:text-destructive hover:underline font-medium text-xs flex items-center gap-1"
              >
                <RefreshCw className="size-3" />
                <span>Gagal simpan (Coba lagi)</span>
              </Button>
            )}
          </div>
        </div>

        {/* Sisi Tengah: Sakelar Ukuran Perangkat Mobile/Desktop */}
        <div className="hidden md:flex items-center">
          <ToggleGroup
            value={[deviceMode]}
            onValueChange={(val) => {
              const selected = val[0];
              if (selected === "mobile" || selected === "desktop") {
                setDeviceMode(selected);
              }
            }}
            variant="outline"
            size="sm"
            className="rounded-lg border bg-muted/40 p-0.5"
          >
            <ToggleGroupItem
              value="mobile"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer",
                deviceMode === "mobile" && "bg-background text-foreground shadow-xs"
              )}
            >
              <Smartphone className="size-3.5" />
              <span>Mobile (375px)</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="desktop"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer",
                deviceMode === "desktop" && "bg-background text-foreground shadow-xs"
              )}
            >
              <Tablet className="size-3.5" />
              <span>Layar Lebar</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Sisi Kanan: Menu Aksi Modal & Terbitkan */}
        <div className="flex items-center gap-2">
          {/* Tombol Isian Kamu */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenSlot("after-hero")}
            className="gap-1.5"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Isian Kamu</span>
            {customContentsList.length > 0 && (
              <Badge variant="secondary" className="size-4 p-0 rounded-full text-[10px] flex items-center justify-center">
                {customContentsList.length}
              </Badge>
            )}
          </Button>

          {/* Tombol Kustomisasi Tema */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setThemeModalOpen(true)}
            className="gap-1.5"
          >
            <Palette className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Tema</span>
          </Button>

          {/* Tombol Urutan Section */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReorderModalOpen(true)}
            className="gap-1.5"
          >
            <Layers className="size-3.5" />
            <span className="hidden sm:inline">Urutan</span>
          </Button>

          {/* Tombol Pratinjau Publik */}
          <Button
            render={
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Eye className="size-3.5" />
            <span className="hidden sm:inline">Pratinjau</span>
          </Button>

          {/* Tombol Terbitkan */}
          <Button
            size="sm"
            onClick={() =>
              publishMutation.mutate({
                id: invitationId,
                status: isPublished ? "DRAFT" : "PUBLISHED",
              })
            }
            disabled={publishMutation.isPending}
            className={`gap-1.5 shadow-xs ${
              isPublished
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {isPublished ? (
              <>
                <Check className="size-3.5" />
                <span>Terbit</span>
              </>
            ) : (
              <>
                <Globe className="size-3.5" />
                <span>Terbitkan</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* 2. Area Kanvas Editor Tengah (Simulasi Smartphone WYSIWYG) */}
      <main className="relative flex flex-1 items-start justify-center overflow-y-auto bg-muted/40 p-4 md:py-8">
        <div
          className={`transition-all duration-300 ${
            deviceMode === "mobile"
              ? "w-full max-w-[390px] rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl ring-1 ring-black/5"
              : "w-full max-w-2xl rounded-2xl border shadow-lg"
          } bg-background overflow-hidden`}
          style={
            {
              "--editor-primary": themeConfig.palette.primary,
              "--editor-bg": themeConfig.palette.background,
              "--editor-accent": themeConfig.palette.accent,
              "--editor-font-heading": themeConfig.typography.headingFont,
              "--editor-font-body": themeConfig.typography.bodyFont,
            } as React.CSSProperties
          }
        >
          {/* Bezel Ponsel Atas / Speaker Earpiece (khusus mode mobile) */}
          {deviceMode === "mobile" && (
            <div className="flex h-5 w-full items-center justify-center bg-zinc-800">
              <div className="h-1 w-12 rounded-full bg-zinc-600" />
            </div>
          )}

          {/* Area Konten Undangan */}
          <div className="flex flex-col text-center" style={{ fontFamily: themeConfig.typography.bodyFont }}>
            {/* 1. Cover / Hero Section */}
            <div
              className="relative min-h-[460px] flex flex-col justify-end p-6 text-white overflow-hidden"
              style={{ backgroundColor: themeConfig.palette.primary }}
            >
              <Image
                src={coverImageUrl}
                alt="Cover Undangan"
                fill
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="relative z-10 flex flex-col items-center gap-2">
                <Badge variant="secondary" className="text-[11px] bg-white/20 text-white backdrop-blur border-none">
                  The Wedding of
                </Badge>

                {/* Inline Editing Judul Undangan */}
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-transparent text-center font-bold text-2xl tracking-tight text-white border-0 border-b border-transparent hover:border-white/40 focus-visible:border-white focus-visible:ring-0 rounded-none shadow-none transition-colors"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                  placeholder="Ketik Nama Pasangan..."
                />

                <p className="text-white/80 text-xs mt-1">
                  {invitation.eventDate
                    ? new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(invitation.eventDate))
                    : "Sabtu, 24 Oktober 2026"}
                </p>

                {/* Tombol Simulasi Cover Gate */}
                <div className="mt-4 w-full">
                  <div className="mx-auto flex max-w-xs items-center justify-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-zinc-900 shadow-md">
                    <Music className="size-3.5 text-rose-500 animate-pulse" />
                    <span>Buka Undangan (Autoplay Audio)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Titik Jangkar Slot: after-hero */}
            <CustomContentSlot
              slotId="after-hero"
              slotLabel="Sampul / Hero"
              items={customContentsList}
              themeConfig={themeConfig}
              onOpenSlotModal={handleOpenSlot}
            />

            {/* 2. Untaian Doa / Quote Section */}
            {isSectionVisible("quote") && (
              <div className="flex flex-col gap-2 p-6 bg-muted/10 border-b">
                <p className="text-xs italic text-muted-foreground leading-relaxed">
                  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu merasa tenteram kepadanya."
                </p>
                <span className="text-[11px] font-semibold text-primary">— QS. Ar-Rum: 21</span>
              </div>
            )}

            {/* Titik Jangkar Slot: after-quote */}
            <CustomContentSlot
              slotId="after-quote"
              slotLabel="Untaian Doa"
              items={customContentsList}
              themeConfig={themeConfig}
              onOpenSlotModal={handleOpenSlot}
            />

            {/* 3. Profil Mempelai (Couple Profile Section) */}
            {isSectionVisible("couple") && (
              <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: themeConfig.palette.secondary }}>
                <h3
                  className="font-bold text-xl tracking-tight text-zinc-800 dark:text-zinc-100"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                >
                  Kedua Mempelai
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-20 overflow-hidden rounded-full border-2 border-white shadow-md">
                      <Image
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                        alt="Mempelai Wanita"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-sm">Adinda Rahma</span>
                    <span className="text-[11px] text-muted-foreground">Putri dari Bpk. Hendra & Ibu Rina</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-20 overflow-hidden rounded-full border-2 border-white shadow-md">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                        alt="Mempelai Pria"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-sm">Bagas Pratama</span>
                    <span className="text-[11px] text-muted-foreground">Putra dari Bpk. Santoso & Ibu Dewi</span>
                  </div>
                </div>
              </div>
            )}

            {/* Titik Jangkar Slot: after-couple (Persistent Slot Rule) */}
            <CustomContentSlot
              slotId="after-couple"
              slotLabel="Profil Mempelai"
              items={customContentsList}
              themeConfig={themeConfig}
              onOpenSlotModal={handleOpenSlot}
            />

            {/* 4. Rangkaian Acara (Event Schedule Section) */}
            {isSectionVisible("event") && (
              <div className="flex flex-col gap-4 p-6 bg-background">
                <h3
                  className="font-bold text-xl tracking-tight text-zinc-800 dark:text-zinc-100"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                >
                  Waktu & Tempat
                </h3>

                <div className="rounded-xl border p-4 text-left shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Akad Nikah</span>
                    <Badge variant="outline" className="text-[10px]">08:00 - 10:00 WIB</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0 text-primary" />
                    <span>Masjid Agung Al-Barkah, Bekasi</span>
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs h-7">
                      Buka Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Titik Jangkar Slot: after-event */}
            <CustomContentSlot
              slotId="after-event"
              slotLabel="Rincian Acara"
              items={customContentsList}
              themeConfig={themeConfig}
              onOpenSlotModal={handleOpenSlot}
            />

            {/* 5. Cerita Bersama (Love Story Section) */}
            {isSectionVisible("love-story") && (
              <div className="flex flex-col gap-3 p-6 bg-muted/15 border-t text-left">
                <h3
                  className="font-bold text-center text-lg tracking-tight text-foreground"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                >
                  Kisah Klasik Kami
                </h3>
                <div className="space-y-3 pt-2 text-xs">
                  <div className="border-l-2 border-primary pl-3">
                    <span className="font-semibold text-primary">2021 — Pertama Bertemu</span>
                    <p className="text-muted-foreground mt-0.5">Berjumpa pertama kali dalam acara reuni sahabat.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <span className="font-semibold text-primary">2024 — Lamaran</span>
                    <p className="text-muted-foreground mt-0.5">Memutuskan untuk melangkah ke jenjang yang lebih serius.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Titik Jangkar Slot: after-story */}
            <CustomContentSlot
              slotId="after-story"
              slotLabel="Kisah Cinta"
              items={customContentsList}
              themeConfig={themeConfig}
              onOpenSlotModal={handleOpenSlot}
            />

            {/* 6. Galeri Foto & Video */}
            {isSectionVisible("gallery") && (
              <div className="flex flex-col gap-3 p-6 bg-background border-t">
                <h3
                  className="font-bold text-lg tracking-tight text-foreground"
                  style={{ fontFamily: themeConfig.typography.headingFont }}
                >
                  Potret Kenangan
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
                      alt="Galeri 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80"
                      alt="Galeri 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Titik Jangkar Slot: after-gallery */}
            <CustomContentSlot
              slotId="after-gallery"
              slotLabel="Galeri Foto"
              items={customContentsList}
              themeConfig={themeConfig}
              onOpenSlotModal={handleOpenSlot}
            />

            {/* 7. Amplop Digital & RSVP Preview Section */}
            {isSectionVisible("gift") && (
              <div className="flex flex-col gap-3 p-6 bg-muted/20 border-t">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <CreditCard className="size-4" />
                  <span className="font-semibold text-sm">Amplop Digital & Kado</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tersedia transfer rekening BCA, Mandiri, dan QRIS statis satu-klik salin.
                </p>
              </div>
            )}

            {/* Titik Jangkar Slot: after-gift */}
            <CustomContentSlot
              slotId="after-gift"
              slotLabel="Amplop & Kado"
              items={customContentsList}
              themeConfig={themeConfig}
              onOpenSlotModal={handleOpenSlot}
            />

            {/* Titik Jangkar Slot: before-footer */}
            <CustomContentSlot
              slotId="before-footer"
              slotLabel="Sebelum Penutup"
              items={customContentsList}
              themeConfig={themeConfig}
              onOpenSlotModal={handleOpenSlot}
            />

            {/* 8. Penutup Undangan */}
            {isSectionVisible("closing") && (
              <div className="p-6 bg-background border-t text-xs text-muted-foreground">
                <p>Merupakan suatu kehormatan bagi kami atas kehadiran dan doa restu Anda.</p>
                <p className="mt-2 font-semibold text-foreground">Adinda & Bagas</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Kustomisasi Tema */}
      <ThemeModal
        open={themeModalOpen}
        onOpenChange={setThemeModalOpen}
        currentTheme={themeConfig}
        onSaveTheme={handleSaveTheme}
      />

      {/* Modal Manajemen Urutan Section */}
      <SectionReorderModal
        open={reorderModalOpen}
        onOpenChange={setReorderModalOpen}
        invitationId={invitationId}
        sections={sections}
        onSectionsChange={(updated) => setSections(updated)}
      />

      {/* Modal Isian Kamu (Custom Content Slots) */}
      <CustomContentModal
        open={customContentModalOpen}
        onOpenChange={setCustomContentModalOpen}
        invitationId={invitationId}
        selectedSlotId={activeSlotId}
        items={customContentsList}
      />
    </div>
  );
}

