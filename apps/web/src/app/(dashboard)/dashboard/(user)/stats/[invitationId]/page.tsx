"use client";

import { use, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Eye,
  Globe,
  HelpCircle,
  Laptop,
  Loader2,
  Radio,
  Smartphone,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@senara/ui/components/card";
import { Progress } from "@senara/ui/components/progress";

import { PageHeader } from "@/components/shared/page-header";
import {
  SearchFilterBar,
  type FilterTabOption,
} from "@/components/shared/search-filter-bar";
import { StatCard } from "@/components/shared/stat-card";
import {
  GuestVisitTable,
  type StatsGeneralViewRow,
  type StatsGuestRow,
} from "@/components/stats/guest-visit-table";
import { trpc } from "@/utils/trpc";

type VisitFilterTab = "ALL" | "OPENED" | "UNOPENED" | "GENERAL";

interface StatsPageProps {
  params: Promise<{
    invitationId: string;
  }>;
}

export default function InvitationStatsPage({ params }: StatsPageProps) {
  const resolvedParams = use(params);
  const invitationId = resolvedParams.invitationId;

  const [activeTab, setActiveTab] = useState<VisitFilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats, isLoading, isError } = useQuery(
    trpc.analytics.getStats.queryOptions({ invitationId })
  );

  const guestList = useMemo(
    () => ((stats?.guests ?? []) as unknown as StatsGuestRow[]),
    [stats?.guests]
  );
  const generalViews = useMemo(
    () => ((stats?.generalViews ?? []) as unknown as StatsGeneralViewRow[]),
    [stats?.generalViews]
  );

  const openedCount = useMemo(
    () => guestList.filter((g) => g.viewCount > 0).length,
    [guestList]
  );
  const unopenedCount = guestList.length - openedCount;

  const visitTabs = useMemo<readonly FilterTabOption<VisitFilterTab>[]>(
    () => [
      { value: "ALL", label: "Semua", count: guestList.length },
      { value: "OPENED", label: "Sudah buka", count: openedCount },
      { value: "UNOPENED", label: "Belum buka", count: unopenedCount },
      {
        value: "GENERAL",
        label: "Tamu lain (link umum)",
        count: generalViews.length,
      },
    ],
    [guestList.length, openedCount, unopenedCount, generalViews.length]
  );

  const filteredGuests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return guestList.filter((g) => {
      if (activeTab === "OPENED" && g.viewCount === 0) return false;
      if (activeTab === "UNOPENED" && g.viewCount > 0) return false;
      if (q && !g.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [guestList, activeTab, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="font-medium text-muted-foreground text-xs">
          Memuat data analitik kunjungan & statistik tamu...
        </p>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-bold text-xl">Data Tidak Ditemukan</h2>
        <Button render={<Link href={"/dashboard" as Route} />} size="sm">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const {
    invitation,
    totalViews,
    todayViews,
    liveVisitorsCount,
    devices,
    rsvp,
  } = stats;

  const mobilePercent =
    totalViews > 0 ? Math.round((devices.mobile / totalViews) * 100) : 0;
  const desktopPercent =
    totalViews > 0 ? Math.round((devices.desktop / totalViews) * 100) : 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 min-w-0">
      <PageHeader
        backHref={"/dashboard/stats" as Route}
        backLabel="Pilih Undangan"
        title="Statistik Tamu Per-Individu & Analitik"
        description={
          <>
            Pantau siapa saja tamu yang sudah membuka undangan{" "}
            <strong>&ldquo;{invitation.title}&rdquo;</strong> secara real-time.
          </>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              render={
                <Link href={`/dashboard/guests/${invitation.id}` as Route} />
              }
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs"
            >
              <Users className="size-3.5" />
              <span>Kelola Tamu</span>
            </Button>
            <Button
              render={
                <Link href={`/${invitation.slug}` as Route} target="_blank" />
              }
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs"
            >
              <Globe className="size-3.5 text-primary" />
              <span>Buka Undangan</span>
            </Button>
          </div>
        }
      />

      {/* Indikator Live Visitor Counter (30 menit terakhir - Task 13.2) */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold text-foreground text-xs sm:text-sm">
            <strong>{liveVisitorsCount} orang</strong> buka undangan dalam 30
            menit terakhir
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-[10px]">
            <Radio className="size-3 text-emerald-500" />
            <span>Live Beacon Tracker Aktif</span>
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            Add-On Rp 15.000
          </Badge>
        </div>
      </div>

      {/* Kartu Ringkasan Metrik Utama */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard
          label="Total Kunjungan"
          value={totalViews}
          description={`${todayViews} kunjungan hari ini`}
          icon={Eye}
        />
        <StatCard
          label="Tamu Sudah Buka"
          value={`${openedCount} / ${guestList.length}`}
          description={`${unopenedCount} tamu belum membuka`}
          icon={TrendingUp}
          valueClassName="text-emerald-600"
          iconClassName="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          label="Pengguna Seluler"
          value={`${mobilePercent}%`}
          description={`${devices.mobile} akses HP`}
          icon={Smartphone}
          valueClassName="text-blue-600"
          iconClassName="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          label="Respon RSVP"
          value={rsvp.total}
          description={`${rsvp.attending} konfirmasi hadir`}
          icon={UserCheck}
          valueClassName="text-amber-500"
          iconClassName="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Tabel Statistik Tamu Per-Individu (Semua / Sudah Buka / Belum Buka / Link Umum) */}
      <div className="flex flex-col gap-4">
        <SearchFilterBar
          searchValue={activeTab === "GENERAL" ? undefined : searchQuery}
          onSearchChange={
            activeTab === "GENERAL" ? undefined : setSearchQuery
          }
          searchPlaceholder="Cari nama tamu..."
          tabs={visitTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <GuestVisitTable
          mode={activeTab === "GENERAL" ? "GENERAL" : "GUESTS"}
          guests={filteredGuests}
          generalViews={generalViews}
        />
      </div>

      {/* Breakdown Perangkat & RSVP */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="shadow-2xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="flex items-center gap-2 font-bold text-sm">
              <Smartphone className="size-4 text-primary" />
              <span>Distribusi Perangkat Pengunjung</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Smartphone className="size-3.5 text-blue-500" />
                  <span>Smartphone / Seluler</span>
                </span>
                <span className="font-bold tabular-nums">
                  {devices.mobile} ({mobilePercent}%)
                </span>
              </div>
              <Progress value={mobilePercent} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Laptop className="size-3.5 text-emerald-500" />
                  <span>Komputer / Laptop</span>
                </span>
                <span className="font-bold tabular-nums">
                  {devices.desktop} ({desktopPercent}%)
                </span>
              </div>
              <Progress value={desktopPercent} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="flex items-center gap-2 font-bold text-sm">
              <UserCheck className="size-4 text-primary" />
              <span>Status Kehadiran Buku Tamu</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0">
            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span className="font-semibold text-xs">Konfirmasi Hadir</span>
              </div>
              <Badge className="bg-emerald-600 tabular-nums text-white">
                {rsvp.attending} Tamu
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <XCircle className="size-4 text-rose-600" />
                <span className="font-semibold text-xs">Berhalangan Hadir</span>
              </div>
              <Badge variant="destructive" className="tabular-nums">
                {rsvp.notAttending} Tamu
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="size-4 text-amber-500" />
                <span className="font-semibold text-xs">Masih Ragu</span>
              </div>
              <Badge variant="secondary" className="tabular-nums">
                {rsvp.uncertain} Tamu
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
