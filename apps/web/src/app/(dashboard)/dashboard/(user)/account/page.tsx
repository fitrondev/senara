"use client";

import type { Route } from "next";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@senara/ui/components/card";

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Memuat profil akun...</p>
      </div>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress ?? "-";
  const fullName = user?.fullName ?? user?.username ?? "Pengguna Senara";
  const createdAt = user?.createdAt
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "-";

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full min-w-0">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={"/dashboard" as Route} className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Pengaturan Akun</span>
          </div>
          <h1 className="font-bold text-2xl tracking-tight text-foreground">
            Pengaturan Akun & Keamanan
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola informasi profil, alamat email, dan kata sandi akun Senara Anda.
          </p>
        </div>

        <Button
          onClick={() => openUserProfile()}
          size="sm"
          className="gap-2 text-xs font-semibold shadow-xs"
        >
          <Settings className="size-3.5" />
          <span>Kelola Profil Lengkap</span>
        </Button>
      </div>

      {/* Kartu Ringkasan Profil */}
      <Card className="shadow-2xs">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <UserIcon className="size-4 text-primary" />
            <span>Informasi Profil</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={fullName}
                  className="size-16 rounded-full border object-cover shadow-xs"
                />
              ) : (
                <div className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full font-bold text-xl">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg text-foreground">{fullName}</h2>
                  <Badge variant="secondary" className="gap-1 text-[10px]">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    <span>Aktif</span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  <span>{email}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Bergabung sejak {createdAt}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openUserProfile()}
                className="gap-1.5 text-xs"
              >
                <ExternalLink className="size-3.5" />
                <span>Ubah Foto & Nama</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kartu Keamanan & Sesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-2xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="size-4 text-primary" />
              <span>Autentikasi & Kata Sandi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Akun Anda dilindungi oleh sistem autentikasi Clerk. Anda dapat memperbarui kata sandi,
              menghubungkan akun Google, atau mengatur perangkat yang sedang login.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openUserProfile()}
              className="w-full gap-2 text-xs"
            >
              <KeyRound className="size-3.5" />
              <span>Pengaturan Keamanan & Sandi</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-2xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <LogOut className="size-4 text-destructive" />
              <span>Keluar dari Sesi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Akhiri sesi login Anda pada perangkat ini. Seluruh draf undangan Anda tetap tersimpan
              dengan aman di akun Senara Anda.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => signOut({ redirectUrl: "/" })}
              className="w-full gap-2 text-xs"
            >
              <LogOut className="size-3.5" />
              <span>Keluar (Sign Out)</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

