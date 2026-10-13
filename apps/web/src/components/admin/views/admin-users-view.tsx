"use client";

import { Suspense, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Coins,
  Crown,
  Edit3,
  ShieldCheck,
  Store,
  UserPlus,
  Users,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@senara/ui/components/select";
import { Skeleton } from "@senara/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";

import { setRole } from "@/app/(admin)/admin/_actions";
import { ClerkRbacCard } from "@/components/admin/clerk-rbac-card";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterBar } from "@/components/shared/search-filter-bar";
import { formatDate } from "@/lib/format";
import { trpc } from "@/utils/trpc";

type SystemRole = "USER" | "RESELLER" | "ADMIN" | "SUPERADMIN";

interface UserEditState {
  userId: string;
  name: string;
  email: string;
  role: SystemRole;
  creditBalance: number;
  resellerBrandName: string;
}

export function AdminUsersView() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [editUser, setEditUser] = useState<UserEditState | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const usersQuery = useQuery(trpc.admin.listUsers.queryOptions());

  const updateUserMutation = useMutation(
    trpc.admin.updateUserRoleAndCredits.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.admin.listUsers.pathFilter());
        await queryClient.invalidateQueries(trpc.admin.checkAccess.pathFilter());
        toast.success(
          "Data pengguna, role & saldo kredit reseller berhasil diperbarui!"
        );
        setEditUser(null);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui data pengguna.");
      },
    })
  );

  const users = usersQuery.data ?? [];

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.name ?? "").toLowerCase().includes(q) ||
      (u.resellerBrandName ?? "").toLowerCase().includes(q)
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    // Sinkronkan juga ke Clerk publicMetadata.role melalui Server Action
    const formData = new FormData();
    formData.set("id", editUser.userId);
    const clerkRoleMap: Record<SystemRole, string> = {
      SUPERADMIN: "superadmin",
      ADMIN: "admin",
      RESELLER: "reseller",
      USER: "user",
    };
    formData.set("role", clerkRoleMap[editUser.role]);
    await setRole(formData);

    updateUserMutation.mutate({
      userId: editUser.userId,
      role: editUser.role,
      creditBalance: Number(editUser.creditBalance) || 0,
      resellerBrandName: editUser.resellerBrandName.trim() || null,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badgeText="Pengguna, RBAC & Mitra"
        badgeIcon={Users}
        title="Manajemen Pengguna, Role Clerk & Kredit Reseller"
        description="Kelola Role-Based Access Control (RBAC) Clerk publicMetadata, merek studio reseller white-label, dan saldo kuota undangan."
        actions={
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-1.5 shadow-xs"
          >
            <UserPlus className="size-4" />
            <span>Tambah Pengguna Baru</span>
          </Button>
        }
      />

      <Suspense
        fallback={<Skeleton className="h-48 w-full rounded-2xl" />}
      >
        <ClerkRbacCard />
      </Suspense>

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter tabel database lokal (nama, email, atau brand)..."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Daftar Akun Terdaftar ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Atur role pengguna atau tambahkan kuota kredit untuk mitra reseller/WO
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersQuery.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Tidak ada pengguna ditemukan"
              description="Belum ada akun yang sesuai dengan kata kunci pencarian."
            />
          ) : (
            <div className="w-full min-w-0 overflow-x-auto">
              <Table className="w-full min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Brand Reseller</TableHead>
                  <TableHead>Saldo Kredit</TableHead>
                  <TableHead>Undangan / Order</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="text-xs font-medium">
                          {user.name ?? "Pengguna Senara"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.role === "SUPERADMIN" ? (
                        <Badge className="bg-amber-500 text-amber-950">
                          <Crown className="mr-1 size-3" />
                          SUPERADMIN
                        </Badge>
                      ) : user.role === "ADMIN" ? (
                        <Badge className="bg-blue-600 text-white">
                          <ShieldCheck className="mr-1 size-3" />
                          ADMIN
                        </Badge>
                      ) : user.role === "RESELLER" ? (
                        <Badge className="bg-emerald-600 text-white">
                          <Store className="mr-1 size-3" />
                          RESELLER
                        </Badge>
                      ) : (
                        <Badge variant="outline">USER</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.resellerBrandName ? (
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <Store className="size-3.5 text-primary" />
                          {user.resellerBrandName}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        <Coins className="mr-1 size-3 text-amber-500" />
                        {user.creditBalance} Kredit
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {user._count.invitations} undangan • {user._count.orders}{" "}
                      order
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() =>
                          setEditUser({
                            userId: user.id,
                            name: user.name ?? "Pengguna",
                            email: user.email,
                            role: user.role,
                            creditBalance: user.creditBalance,
                            resellerBrandName: user.resellerBrandName ?? "",
                          })
                        }
                      >
                        <Edit3 className="mr-1 size-3" />
                        Kelola
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(editUser)}
        onOpenChange={(open) => {
          if (!open) setEditUser(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kelola Akses & Kredit Reseller</DialogTitle>
            <DialogDescription>
              {editUser?.name} ({editUser?.email})
            </DialogDescription>
          </DialogHeader>

          {editUser ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Hak Akses Sistem (4 Jenis Role)</Label>
                <Select
                  value={editUser.role}
                  onValueChange={(val) => {
                    if (val) {
                      setEditUser((prev) =>
                        prev
                          ? { ...prev, role: val as SystemRole }
                          : null
                      );
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih role pengguna">
                      {editUser.role === "SUPERADMIN"
                        ? "SUPERADMIN (Pemilik Platform — Otoritas Penuh)"
                        : editUser.role === "ADMIN"
                          ? "ADMIN (Admin Operasional — Order, Template & Moderasi)"
                          : editUser.role === "RESELLER"
                            ? "RESELLER (Mitra Studio / WO White-Label)"
                            : "USER (Pengguna Reguler / Mempelai)"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="USER">
                        USER (Pengguna Reguler / Mempelai)
                      </SelectItem>
                      <SelectItem value="RESELLER">
                        RESELLER (Mitra Studio / WO White-Label)
                      </SelectItem>
                      <SelectItem value="ADMIN">
                        ADMIN (Admin Operasional — Order, Template & Moderasi)
                      </SelectItem>
                      <SelectItem value="SUPERADMIN">
                        SUPERADMIN (Pemilik Platform — Otoritas Penuh)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="user-credits">
                  Saldo Kuota Kredit Undangan (Reseller)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="user-credits"
                    type="number"
                    min={0}
                    value={editUser.creditBalance}
                    onChange={(e) =>
                      setEditUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              creditBalance: Number(e.target.value),
                            }
                          : null
                      )
                    }
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditUser((prev) =>
                        prev
                          ? { ...prev, creditBalance: prev.creditBalance + 5 }
                          : null
                      )
                    }
                  >
                    +5
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditUser((prev) =>
                        prev
                          ? { ...prev, creditBalance: prev.creditBalance + 10 }
                          : null
                      )
                    }
                  >
                    +10
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="user-brand">
                  Nama Brand Reseller White-Label (Opsional)
                </Label>
                <Input
                  id="user-brand"
                  placeholder="Contoh: Galipat Story Invitation"
                  value={editUser.resellerBrandName}
                  onChange={(e) =>
                    setEditUser((prev) =>
                      prev
                        ? { ...prev, resellerBrandName: e.target.value }
                        : null
                    )
                  }
                />
                <p className="text-[11px] text-muted-foreground">
                  Jika diisi, footer undangan milik akun ini akan menampilkan
                  brand mitra tersebut.
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUser(null)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  <CheckCircle2 className="mr-1.5 size-3.5" />
                  {updateUserMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {
          queryClient.invalidateQueries(trpc.admin.listUsers.pathFilter());
          queryClient.invalidateQueries(
            trpc.admin.getDashboardMetrics.pathFilter()
          );
        }}
      />
    </div>
  );
}

