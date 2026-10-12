"use client";

import { use } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  HelpCircle,
  Laptop,
  Loader2,
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

import { trpc } from "@/utils/trpc";

interface StatsPageProps {
  params: Promise<{
    invitationId: string;
  }>;
}

export default function InvitationStatsPage({ params }: StatsPageProps) {
  const resolvedParams = use(params);
  const invitationId = resolvedParams.invitationId;

  const { data: stats, isLoading, isError } = useQuery(
    trpc.analytics.getStats.queryOptions({ invitationId })
  );

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Memuat data analitik kunjungan...</p>
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

  const { invitation, totalViews, todayViews, devices, rsvp } = stats;

  const mobilePercent =
    totalViews > 0 ? Math.round((devices.mobile / totalViews) * 100) : 0;
  const desktopPercent =
    totalViews > 0 ? Math.round((devices.desktop / totalViews) * 100) : 0;

  const rsvpAttendingPercent =
    rsvp.total > 0 ? Math.round((rsvp.attending / rsvp.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 max-w-5xl mx-auto w-full">
      {/* 1. Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={"/dashboard" as Route} className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Statistik</span>
          </div>
          <h1 className="font-bold text-2xl tracking-tight text-foreground">
            Analitik Kunjungan & Tamu
          </h1>
          <p className="text-xs text-muted-foreground">
            Laporan lalu lintas dan respon kehadiran untuk <strong>"{invitation.title}"</strong>
          </p>
        </div>

        <Button
          render={
            <Link
              href={(`/${invitation.slug}`) as Route}
              target="_blank"
            />
          }
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-9"
        >
          <Globe className="size-3.5 text-primary" />
          <span>Buka Undangan Publik</span>
        </Button>
      </div>

      {/* 2. Kartu Ringkasan Metrik Utama */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Total Kunjungan</span>
              <Eye className="size-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-bold text-2xl text-foreground tabular-nums">{totalViews}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Semua waktu</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Hari Ini</span>
              <TrendingUp className="size-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-bold text-2xl text-emerald-600 tabular-nums">{todayViews}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Kunjungan baru</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Pengguna Seluler</span>
              <Smartphone className="size-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-bold text-2xl text-blue-500 tabular-nums">{mobilePercent}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{devices.mobile} perangkat</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Respon RSVP</span>
              <UserCheck className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-bold text-2xl text-amber-500 tabular-nums">{rsvp.total}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {rsvp.attending} konfirmasi hadir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Analisis Mendalam: Perangkat & RSVP Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Breakdown Perangkat */}
        <Card className="shadow-2xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Smartphone className="size-4 text-primary" />
              <span>Distribusi Perangkat Pengunjung</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
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
                <span className="flex items-center gap-1.5 text-foreground font-medium">
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

        {/* Breakdown RSVP */}
        <Card className="shadow-2xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <UserCheck className="size-4 text-primary" />
              <span>Status Kehadiran Buku Tamu</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span className="text-xs font-semibold">Konfirmasi Hadir</span>
              </div>
              <Badge className="bg-emerald-600 tabular-nums">{rsvp.attending} Tamu</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <XCircle className="size-4 text-rose-600" />
                <span className="text-xs font-semibold">Berhalangan Hadir</span>
              </div>
              <Badge variant="destructive" className="tabular-nums">
                {rsvp.notAttending} Tamu
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="size-4 text-amber-500" />
                <span className="text-xs font-semibold">Masih Ragu</span>
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

