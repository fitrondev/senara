# 📏 Standar Koding & Konvensi Senara

Dokumen ini mendefinisikan aturan penulisan kode, konvensi penamaan, dan pola arsitektur yang **wajib dipatuhi** oleh developer dan AI coding assistant saat memprogram di repositori **Senara**.

---

## 1. Prinsip Utama (Core Principles)

1. **Strict Type Safety:** Tidak ada kompromi untuk `any`. Gunakan `unknown` jika tipe belum diketahui, lalu persempit dengan tipe guard atau Zod schema.
2. **Keterbacaan di Atas Kelihaian (*Readability over Cleverness*):** Tulis kode yang mudah dipahami oleh anggota tim lain dan mudah dianalisis oleh AI dalam sesi berikutnya.
3. **Single Responsibility Principle (SRP):** Setiap komponen React, router procedure, atau modul utilitas hanya boleh bertanggung jawab atas satu hal spesifik.
4. **Pencegahan Akses Ilegal (IDOR Protection by Default):** Setiap operasi mutasi data wajib memvalidasi kepemilikan resource (`userId: ctx.auth.userId`).

---

## 2. Konvensi Penamaan (Naming Conventions)

| Kategori | Konvensi | Contoh |
|---|---|---|
| **Berkas Komponen React** | `kebab-case.tsx` | `invitation-card.tsx`, `cover-gate.tsx` |
| **Fungsi Komponen React** | `PascalCase` | `function InvitationCard() {}` |
| **Berkas Hooks** | `use-kebab-case.ts` | `use-audio-player.ts`, `use-canvas-scale.ts` |
| **Fungsi Hooks** | `camelCase` diawali `use` | `export function useAudioPlayer() {}` |
| **Berkas Router tRPC** | `kebab-case.ts` | `invitation.ts`, `guest.ts`, `rsvp.ts` |
| **Variabel Router tRPC** | `camelCase` diakhiri `Router` | `export const invitationRouter = router({ ... })` |
| **Model Prisma** | `PascalCase` tunggal | `Invitation`, `Guest`, `RSVPResponse` |
| **Kolom Database** | `camelCase` | `invitationId`, `guestName`, `isMusicAutoplay` |
| **Nilai Enum** | `SCREAMING_SNAKE_CASE` | `DRAFT`, `PUBLISHED`, `NOT_ATTENDING` |
| **Interface / Type Props** | `PascalCase` diakhiri `Props` | `interface CoverGateProps {}` |

---

## 3. Standar Komponen React & Next.js

### 3.1 Pembagian Server vs Client Components
- Buat komponen sebagai **Server Component (RSC)** secara default.
- Gunakan direktif `"use client"` **hanya** jika komponen membutuhkan:
  - React State (`useState`, `useReducer`) atau Lifecycle (`useEffect`).
  - Event listener (`onClick`, `onChange`, `onSubmit`).
  - Browser API (`window`, `localStorage`, `Audio()`, `navigator.clipboard`).
  - Hooks tRPC / React Query klien (`trpc.useQuery`, `trpc.useMutation`).

### 3.2 Struktur File Komponen
```tsx
// 1. Direktif (jika ada)
"use client";

// 2. Impor pustaka eksternal
import * as React from "react";
import { Copy, Check } from "lucide-react";

// 3. Impor internal monorepo (@senara/ui, @senara/api, utils)
import { Button } from "@senara/ui/components/button";
import { cn } from "@senara/ui/lib/utils";

// 4. Deklarasi Tipe / Props Interface
interface BankAccountCardProps {
  bankName: string;
  accountNo: string;
  accountName: string;
  className?: string;
}

// 5. Fungsi Komponen Utama (Exported)
export function BankAccountCard({
  bankName,
  accountNo,
  accountName,
  className,
}: BankAccountCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [accountNo]);

  return (
    <div className={cn("p-4 rounded-xl border bg-card text-card-foreground", className)}>
      <p className="font-semibold">{bankName}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-lg">{accountNo}</span>
        <Button size="sm" variant="outline" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">a.n. {accountName}</p>
    </div>
  );
}
```

---

## 4. Standar Styling dengan Tailwind CSS v4

1. **Semantic Color Tokens:** Selalu gunakan token tema CSS variables daripada warna hardcoded.
   - ✅ `bg-background text-foreground`, `text-muted-foreground`, `bg-primary text-primary-foreground`
   - ❌ `bg-[#ffffff] text-[#111111]`
