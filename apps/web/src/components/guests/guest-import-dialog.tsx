"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Label } from "@senara/ui/components/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@senara/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@senara/ui/components/tabs";
import { Textarea } from "@senara/ui/components/textarea";

import { trpc } from "@/utils/trpc";

export interface ParsedGuestItem {
  name: string;
  phone?: string;
  category?: string;
}

interface GuestImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: string;
}

const SAMPLE_CSV_CONTENT = `Nama Tamu,Nomor WhatsApp,Kategori
Bpk. Budi Santoso & Keluarga,081234567890,Keluarga
Ibu Siti Rahmawati,082198765432,VIP
Ahmad Dahlan,085712345678,Teman Kantor
Rina Kartika,081345678901,Sahabat`;

export function GuestImportDialog({
  open,
  onOpenChange,
  invitationId,
}: GuestImportDialogProps) {
  const queryClient = useQueryClient();

  const [pasteContent, setPasteContent] = useState("");
  const [parsedGuests, setParsedGuests] = useState<ParsedGuestItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("paste");

  const batchCreateMutation = useMutation(
    trpc.guest.batchCreate.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Berhasil mengimpor ${data.count} tamu sekaligus!`);
        queryClient.invalidateQueries(trpc.guest.list.queryFilter({ invitationId }));
        onOpenChange(false);
        setPasteContent("");
        setParsedGuests([]);
      },
      onError: (err) => {
        toast.error(err.message || "Gagal mengimpor data tamu.");
      },
    })
  );

  const parseRows = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const results: ParsedGuestItem[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      if (
        i === 0 &&
        (line.toLowerCase().includes("nama") ||
          line.toLowerCase().includes("name") ||
          line.toLowerCase().includes("tamu"))
      ) {
        continue;
      }

      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const name = parts[0];
      const phone = parts[1] || undefined;
      const category = parts[2] || undefined;

      if (name && name.length > 0) {
        results.push({
          name,
          phone,
          category,
        });
      }
    }

    setParsedGuests(results);
  };

  const handlePasteChange = (val: string) => {
    setPasteContent(val);
    parseRows(val);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPasteContent(content);
        parseRows(content);
        setActiveTab("paste");
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contoh-daftar-tamu-senara.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Contoh berkas CSV berhasil diunduh.");
  };

  const handleImportSubmit = () => {
    if (parsedGuests.length === 0) {
      toast.error("Tidak ada data tamu yang valid untuk diimpor.");
      return;
    }

    batchCreateMutation.mutate({
      invitationId,
      guests: parsedGuests,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                <FileSpreadsheet className="size-5" />
              </div>
              <div>
                <DialogTitle>Impor Massal Tamu (CSV / Teks)</DialogTitle>
                <DialogDescription className="text-xs">
                  Unggah file CSV atau salin-tempel daftar tamu untuk mengimpor puluhan tamu
                  sekaligus.
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleDownloadSampleCsv}
              className="shrink-0 gap-1.5 text-[11px]"
            >
              <Download className="size-3.5 text-primary" />
              <span>Unduh Contoh CSV</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-left">
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              if (val) setActiveTab(val);
            }}
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="paste" className="gap-1.5 text-xs">
                <FileText className="size-3.5" />
                <span>Salin & Tempel Teks</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-1.5 text-xs">
                <Upload className="size-3.5" />
                <span>Unggah File CSV</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="flex flex-col gap-3 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="paste-area" className="font-semibold text-xs">
                  Tempel Baris Data (Format: Nama, No_HP, Kategori)
                </Label>
                <Textarea
                  id="paste-area"
                  rows={6}
                  placeholder={`Budi Santoso, 081234567890, Keluarga\nSiti Rahmawati, 082198765432, VIP\nAhmad Dahlan, 085712345678, Teman Kantor`}
                  value={pasteContent}
                  onChange={(e) => handlePasteChange(e.target.value)}
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Format per baris: <code>Nama, Nomor_WhatsApp, Kategori</code> (pisahkan dengan
                  koma atau tab).
                </p>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="flex flex-col gap-3 pt-2">
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-muted-foreground/30 border-dashed p-8 text-center transition-colors hover:bg-muted/10">
                <Upload className="mb-2 size-8 text-muted-foreground" />
                <p className="font-semibold text-foreground text-xs">
                  Pilih berkas CSV atau teks
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Mendukung berkas .csv dan .txt UTF-8
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <label className="inline-flex cursor-pointer">
                    <Button size="sm" className="pointer-events-none">
                      Pilih Berkas CSV
                    </Button>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadSampleCsv}
                    className="gap-1.5 text-xs"
                  >
                    <Download className="size-3.5" />
                    <span>Contoh CSV</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {parsedGuests.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">
                  Pratinjau Tamu ({parsedGuests.length} orang)
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Siap Diimpor
                </Badge>
              </div>

              <div className="max-h-40 overflow-y-auto rounded-lg border bg-background">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="p-2 text-[10px] uppercase">#</TableHead>
                      <TableHead className="p-2 text-[10px] uppercase">
                        Nama Tamu
                      </TableHead>
                      <TableHead className="p-2 text-[10px] uppercase">
                        No. WhatsApp
                      </TableHead>
                      <TableHead className="p-2 text-[10px] uppercase">
                        Kategori
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedGuests.map((g, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/20">
                        <TableCell className="p-2 text-[10px] text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="p-2 font-medium text-foreground">
                          {g.name}
                        </TableCell>
                        <TableCell className="p-2 font-mono text-[11px] text-muted-foreground">
                          {g.phone || "-"}
                        </TableCell>
                        <TableCell className="p-2 text-muted-foreground">
                          {g.category || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-col items-center justify-between gap-2 border-t pt-3 sm:flex-row">
          <span className="text-[11px] text-muted-foreground">
            Total terdeteksi: <strong>{parsedGuests.length}</strong> tamu
          </span>

          <div className="flex items-center gap-2">
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Batal
            </DialogClose>
            <Button
              size="sm"
              onClick={handleImportSubmit}
              disabled={parsedGuests.length === 0 || batchCreateMutation.isPending}
              className="gap-1.5"
            >
              {batchCreateMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Mengimpor...</span>
                </>
              ) : (
                <>
                  <Users className="size-3.5" />
                  <span>Impor {parsedGuests.length} Tamu</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
