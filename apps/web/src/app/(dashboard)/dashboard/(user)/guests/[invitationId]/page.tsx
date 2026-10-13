"use client";

import { use, useMemo, useState } from "react";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Filter,
  Loader2,
  MessageCircle,
  UserPlus,
  Users,
  UsersRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@senara/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@senara/ui/components/select";

import { GuestFormDialog } from "@/components/guests/guest-form-dialog";
import {
  GuestTable,
  type GuestListItem,
} from "@/components/guests/guest-table";
import { GuestWishesDialog } from "@/components/guests/guest-wishes-dialog";
import { PrivateModeCard } from "@/components/guests/private-mode-card";
import {
  buildPersonalizedInvitationUrl,
  DEFAULT_WA_TEMPLATE,
  generateWhatsAppUrl,
} from "@/components/guests/whatsapp-composer";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { PageHeader } from "@/components/shared/page-header";
import {
  SearchFilterBar,
  type FilterTabOption,
} from "@/components/shared/search-filter-bar";
import { StatCard } from "@/components/shared/stat-card";
import { trpc } from "@/utils/trpc";

// Vercel Best Practice (bundle-dynamic-imports): Load heavy import & composer modals lazily
const GuestImportDialog = dynamic(() =>
  import("@/components/guests/guest-import-dialog").then(
    (m) => m.GuestImportDialog
  )
);
const WhatsAppComposerModal = dynamic(() =>
  import("@/components/guests/whatsapp-composer").then(
    (m) => m.WhatsAppComposerModal
  )
);

type GuestFilterTab =
  | "ALL"
  | "ATTENDING"
  | "NOT_ATTENDING"
  | "UNCONFIRMED"
  | "GROUP";

interface GuestPageProps {
  params: Promise<{
    invitationId: string;
  }>;
}

