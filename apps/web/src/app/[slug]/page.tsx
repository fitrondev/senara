"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, Loader2, Lock, Smartphone } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";

import {
  DEFAULT_THEME_CONFIG,
  type ThemeConfig,
} from "@/components/editor/theme-modal";
import type { BankAccountItem } from "@/components/invitation/digital-gift-section";
import type { EventScheduleItem } from "@/components/invitation/event-section";
import type { PublicCustomContentItem } from "@/components/invitation/public-custom-content-slot";
import {
  UnifiedInvitation,
  type UnifiedGalleryItem,
  type UnifiedSectionConfig,
  type UnifiedStoryItem,
} from "@/components/invitation/unified-invitation";
import { trpc } from "@/utils/trpc";

interface PublicInvitationPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    to?: string;
    g?: string;
    preview?: string;
  }>;
}

interface ExtendedThemeConfig extends ThemeConfig {
  withPhotos?: boolean;
  fields?: Record<string, string>;
  fontSet?: string;
  fontScale?: number;
  scriptFont?: string;
  musicStartAt?: number;
}

function getOrCreateDeviceFingerprint(): string {
  if (typeof window === "undefined") return "server";
  const storageKey = "senara_device_fp_v1";
  try {
    const existing = window.localStorage.getItem(storageKey);
    if (existing) return existing;
    const ua = window.navigator.userAgent || "ua";
    const screenSig = `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`;
    const randomPart = Math.random().toString(36).slice(2, 10);
    const fp = `fp_${btoa(`${ua.slice(0, 32)}_${screenSig}`).replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)}_${randomPart}`;
    window.localStorage.setItem(storageKey, fp);
    return fp;
  } catch {
    return "fp_fallback_browser";
  }
}

function detectDeviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "mobile";
  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent)
    ? "mobile"
    : "desktop";
}

