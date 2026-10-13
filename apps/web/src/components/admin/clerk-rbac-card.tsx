"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Crown,
  KeyRound,
  Shield,
  ShieldCheck,
  Store,
  UserCheck,
  UserMinus,
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
import { Skeleton } from "@senara/ui/components/skeleton";

import {
  removeRole,
  searchClerkUsers,
  setRole,
  type ClerkRbacUserItem,
} from "@/app/(admin)/admin/_actions";
import { SearchUsers } from "@/app/(admin)/admin/SearchUsers";
import { trpc } from "@/utils/trpc";
import type { Roles } from "../../../types/globals";

export function ClerkRbacCard() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const query = searchParams.get("search") ?? "";

  const [users, setUsers] = useState<ClerkRbacUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadClerkUsers = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const data = await searchClerkUsers(searchQuery);
      setUsers(data);
    } catch {
      toast.error("Gagal memuat daftar pengguna dari Clerk.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadClerkUsers(query);
  }, [query]);

  const handleSetRole = (userId: string, role: Roles) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", userId);
      formData.set("role", role);

      const res = await setRole(formData);
      if (res.ok) {
        toast.success(`Role Clerk berhasil diubah menjadi '${role}'`);
        await loadClerkUsers(query);
        await queryClient.invalidateQueries(trpc.admin.listUsers.pathFilter());
        await queryClient.invalidateQueries(trpc.admin.checkAccess.pathFilter());
      } else {
        toast.error(String(res.message));
      }
    });
  };

  const handleRemoveRole = (userId: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", userId);

      const res = await removeRole(formData);
      if (res.ok) {
        toast.success("Role metadata Clerk berhasil direset ke USER");
        await loadClerkUsers(query);
        await queryClient.invalidateQueries(trpc.admin.listUsers.pathFilter());
        await queryClient.invalidateQueries(trpc.admin.checkAccess.pathFilter());
      } else {
        toast.error(String(res.message));
      }
    });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            <CardTitle className="text-base">
              Clerk Session Metadata RBAC (`publicMetadata.role`)
            </CardTitle>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            Claims: &#123; &quot;metadata&quot;: &quot;&#123;&#123;user.public_metadata&#125;&#125;&quot; &#125;
          </Badge>
        </div>
        <CardDescription>
          Cari akun langsung dari Clerk Directory dan tetapkan salah satu dari 4
          role sistem: <code>user</code>, <code>reseller</code>,{" "}
          <code>admin</code>, atau <code>superadmin</code> (tersinkronisasi
          otomatis dengan database Senara).
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <SearchUsers />

        {isLoading ? (
          <div className="space-y-2 pt-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Tidak ada pengguna Clerk yang ditemukan untuk kata kunci tersebut.
          </p>
        ) : (
          <div className="divide-y rounded-xl border">
            {users.map((user) => {
              const fullName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                "Tanpa Nama";
              const normalizedRole = user.role?.toLowerCase();
              return (
                <div
                  key={user.id}
                  className="flex flex-col justify-between gap-3 p-3.5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-xs font-semibold text-foreground">
                        {fullName}
                      </span>
                      {normalizedRole === "superadmin" ? (
                        <Badge className="bg-amber-500 text-[10px] text-amber-950">
                          <Crown className="mr-1 size-3" />
                          superadmin
                        </Badge>
                      ) : normalizedRole === "admin" ? (
                        <Badge className="bg-blue-600 text-[10px] text-white">
                          <ShieldCheck className="mr-1 size-3" />
                          admin
                        </Badge>
                      ) : normalizedRole === "reseller" ? (
                        <Badge className="bg-emerald-600 text-[10px] text-white">
                          <Store className="mr-1 size-3" />
                          reseller
                        </Badge>
                      ) : normalizedRole === "user" ? (
                        <Badge variant="secondary" className="text-[10px]">
                          <UserCheck className="mr-1 size-3" />
                          user
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          default (user)
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {user.emailAddress}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                      type="button"
                      size="xs"
                      variant={
                        normalizedRole === "superadmin" ? "default" : "outline"
                      }
                      disabled={isPending || normalizedRole === "superadmin"}
                      onClick={() => handleSetRole(user.id, "superadmin")}
                    >
                      <Crown className="mr-1 size-3" />
                      Super Admin
                    </Button>

                    <Button
                      type="button"
                      size="xs"
                      variant={
                        normalizedRole === "admin" ? "default" : "outline"
                      }
                      disabled={isPending || normalizedRole === "admin"}
                      onClick={() => handleSetRole(user.id, "admin")}
                    >
                      <Shield className="mr-1 size-3" />
                      Admin
                    </Button>

                    <Button
                      type="button"
                      size="xs"
                      variant={
                        normalizedRole === "reseller" ? "default" : "outline"
                      }
                      disabled={isPending || normalizedRole === "reseller"}
                      onClick={() => handleSetRole(user.id, "reseller")}
                    >
                      <Store className="mr-1 size-3" />
                      Reseller
                    </Button>

                    <Button
                      type="button"
                      size="xs"
                      variant={
                        normalizedRole === "user" ? "default" : "outline"
                      }
                      disabled={isPending || normalizedRole === "user"}
                      onClick={() => handleSetRole(user.id, "user")}
                    >
                      <UserCheck className="mr-1 size-3" />
                      User
                    </Button>

                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={isPending || !user.role}
                      onClick={() => handleRemoveRole(user.id)}
                    >
                      <UserMinus className="mr-1 size-3" />
                      Reset
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