2. **Penggabungan Kelas Dinamis:** Selalu gunakan utility `cn()` dari `@senara/ui` saat melakukan penggabungan kelas kondisional:
   ```tsx
   className={cn("base-class", isActive && "active-class", className)}
   ```
3. **Responsive Mobile-First:** Gunakan pendekatan mobile-first (`w-full md:w-auto`, `flex-col sm:flex-row`).

---

## 5. Standar Router tRPC & Penanganan Kesalahan (Error Handling)

### 5.1 Proteksi Kepemilikan & Validasi Input
Setiap mutasi wajib menyertakan validasi skema Zod dan pemeriksaan kepemilikan pengguna:

```typescript
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../index";

export const invitationRouter = router({
  updateSlug: protectedProcedure
    .input(
      z.object({
        invitationId: z.string().cuid(),
        newSlug: z
          .string()
          .min(3)
          .max(50)
          .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan strip (-)"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Verifikasi kepemilikan undangan
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id: input.invitationId,
          userId: ctx.auth.userId, // Mencegah IDOR
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }

      // 2. Cek ketersediaan slug unik
      const existingSlug = await ctx.db.invitation.findUnique({
        where: { slug: input.newSlug },
      });

      if (existingSlug && existingSlug.id !== input.invitationId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tautan/slug ini sudah digunakan oleh undangan lain. Silakan pilih slug lain.",
        });
      }

      // 3. Mutasi database
      return await ctx.db.invitation.update({
        where: { id: input.invitationId },
        data: { slug: input.newSlug },
      });
    }),
});
```

### 5.2 Pemilihan Kode Error tRPC
- `UNAUTHORIZED`: Pengguna belum login atau token sesi kedaluwarsa.
- `FORBIDDEN`: Pengguna login trivial mencoba mengakses resource yang bukan miliknya.
- `NOT_FOUND`: Data yang diminta tidak ditemukan di database.
- `BAD_REQUEST`: Payload gagal validasi bisnis.
- `CONFLICT`: Pelanggaran constraint unik (misal: slug ganda).

---

## 6. Standar Performa Vercel (Vercel React Best Practices)

Seluruh komponen React dan halaman Next.js wajib mematuhi 8 pilar performa dari Vercel Engineering:

### 6.1 Menghilangkan Waterfall (Eliminating Waterfalls - CRITICAL)
- **`async-parallel`:** Gunakan `Promise.all()` untuk pemanggilan data independen, hindari `await` berurutan yang saling menunggu tanpa ketergantungan.
- **`async-cheap-condition-before-await`:** Periksa kondisi sinkron sederhana sebelum menunggu remote fetch / database query.
- **`async-suspense-boundaries`:** Gunakan `<Suspense>` untuk streaming konten lambat secara bertahap daripada memblokir keseluruhan halaman.

### 6.2 Optimasi Ukuran Bundle (Bundle Size Optimization - CRITICAL)
- **`bundle-barrel-imports`:** Impor langsung dari modul spesifik, hindari mengimpor dari *barrel file* masif yang dapat menggelembungkan bundle.
- **`bundle-dynamic-imports`:** Gunakan `next/dynamic` untuk komponen berat yang hanya muncul saat interaksi (misal: modal editor kompleks, date picker besar).
- **`bundle-defer-third-party`:** Tunda pustaka analitik atau devtools (hanya muat `ReactQueryDevtools` di lingkungan `development`).

### 6.3 Performa Server-Side (Server-Side Performance - HIGH)
- **`server-hoist-static-io`:** Hoist objek/array konstan (navigasi, teks statis, konfigurasi font) ke tingkat modul di luar fungsi render komponen.
- **`server-serialization`:** Minimalkan payload yang dioper dari Server Component ke Client Component (jangan mengoper seluruh objek database jika klien hanya butuh 2 field).
- **Push Client Boundaries Down:** Pertahankan layout dan kontainer sebagai Server Component, dan jadikan hanya leaf nodes interaktif sebagai `"use client"`.

### 6.4 Optimasi Re-render & Rendering (MEDIUM)
- **`rendering-conditional-render`:** Gunakan operator ternary (`condition ? <Component /> : null`), hindari `condition && <Component />` yang berisiko merender nilai `0` atau `false` ke DOM.
- **`rerender-functional-setstate`:** Gunakan functional update `setState((prev) => ...)` untuk menghindari dependensi closure yang tidak stabil.
- **`rerender-no-inline-components`:** Dilarang mendeklarasikan komponen React di dalam fungsi render komponen lain.