export default function PublicInvitationPage({
  params,
  searchParams,
}: PublicInvitationPageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);

  const slug = resolvedParams.slug;
  const guestCode = resolvedSearchParams?.g;
  const isOwnerPreview = resolvedSearchParams?.preview === "1";

  const guestNameFromQuery = useMemo(() => {
    if (!resolvedSearchParams?.to) return undefined;
    try {
      return decodeURIComponent(resolvedSearchParams.to.replace(/\+/g, " "));
    } catch {
      return resolvedSearchParams.to;
    }
  }, [resolvedSearchParams]);

  const {
    data: invitation,
    isLoading,
    isError,
  } = useQuery(trpc.invitation.getBySlugPublic.queryOptions({ slug }));

  const [accessState, setAccessState] = useState<{
    checked: boolean;
    allowed: boolean;
    reason?: "PRIVATE_LOCKED" | "DEVICE_LIMIT_REACHED" | "PUBLIC_ALLOWED" | "GUEST_VERIFIED";
    maxDevices?: number;
    guestId?: string | null;
    guestName?: string | null;
    isGroupLink?: boolean;
  }>({
    checked: false,
    allowed: true,
  });

  const verifyMutation = useMutation(
    trpc.invitation.verifyGuestDevice.mutationOptions({
      onSuccess: (res) => {
        setAccessState({
          checked: true,
          allowed: res.allowed,
          reason: res.reason,
          maxDevices: res.maxDevices,
          guestId: res.guestId,
          guestName: res.guestName,
          isGroupLink: res.isGroupLink,
        });
      },
      onError: () => {
        setAccessState({ checked: true, allowed: true });
      },
    })
  );

  const hasSentBeaconRef = useRef(false);

  // Verifikasi Mode Privat & Pembatasan Perangkat HP + Kirim Beacon Analitik
  useEffect(() => {
    if (!invitation?.id) return;

    if (isOwnerPreview) {
      setAccessState({
        checked: true,
        allowed: true,
        guestId: guestCode ?? null,
        guestName: guestNameFromQuery ?? null,
      });
      return;
    }

    const fp = getOrCreateDeviceFingerprint();
    verifyMutation.mutate({
      invitationId: invitation.id,
      guestCode,
      guestName: guestNameFromQuery,
      deviceFingerprint: fp,
    });
  }, [invitation?.id, guestCode, guestNameFromQuery, isOwnerPreview]);

  useEffect(() => {
    if (
      !invitation?.id ||
      isOwnerPreview ||
      !accessState.checked ||
      !accessState.allowed ||
      hasSentBeaconRef.current
    ) {
      return;
    }

    hasSentBeaconRef.current = true;
    const fp = getOrCreateDeviceFingerprint();
    const payload = JSON.stringify({
      invitationId: invitation.id,
      guestId: accessState.guestId ?? guestCode,
      guestName: accessState.guestName ?? guestNameFromQuery,
      deviceType: detectDeviceType(),
      browser:
        typeof navigator !== "undefined"
          ? navigator.userAgent.slice(0, 60)
          : "unknown",
      deviceFingerprint: fp,
    });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/beacon", blob);
    } else {
      fetch("/api/analytics/beacon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [
    invitation?.id,
    isOwnerPreview,
    accessState.checked,
    accessState.allowed,
    accessState.guestId,
    accessState.guestName,
    guestCode,
    guestNameFromQuery,
  ]);

  const themeConfig = useMemo<ExtendedThemeConfig>(() => {
    if (invitation?.themeConfig) {
      return {
        ...DEFAULT_THEME_CONFIG,
        ...(invitation.themeConfig as unknown as Partial<ExtendedThemeConfig>),
      };
    }
    return DEFAULT_THEME_CONFIG;
  }, [invitation?.themeConfig]);

  if (isLoading || (invitation?.isPrivateMode && !accessState.checked)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="font-medium text-muted-foreground text-xs tracking-wide">
          Mempersiapkan undangan istimewa...
        </p>
      </div>
    );
  }

  if (isError || !invitation) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <h2 className="font-bold text-2xl text-foreground">
          Undangan Tidak Ditemukan
        </h2>
        <p className="max-w-sm text-muted-foreground text-xs leading-relaxed">
          Tautan undangan mungkin salah atau acara telah dinonaktifkan oleh
          penyelenggara.
        </p>
        <Button render={<Link href={"/" as Route} />} className="gap-2 text-xs">
          Kembali ke Senara
        </Button>
      </div>
    );
  }

  // Layar Mode Privat: Undangan Terkunci atau Batas Perangkat HP Tercapai (Task 13.3)
  if (!accessState.allowed) {
    const isDeviceLimit = accessState.reason === "DEVICE_LIMIT_REACHED";
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/30 p-6 text-center">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border bg-card p-8 shadow-xl">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {isDeviceLimit ? (
              <Smartphone className="size-7" />
            ) : (
              <Lock className="size-7" />
            )}
          </div>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
            {isDeviceLimit ? "Batas Perangkat Tercapai" : "Mode Privat Aktif"}
          </Badge>
          <h2 className="font-serif font-bold text-foreground text-xl">
            {isDeviceLimit
              ? "Tautan Sudah Dibuka di Perangkat Lain"
              : "Undangan Terkunci"}
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {isDeviceLimit ? (
              <>
                Tautan undangan pribadi untuk{" "}
                <strong>{accessState.guestName || guestNameFromQuery}</strong>{" "}
                dibatasi maksimal{" "}
                <strong>{accessState.maxDevices ?? 2} perangkat HP</strong>. Jika
                Anda berganti ponsel, silakan hubungi pengundang untuk menekan
                tombol <strong>Reset HP</strong>.
              </>
            ) : (
              <>
                Undangan <strong>&ldquo;{invitation.title}&rdquo;</strong> ini
                khusus untuk tamu yang diundang. Silakan buka menggunakan tautan
                pribadi yang dikirimkan oleh penyelenggara acara melalui WhatsApp.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (invitation.status === "EXPIRED") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <Badge
          variant="outline"
          className="border-amber-300 text-amber-600 text-xs"
        >
          Acara Telah Selesai
        </Badge>
        <h2 className="font-bold text-2xl text-foreground">
          {invitation.title}
        </h2>
        <p className="max-w-sm text-muted-foreground text-xs leading-relaxed">
          Masa tayang undangan ini telah berakhir. Terima kasih atas segala doa
          restu dan perhatian yang telah diberikan kepada kami.
        </p>
      </div>
    );
  }

  const resolvedGuestName = accessState.guestName || guestNameFromQuery;

  return (
    <div
      className="flex min-h-screen justify-center bg-zinc-950/5 selection:bg-primary selection:text-primary-foreground"
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
      {isOwnerPreview && resolvedGuestName ? (
        <div className="fixed top-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/30 bg-background/95 px-4 py-1.5 text-xs shadow-lg backdrop-blur">
          <Eye className="size-3.5 text-primary" />
          <span className="font-medium text-foreground">
            Tampilan untuk <strong>{resolvedGuestName}</strong>
          </span>
        </div>
      ) : null}

      <main className="relative min-h-screen w-full max-w-md overflow-x-hidden bg-background shadow-2xl">
        <UnifiedInvitation
          invitationId={invitation.id}
          templateSlug={invitation.template?.slug ?? "kartu-pos-vintage"}
          title={invitation.title}
          eventDate={invitation.eventDate}
          coverImageUrl={
            invitation.coverImageUrl || invitation.template?.thumbnail
          }
          musicUrl={invitation.musicUrl}
          musicStartAt={themeConfig.musicStartAt ?? 0}
          fontScale={themeConfig.fontScale ?? 1}
          scriptFont={themeConfig.scriptFont}
          themeConfig={themeConfig}
          sections={invitation.sections as unknown as UnifiedSectionConfig[]}
          schedules={invitation.schedules as unknown as EventScheduleItem[]}
          bankAccounts={invitation.bankAccounts as unknown as BankAccountItem[]}
          galleries={invitation.galleries as unknown as UnifiedGalleryItem[]}
          loveStories={invitation.loveStories as unknown as UnifiedStoryItem[]}
          customContents={
            (invitation.customContents ??
              []) as unknown as PublicCustomContentItem[]
          }
          guestId={accessState.guestId ?? guestCode}
          guestName={resolvedGuestName}
          isGroupLink={accessState.isGroupLink ?? false}
          resellerBrandName={invitation.user?.resellerBrandName}
          resellerLogoUrl={invitation.user?.resellerLogoUrl}
          withPhotos={themeConfig.withPhotos ?? true}
          fields={themeConfig.fields ?? {}}
          live
          editing={false}
          showCoverGateInitially
        />
      </main>
    </div>
  );
}
