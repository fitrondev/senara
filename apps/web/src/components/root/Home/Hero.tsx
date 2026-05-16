import { Show, SignInButton } from "@clerk/nextjs";
import { Button } from "@senara/ui/components/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] relative overflow-hidden py-12 md:py-16 lg:py-0 flex items-center justify-center">
      <div className="container">
        <div className="grid items-center justify-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight leading-tight sm:text-4xl lg:text-5xl">
              Rayakan momenmu dengan Senara, memudahkanmu membuat undangan
              digital dan mudah dibagikan.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-lg lg:mx-0">
              Rancang undangan digital yang indah dan eksklusif dengan
              drag-and-drop kami yang intuitif, atau biarkan para ahli kami
              menciptakan sesuatu yang benar-benar unik untuk momen spesial
              Anda.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Show when={"signed-out"}>
                <Button size={"lg"} asChild className="w-full sm:w-auto">
                  <SignInButton mode="modal">Get Started</SignInButton>
                </Button>
              </Show>

              <Show when={"signed-in"}>
                <Button size={"lg"} asChild className="w-full sm:w-auto">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </Show>

              <Button
                asChild
                variant={"outline"}
                size={"lg"}
                className="w-full sm:w-auto"
              >
                <Link href={"/contact"}>Hubungi Kami</Link>
              </Button>
            </div>
          </div>

          <div className="hero-float motion-reduce:animate-none relative mx-auto w-full max-w-88 sm:max-w-sm lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative rounded-3xl bg-transparent p-4 sm:p-6">
              <Image
                src={"/images/Wedding-bro.svg"}
                alt="hero image senara"
                width={500}
                height={500}
                priority
                sizes="(max-width: 1024px) 80vw, 500px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
