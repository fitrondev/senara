<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🤖 Senara Agent Instructions (`apps/web`)

Selamat datang di modul frontend **Senara** (`apps/web`). Dokumen ini berisi instruksi khusus untuk Agen AI yang bekerja pada aplikasi web ini.

---

## 🎯 Identitas & Tanggung Jawab Paket `apps/web`

Paket ini adalah aplikasi utama berbasis **Next.js 16 (App Router) + React 19** yang menangani:

- Halaman publik (Landing Page, Galeri Template, Halaman Undangan Tamu `/[slug]`).
- Halaman aplikasi terotentikasi (`/dashboard/*`).
- Editor visual interaktif (`/editor/[invitationId]`).
- Komunikasi API ke backend melalui klien **tRPC** (`@senara/api`) dan **TanStack React Query**.
- Autentikasi pengguna didukung oleh **Clerk** (`@clerk/nextjs`).

---

## 🛡️ Batasan Arsitektur Penting

1. **Jangan Impor `@senara/db` Langsung:**  
   Semua data dari basis data harus diambil melalui tRPC client (`trpc.[router].[procedure].useQuery` atau `useMutation`).
2. **Gunakan Komponen `@senara/ui`:**  
   Gunakan komponen UI dari `@senara/ui` (Button, Input, Dialog, Dropdown, Card, dll.) dan Tailwind CSS v4.
3. **Pemisahan Server vs Client Components:**  
   Jadikan komponen sebagai Server Component secara default. Tambahkan `"use client"` hanya jika membutuhkan hooks interaktif, state, atau event handlers.
4. **Kepatuhan Audio Autoplay:**  
   Pada halaman tamu publik `/[slug]`, selalu sertakan Cover Gate ("Buka Undangan") agar pemutaran audio latar diizinkan oleh kebijakan autoplay browser seluler.

---

## 📚 Referensi Dokumentasi Lengkap

Untuk spesifikasi fitur, arsitektur, dan koding standar:

- [PRD Utama](../../docs/PRD.md)
- [Arsitektur Sistem](../../docs/ARCHITECTURE.md)
- [Petunjuk Agen Global](../../docs/AGENT.md)
- [Standar Koding](../../docs/CODING_STANDARDS.md)
- [Daftar Tugas (Tasks)](../../docs/TASKS.md)
- [Tech Stack & CLI](../../docs/TECH_STACK.md)
