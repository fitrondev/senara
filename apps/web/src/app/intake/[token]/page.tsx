"use client";

import { use, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Heart,
  Loader2,
  MapPin,
  Send,
  Sparkles,
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
import { Textarea } from "@senara/ui/components/textarea";

import { trpc } from "@/utils/trpc";

interface ClientIntakePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function ClientIntakePage({ params }: ClientIntakePageProps) {
  const { token } = use(params);

  const { data: intake, isLoading, isError, refetch } = useQuery(
    trpc.reseller.getIntakeByToken.queryOptions({ token })
  );

  const [brideNickname, setBrideNickname] = useState("");
  const [brideFullName, setBrideFullName] = useState("");
  const [brideParents, setBrideParents] = useState("");
  const [groomNickname, setGroomNickname] = useState("");
  const [groomFullName, setGroomFullName] = useState("");
  const [groomParents, setGroomParents] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-24");
  const [akadTime, setAkadTime] = useState("08:00 WIB");
  const [resepsiTime, setResepsiTime] = useState("11:00 - 14:00 WIB");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");

  const submitMutation = useMutation(
    trpc.reseller.submitIntakeForm.mutationOptions({
      onSuccess: () => {
        toast.success(
          "Data undangan berhasil dikirim! Draf undangan telah dibuat otomatis."
        );
        refetch();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengirim formulir data undangan.");
      },
    })
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-muted/20 p-6">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-xs">
          Memuat formulir data undangan...
        </p>
      </div>
    );
  }

  if (isError || !intake) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/20 p-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Formulir Tidak Ditemukan
        </h1>
        <p className="max-w-sm text-muted-foreground text-xs">
          Tautan formulir klien ini tidak ditemukan atau sudah tidak berlaku.
          Silakan hubungi penyedia jasa undangan Anda.
        </p>
      </div>
    );
  }

  const brandName =
    intake.reseller.resellerBrandName ||
    intake.reseller.name ||
    "Mitra Studio Undangan";
  const isSubmitted = intake.status === "SUBMITTED";

  return (
    <div className="min-h-screen bg-muted/25 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header White-Label Studio */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 shadow-xs">
            {intake.reseller.resellerLogoUrl ? (
              <img
                src={intake.reseller.resellerLogoUrl}
                alt={brandName}
                className="size-4 rounded-sm object-contain"
              />
            ) : (
              <Sparkles className="size-3.5 text-primary" />
            )}
            <span className="font-semibold text-xs text-foreground">
              {brandName}
            </span>
          </div>

          <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Formulir Data Undangan Digital
          </h1>
          <p className="max-w-md text-muted-foreground text-xs leading-relaxed">
            Halo <strong>{intake.clientName}</strong>, silakan lengkapi data
            mempelai dan jadwal acara untuk tema{" "}
            <Badge variant="secondary" className="text-[10px]">
              {intake.template.name}
            </Badge>
            .
          </p>
        </div>

        {isSubmitted ? (
          <Card className="border-emerald-500/40 bg-card shadow-md">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px]">
                Data Berhasil Terkirim
              </Badge>
              <h2 className="font-serif text-xl font-bold text-foreground">
                Terima Kasih, {intake.clientName}!
              </h2>
              <p className="max-w-md text-muted-foreground text-xs leading-relaxed">
                Data mempelai dan lokasi acara Anda telah kami terima dan draf
                undangan telah otomatis dibuat di sistem{" "}
                <strong>{brandName}</strong>.
              </p>
              {intake.createdSlug ? (
                <Button
                  size="sm"
                  className="mt-2 gap-1.5 text-xs"
                  render={
                    <Link
                      href={`/${intake.createdSlug}?preview=1` as Route}
                      target="_blank"
                    />
                  }
                >
                  <ExternalLink className="size-3.5" />
                  <span>Lihat Pratinjau Draf Undangan</span>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              submitMutation.mutate({
                token,
                brideNickname,
                brideFullName,
                brideParents,
                groomNickname,
                groomFullName,
                groomParents,
                eventDate,
                akadTime,
                resepsiTime: resepsiTime.trim() || undefined,
                venueName,
                venueAddress,
                mapsUrl: mapsUrl.trim() || undefined,
              });
            }}
          >
            {/* Bagian 1: Data Mempelai */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-base">
                  <Heart className="size-4 text-primary" />
                  <span>1. Data Mempelai Wanita & Pria</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Isi nama panggilan, nama lengkap beserta gelar, dan nama kedua
                  orang tua.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-xl border bg-muted/15 p-3.5">
                  <p className="font-semibold text-xs text-primary">
                    Mempelai Wanita
                  </p>
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Panggilan</Label>
                    <Input
                      placeholder="Contoh: Adinda"
                      value={brideNickname}
                      onChange={(e) => setBrideNickname(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Lengkap & Gelar</Label>
                    <Input
                      placeholder="Adinda Rahma Putri, S.Psi."
                      value={brideFullName}
                      onChange={(e) => setBrideFullName(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Orang Tua</Label>
                    <Input
                      placeholder="Putri pertama Bpk. Hendra & Ibu Sari"
                      value={brideParents}
                      onChange={(e) => setBrideParents(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border bg-muted/15 p-3.5">
                  <p className="font-semibold text-xs text-primary">
                    Mempelai Pria
                  </p>
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Panggilan</Label>
                    <Input
                      placeholder="Contoh: Bagas"
                      value={groomNickname}
                      onChange={(e) => setGroomNickname(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Lengkap & Gelar</Label>
                    <Input
                      placeholder="Bagas Pratama Wijaya, S.T."
                      value={groomFullName}
                      onChange={(e) => setGroomFullName(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Orang Tua</Label>
                    <Input
                      placeholder="Putra kedua Bpk. Suryo & Ibu Ratna"
                      value={groomParents}
                      onChange={(e) => setGroomParents(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bagian 2: Jadwal & Lokasi Acara */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-base">
                  <Calendar className="size-4 text-primary" />
                  <span>2. Jadwal & Lokasi Acara</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Informasi waktu pelaksanaan akad/pemberkatan, resepsi, dan
                  titik Google Maps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Tanggal Acara Utama</Label>
                    <Input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Waktu Akad / Utama</Label>
                    <Input
                      placeholder="08:00 WIB"
                      value={akadTime}
                      onChange={(e) => setAkadTime(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Waktu Resepsi (Opsional)</Label>
                    <Input
                      placeholder="11:00 - 14:00 WIB"
                      value={resepsiTime}
                      onChange={(e) => setResepsiTime(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1 text-xs">
                      <MapPin className="size-3 text-primary" />
                      <span>Nama Gedung / Kediaman</span>
                    </Label>
                    <Input
                      placeholder="Grand Ballroom Senara Heritage"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Link Google Maps (Opsional)
                    </Label>
                    <Input
                      placeholder="https://maps.app.goo.gl/..."
                      value={mapsUrl}
                      onChange={(e) => setMapsUrl(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Alamat Lengkap Lokasi Acara</Label>
                  <Textarea
                    rows={2}
                    placeholder="Jl. Taman Kebon Sirih No. 18, Jakarta Pusat"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 text-xs"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              <span>Kirim Data & Buat Draf Undangan Sekarang</span>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

