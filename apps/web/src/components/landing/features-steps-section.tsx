import { Badge } from "@senara/ui/components/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@senara/ui/components/card";

import { FEATURES, STEPS } from "./landing-data";

export function FeaturesStepsSection() {
  return (
    <>
      <section id="fitur" className="border-b bg-muted/20 py-14 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-2.5 text-center sm:mb-14 sm:gap-3">
            <Badge
              variant="outline"
              className="border-primary/30 text-xs tracking-wider text-primary uppercase"
            >
              Fitur Lengkap
            </Badge>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Semua yang Anda Butuhkan untuk Momen Teristimewa
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              Dari pengeditan visual hingga distribusi pesan ke ratusan tamu,
              Senara dirancang untuk kemudahan maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="flex flex-col justify-between p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:p-6"
                >
                  <CardHeader className="gap-2.5 p-0 sm:gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-11">
                        <Icon className="size-5" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold"
                      >
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="mt-1.5 text-base font-bold tracking-tight text-foreground sm:mt-2 sm:text-lg">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="border-b py-14 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-2.5 text-center sm:mb-14 sm:gap-3">
            <Badge
              variant="outline"
              className="border-primary/30 text-xs tracking-wider text-primary uppercase"
            >
              Alur Cepat
            </Badge>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Tiga Langkah Mudah Menuju Hari Bahagia
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              Tidak butuh waktu berhari-hari. Publikasikan undangan Anda dalam
              hitungan menit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {STEPS.map((item) => (
              <Card
                key={item.step}
                className="relative border-dashed p-5 transition-colors hover:border-solid hover:border-primary/40 sm:p-6"
              >
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <span className="font-mono text-2xl font-extrabold text-primary/30 sm:text-3xl">
                    {item.step}
                  </span>
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    ✓
                  </div>
                </div>
                <h3 className="mb-1.5 font-serif text-base font-bold text-foreground sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

