"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Mail,
  Plus,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
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

export function UserDashboardView() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: invitations,
    isLoading,
    refetch,
  } = useQuery(trpc.invitation.getMyInvitations.queryOptions());

  const metrics = useMemo(() => {
    if (!invitations) {
      return { total: 0, published: 0, guests: 0, rsvps: 0 };
    }
    const total = invitations.length;
    const published = invitations.filter((inv) => inv.status === "PUBLISHED").length;
    const guests = invitations.reduce((acc, inv) => acc + (inv._count?.guests ?? 0), 0);
    const rsvps = invitations.reduce((acc, inv) => acc + (inv._count?.rsvps ?? 0), 0);

    return { total, published, guests, rsvps };
  }, [invitations]);

  const filterTabs = useMemo<readonly FilterTabOption<FilterStatus>[]>(
    () => [
      { value: "ALL", label: "Semua", count: metrics.total },
      { value: "PUBLISHED", label: "Terbit", count: metrics.published },
      { value: "DRAFT", label: "Draf", count: metrics.total - metrics.published },
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
        title={
          isUserLoaded && user?.firstName
            ? `Halo, ${user.firstName}!`
            : "Undangan Saya"
        }
        description="Kelola proyek undangan digital, pantau status publikasi, dan sambut tamu Anda."
        actions={
          <Button
            render={<Link href={"/dashboard/templates" as Route} />}
            className="gap-2 shadow-xs"
          >
            <Plus className="size-4" data-icon="inline-start" />
            <span>Buat Undangan Baru</span>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard
          label="Total Undangan"
          value={metrics.total}
          icon={FileText}
          isLoading={isLoading}
        />
        <StatCard
          label="Sudah Terbit"
          value={metrics.published}
          icon={Radio}
          iconClassName="bg-emerald-500/10 text-emerald-600"
          isLoading={isLoading}
        />
        <StatCard
          label="Tamu Terdaftar"
          value={metrics.guests}
          icon={Users}
          iconClassName="bg-secondary text-secondary-foreground"
          isLoading={isLoading}
        />
        <StatCard
          label="Respon RSVP"
          value={metrics.rsvps}
          icon={Mail}
          iconClassName="bg-accent/40 text-accent-foreground"
          isLoading={isLoading}
        />
      </div>

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari judul atau URL undangan..."
        tabs={filterTabs}
        activeTab={filterStatus}
        onTabChange={setFilterStatus}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-16/9 w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredInvitations.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
          icon={Sparkles}
          title={
            searchQuery
              ? "Tidak ada undangan yang cocok"
              : "Belum Ada Undangan"
          }
          description={
            searchQuery
              ? `Tidak ditemukan undangan dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
              : "Mulai buat undangan digital pertama Anda dengan memilih template elegan yang siap digunakan."
          }
          action={
            !searchQuery ? (
              <Button
                render={<Link href={"/dashboard/templates" as Route} />}
                className="gap-2"
              >
                <Plus className="size-4" data-icon="inline-start" />
                <span>Pilih Template Sekarang</span>
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

