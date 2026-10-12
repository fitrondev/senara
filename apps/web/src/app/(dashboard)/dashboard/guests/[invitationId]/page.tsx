"use client";

import { use, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  Loader2,
  MessageCircle,
  MoreVertical,
  Plus,
  Search,
  Send,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@senara/ui/components/alert-dialog";
import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@senara/ui/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@senara/ui/components/empty";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import { NativeSelect, NativeSelectOption } from "@senara/ui/components/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";
import { cn } from "@senara/ui/lib/utils";

import { GuestImportDialog } from "@/components/guests/guest-import-dialog";
import {
  DEFAULT_WA_TEMPLATE,
  generateWhatsAppUrl,
  WhatsAppComposerModal,
} from "@/components/guests/whatsapp-composer";
import { trpc } from "@/utils/trpc";

interface GuestPageProps {
  params: Promise<{
    invitationId: string;
  }>;
}

export default function GuestManagementPage({ params }: GuestPageProps) {
  const resolvedParams = use(params);
  const invitationId = resolvedParams.invitationId;
  const queryClient = useQueryClient();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Modal States
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [composerModalOpen, setComposerModalOpen] = useState(false);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<{
    id: string;
    name: string;
    phone: string;
    category: string;
  } | null>(null);

  // Form State untuk Tambah / Edit Manual
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCategory, setFormCategory] = useState("Umum");

  // State Konfirmasi Hapus
  const [deleteTargetGuest, setDeleteTargetGuest] = useState<{ id: string; name: string } | null>(
    null
  );

  // Template WhatsApp Tersimpan di State Lokal
  const [waTemplate, setWaTemplate] = useState<string>(DEFAULT_WA_TEMPLATE);

  // Ambil Data Undangan
  const { data: invitation, isLoading: isLoadingInvitation } = useQuery(
    trpc.invitation.getById.queryOptions({ id: invitationId })
  );

  // Ambil Daftar Tamu
  const { data: guests, isLoading: isLoadingGuests } = useQuery(
    trpc.guest.list.queryOptions({
      invitationId,
      search: searchQuery.trim() || undefined,
      category: selectedCategory !== "ALL" ? selectedCategory : undefined,
    })
  );

  // Mutasi: Tambah Tamu (batchCreate dengan 1 item)
  const addGuestMutation = useMutation(
    trpc.guest.batchCreate.mutationOptions({
      onSuccess: () => {
        toast.success("Tamu berhasil ditambahkan.");
        queryClient.invalidateQueries(trpc.guest.list.queryFilter({ invitationId }));
        setAddEditDialogOpen(false);
        resetForm();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menambahkan tamu.");
      },
    })
  );

  // Mutasi: Update Tamu
  const updateGuestMutation = useMutation(
    trpc.guest.update.mutationOptions({
      onSuccess: () => {
        toast.success("Data tamu berhasil diperbarui.");
        queryClient.invalidateQueries(trpc.guest.list.queryFilter({ invitationId }));
        setAddEditDialogOpen(false);
        resetForm();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui tamu.");
      },
    })
  );

  // Mutasi: Hapus Tamu
  const deleteGuestMutation = useMutation(
    trpc.guest.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Tamu berhasil dihapus.");
        queryClient.invalidateQueries(trpc.guest.list.queryFilter({ invitationId }));
        setDeleteTargetGuest(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus tamu.");
      },
    })
  );

  // Mutasi: Update Status Kirim WA
  const updateStatusSentMutation = useMutation(
    trpc.guest.updateStatusSent.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.guest.list.queryFilter({ invitationId }));
      },
    })
  );

  const resetForm = () => {
    setFormName("");
    setFormPhone("");
    setFormCategory("Umum");
    setEditingGuest(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setAddEditDialogOpen(true);
  };

  const handleOpenEdit = (guest: {
    id: string;
    name: string;
    phone: string | null;
    category: string | null;
  }) => {
    setEditingGuest({
      id: guest.id,
      name: guest.name,
      phone: guest.phone || "",
      category: guest.category || "Umum",
    });
    setFormName(guest.name);
    setFormPhone(guest.phone || "");
    setFormCategory(guest.category || "Umum");
    setAddEditDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Nama tamu wajib diisi.");
      return;
    }

    if (editingGuest) {
      updateGuestMutation.mutate({
        id: editingGuest.id,
        invitationId,
        name: formName.trim(),
        phone: formPhone.trim() || null,
        category: formCategory.trim() || null,
      });
    } else {
      addGuestMutation.mutate({
        invitationId,
        guests: [
          {
            name: formName.trim(),
            phone: formPhone.trim() || undefined,
            category: formCategory.trim() || undefined,
          },
        ],
      });
    }
  };

  // Handler Kirim WhatsApp Satu-Klik
  const handleSendWhatsApp = (guest: { id: string; name: string; phone: string | null }) => {
    if (!invitation) return;

    const origin = typeof window !== "undefined" ? window.location.origin : "https://senara.id";
    const waUrl = generateWhatsAppUrl({
      phone: guest.phone,
      template: waTemplate,
      guestName: guest.name,
      publicBaseUrl: origin,
      invitationSlug: invitation.slug,
    });

    // Tandai status sebagai sudah dikirim
    updateStatusSentMutation.mutate({
      id: guest.id,
      invitationId,
      isSentWa: true,
    });

    // Buka WhatsApp di tab baru
    window.open(waUrl, "_blank", "noopener,noreferrer");
    toast.success(`WhatsApp dibuka untuk ${guest.name}. Status otomatis ditandai Terkirim.`);
  };

  // Hitung Metrik Tamu
  const guestList = guests ?? [];
  const totalGuests = guestList.length;
  const sentCount = guestList.filter((g) => g.isSentWa).length;
  const unsentCount = totalGuests - sentCount;
  const attendingCount = guestList.filter((g) => g.rsvps?.[0]?.attendance === "ATTENDING").length;

  // Daftar Kategori Unik
  const categories = useMemo(() => {
    const set = new Set<string>();
    guestList.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [guestList]);

  if (isLoadingInvitation) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Memuat data manajemen tamu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 max-w-6xl mx-auto w-full">
      {/* 1. Header & Navigasi Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={"/dashboard" as Route} className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Manajemen Tamu</span>
          </div>
          <h1 className="font-bold text-2xl tracking-tight text-foreground">
            Daftar Tamu & Distribusi WhatsApp
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola daftar undangan personal untuk <strong>"{invitation?.title}"</strong>
          </p>
        </div>

        {/* Tombol Aksi Toolbar Atas */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setComposerModalOpen(true)}
            className="gap-1.5 text-xs h-9"
          >
            <MessageCircle className="size-3.5 text-emerald-600" />
            <span>Format WhatsApp</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportModalOpen(true)}
            className="gap-1.5 text-xs h-9"
          >
            <FileSpreadsheet className="size-3.5 text-primary" />
            <span>Impor CSV / Excel</span>
          </Button>

          <Button size="sm" onClick={handleOpenAdd} className="gap-1.5 text-xs h-9 shadow-xs">
            <UserPlus className="size-3.5" />
            <span>+ Tambah Tamu</span>
          </Button>
        </div>
      </div>

      {/* 2. Kartu Ringkasan Metrik */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Total Tamu</span>
              <Users className="size-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-bold text-2xl text-foreground tabular-nums">{totalGuests}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tamu terdaftar</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Sudah Dikirim</span>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-bold text-2xl text-emerald-600 tabular-nums">{sentCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Undangan terkirim</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Belum Dikirim</span>
              <Clock className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-bold text-2xl text-amber-500 tabular-nums">{unsentCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Menunggu distribusi</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>RSVP Hadir</span>
              <UserCheck className="size-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-bold text-2xl text-primary tabular-nums">{attendingCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Konfirmasi hadir</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Bar Filter & Pencarian */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Cari nama tamu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Kategori:</span>
          <NativeSelect
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs h-9"
          >
            <NativeSelectOption value="ALL">Semua Kategori</NativeSelectOption>
            {categories.map((cat) => (
              <NativeSelectOption key={cat} value={cat}>
                {cat}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      {/* 4. Tabel Manajemen Tamu */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-xs">
        {isLoadingGuests ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : guestList.length === 0 ? (
          <Empty className="p-12">
            <EmptyMedia variant="icon">
              <Users className="size-5 text-muted-foreground" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-sm font-semibold text-foreground">
                Belum Ada Tamu Terdaftar
              </EmptyTitle>
              <EmptyDescription className="text-xs text-muted-foreground">
                Tambahkan tamu satu per satu atau gunakan impor massal CSV.
              </EmptyDescription>
            </EmptyHeader>
            <Button size="sm" onClick={handleOpenAdd} className="gap-1.5 text-xs mt-2">
              <UserPlus className="size-3.5" />
              <span>Tambah Tamu Pertama</span>
            </Button>
          </Empty>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="pl-5 text-[11px] uppercase tracking-wider">Nama Tamu</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Kategori</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">No. WhatsApp</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Status Kirim</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">RSVP</TableHead>
                <TableHead className="pr-5 text-right text-[11px] uppercase tracking-wider">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guestList.map((guest) => {
                const rsvpStatus = guest.rsvps?.[0]?.attendance;

                return (
                  <TableRow key={guest.id} className="hover:bg-muted/20 transition-colors">
                    {/* Nama Tamu */}
                    <TableCell className="pl-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm">
                          {guest.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ID: {guest.id.slice(0, 8)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Kategori */}
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {guest.category || "Umum"}
                      </Badge>
                    </TableCell>

                    {/* Nomor WhatsApp */}
                    <TableCell className="font-mono text-muted-foreground">
                      {guest.phone || "-"}
                    </TableCell>

                    {/* Status Kirim */}
                    <TableCell>
                      <Badge
                        variant={guest.isSentWa ? "default" : "secondary"}
                        className={cn(
                          "text-[10px] font-medium gap-1",
                          guest.isSentWa
                            ? "bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20"
                            : "text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/20"
                        )}
                      >
                        {guest.isSentWa ? (
                          <>
                            <CheckCircle2 className="size-2.5" />
                            <span>Sudah Dikirim</span>
                          </>
                        ) : (
                          <>
                            <Clock className="size-2.5" />
                            <span>Belum Dikirim</span>
                          </>
                        )}
                      </Badge>
                    </TableCell>

                    {/* RSVP Badge */}
                    <TableCell>
                      {rsvpStatus === "ATTENDING" && (
                        <Badge variant="default" className="text-[10px] bg-emerald-600 text-white">
                          Hadir
                        </Badge>
                      )}
                      {rsvpStatus === "NOT_ATTENDING" && (
                        <Badge variant="destructive" className="text-[10px]">
                          Tidak Hadir
                        </Badge>
                      )}
                      {rsvpStatus === "UNCERTAIN" && (
                        <Badge variant="secondary" className="text-[10px]">
                          Ragu
                        </Badge>
                      )}
                      {!rsvpStatus && (
                        <span className="text-[11px] text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Tombol Aksi */}
                    <TableCell className="pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol Kirim WhatsApp */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendWhatsApp(guest)}
                          className="h-7 gap-1 px-2.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-600/30"
                          title="Kirim Undangan via WhatsApp"
                        >
                          <Send className="size-3" />
                          <span>Kirim WA</span>
                        </Button>

                        {/* Tombol Edit */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEdit(guest)}
                          title="Edit Data Tamu"
                        >
                          <Edit2 className="size-3" />
                        </Button>

                        {/* Tombol Hapus */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            setDeleteTargetGuest({ id: guest.id, name: guest.name })
                          }
                          title="Hapus Tamu"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog Tambah / Edit Tamu Manual */}
      <Dialog open={addEditDialogOpen} onOpenChange={setAddEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGuest ? "Edit Data Tamu" : "Tambah Tamu Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Masukkan informasi nama dan nomor WhatsApp untuk mempersonalisasi tautan undangan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="guest-name" className="text-xs font-semibold">
                Nama Lengkap Tamu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="guest-name"
                placeholder="Contoh: Bpk. Budi Santoso & Keluarga"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="guest-phone" className="text-xs font-semibold">
                Nomor WhatsApp (Opsional)
              </Label>
              <Input
                id="guest-phone"
                placeholder="Contoh: 081234567890"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Format nomor HP Indonesia (08xxx atau 628xxx).
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="guest-cat" className="text-xs font-semibold">
                Kategori Tamu
              </Label>
              <Input
                id="guest-cat"
                placeholder="Contoh: VIP, Keluarga, Sahabat, Teman Kantor"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>

            <DialogFooter className="border-t pt-3">
              <DialogClose render={<Button type="button" variant="outline" size="sm" />}>
                Batal
              </DialogClose>
              <Button
                type="submit"
                size="sm"
                disabled={addGuestMutation.isPending || updateGuestMutation.isPending}
                className="gap-1.5"
              >
                {addGuestMutation.isPending || updateGuestMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>{editingGuest ? "Simpan Perubahan" : "Tambah Tamu"}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Dialog Impor CSV */}
      <GuestImportDialog
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        invitationId={invitationId}
      />

      {/* Modal Dialog Composer Format Pesan WhatsApp */}
      <WhatsAppComposerModal
        open={composerModalOpen}
        onOpenChange={setComposerModalOpen}
        template={waTemplate}
        onSaveTemplate={(newTpl) => setWaTemplate(newTpl)}
        invitationSlug={invitation?.slug ?? ""}
      />

      {/* Dialog Konfirmasi Hapus Tamu */}
      <AlertDialog
        open={!!deleteTargetGuest}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetGuest(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tamu Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>"{deleteTargetGuest?.name}"</strong> dari
              daftar undangan? Riwayat RSVP terkait juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteGuestMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteGuestMutation.isPending}
              onClick={() => {
                if (deleteTargetGuest) {
                  deleteGuestMutation.mutate({
                    id: deleteTargetGuest.id,
                    invitationId,
                  });
                }
              }}
            >
              {deleteGuestMutation.isPending ? "Menghapus..." : "Ya, Hapus Tamu"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

