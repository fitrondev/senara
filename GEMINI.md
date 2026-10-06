# 🤖 Senara Agent Instructions (Workspace Root)

Petunjuk utama untuk seluruh agen AI (Antigravity, Cursor, Claude Code, Copilot, Windsurf) yang mengoperasikan repositori **Senara**.

Panduan ini merujuk secara terpusat ke dokumentasi teknis di direktori `docs/`:

- 📋 [**docs/AGENT.md**](file:///d:/senara/docs/AGENT.md) — Panduan utama agen, guardrails monorepo, strict typing, dan cheat sheet implementasi tRPC/Prisma.
- 📖 [**docs/PRD.md**](file:///d:/senara/docs/PRD.md) — Spesifikasi produk lengkap (Fitur "Isian Kamu", Cover Gate audio autoplay, Amplop Digital, RSVP, Personalisasi Tamu).
- 🏛️ [**docs/ARCHITECTURE.md**](file:///d:/senara/docs/ARCHITECTURE.md) — Arsitektur sistem, alur data tRPC, arsitektur visual editor, dan slot isian dinamis.
- 🛠️ [**docs/TECH_STACK.md**](file:///d:/senara/docs/TECH_STACK.md) — Dependensi, environment variables, dan perintah CLI Bun/Turbo.
- 📏 [**docs/CODING_STANDARDS.md**](file:///d:/senara/docs/CODING_STANDARDS.md) — Standar kode TypeScript, React, Tailwind CSS v4, dan error handling.
- 🗄️ [**docs/DATABASE_SCHEMA.md**](file:///d:/senara/docs/DATABASE_SCHEMA.md) — Skema Prisma relasional, ERD, indeks performa, dan panduan migrasi MySQL.
- 📝 [**docs/TASKS.md**](file:///d:/senara/docs/TASKS.md) — Backlog tugas pengembangan mikro (_bite-sized tasks_) siap eksekusi.
- 🚀 [**docs/VIBE_CODING_GUIDE.md**](file:///d:/senara/docs/VIBE_CODING_GUIDE.md) — Playbook vibe coding, alur 4 langkah, dan template prompt.

---

## 🛡️ Aturan Singkat Agen

1. **Mode Eksekusi Otonom:** Langsung kerjakan tugas terdefinisi tanpa mengajukan pertanyaan berulang di akhir giliran.
2. **Hormati Batas Monorepo:** Prisma di `packages/db`, tRPC di `packages/api`, UI primitif di `packages/ui`, Web App di `apps/web`.
3. **Strict Type Safety:** Tidak ada `any`. Gunakan Zod dan inferensi tRPC/Prisma.
4. **Pencegahan IDOR:** Selalu validasi `userId: ctx.auth.userId` pada setiap mutasi data pengguna.
5. **Vercel React Best Practices:** Gunakan Server Components secara bawaan, dorong `"use client"` ke leaf node terendah, hoist objek statis, dan eliminasi waterfall data fetching.
6. **Verifikasi:** Selalu jalankan `bun run check-types` setelah melakukan modifikasi kode.

