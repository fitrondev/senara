"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  FileSpreadsheet,
  Plus,
  Sparkles,
  Store,
} from "lucide-react";

import { Button } from "@senara/ui/components/button";
import { Card, CardContent } from "@senara/ui/components/card";
import { Skeleton } from "@senara/ui/components/skeleton";

import { InvitationCard } from "@/components/invitation-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  SearchFilterBar,
  type FilterTabOption,
} from "@/components/shared/search-filter-bar";
import { StatCard } from "@/components/shared/stat-card";
import { trpc } from "@/utils/trpc";

type FilterStatus = "ALL" | "PUBLISHED" | "DRAFT";

export function ResellerDashboardView() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resellerData, isLoading: isResellerLoading } = useQuery(
    trpc.reseller.getDashboard.queryOptions()
  );
  const {
    data: invitations,
    isLoading: isInvitationsLoading,
    refetch,
  } = useQuery(trpc.invitation.getMyInvitations.queryOptions());

  const creditBalance = resellerData?.user.creditBalance ?? 0;
  const intakeLinks = resellerData?.intakeLinks ?? [];
  const submittedCount = intakeLinks.filter(
    (item) => item.status === "SUBMITTED"
  ).length;

  const metrics = useMemo(() => {
    if (!invitations) {
      return { total: 0, published: 0 };
    }
    const total = invitations.length;
    const published = invitations.filter(
      (inv) => inv.status === "PUBLISHED"
    ).length;
    return { total, published };
  }, [invitations]);

  const filterTabs = useMemo<readonly FilterTabOption<FilterStatus>[]>(
    () => [
      { value: "ALL", label: "Semua Proyek", count: metrics.total },
      { value: "PUBLISHED", label: "Terbit", count: metrics.published },
      {
        value: "DRAFT",
        label: "Draf Klien",
        count: metrics.total - metrics.published,
      },
    ],
    [metrics.total, metrics.published]
  );

  const filteredInvitations = useMemo(() => {
    if (!invitations) return [];
    const normalizedSearch = searchQuery.toLowerCase();
    return invitations.filter((inv) => {
      const matchStatus =
        filterStatus === "ALL" ? true : inv.status === filterStatus;
      const matchSearch =
        normalizedSearch === ""
          ? true
          : inv.title.toLowerCase().includes(normalizedSearch) ||
            inv.slug.toLowerCase().includes(normalizedSearch);
      return matchStatus && matchSearch;
    });
  }, [invitations, filterStatus, searchQuery]);

  return (
    <div className="flex flex-col gap-6 min-w-0 w-full">
      <PageHeader
        badgeText="Mitra Reseller White-Label"
        badgeIcon={Store}
        title={
          resellerData?.user.resellerBrandName
            ? `Studio ${resellerData.user.resellerBrandName}`
            : "Dashboard Mitra Reseller"
        }
        description="Kelola banyak proyek undangan klien, pantau saldo kredit tanpa masa hangus, dan atur identitas white-label bisnis Anda."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              render={<Link href={"/dashboard/reseller" as Route} />}
              className="gap-2"
            >
              <Coins className="size-4 text-amber-500" />
              <span>Top-Up Kredit & White-Label</span>
            </Button>
            <Button
              render={<Link href={"/dashboard/templates" as Route} />}
              className="gap-2 shadow-xs"
            >
              <Plus className="size-4" data-icon="inline-start" />
              <span>Buat Undangan Klien</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Saldo Kredit Aktif"
          value={`${creditBalance} Kredit`}
          description="5 Kredit = 1 Undangan (Semua Add-On Aktif)"
          icon={Coins}
          iconClassName="bg-amber-500/10 text-amber-600"
          isLoading={isResellerLoading}
        />
        <StatCard
          label="Identitas White-Label"
          value={resellerData?.user.resellerBrandName || "Default Senara"}
          description={
            resellerData?.user.resellerBrandName
              ? "Merek aktif di footer undangan"
              : "Atur merek di menu Workspace"
          }
          icon={Sparkles}
          iconClassName="bg-emerald-500/10 text-emerald-600"
          isLoading={isResellerLoading}
        />
        <StatCard
          label="Tautan Formulir Klien"
          value={`${submittedCount} / ${intakeLinks.length}`}
          description="Formulir klien yang telah diisi"
          icon={FileSpreadsheet}
          iconClassName="bg-blue-500/10 text-blue-600"
          isLoading={isResellerLoading}
        />
        <StatCard
          label="Proyek Undangan Klien"
          value={`${metrics.published} / ${metrics.total}`}
          description="Undangan klien berstatus Terbit"
          icon={CheckCircle2}
          isLoading={isInvitationsLoading}
        />
      </div>

      <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-2xs">
        <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">
              Butuh Top-Up Kredit atau Buat Tautan Formulir Klien Baru?
            </p>
            <p className="text-xs text-muted-foreground">
              Buka Workspace Reseller untuk membeli paket bundel kredit hemat,
              mengganti logo white-label, dan membagikan link form otomatis ke
              klien Anda.
            </p>
          </div>
          <Button
            size="sm"
            render={<Link href={"/dashboard/reseller" as Route} />}
            className="shrink-0 gap-1.5"
          >
            <span>Buka Workspace Reseller</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </CardContent>
      </Card>

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama klien, judul, atau slug undangan..."
        tabs={filterTabs}
        activeTab={filterStatus}
        onTabChange={setFilterStatus}
      />

      {isInvitationsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-16/9 w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredInvitations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredInvitations.map((inv) => (
            <InvitationCard
              key={inv.id}
              invitation={inv}
              onRefresh={() => refetch()}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Store}
          title={
            searchQuery
              ? "Proyek klien tidak ditemukan"
              : "Belum Ada Proyek Undangan Klien"
          }
          description={
            searchQuery
              ? `Tidak ditemukan proyek undangan dengan kata kunci "${searchQuery}".`
              : "Mulai buat undangan untuk klien pertama Anda atau buat tautan formulir klien di Workspace Reseller."
          }
          action={
            !searchQuery ? (
              <Button
                render={<Link href={"/dashboard/templates" as Route} />}
                className="gap-2"
              >
                <Plus className="size-4" data-icon="inline-start" />
                <span>Buat Undangan Klien</span>
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

