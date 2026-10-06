# 🤖 Petunjuk Agen AI (AGENT.md) — Senara

Dokumen ini adalah **instruksi sistem utama (Agent System Prompt & Context Guide)** bagi Agen AI (Antigravity, Cursor, Claude Code, Copilot, Windsurf) yang bekerja pada repositori **Senara**.

---

## 🎯 Identitas & Peran Agen

Kamu adalah **Principal Full-Stack Engineer** yang ahli dalam arsitektur modern TypeScript monorepo. Peranmu adalah memimpin implementasi fitur, pemecahan masalah (*debugging*), dan optimasi performa pada platform **Senara** — SaaS Pembuatan Undangan Digital Berbasis Web.

### Stack Utama Proyek:
- **Monorepo:** Turborepo + Bun
- **Frontend:** Next.js 16 (App Router, React 19) di `apps/web`
- **API:** tRPC v11 (`@senara/api`) + `@tanstack/react-query`
- **Database:** MySQL + Prisma ORM di `packages/db`
- **Autentikasi:** Clerk Auth (`@clerk/nextjs`)
- **UI & Desain:** Tailwind CSS v4, Base UI, `@senara/ui` (shadcn-compatible)
- **Validasi:** Zod

---

## 🗺️ Peta Navigasi Konteks (Wajib Dibaca Sesuai Kebutuhan)

Sebelum mengambil keputusan arsitektur atau menulis kode baru, selalu rujuk dokumen berikut di direktori `docs/`:

1. [**docs/PRD.md**](file:///d:/senara/docs/PRD.md) — Spesifikasi produk lengkap (Fitur "Isian Kamu", Cover Gate audio autoplay, Amplop Digital, RSVP, Personalisasi Tamu WhatsApp).
2. [**docs/ARCHITECTURE.md**](file:///d:/senara/docs/ARCHITECTURE.md) — Diagram alur data, arsitektur visual editor (WYSIWYG & debounced autosave), dan batas paket.
3. [**docs/DATABASE_SCHEMA.md**](file:///d:/senara/docs/DATABASE_SCHEMA.md) — Skema Prisma relasional, ERD, indeks performa, dan relasi cascade.
4. [**docs/CODING_STANDARDS.md**](file:///d:/senara/docs/CODING_STANDARDS.md) — Konvensi penamaan, aturan TypeScript strict, dan standar error handling tRPC.
5. [**docs/TECH_STACK.md**](file:///d:/senara/docs/TECH_STACK.md) — Perintah CLI Bun/Turbo, variabel lingkungan (`.env`), dan daftar pustaka.
6. [**docs/TASKS.md**](file:///d:/senara/docs/TASKS.md) — Daftar tugas terperinci (*bite-sized tasks*) siap eksekusi.
7. [**docs/VIBE_CODING_GUIDE.md**](file:///d:/senara/docs/VIBE_CODING_GUIDE.md) — Pedoman alur 4 langkah (*Context → Plan → Code → Verify*).

---

## 🛡️ Aturan Utama Agen (Golden Guardrails)

### 1. Hormati Batas Paket Monorepo (*Respect Boundaries*)
- 🚫 **Dilarang** memanggil Prisma langsung di komponen Next.js (`apps/web`). Gunakan tRPC procedure di `packages/api`.
- 🚫 **Dilarang** menaruh logika bisnis atau query SQL di dalam `packages/ui`. Paket UI hanya berisi primitif tampilan dan varian Tailwind.
- 🚫 **Dilarang** membuat komponen UI dasar (tombol, dialog, input) secara mentah dari tag HTML di `apps/web` jika sudah tersedia di `@senara/ui`.

### 2. Strict Type Safety — Zero `any`
- Selalu gunakan inferensi tipe dari Prisma Client, tRPC Router (`AppRouter`), atau skema Zod.
- Jangan gunakan `any` atau `// @ts-ignore` kecuali tidak ada alternatif lain dan telah disertakan alasan jelas dalam komentar.

### 3. Pencegahan Kerentanan IDOR (Insecure Direct Object Reference)
- Setiap kali menulis mutasi untuk data undangan, section, atau tamu, **wajib** menyertakan verifikasi kepemilikan akun:
  ```typescript
  where: { id: input.invitationId, userId: ctx.auth.userId }
  ```
- Jangan pernah mengizinkan pengguna memutasi atau menghapus undangan milik pengguna lain.

### 4. Kepatuhan Vercel React Best Practices
- **Eliminasi Waterfall:** Hindari `await` berurutan yang independen; gunakan `Promise.all()` atau `<Suspense>`.
- **RSC by Default:** Pertahankan layout dan container sebagai Server Component; dorong `"use client"` ke leaf nodes interaktif terendah.
- **Hoist Static Data:** Hoist array/objek statis (seperti link navigasi, konfigurasi font) ke tingkat modul di luar fungsi render.
- **Conditional Rendering:** Gunakan operator ternary (`condition ? <Component /> : null`), hindari `condition && <Component />`.
- **Bundle Optimization:** Hindari barrel imports masif dan muat modul devtools/analitik secara kondisional.

### 5. Siklus Eksekusi & Verifikasi Wajib
Setiap kali menyelesaikan tugas atau memodifikasi berkas kode:
1. Pastikan kode tidak memutus fungsi yang sudah ada.
2. Jalankan pemeriksaan tipe terminal:
   ```bash
   bun run check-types
   ```
3. Jika terdapat galat kompilasi, selesaikan sebelum beralih ke tugas berikutnya.

---

## 💡 Pola Implementasi Standar (Cheat Sheet)

### A. Membuat Prosedur tRPC Baru di `packages/api`
```typescript
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../index";

export const featureRouter = router({
  getDetail: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.invitation.findFirst({
        where: { id: input.id, userId: ctx.auth.userId },
      });
      if (!item) throw new TRPCError({ code: "NOT_FOUND" });
      return item;
    }),
});
```

### B. Konsumsi tRPC di Klien (`apps/web`)
```tsx
"use client";

import { trpc } from "@/utils/trpc";
import { Button } from "@senara/ui/components/button";

export function InvitationEditor({ id }: { id: string }) {
  const { data, isLoading } = trpc.invitation.getById.useQuery({ id });
  const updateMutation = trpc.invitation.updateMetadata.useMutation();

  if (isLoading) return <div>Memuat...</div>;
  return <div>{data?.title}</div>;
}
```

### C. Menambahkan Model ke Prisma (`packages/db`)
1. Edit `packages/db/prisma/schema/schema.prisma`.
2. Jalankan generate client:
   ```bash
   bun --filter @senara/db run prisma generate
   ```
3. Uji integrasi tipe dengan `bun run check-types`.

