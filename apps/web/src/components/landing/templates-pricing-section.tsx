import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { Card, CardContent, CardFooter } from "@senara/ui/components/card";
import { Separator } from "@senara/ui/components/separator";
import { cn } from "@senara/ui/lib/utils";

import { PRICING_PLANS, TEMPLATES_PREVIEW } from "./landing-data";

export function TemplatesPricingSection() {
  return (
    <>
      <section id="template" className="border-b bg-muted/20 py-14 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:mb-14 sm:flex-row">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <Badge
                variant="outline"
                className="mx-auto w-fit border-primary/30 text-xs tracking-wider text-primary uppercase sm:mx-0"
              >
                Katalog Desain
              </Badge>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Koleksi Template Elegan
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Dirancang khusus dengan estetika premium yang memikat mata
                setiap tamu.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs font-semibold sm:w-auto"
              render={<Link href="/dashboard/templates" />}
            >
              <span>Lihat Semua Template</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {TEMPLATES_PREVIEW.map((tpl) => (
              <Card
                key={tpl.id}
                className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="relative flex h-40 w-full flex-col justify-between p-5 text-white sm:h-44"
                  style={{ backgroundColor: tpl.color }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-[10px] text-white backdrop-blur"
                    >
                      {tpl.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-white/20 bg-black/30 text-[10px] text-white"
                    >
                      {tpl.tag}
                    </Badge>
                  </div>
                  <div className="font-serif text-lg leading-tight font-bold drop-shadow-sm">
                    {tpl.name}
                  </div>
                </div>

                <CardContent className="flex flex-1 flex-col gap-2 px-5 pt-5 pb-4">
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {tpl.description}
                  </p>
                </CardContent>

                <CardFooter className="px-5 pt-0 pb-5">
                  <Button
                    size="sm"
                    className="w-full text-xs font-semibold"
                    render={<Link href={`/template/${tpl.id}` as Route} />}
                  >
                    <span>Lihat Contoh & Pakai</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="harga" className="border-b py-14 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-2.5 text-center sm:mb-14 sm:gap-3">
            <Badge
              variant="outline"
              className="border-primary/30 text-xs tracking-wider text-primary uppercase"
            >
              Paket & Biaya
            </Badge>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Investasi Terjangkau, Tanpa Biaya Tersembunyi
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              Pilih paket yang paling sesuai dengan kebutuhan perayaan
              pernikahan Anda.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-6 pt-2 md:grid-cols-2 lg:gap-8">
            {PRICING_PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative flex flex-col justify-between p-6 pt-8 transition-all duration-300 sm:p-7 sm:pt-8",
                  plan.popular
                    ? "border-primary bg-card shadow-xl ring-2 ring-primary/20 lg:-translate-y-2"
                    : "border-border shadow-xs"
                )}
              >
                {plan.popular ? (
                  <Badge className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 px-3.5 py-1 text-xs font-semibold whitespace-nowrap shadow-sm">
                    Paling Populer
                  </Badge>
                ) : null}

                <div>
                  <div className="mb-5">
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      {plan.name}
                    </h3>
                    <p className="mt-1.5 min-h-[36px] text-xs leading-relaxed text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                    <span className="font-serif text-2xl font-bold tracking-tight whitespace-nowrap text-foreground sm:text-3xl">
                      {plan.price}
                    </span>
                    <span className="text-xs whitespace-nowrap text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>

                  <Separator className="mb-6" />

                  <ul className="mb-8 flex flex-col gap-3 text-xs">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="leading-relaxed text-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.variant}
                  size="default"
                  className={cn(
                    "w-full text-xs font-semibold",
                    plan.popular && "shadow-md"
                  )}
                  render={<Link href="/dashboard/billing" />}
                >
                  {plan.ctaText}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

