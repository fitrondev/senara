# 🚀 Panduan Vibe Coding Senara

Dokumen ini adalah **buku pedoman utama (playbook)** untuk menjalankan *vibe coding* di repositori **Senara**. Panduan ini ditujukan bagi developer maupun AI Coding Assistant agar proses pengembangan berjalan sangat cepat, minim gesekan (*low friction*), namun tetap menghasilkan kode berkualitas produksi (*production-grade*), tipe-aman (*type-safe*), dan bebas regresi.

---

## 🧭 Apa itu "Vibe Coding" di Senara?

> **Vibe Coding** adalah metodologi pengembangan di mana developer berkolaborasi dengan AI secara deklaratif dan iteratif — berfokus pada visi, logika bisnis, dan pengalaman pengguna (UX), sementara AI mengeksekusi implementasi kode secara presisi dengan berpedoman pada kontrak arsitektur yang telah ditetapkan.

Agar vibe coding tidak berubah menjadi kekacauan kode (*code rot*), ada batas-batas rel (*guardrails*) ketat yang wajib dipatuhi.

---

## 🛡️ 7 Hukum Emas Vibe Coding Senara

1. **Prinsip Satu Tugas per Prompt (*Micro-Tasking*):**  
   Jangan meminta atau mengeksekusi 5 fitur sekaligus dalam satu instruksi. Pecah tugas menjadi langkah terukur (lihat [TASKS.md](file:///d:/senara/docs/TASKS.md)). Selesaikan satu blok fungsi, verifikasi, lalu lanjutkan.
2. **Ketahui Batas Monorepo (*Respect Package Boundaries*):**  
   - Skema basis data & query Prisma → Hanya di `packages/db`.
   - Business logic & API endpoints → Hanya di `packages/api`.
   - Reusable UI primitives → Hanya di `packages/ui`.
   - Halaman, layout, & client routing → Di `apps/web`.
3. **Ketik Tanpa Ampun (*Strict Type Safety — Zero `any`*):**  
   Dilarang menggunakan `any`. Gunakan inferensi tipe tRPC (`InferSelectModel`, input/output z.infer<typeof schema>) dan Zod untuk semua payload.
4. **Periksa Berkas Sebelum Mengubah (*Read Before Write*):**  
   Jangan berasumsi tentang nama fungsi, props, atau letak file. Selalu periksa file referensi terlebih dahulu sebelum menulis kode baru.
5. **Gunakan Primitif UI yang Tersedia:**  
   Gunakan komponen dari `@senara/ui` (Base UI / Shadcn) dan Tailwind CSS v4. Jangan membuat tombol, modal dialog, atau input teks dari elemen HTML mentah jika komponen primitif sudah tersedia di paket UI.
6. **Integritas Dokumentasi & Kode yang Ada:**  
   Pertahankan komentar, docstrings, dan fungsi yang tidak berkaitan langsung dengan tugas yang sedang dikerjakan. Jangan menghapus kode yang tampaknya tidak relevan tanpa konfirmasi.
7. **Verifikasi Wajib Setiap Iterasi (*Verify Every Step*):**  
   Setelah membuat atau mengedit kode, selalu jalankan pemeriksaan tipe:
   ```bash
   bun run check-types
   ```
   Jika ada galat TypeScript, selesaikan saat itu juga sebelum melanjutkan ke fitur berikutnya.

---

## 📋 Alur Kerja 4 Langkah (Context → Plan → Code → Verify)

```text
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌───────────────────┐
│ 1. LOAD CONTEXT │ ──► │   2. PLAN    │ ──► │   3. CODE    │ ──► │    4. VERIFY      │
│  Baca file &    │     │ Tulis rencana│     │ Edit berkas  │     │ bun check-types   │
│  cek dokumen    │     │ langkah demi │     │ secara rapi  │     │ & tes fungsional  │
│  relevan        │     │ langkah      │     │ & modular    │     │                   │
└─────────────────┘     └──────────────┘     └──────────────┘     └───────────────────┘
```

1. **Context:** Buka file yang akan disentuh beserta file saudaranya (misal: schema Prisma dan router tRPC terkait).
2. **Plan:** Buat ringkasan 2–4 baris apa yang akan diubah sebelum menulis kode.
3. **Code:** Lakukan perubahan menggunakan patch yang bersih.
4. **Verify:** Pastikan kompilasi TypeScript dan linting sukses.

---

## 💬 Template Prompt untuk Vibe Coding

Gunakan template di bawah ini saat meminta AI mengerjakan fitur tertentu agar hasilnya langsung tepat sasaran:

### 1. Template: Membuat Router / Prosedur tRPC Baru
```markdown
Bantu saya membuat router tRPC baru di `packages/api/src/routers/[feature].ts`.
- Fungsi: [Sebutkan tujuan prosedur, misal: membuat draft undangan baru]
- Input: Zod schema dengan validasi [sebutkan field input]
- Akses: [protectedProcedure / publicProcedure]
- Operasi Database: Menggunakan `ctx.db.[model]`
- Response: Kembalikan [sebutkan output yang diharapkan]
Pastikan router didaftarkan di `appRouter` pada `packages/api/src/routers/index.ts` dan jalankan verifikasi tipe.
```

### 2. Template: Menambahkan Komponen UI di `@senara/ui`
```markdown
Bantu saya membuat komponen baru `[NamaKomponen]` di `packages/ui/src/components/[kategori]/[nama-komponen].tsx`.
- Berpedoman pada Tailwind CSS v4 dan Base UI / Shadcn.
- Props harus memiliki interface TypeScript yang ketat.
- Harus mendukung variant dengan `class-variance-authority` (CVA) jika memiliki variasi gaya.
- Ekspor komponen melalui `packages/ui/src/index.ts` atau barrel file terkait.
```

### 3. Template: Menambahkan Model & Migrasi Prisma
```markdown
Bantu saya menambahkan model Prisma baru `[NamaModel]` pada `packages/db/prisma/schema/schema.prisma`.
- Kolom & Relasi: [Sebutkan field, tipe data, dan relasi ke User/Invitation]
- Indexing: Tambahkan index pada foreign key dan kolom yang sering dicari.
- Jangan lupa perbarui ekspor Prisma client dan cek keselarasan dengan `docs/DATABASE_SCHEMA.md`.
```

### 4. Template: Membuat Fitur Editor Canvas
```markdown
Bantu saya mengimplementasikan [Nama Fitur, misal: Inline Text Edit] di canvas editor `apps/web/src/app/editor/[invitationId]`.
- Ikuti arsitektur di `docs/ARCHITECTURE.md` (Editor Architecture).
- State lokal harus reaktif dan menggunakan debounced save (600ms) ke tRPC `invitation.updateSection`.
- UI harus responsif untuk ukuran mobile canvas (375px).
```

### 5. Template: Memperbaiki Bug (Bug Fixing)
```markdown
Saya menemukan galat berikut pada [nama berkas / url]:
`[Paste pesan error / stack trace di sini]`
- Analisis akar penyebab galat (root cause).
- Jelaskan solusinya secara singkat.
- Lakukan perbaikan tanpa merusak fungsi yang sudah ada.
- Verifikasi dengan `bun run check-types`.
```

---

## ⚠️ Anti-Patterns (Hal yang Wajib Dihindari)

| ❌ Jangan Lakukan | ✅ Cara yang Benar |
|---|---|
| Menulis inline query database langsung di komponen Next.js page | Gunakan tRPC procedure (`packages/api`) agar logika terpusat dan aman |
| Mengabaikan validasi runtime pada payload API | Selalu gunakan Zod validator pada input tRPC |
| Menggunakan inline styles (`style={{ color: 'red' }}`) untuk tema | Gunakan CSS variables / Tailwind utility classes sesuai token tema |
| Menyimpan file media berukuran besar langsung ke basis data | Simpan file ke Cloudflare R2 dan simpan URL publiknya di database |
| Menghapus atau me-reset database lokal secara sembarangan | Gunakan migrasi Prisma terarah (`prisma migrate dev`) atau konfirmasi dulu |
| Melakukan polling API berulang-ulang tanpa alasan | Manfaatkan caching React Query dan revalidasi terarah |

---

## 💡 Tips Efisiensi Sesi Coding
- **Fokuskan Context:** Saat bekerja pada editor, jangan memuat seluruh file dashboard jika tidak dibutuhkan. Berikan konteks file secara spesifik.
- **Gunakan Lint Feedback:** Jika IDE atau terminal memberikan peringatan linting atau type error, selesaikan segera sebelum tumpukannya membesar.
- **Commit Berkala:** Lakukan commit Git kecil setelah setiap micro-task di [TASKS.md](file:///d:/senara/docs/TASKS.md) selesai dan lolos `check-types`.

