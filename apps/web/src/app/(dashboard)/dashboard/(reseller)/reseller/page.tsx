"use client";

import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Coins,
  ExternalLink,
  FileSpreadsheet,
  Sparkles,
  Store,
} from "lucide-react";

import { Button } from "@senara/ui/components/button";

import { ResellerBrandingCard } from "@/components/reseller/reseller-branding-card";
import { ResellerIntakeLinksSection } from "@/components/reseller/reseller-intake-links-section";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { trpc } from "@/utils/trpc";

export default function ResellerDashboardPage() {
  const { data, isLoading } = useQuery(
    trpc.reseller.getDashboard.queryOptions()
  );

  const creditBalance = data?.user.creditBalance ?? 0;
  const intakeLinks = data?.intakeLinks ?? [];
  const invitations = data?.invitations ?? [];
  const templates = data?.templates ?? [];

  const submittedCount = intakeLinks.filter(
    (item) => item.status === "SUBMITTED"
  ).length;
  const publishedCount = invitations.filter(
    (inv) => inv.status === "PUBLISHED"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        badgeText="Mitra Reseller White-Label"
        badgeIcon={Store}
        title="Ruang Kerja Reseller & White-Label"
        description="Kelola saldo kredit tanpa masa hangus, ganti footer dengan merek bisnismu sendiri, dan buat Tautan Formulir Klien otomatis."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            render={<Link href={"/reseller" as Route} target="_blank" />}
          >
            <ExternalLink className="size-3.5" />
            <span>Kalkulator Untung Reseller</span>
          </Button>
        }
      />

      {/* Ringkasan Statistik Reseller */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Saldo Kredit Aktif"
          value={`${creditBalance} Kredit`}
          description="Tidak ada masa kadaluarsa"
          icon={Coins}
          isLoading={isLoading}
        />
        <StatCard
          label="Identitas White-Label"
          value={data?.user.resellerBrandName || "Default Senara"}
          description={
            data?.user.resellerBrandName
              ? "Merek bisnis aktif di footer"
              : "Atur nama studio di bawah"
          }
          icon={Sparkles}
          isLoading={isLoading}
        />
        <StatCard
          label="Tautan Formulir Klien"
          value={`${submittedCount} / ${intakeLinks.length}`}
          description="Formulir klien yang sudah dilengkapi"
          icon={FileSpreadsheet}
          isLoading={isLoading}
        />
        <StatCard
          label="Undangan Klien Terbit"
          value={publishedCount}
          description={`Dari total ${invitations.length} proyek undangan`}
          icon={CheckCircle2}
          isLoading={isLoading}
        />
      </div>

      {/* Pengaturan White-Label & Paket Kredit */}
      <ResellerBrandingCard
        creditBalance={creditBalance}
        initialBrandName={data?.user.resellerBrandName}
        initialLogoUrl={data?.user.resellerLogoUrl}
        invitations={invitations}
      />

      {/* Tautan Formulir Klien */}
      <ResellerIntakeLinksSection
        intakeLinks={intakeLinks}
        templates={templates}
      />
    </div>
  );
}

