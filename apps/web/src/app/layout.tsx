import type { Metadata } from "next";
import { Quicksand, Libre_Baskerville, Space_Mono } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import Providers from "@/components/providers";

import "../index.css";

const fontSans = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

const fontMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Senara — Platform Undangan Digital Interaktif",
  description:
    "Buat undangan digital pernikahan, khitanan, ulang tahun, dan syukuran yang hangat dan elegan dalam hitungan menit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
