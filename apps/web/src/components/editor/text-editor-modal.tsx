"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Palette,
  RotateCcw,
  Sparkles,
  Strikethrough,
  Underline,
} from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@senara/ui/components/tabs";
import { Textarea } from "@senara/ui/components/textarea";

// Palet warna kurasi elegan untuk undangan pernikahan & pesta
const COLOR_PRESETS = [
  { name: "Default Teks", color: "#1e293b", bgClass: "bg-slate-800" },
  { name: "Emas Mewah", color: "#d4af37", bgClass: "bg-amber-400" },
  { name: "Rose Gold", color: "#b76e79", bgClass: "bg-rose-400" },
  { name: "Cokelat Bumi", color: "#78350f", bgClass: "bg-amber-900" },
  { name: "Emerald", color: "#065f46", bgClass: "bg-emerald-700" },
  { name: "Navy Mewah", color: "#1e3a8a", bgClass: "bg-blue-900" },
  { name: "Merah Marun", color: "#991b1b", bgClass: "bg-red-800" },
  { name: "Abu Elegan", color: "#64748b", bgClass: "bg-slate-500" },
  { name: "Putih", color: "#ffffff", bgClass: "bg-white border" },
] as const;

export interface TextEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field?: string;
  fieldName?: string;
  label?: string;
  fieldLabel?: string;
  initialValue: string;
  onSave: (field: string, value: string) => void;
}

