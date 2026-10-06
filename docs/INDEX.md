# 📚 Senara Documentation Hub

Selamat datang di repositori dokumentasi **Senara** — SaaS Platform Undangan Digital berbasis web modern. Direktori `docs/` ini dirancang khusus untuk memfasilitasi **Vibe Coding** yang efisien, terstruktur, dan presisi bagi pengembang manusia maupun agen AI (AI Coding Assistant).

---

## 🗺️ Peta Navigasi Dokumen

| Berkas | Deskripsi | Kapan Harus Dibaca? |
|---|---|---|
| [**PRD.md**](file:///d:/senara/docs/PRD.md) | **Product Requirements Document**<br>Visi produk, fitur lengkap, aturan bisnis, dan spesifikasi fungsional 30 bab. | Saat membutuhkan konteks kebutuhan produk, spesifikasi fitur (Isian Kamu, Cover Gate, Amplop Digital), dan alur pengguna. |
| [**AGENT.md**](file:///d:/senara/docs/AGENT.md) | **Instruksi Agen AI (Agent Context & System Prompt)**<br>Pedoman operasional agen AI, batas paket monorepo, strict typing, dan IDOR guardrails. | Wajib dibaca oleh Agen AI sebelum mengeksekusi instruksi pengembangan. |
| [**VIBE_CODING_GUIDE.md**](file:///d:/senara/docs/VIBE_CODING_GUIDE.md) | **Master Playbook Vibe Coding**<br>Aturan main interaksi AI, prompt templates, cara membagi tugas, dan SOP verifikasi. | **Wajib dibaca pertama kali** oleh AI assistant atau developer sebelum memulai sesi coding. |
| [**ARCHITECTURE.md**](file:///d:/senara/docs/ARCHITECTURE.md) | **Arsitektur Sistem & Alur Data**<br>Struktur Monorepo Turborepo, pola tRPC + React Query, rendering Next.js, dan engine editor WYSIWYG. | Saat merancang fitur baru, menentukan lokasi kode antar-paket (`apps/web` vs `packages/*`), dan memahami data flow. |
| [**TECH_STACK.md**](file:///d:/senara/docs/TECH_STACK.md) | **Katalog Stack & Panduan Perintah**<br>Daftar pustaka, konfigurasi Environment Variable, perintah CLI Bun/Turbo/Prisma, dan do's & don'ts. | Saat menjalankan perintah terminal, menambah dependensi, atau menyetel konfigurasi runtime. |
| [**CODING_STANDARDS.md**](file:///d:/senara/docs/CODING_STANDARDS.md) | **Standar Koding & Konvensi**<br>Gaya penulisan TypeScript, arsitektur komponen React, styling Tailwind CSS v4, pola Zod, dan error handling. | Setiap kali menulis, mengedit, atau merefaktor kode komponen, router, maupun skema data. |
| [**DATABASE_SCHEMA.md**](file:///d:/senara/docs/DATABASE_SCHEMA.md) | **Spesifikasi Basis Data & Prisma ORM**<br>Definisi model Prisma relasional, indexing, relasi cascade, enum, dan panduan migrasi MySQL. | Saat membuat/mengubah model database, menjalankan migrasi, atau menyusun query Prisma. |
| [**TASKS.md**](file:///d:/senara/docs/TASKS.md) | **Backlog Tugas Terperinci (Bite-Sized Tasks)**<br>Daftar tugas terstruktur per fase (Sprint/Epic) yang siap dieksekusi secara modular. | Saat memilih tugas berikutnya untuk di-*vibe-code* prompt-demi-prompt. |

---

## ⚡ Alur Cepat Memulai Sesi Vibe Coding

1. **Baca [VIBE_CODING_GUIDE.md](file:///d:/senara/docs/VIBE_CODING_GUIDE.md)** untuk memahami prinsip *single-responsibility prompt* dan SOP validasi.
2. **Pilih tugas dari [TASKS.md](file:///d:/senara/docs/TASKS.md)** (misal: *Task 1.1 — Inisialisasi Prisma Schema*).
3. **Konfirmasi aturan penulisan di [CODING_STANDARDS.md](file:///d:/senara/docs/CODING_STANDARDS.md)** dan skema di [DATABASE_SCHEMA.md](file:///d:/senara/docs/DATABASE_SCHEMA.md).
4. **Eksekusi & Verifikasi**: Jalankan `bun run check-types` dan pastikan tidak ada regresi sebelum beralih ke tugas berikutnya.

