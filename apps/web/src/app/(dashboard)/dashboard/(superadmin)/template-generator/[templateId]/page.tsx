"use client";

import { use } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Wand2 } from "lucide-react";

import { Button } from "@senara/ui/components/button";

import { TemplateGeneratorEditor } from "@/components/admin/template-generator/editor/template-generator-editor";
import { trpc } from "@/utils/trpc";

interface TemplateGeneratorPageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export default function SuperadminTemplateEditorPage({
  params,
}: TemplateGeneratorPageProps) {
  const resolvedParams = use(params);
  const templateId = resolvedParams.templateId;

  const {
    data: template,
    isLoading,
    isError,
  } = useQuery(
    trpc.templateGenerator.getById.queryOptions({ id: templateId })
  );

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-amber-500" />
        <p className="text-xs font-medium text-muted-foreground">
          Menyiapkan kanvas Template Generator Senara...
        </p>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-2xl bg-destructive/10 p-3 text-destructive">
          <Wand2 className="size-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold">Template Tidak Ditemukan</h2>
          <p className="max-w-sm text-xs text-muted-foreground">
            Template ini mungkin telah dihapus atau Anda tidak memiliki akses
            sebagai Super Admin.
          </p>
        </div>
        <Button
          render={<Link href={"/dashboard/template-generator" as Route} />}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Daftar Template</span>
        </Button>
      </div>
    );
  }

  return <TemplateGeneratorEditor template={template} />;
}
