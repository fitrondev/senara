import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

import "../index.css";
import { Inter } from "next/font/google";
import { cn } from "@senara/ui/lib/utils";

import Providers from "@/components/providers";
import { TooltipProvider } from "@senara/ui/components/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "senara",
  description: "senara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={cn("antialiased", inter.variable)}>
        <ClerkProvider>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
