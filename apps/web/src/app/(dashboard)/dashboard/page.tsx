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
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@senara/ui/components/empty";
import { Input } from "@senara/ui/components/input";
import { Skeleton } from "@senara/ui/components/skeleton";

import { InvitationCard } from "@/components/invitation-card";
import { trpc } from "@/utils/trpc";

type FilterStatus = "ALL" | "PUBLISHED" | "DRAFT";

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: invitations,
    isLoading,
    refetch,
  } = useQuery(trpc.invitation.getMyInvitations.queryOptions());

  // Hitung metrik ringkasan
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

  // Filter daftar undangan
  const filteredInvitations = useMemo(() => {
    if (!invitations) return [];
    return invitations.filter((inv) => {
      const matchStatus =
        filterStatus === "ALL" ? true : inv.status === filterStatus;
      const matchSearch =
        searchQuery === ""
          ? true
          : inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [invitations, filterStatus, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Sambutan & Aksi Utama */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight sm:text-3xl text-foreground">
            {isUserLoaded && user?.firstName
              ? `Halo, ${user.firstName}! 👋`
              : "Undangan Saya"}
          </h1>
          <p className="text-muted-foreground text-sm">
            Kelola proyek undangan digital, pantau status publikasi, dan sambut tamu Anda.
          </p>
        </div>

        <Button
          render={<Link href={"/dashboard/templates" as Route} />}
          className="gap-2 shadow-xs"
        >
          <Plus className="size-4" data-icon="inline-start" />
          <span>Buat Undangan Baru</span>
        </Button>
      </div>

      {/* Kartu Ringkasan Metrik */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <FileText className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Total Undangan</p>
              <p className="font-bold text-xl">{metrics.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex size-9 items-center justify-center rounded-lg">
              <Radio className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Sudah Terbit</p>
              <p className="font-bold text-xl">{metrics.published}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 flex size-9 items-center justify-center rounded-lg">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Tamu Terdaftar</p>
              <p className="font-bold text-xl">{metrics.guests}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 flex size-9 items-center justify-center rounded-lg">
              <Mail className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Respon RSVP</p>
              <p className="font-bold text-xl">{metrics.rsvps}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tab & Pencarian */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={filterStatus === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("ALL")}
            className="text-xs"
          >
            Semua ({metrics.total})
          </Button>
          <Button
            variant={filterStatus === "PUBLISHED" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("PUBLISHED")}
            className="text-xs"
          >
            Terbit ({metrics.published})
          </Button>
          <Button
            variant={filterStatus === "DRAFT" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("DRAFT")}
            className="text-xs"
          >
            Draf ({metrics.total - metrics.published})
          </Button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Cari judul atau URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs"
          />
        </div>
      </div>

      {/* Tampilan Daftar Undangan / Loading / Empty */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInvitations.map((inv) => (
            <InvitationCard
              key={inv.id}
              invitation={inv}
              onRefresh={() => refetch()}
            />
          ))}
        </div>
      ) : (
        <Empty className="rounded-xl border border-dashed py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Sparkles className="size-6 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>
              {searchQuery
                ? "Tidak ada undangan yang cocok"
                : "Belum Ada Undangan"}
            </EmptyTitle>
            <EmptyDescription>
              {searchQuery
                ? `Tidak ditemukan undangan dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
                : "Mulai buat undangan digital pertama Anda dengan memilih template elegan yang siap digunakan."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {!searchQuery && (
              <Button
                render={<Link href={"/dashboard/templates" as Route} />}
                className="gap-2"
              >
                <Plus className="size-4" data-icon="inline-start" />
                <span>Pilih Template Sekarang</span>
              </Button>
            )}
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
