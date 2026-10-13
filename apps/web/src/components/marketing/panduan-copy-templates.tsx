"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@senara/ui/components/tabs";

// Vercel Best Practice: Hoist static copywriting templates outside component
const COPYWRITING_TEMPLATES = [
  {
    id: "ISLAMI",
    label: "Nuansa Islami",
    badge: "Paling Banyak Dipakai",
    opening:
      "Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nMaha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami merangkaikan kasih sayang yang Kau ciptakan dalam ikatan suci pernikahan putra-putri kami.",
    whatsappMessage: `Kepada Yth.
*{{guest_name}}*

Assalamu'alaikum Wr. Wb.
Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.

Detail acara dan lokasi dapat dilihat pada tautan berikut:
{{invitation_url}}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
Wassalamu'alaikum Wr. Wb.`,
  },
  {
    id: "UMUM",
    label: "Umum & Hangat",
    badge: "Universal",
    opening:
      "Tuhan membuat segala sesuatu indah pada waktunya. Indah saat Dia mempertemukan, indah saat Dia menumbuhkan kasih, dan indah saat Dia mempersatukan kami dalam ikatan pernikahan yang kudus.",
    whatsappMessage: `Kepada Yth.
*{{guest_name}}*

Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk berbagi kebahagiaan di hari pernikahan kami.

Silakan klik tautan berikut untuk membuka undangan digital kami:
{{invitation_url}}

Kehadiran dan doa restu Anda adalah kado terindah bagi langkah awal keluarga kecil kami. Terima kasih.`,
  },
  {
    id: "FORMAL",
    label: "Resmi & Formal",
    badge: "Tamu VIP / Kolega",
    opening:
      "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami yang akan dilaksanakan pada:",
    whatsappMessage: `Yth. *{{guest_name}}*
Di Tempat

Dengan hormat,
Melalui pesan singkat ini, kami mengharapkan kehadiran Bapak/Ibu pada acara Resepsi Pernikahan kami. Informasi lengkap mengenai waktu dan tempat acara tertera pada tautan undangan resmi berikut:

{{invitation_url}}

Atas perhatian dan kehadiran Bapak/Ibu, kami haturkan terima kasih yang sebesar-besarnya.`,
  },
  {
    id: "SANTAI",
    label: "Santai (Sahabat)",
    badge: "Teman Dekat",
    opening:
      "Setelah perjalanan panjang penuh cerita, tawa, dan doa, akhirnya kami tiba di babak baru. Kami ingin merayakan hari bahagia ini bersama orang-orang terdekat yang selalu mendukung langkah kami.",
    whatsappMessage: `Halo *{{guest_name}}*! ✨

Akhirnya hari yang ditunggu tiba juga! Kami mengundangmu untuk datang dan seru-seruan bareng di acara pernikahan kami.

Cek jadwal, lokasi, dan isi konfirmasi kehadiranmu (RSVP) di link ini ya:
{{invitation_url}}

Ditunggu banget kehadirannya, sampai ketemu di sana!`,
  },
] as const;

export function PanduanCopyTemplates() {
  const [activeTab, setActiveTab] = useState<string>("ISLAMI");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success("Teks berhasil disalin ke papan klip!");
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error("Gagal menyalin teks.");
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        if (val) setActiveTab(val);
      }}
      className="w-full"
    >
      <TabsList className="flex flex-wrap justify-start gap-1">
        {COPYWRITING_TEMPLATES.map((tpl) => (
          <TabsTrigger key={tpl.id} value={tpl.id} className="text-xs">
            {tpl.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {COPYWRITING_TEMPLATES.map((tpl) => (
        <TabsContent key={tpl.id} value={tpl.id} className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="flex flex-col justify-between p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">
                    Kalimat Pembuka di Undangan
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {tpl.badge}
                  </Badge>
                </div>
                <p className="whitespace-pre-line rounded-xl bg-muted/40 p-3.5 text-foreground/90 text-xs leading-relaxed">
                  {tpl.opening}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(`${tpl.id}-open`, tpl.opening)}
                className="mt-4 w-fit gap-1.5 text-xs"
              >
                {copiedKey === `${tpl.id}-open` ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>Salin Kalimat Pembuka</span>
              </Button>
            </Card>

            <Card className="flex flex-col justify-between p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">
                    Format Pengantar WhatsApp
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Siap Kirim WA
                  </Badge>
                </div>
                <p className="whitespace-pre-line rounded-xl bg-emerald-500/5 p-3.5 font-mono text-foreground/90 text-xs leading-relaxed">
                  {tpl.whatsappMessage}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(`${tpl.id}-wa`, tpl.whatsappMessage)}
                className="mt-4 w-fit gap-1.5 text-xs"
              >
                {copiedKey === `${tpl.id}-wa` ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>Salin Format WhatsApp</span>
              </Button>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

