# 🤖 Senara Agent Instructions (Workspace Root)

Petunjuk utama untuk seluruh agen AI (Antigravity, Cursor, Claude Code, Copilot, Windsurf) yang mengoperasikan repositori **Senara**.

Panduan ini merujuk secara terpusat ke dokumentasi teknis di direktori `docs/`:

- 📋 [**docs/AGENT.md**](file:///d:/senara/docs/AGENT.md) — Panduan utama agen, guardrails monorepo, anti-halusinasi, arsitektur modular/DRY, strict typing, dan cheat sheet implementasi tRPC/Prisma.
- 📖 [**docs/PRD.md**](file:///d:/senara/docs/PRD.md) — Spesifikasi produk lengkap (Fitur "Isian Kamu", Cover Gate audio autoplay, Amplop Digital, RSVP, Personalisasi Tamu).
- 🏛️ [**docs/ARCHITECTURE.md**](file:///d:/senara/docs/ARCHITECTURE.md) — Arsitektur sistem, alur data tRPC, arsitektur visual editor, dan slot isian dinamis.
- 🛠️ [**docs/TECH_STACK.md**](file:///d:/senara/docs/TECH_STACK.md) — Dependensi, environment variables, dan perintah CLI Bun/Turbo.
- 📏 [**docs/CODING_STANDARDS.md**](file:///d:/senara/docs/CODING_STANDARDS.md) — Standar kode TypeScript, React, Tailwind CSS v4, modularitas komponen, dan error handling.
- 🗄️ [**docs/DATABASE_SCHEMA.md**](file:///d:/senara/docs/DATABASE_SCHEMA.md) — Skema Prisma relasional, ERD, indeks performa, dan panduan migrasi MySQL.
- 📝 [**docs/TASKS.md**](file:///d:/senara/docs/TASKS.md) — Backlog tugas pengembangan mikro (_bite-sized tasks_) siap eksekusi.
- 🚀 [**docs/VIBE_CODING_GUIDE.md**](file:///d:/senara/docs/VIBE_CODING_GUIDE.md) — Playbook vibe coding, alur 4 langkah, dan template prompt.

---

## 🛡️ Aturan Singkat Agen (Mandatory Guardrails)

1. **Anti-Halusinasi (Zero Hallucination):** Selalu baca dan verifikasi file target, skema Prisma, router tRPC, dan kontrak prop `@senara/ui` sebelum menulis kode. Jangan mengarang API atau prop yang belum terverifikasi.
2. **Modular & Reusable (No God Files & DRY):**
   - Jangan menumpuk kode di 1 file panjang (> 250–300 baris). Pecah halaman/fitur besar menjadi sub-komponen, dialog/modal, konstanta, dan tipe terpisah.
   - Gunakan komponen bersama di `apps/web/src/components/shared/` (`PageHeader`, `StatCard`, `EmptyState`, `ConfirmDeleteDialog`, `SearchFilterBar`) dan utilitas terpusat di `apps/web/src/lib/format.ts` agar tidak berulang-ulang ditulis di setiap file.
   - Gunakan seluruh primitif `@senara/ui` (`Select`, `Tabs`, `Slider`, `Dialog`, `AlertDialog`, `sonner` `toast`).
3. **Mode Eksekusi Otonom:** Langsung kerjakan tugas terdefinisi tanpa mengajukan pertanyaan berulang di akhir giliran.
4. **Hormati Batas Monorepo:** Prisma di `packages/db`, tRPC di `packages/api`, UI primitif di `packages/ui`, Web App di `apps/web`.
5. **Strict Type Safety:** Tidak ada `any`. Gunakan Zod dan inferensi tRPC/Prisma.
6. **Pencegahan IDOR:** Selalu validasi `userId: ctx.auth.userId` pada setiap mutasi data pengguna.
7. **Vercel React Best Practices:** Gunakan Server Components secara bawaan, dorong `"use client"` ke leaf node terendah, gunakan `next/dynamic` untuk modal berat, hoist objek statis ke luar komponen, gunakan ternary (`cond ? <A /> : null`), dan eliminasi waterfall data fetching.
8. **Verifikasi Wajib:** Selalu jalankan `bun run check-types` setelah melakukan modifikasi kode.
