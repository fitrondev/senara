import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@senara/ui/components/accordion";
import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card } from "@senara/ui/components/card";

import { FAQS, TESTIMONIALS } from "./landing-data";

const FIVE_STARS = [0, 1, 2, 3, 4] as const;

export function TestimonialsFaqSection() {
  return (
    <>
      <section className="border-b bg-muted/20 py-14 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-2.5 text-center sm:mb-14 sm:gap-3">
            <Badge
              variant="outline"
              className="border-primary/30 text-xs tracking-wider text-primary uppercase"
            >
              Kisah Bahagia
            </Badge>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Dipercaya Pasangan Pengantin & Vendor Pernikahan
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              Pengalaman nyata mereka yang telah mempercayakan momen sakralnya
              bersama Senara.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.author}
                className="flex flex-col justify-between p-5 sm:p-6"
              >
                <div>
                  <div className="mb-3.5 flex items-center gap-1 text-amber-500 sm:mb-4">
                    {FIVE_STARS.map((i) => (
                      <Star key={i} className="size-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <p className="mb-5 text-xs leading-relaxed text-foreground italic sm:mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t pt-3.5 sm:pt-4">
                  <p className="font-serif text-xs font-bold text-foreground">
                    {t.author}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {t.event}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-b py-14 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col items-center gap-2.5 text-center sm:mb-14 sm:gap-3">
            <Badge
              variant="outline"
              className="border-primary/30 text-xs tracking-wider text-primary uppercase"
            >
              Tanya Jawab
            </Badge>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Semua jawaban atas keraguan Anda seputar undangan digital Senara.
            </p>
          </div>

          <Accordion className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="py-3.5 text-left text-xs font-semibold text-foreground sm:py-4 sm:text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-xs leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-primary py-12 text-primary-foreground sm:py-16 md:py-20">
        <div className="container mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center sm:gap-6 sm:px-6">
          <Badge
            variant="secondary"
            className="border-none bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-widest text-white uppercase backdrop-blur sm:text-xs"
          >
            Mulai Hari Ini
          </Badge>

          <h2 className="font-serif text-2xl leading-snug font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Siap Membuat Undangan Pernikahan Impian Anda?
          </h2>

          <p className="max-w-xl text-xs leading-relaxed text-white/85 sm:text-sm md:text-base">
            Bergabunglah bersama ribuan pasangan lain. Buat, sesuaikan, dan
            kirimkan undangan digital Anda dalam waktu kurang dari 10 menit.
          </p>

          <div className="flex w-full flex-col items-center gap-3 pt-1 sm:w-auto sm:flex-row sm:pt-2">
            <Button
              size="lg"
              className="w-full bg-white text-xs font-semibold text-zinc-950 shadow-xl hover:bg-white/90 sm:w-auto sm:text-sm"
              render={<Link href="/dashboard" />}
            >
              <span>Daftar & Buat Undangan Sekarang</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

