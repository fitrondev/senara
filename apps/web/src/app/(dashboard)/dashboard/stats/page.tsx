"use client";

import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Eye,
  Loader2,
  Plus,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@senara/ui/components/card";

import { trpc } from "@/utils/trpc";

export default function StatsIndexPage() {
  const { data: invitations, isLoading } = useQuery(
    trpc.invitation.getMyInvitations.queryOptions()
  );

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Memuat data statistik...</p>
      </div>
    );
  }

  const items = invitations ?? [];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-1 border-b pb-5">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BarChart3 className="size-5" />
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight text-foreground">
              Statistik Kunjungan Undangan
            </h1>
            <p className="text-xs text-muted-foreground">
              Pilih undangan untuk melihat metrik total tayang, kunjungan harian, dan ringkasan kehadiran.
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center text-muted-foreground gap-3">
          <Eye className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-semibold text-foreground text-sm">Belum Ada Undangan</p>
            <p className="text-xs mt-0.5">Buat undangan terlebih dahulu untuk melihat analitik.</p>
          </div>
          <Button render={<Link href={"/dashboard/templates" as Route} />} size="sm" className="gap-1.5 text-xs mt-2">
            <Plus className="size-3.5" />
            <span>Pilih Template</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((inv) => (
            <Card
              key={inv.id}
              className="flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={inv.status === "PUBLISHED" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {inv.status === "PUBLISHED" ? "Terbit" : "Draf"}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">/{inv.slug}</span>
                </div>
                <CardTitle className="font-bold text-lg text-foreground mt-2">
                  {inv.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Calendar className="size-3 text-primary" />
                  <span>
                    {inv.eventDate
                      ? new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(inv.eventDate))
                      : "Belum diatur tanggal"}
                  </span>
                </p>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <Button
                  render={
                    <Link
                      href={(`/dashboard/stats/${inv.id}`) as Route}
                    />
                  }
                  className="w-full gap-2 text-xs font-semibold h-9"
                >
                  <BarChart3 className="size-3.5" />
                  <span>Lihat Statistik Kunjungan</span>
                  <ArrowRight className="size-3.5 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

