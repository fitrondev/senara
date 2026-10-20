"use client";

import Image from "next/image";
import type { Route } from "next";
import Link from "next/link";
import {
  Archive,
  Copy,
  Crown,
  Edit3,
  ExternalLink,
  Eye,
  Globe,
  Loader2,
  Trash2,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@senara/ui/components/dropdown-menu";

import type { TemplateGeneratorItem } from "./template-generator-types";
import { formatDate } from "@/lib/format";

export interface TemplateGeneratorTableProps {
  templates: TemplateGeneratorItem[];
  onDuplicate: (template: TemplateGeneratorItem) => void;
  onPublish: (template: TemplateGeneratorItem) => void;
  onArchive: (template: TemplateGeneratorItem) => void;
  onDelete: (template: TemplateGeneratorItem) => void;
  onPreview: (template: TemplateGeneratorItem) => void;
  isActionLoading?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  WEDDING: "Pernikahan",
  BIRTHDAY: "Ulang Tahun",
  KHITANAN: "Khitanan",
};

export function TemplateGeneratorTable({
  templates,
  onDuplicate,
  onPublish,
  onArchive,
  onDelete,
  onPreview,
  isActionLoading,
}: TemplateGeneratorTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/70 bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Thumbnail</th>
              <th className="px-4 py-3 font-semibold">Nama & Slug</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Tipe</th>
              <th className="px-4 py-3 font-semibold">Penggunaan</th>
              <th className="px-4 py-3 font-semibold">Terakhir Diubah</th>
              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {templates.map((tpl) => {
              const categoryLabel = CATEGORY_LABELS[tpl.category] || tpl.category;
              return (
                <tr
                  key={tpl.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-border/60 bg-muted">
                      {tpl.thumbnail ? (
                        <Image
                          src={tpl.thumbnail}
                          alt={tpl.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-foreground">
                        {tpl.name}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        /{tpl.slug}
                      </span>
                      {tpl.description ? (
                        <span className="line-clamp-1 max-w-xs text-[11px] text-zinc-500">
                          {tpl.description}
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {categoryLabel}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    {tpl.status === "PUBLISHED" ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px]">
                        Published
                      </Badge>
                    ) : tpl.status === "ARCHIVED" ? (
                      <Badge className="bg-zinc-500/15 text-zinc-600 border-zinc-500/30 text-[10px]">
                        Archived
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px]">
                        Draft
                      </Badge>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {tpl.isPremium ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600"
                      >
                        <Crown className="size-2.5" />
                        <span>Premium</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Gratis
                      </Badge>
                    )}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {tpl.invitationsCount}
                    </span>{" "}
                    undangan
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(tpl.updatedAt)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        render={
                          <Link
                            href={
                              `/dashboard/template-generator/${tpl.id}` as Route
                            }
                          />
                        }
                        size="sm"
                        variant="default"
                        className="h-8 gap-1 px-2.5 text-xs bg-amber-600 hover:bg-amber-500 text-white"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Buka Editor</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                        onClick={() => onPreview(tpl)}
                        title="Pratinjau Template"
                      >
                        <Eye className="size-3.5 text-muted-foreground" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 px-2" />}>
                          •••
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem
                            onClick={() => onDuplicate(tpl)}
                            className="gap-2"
                          >
                            <Copy className="size-3.5" />
                            <span>Duplikasi Template</span>
                          </DropdownMenuItem>

                          {tpl.status !== "PUBLISHED" ? (
                            <DropdownMenuItem
                              onClick={() => onPublish(tpl)}
                              className="gap-2 text-emerald-600"
                            >
                              <Globe className="size-3.5" />
                              <span>Publikasikan ke Galeri</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onArchive(tpl)}
                              className="gap-2 text-zinc-600"
                            >
                              <Archive className="size-3.5" />
                              <span>Arsipkan Template</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => onDelete(tpl)}
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Hapus Permanen</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