export default function GuestManagementPage({ params }: GuestPageProps) {
  const resolvedParams = use(params);
  const invitationId = resolvedParams.invitationId;
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<GuestFilterTab>("ALL");

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [composerModalOpen, setComposerModalOpen] = useState(false);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [wishesTargetGuest, setWishesTargetGuest] =
    useState<GuestListItem | null>(null);

  const [editingGuest, setEditingGuest] = useState<{
    id: string;
    name: string;
    phone: string;
    category: string;
    isGroupLink: boolean;
  } | null>(null);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCategory, setFormCategory] = useState("Umum");
  const [formIsGroupLink, setFormIsGroupLink] = useState(false);

  const [deleteTargetGuest, setDeleteTargetGuest] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [waTemplate, setWaTemplate] = useState<string>(DEFAULT_WA_TEMPLATE);

  const { data: invitation, isLoading: isLoadingInvitation } = useQuery(
    trpc.invitation.getById.queryOptions({ id: invitationId })
  );

  const { data: guests, isLoading: isLoadingGuests } = useQuery(
    trpc.guest.list.queryOptions({
      invitationId,
      search: searchQuery.trim() || undefined,
      category: selectedCategory !== "ALL" ? selectedCategory : undefined,
    })
  );

  const invalidateGuestList = () => {
    queryClient.invalidateQueries(trpc.guest.list.queryFilter({ invitationId }));
  };

  const resetForm = (asGroupLink = false) => {
    setFormName("");
    setFormPhone("");
    setFormCategory(asGroupLink ? "Grup WhatsApp" : "Umum");
    setFormIsGroupLink(asGroupLink);
    setEditingGuest(null);
  };

  const addGuestMutation = useMutation(
    trpc.guest.batchCreate.mutationOptions({
      onSuccess: () => {
        toast.success(
          formIsGroupLink
            ? "Link Grup WhatsApp berhasil dibuat."
            : "Tamu berhasil ditambahkan."
        );
        invalidateGuestList();
        setAddEditDialogOpen(false);
        resetForm();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menambahkan tamu.");
      },
    })
  );

  const updateGuestMutation = useMutation(
    trpc.guest.update.mutationOptions({
      onSuccess: () => {
        toast.success("Data tamu berhasil diperbarui.");
        invalidateGuestList();
        setAddEditDialogOpen(false);
        resetForm();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui tamu.");
      },
    })
  );

  const deleteGuestMutation = useMutation(
    trpc.guest.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Tamu berhasil dihapus.");
        invalidateGuestList();
        setDeleteTargetGuest(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal menghapus tamu.");
      },
    })
  );

  const updateStatusSentMutation = useMutation(
    trpc.guest.updateStatusSent.mutationOptions({
      onSuccess: () => {
        invalidateGuestList();
      },
    })
  );

  const resetDevicesMutation = useMutation(
    trpc.guest.resetDevices.mutationOptions({
      onSuccess: (updated) => {
        toast.success(`Batas perangkat HP untuk "${updated.name}" berhasil di-reset.`);
        invalidateGuestList();
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mereset perangkat tamu.");
      },
    })
  );

  const updatePrivateModeMutation = useMutation(
    trpc.invitation.updateMetadata.mutationOptions({
      onSuccess: (updated) => {
        queryClient.invalidateQueries(
          trpc.invitation.getById.queryFilter({ id: invitationId })
        );
        toast.success(
          updated.isPrivateMode
            ? "Mode Privat diaktifkan. Hanya tamu terdaftar yang dapat membuka undangan."
            : "Mode Privat dinonaktifkan."
        );
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui pengaturan Mode Privat.");
      },
    })
  );

  const handleOpenAdd = (asGroupLink = false) => {
    resetForm(asGroupLink);
    setAddEditDialogOpen(true);
  };

  const handleOpenEdit = (guest: GuestListItem) => {
    setEditingGuest({
      id: guest.id,
      name: guest.name,
      phone: guest.phone || "",
      category: guest.category || "Umum",
      isGroupLink: guest.isGroupLink,
    });
    setFormName(guest.name);
    setFormPhone(guest.phone || "");
    setFormCategory(guest.category || "Umum");
    setFormIsGroupLink(guest.isGroupLink);
    setAddEditDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Nama wajib diisi.");
      return;
    }

    if (editingGuest) {
      updateGuestMutation.mutate({
        id: editingGuest.id,
        invitationId,
        name: formName.trim(),
        phone: formIsGroupLink ? null : formPhone.trim() || null,
        category: formCategory.trim() || null,
        isGroupLink: formIsGroupLink,
      });
    } else {
      addGuestMutation.mutate({
        invitationId,
        guests: [
          {
            name: formName.trim(),
            phone: formIsGroupLink ? undefined : formPhone.trim() || undefined,
            category: formCategory.trim() || undefined,
            isGroupLink: formIsGroupLink,
          },
        ],
      });
    }
  };

  const getPublicOrigin = () =>
    typeof window !== "undefined" ? window.location.origin : "https://senara.id";

  const handleSendWhatsApp = (guest: GuestListItem) => {
    if (!invitation) return;

    const waUrl = generateWhatsAppUrl({
      phone: guest.phone,
      template: waTemplate,
      guestName: guest.name,
      guestId: guest.id,
      publicBaseUrl: getPublicOrigin(),
      invitationSlug: invitation.slug,
    });

    updateStatusSentMutation.mutate({
      id: guest.id,
      invitationId,
      isSentWa: true,
    });

    window.open(waUrl, "_blank", "noopener,noreferrer");
    toast.success(
      `WhatsApp dibuka untuk ${guest.name}. Status otomatis ditandai Terkirim.`
    );
  };

  const handleCopyLink = async (guest: GuestListItem) => {
    if (!invitation) return;
    const url = buildPersonalizedInvitationUrl({
      publicBaseUrl: getPublicOrigin(),
      invitationSlug: invitation.slug,
      guestName: guest.name,
      guestId: guest.id,
    });
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`Link undangan untuk "${guest.name}" berhasil disalin!`);
    } catch {
      toast.error("Gagal menyalin link undangan.");
    }
  };

  const handlePreviewAsGuest = (guest: GuestListItem) => {
    if (!invitation) return;
    const url = `${buildPersonalizedInvitationUrl({
      publicBaseUrl: getPublicOrigin(),
      invitationSlug: invitation.slug,
      guestName: guest.name,
      guestId: guest.id,
    })}&preview=1`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const guestList = (guests ?? []) as GuestListItem[];

  // 4 Metrik Utama sesuai Task 13.1: Tamu, Hadir, Tidak Hadir, Belum Konfirmasi
  const summaryStats = useMemo(() => {
    let attendingCount = 0;
    let attendingPax = 0;
    let notAttendingCount = 0;
    let unconfirmedCount = 0;
    let groupCount = 0;

    for (const g of guestList) {
      if (g.isGroupLink) groupCount += 1;
      const rsvps = g.rsvps ?? [];
      if (rsvps.length === 0) {
        unconfirmedCount += 1;
        continue;
      }

      if (g.isGroupLink) {
        for (const r of rsvps) {
          if (r.attendance === "ATTENDING") {
            attendingCount += 1;
            attendingPax += r.guestCount || 1;
          } else if (r.attendance === "NOT_ATTENDING") {
            notAttendingCount += 1;
          }
        }
      } else {
        const latest = rsvps[0];
        if (latest?.attendance === "ATTENDING") {
          attendingCount += 1;
          attendingPax += latest.guestCount || 1;
        } else if (latest?.attendance === "NOT_ATTENDING") {
          notAttendingCount += 1;
        } else {
          unconfirmedCount += 1;
        }
      }
    }

    return {
      totalGuests: guestList.length,
      attendingCount,
      attendingPax,
      notAttendingCount,
      unconfirmedCount,
      groupCount,
    };
  }, [guestList]);

  const filterTabs = useMemo<readonly FilterTabOption<GuestFilterTab>[]>(
    () => [
      { value: "ALL", label: "Semua", count: summaryStats.totalGuests },
      { value: "ATTENDING", label: "Hadir", count: summaryStats.attendingCount },
      {
        value: "NOT_ATTENDING",
        label: "Tidak Hadir",
        count: summaryStats.notAttendingCount,
      },
      {
        value: "UNCONFIRMED",
        label: "Belum Konfirmasi",
        count: summaryStats.unconfirmedCount,
      },
      { value: "GROUP", label: "Link Grup", count: summaryStats.groupCount },
    ],
    [summaryStats]
  );

  const filteredGuests = useMemo(() => {
    if (activeTab === "ALL") return guestList;
    if (activeTab === "GROUP") return guestList.filter((g) => g.isGroupLink);
    return guestList.filter((g) => {
      const rsvps = g.rsvps ?? [];
      if (activeTab === "UNCONFIRMED") return rsvps.length === 0;
      return rsvps.some((r) => r.attendance === activeTab);
    });
  }, [guestList, activeTab]);

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
        <p className="font-medium text-muted-foreground text-xs">
          Memuat ruang kerja tamu & balasan RSVP...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 min-w-0">
      <PageHeader
        backHref={"/dashboard/guests" as Route}
        backLabel="Pilih Undangan"
        title="Tamu & Balasan RSVP Terpadu"
        description={
          <>
            Kelola daftar tamu, kirim WhatsApp, buat Link Grup, dan pantau balasan
            RSVP untuk <strong>&ldquo;{invitation?.title}&rdquo;</strong>
          </>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComposerModalOpen(true)}
              className="h-9 gap-1.5 text-xs"
            >
              <MessageCircle className="size-3.5 text-emerald-600" />
              <span>Format WA</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="h-9 gap-1.5 text-xs"
            >
              <FileSpreadsheet className="size-3.5 text-primary" />
              <span>Impor CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAdd(true)}
              className="h-9 gap-1.5 border-indigo-500/30 text-indigo-600 text-xs hover:bg-indigo-500/10 dark:text-indigo-400"
            >
              <UsersRound className="size-3.5" />
              <span>+ Link Grup WA</span>
            </Button>

            <Button
              size="sm"
              onClick={() => handleOpenAdd(false)}
              className="h-9 gap-1.5 text-xs shadow-xs"
            >
              <UserPlus className="size-3.5" />
              <span>+ Tambah Tamu</span>
            </Button>
          </>
        }
      />

      {/* 4 Kartu Ringkasan: Tamu, Hadir, Tidak Hadir, Belum Konfirmasi */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard
          label="Tamu"
          value={summaryStats.totalGuests}
          description={`${summaryStats.groupCount} link grup WA`}
          icon={Users}
        />
        <StatCard
          label="Hadir"
          value={summaryStats.attendingCount}
          description={`Total ${summaryStats.attendingPax} orang (pax)`}
          icon={CheckCircle2}
          valueClassName="text-emerald-600"
          iconClassName="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          label="Tidak Hadir"
          value={summaryStats.notAttendingCount}
          description="Konfirmasi berhalangan"
          icon={XCircle}
          valueClassName="text-rose-600"
          iconClassName="bg-rose-500/10 text-rose-600"
        />
        <StatCard
          label="Belum Konfirmasi"
          value={summaryStats.unconfirmedCount}
          description="Menunggu balasan RSVP"
          icon={Clock}
          valueClassName="text-amber-500"
          iconClassName="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Panel Kontrol Mode Privat & Pembatasan Perangkat HP (Task 13.3) */}
      <PrivateModeCard
        isPrivateMode={invitation?.isPrivateMode ?? false}
        maxDevicesPerGuest={invitation?.maxDevicesPerGuest ?? 2}
        isUpdating={updatePrivateModeMutation.isPending}
        onTogglePrivateMode={(nextVal) =>
          updatePrivateModeMutation.mutate({
            id: invitationId,
            isPrivateMode: nextVal,
          })
        }
        onChangeMaxDevices={(nextMax) =>
          updatePrivateModeMutation.mutate({
            id: invitationId,
            maxDevicesPerGuest: nextMax,
          })
        }
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama tamu atau grup..."
        tabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightSlot={
          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-muted-foreground" />
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                if (val) setSelectedCategory(val);
              }}
            >
              <SelectTrigger className="w-36 text-xs">
                <SelectValue placeholder="Semua Kategori">
                  {selectedCategory === "ALL"
                    ? "Semua Kategori"
                    : selectedCategory}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <GuestTable
        guests={filteredGuests}
        isLoading={isLoadingGuests}
        maxDevicesPerGuest={invitation?.maxDevicesPerGuest ?? 2}
        onAddFirstGuest={() => handleOpenAdd(false)}
        onSendWhatsApp={handleSendWhatsApp}
        onCopyLink={handleCopyLink}
        onPreviewAsGuest={handlePreviewAsGuest}
        onViewWishes={setWishesTargetGuest}
        onResetDevices={(guest) =>
          resetDevicesMutation.mutate({
            id: guest.id,
            invitationId,
          })
        }
        onEditGuest={handleOpenEdit}
        onDeleteGuest={setDeleteTargetGuest}
      />

      <GuestFormDialog
        open={addEditDialogOpen}
        onOpenChange={setAddEditDialogOpen}
        isEditing={Boolean(editingGuest)}
        formName={formName}
        onFormNameChange={setFormName}
        formPhone={formPhone}
        onFormPhoneChange={setFormPhone}
        formCategory={formCategory}
        onFormCategoryChange={setFormCategory}
        isGroupLink={formIsGroupLink}
        onIsGroupLinkChange={setFormIsGroupLink}
        onSwitchToCsv={() => setImportModalOpen(true)}
        isPending={addGuestMutation.isPending || updateGuestMutation.isPending}
        onSubmit={handleFormSubmit}
      />

      <GuestWishesDialog
        open={Boolean(wishesTargetGuest)}
        onOpenChange={(open) => {
          if (!open) setWishesTargetGuest(null);
        }}
        guestName={wishesTargetGuest?.name ?? ""}
        isGroupLink={wishesTargetGuest?.isGroupLink ?? false}
        rsvps={wishesTargetGuest?.rsvps ?? []}
      />

      {importModalOpen ? (
        <GuestImportDialog
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          invitationId={invitationId}
        />
      ) : null}

      {composerModalOpen ? (
        <WhatsAppComposerModal
          open={composerModalOpen}
          onOpenChange={setComposerModalOpen}
          template={waTemplate}
          onSaveTemplate={(newTpl) => setWaTemplate(newTpl)}
          invitationSlug={invitation?.slug ?? ""}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={Boolean(deleteTargetGuest)}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetGuest(null);
        }}
        title="Hapus Tamu / Link Grup Ini?"
        description={
          <>
            Apakah Anda yakin ingin menghapus{" "}
            <strong>&ldquo;{deleteTargetGuest?.name}&rdquo;</strong> dari daftar
            undangan?
          </>
        }
        confirmLabel="Ya, Hapus"
        isPending={deleteGuestMutation.isPending}
        onConfirm={() => {
          if (deleteTargetGuest) {
            deleteGuestMutation.mutate({
              id: deleteTargetGuest.id,
              invitationId,
            });
          }
        }}
      />
    </div>
  );
}