export function TextEditorModal({
  open,
  onOpenChange,
  field,
  fieldName,
  label,
  fieldLabel,
  initialValue,
  onSave,
}: TextEditorModalProps) {
  const resolvedField = field || fieldName || "text";
  const resolvedLabel = label || fieldLabel || "Teks";
  const [content, setContent] = useState<string>(initialValue);
  const [selectedColor, setSelectedColor] = useState<string>("#1e293b");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center"
  );
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrike, setIsStrike] = useState<boolean>(false);
  const [headingLevel, setHeadingLevel] = useState<
    "normal" | "h1" | "h2" | "h3"
  >("normal");

  // Ekstrak warna dan teks polos jika ada tag span style
  useEffect(() => {
    if (!open) return;
    setContent(initialValue);

    // Deteksi jika initialValue memuat warna
    const colorMatch = initialValue.match(/color:\s*([^;"'>]+)/i);
    if (colorMatch?.[1]) {
      setSelectedColor(colorMatch[1].trim());
    } else {
      setSelectedColor("#1e293b");
    }

    // Deteksi tag tebal, miring, dsb
    setIsBold(/<\/?(b|strong)>/i.test(initialValue));
    setIsItalic(/<\/?(i|em)>/i.test(initialValue));
    setIsUnderline(/<\/?u>/i.test(initialValue));
    setIsStrike(/<\/?(s|del|strike)>/i.test(initialValue));

    if (/<h1/i.test(initialValue)) setHeadingLevel("h1");
    else if (/<h2/i.test(initialValue)) setHeadingLevel("h2");
    else if (/<h3/i.test(initialValue)) setHeadingLevel("h3");
    else setHeadingLevel("normal");

    // Deteksi align
    if (/text-left|text-align:\s*left/i.test(initialValue))
      setTextAlign("left");
    else if (/text-right|text-align:\s*right/i.test(initialValue))
      setTextAlign("right");
    else setTextAlign("center");
  }, [initialValue, open]);

  // Hapus tag HTML pembungkus untuk input teks bersih
  const rawText = useMemo(() => {
    return content.replace(/<[^>]*>?/gm, "").trim();
  }, [content]);

  // Generate output HTML berformat
  const formattedHtml = useMemo(() => {
    let result = rawText || initialValue;

    if (isBold) result = `<strong>${result}</strong>`;
    if (isItalic) result = `<em>${result}</em>`;
    if (isUnderline) result = `<u>${result}</u>`;
    if (isStrike) result = `<s>${result}</s>`;

    const styleParts: string[] = [];
    if (selectedColor && selectedColor !== "#1e293b") {
      styleParts.push(`color: ${selectedColor}`);
    }
    if (textAlign !== "center") {
      styleParts.push(`text-align: ${textAlign}`);
    }

    if (styleParts.length > 0) {
      result = `<span style="${styleParts.join("; ")}">${result}</span>`;
    }

    if (headingLevel === "h1") result = `<h1>${result}</h1>`;
    else if (headingLevel === "h2") result = `<h2>${result}</h2>`;
    else if (headingLevel === "h3") result = `<h3>${result}</h3>`;

    return result;
  }, [
    rawText,
    initialValue,
    isBold,
    isItalic,
    isUnderline,
    isStrike,
    selectedColor,
    textAlign,
    headingLevel,
  ]);

  const handleSave = () => {
    onSave(resolvedField, formattedHtml);
    onOpenChange(false);
  };

  const handleReset = () => {
    setContent(initialValue.replace(/<[^>]*>?/gm, ""));
    setSelectedColor("#1e293b");
    setTextAlign("center");
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setIsStrike(false);
    setHeadingLevel("normal");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Sparkles className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-serif text-lg">
                Edit Teks & Warna
              </DialogTitle>
              <DialogDescription className="text-xs">
                Format font, ubah warna, dan atur perataan teks pada elemen{" "}
                <strong className="text-foreground">{resolvedLabel}</strong>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" className="text-xs">
              Form Teks & Format
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1.5 text-xs">
              <Eye className="size-3.5" />
              <span>Pratinjau Hasil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4 pt-3">
            {/* Toolbar Format Teks */}
            <div className="bg-muted/30 flex flex-wrap items-center gap-1.5 rounded-xl border p-2 text-xs">
              {/* Gaya Teks */}
              <div className="flex items-center gap-1 border-r pr-2">
                <Button
                  type="button"
                  variant={isBold ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setIsBold(!isBold)}
                  title="Tebal (Bold)"
                >
                  <Bold className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={isItalic ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setIsItalic(!isItalic)}
                  title="Miring (Italic)"
                >
                  <Italic className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={isUnderline ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setIsUnderline(!isUnderline)}
                  title="Garis Bawah (Underline)"
                >
                  <Underline className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={isStrike ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setIsStrike(!isStrike)}
                  title="Coret (Strikethrough)"
                >
                  <Strikethrough className="size-3.5" />
                </Button>
              </div>

              {/* Ukuran / Heading */}
              <div className="flex items-center gap-1 border-r pr-2">
                <Button
                  type="button"
                  variant={headingLevel === "normal" ? "secondary" : "ghost"}
                  size="xs"
                  className="h-7 px-2 text-[11px]"
                  onClick={() => setHeadingLevel("normal")}
                >
                  Normal
                </Button>
                <Button
                  type="button"
                  variant={headingLevel === "h1" ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() =>
                    setHeadingLevel(headingLevel === "h1" ? "normal" : "h1")
                  }
                  title="Judul Utama (H1)"
                >
                  <Heading1 className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={headingLevel === "h2" ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() =>
                    setHeadingLevel(headingLevel === "h2" ? "normal" : "h2")
                  }
                  title="Sub-judul (H2)"
                >
                  <Heading2 className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={headingLevel === "h3" ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() =>
                    setHeadingLevel(headingLevel === "h3" ? "normal" : "h3")
                  }
                  title="Judul Kecil (H3)"
                >
                  <Heading3 className="size-3.5" />
                </Button>
              </div>

              {/* Perataan Teks (Alignment) */}
              <div className="flex items-center gap-1 border-r pr-2">
                <Button
                  type="button"
                  variant={textAlign === "left" ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setTextAlign("left")}
                  title="Rata Kiri"
                >
                  <AlignLeft className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={textAlign === "center" ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setTextAlign("center")}
                  title="Rata Tengah"
                >
                  <AlignCenter className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={textAlign === "right" ? "default" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setTextAlign("right")}
                  title="Rata Kanan"
                >
                  <AlignRight className="size-3.5" />
                </Button>
              </div>

              {/* Reset Formatting */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-7"
                onClick={handleReset}
                title="Kembalikan ke Teks Polos"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>

            {/* Pilihan Warna Teks (Color Picker) */}
            <div className="space-y-2 rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-xs font-semibold">
                  <Palette className="text-primary size-3.5" />
                  <span>Pilihan Warna Teks</span>
                </Label>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-4 rounded-full border shadow-2xs"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-muted-foreground font-mono text-xs uppercase">
                    {selectedColor}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected =
                    selectedColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setSelectedColor(preset.color)}
                      title={preset.name}
                      className={`relative flex size-7 items-center justify-center rounded-full transition-transform hover:scale-110 ${preset.bgClass} ${
                        isSelected ? "ring-primary ring-2 ring-offset-2" : ""
                      }`}
                    >
                      {isSelected ? (
                        <Check
                          className={`size-3.5 ${
                            preset.color === "#ffffff"
                              ? "text-slate-900"
                              : "text-white"
                          }`}
                        />
                      ) : null}
                    </button>
                  );
                })}

                {/* Custom Native Color Picker */}
                <div className="relative flex items-center">
                  <input
                    type="color"
                    id="custom-text-color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="absolute inset-0 size-7 cursor-pointer opacity-0"
                    title="Pilih Warna Kustom Lainnya"
                  />
                  <div className="border-primary text-primary hover:bg-primary/10 flex size-7 items-center justify-center rounded-full border border-dashed">
                    <span className="text-[10px] font-bold">+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Pengetikan Teks */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Isi Teks</Label>
              <Textarea
                rows={4}
                value={rawText}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ketik teks undangan di sini..."
                className="text-xs leading-relaxed"
              />
            </div>
          </TabsContent>

          {/* Tab Pratinjau Teks */}
          <TabsContent value="preview" className="space-y-4 pt-3">
            <div className="bg-muted/10 rounded-2xl border p-6 text-center">
              <p className="text-muted-foreground mb-3 text-xs">
                Berikut pratinjau tampilan teks Anda dengan format dan warna
                terpilih:
              </p>
              <div
                className="bg-card rounded-xl border p-6 shadow-xs"
                style={{
                  color: selectedColor,
                  textAlign,
                }}
              >
                <div
                  className={`font-serif leading-relaxed ${
                    headingLevel === "h1"
                      ? "text-2xl font-bold sm:text-3xl"
                      : headingLevel === "h2"
                        ? "text-xl font-bold sm:text-2xl"
                        : headingLevel === "h3"
                          ? "text-lg font-semibold"
                          : "text-sm"
                  } ${isBold ? "font-bold" : ""} ${isItalic ? "italic" : ""} ${
                    isUnderline ? "underline" : ""
                  } ${isStrike ? "line-through" : ""}`}
                >
                  {rawText || "Pratinjau Teks Kosong"}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="gap-1.5 text-xs"
          >
            <Check className="size-3.5" />
            <span>Terapkan Perubahan</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
