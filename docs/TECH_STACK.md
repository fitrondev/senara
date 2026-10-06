# 🛠️ Tech Stack & Panduan Perintah Senara

Dokumen ini adalah referensi lengkap pustaka (*libraries*), konfigurasi runtime, variabel lingkungan (*environment variables*), dan daftar perintah CLI yang digunakan di seluruh repositori **Senara**.

---

## 1. Rincian Stack Teknologi

| Komponen / Lapisan | Teknologi | Versi / Keterangan |
|---|---|---|
| **Runtime & Package Manager** | [Bun](https://bun.sh/) | v1.1+ (Eksekutor cepat untuk script dan monorepo workspace) |
| **Monorepo Build System** | [Turborepo](https://turbo.build/) | Mengelola alur build `apps/web` dan `packages/*` |
| **Frontend Framework** | [Next.js](https://nextjs.org/) | v16.3+ (App Router, React 19, Server & Client Components) |
| **API Protocol** | [tRPC](https://trpc.io/) | v11 (End-to-end type safety antara backend & frontend) |
| **Client State & Caching** | [TanStack React Query](https://tanstack.com/query) | v5 (Sinkronisasi server state, caching, & revalidasi) |
| **Database & ORM** | [MySQL](https://www.mysql.com/) + [Prisma ORM](https://www.prisma.io/) | Basis data relasional dengan model terpusat di `@senara/db` |
| **Autentikasi & Sesi** | [Clerk](https://clerk.com/) | v7+ (Manajemen pengguna, Social Login, dan sesi JWT) |
| **Styling & Desain** | [Tailwind CSS v4](https://tailwindcss.com/) | Styling berbasis utility class performa tinggi |
| **Primitif UI** | [Base UI](https://base-ui.com/) + [Shadcn UI](https://ui.shadcn.com/) | Komponen aksesibel di `@senara/ui` (Dialog, Dropdown, Button) |
| **Ikonografi** | [Lucide React](https://lucide.dev/) | Koleksi ikon SVG modern dan konsisten |
| **Notifikasi Toast** | [Sonner](https://sonner.emilkowal.ski/) | Toast interaktif dan animasi halus |
| **Validasi Skema** | [Zod](https://zod.dev/) | Validasi tipe runtime untuk API input & form state |
| **Media Storage & CDN** | [Cloudflare R2](https://www.cloudflare.com/products/r2/) | S3-compatible object storage tanpa biaya egress |
| **Payment Gateway** | [Midtrans Snap](https://midtrans.com/) / [Xendit](https://www.xendit.co/) | QRIS dan Virtual Account lokal Indonesia |
| **Konfigurasi Env** | [Varlock](https://varlock.dev/) | Generator tipe aman untuk environment variables |

---

## 2. Struktur Variabel Lingkungan (.env)

Setiap paket membaca environment variable yang relevan. Salin template berikut ke berkas `.env.local` atau `.env` lokal:

```bash
# ==========================================
# DATABASE (MySQL)
# ==========================================
DATABASE_URL="mysql://root:password@localhost:3306/senara"

# ==========================================
# CLERK AUTHENTICATION
# ==========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# ==========================================
# CLOUDFLARE R2 STORAGE
# ==========================================
R2_ACCOUNT_ID="your_cloudflare_account_id"
R2_ACCESS_KEY_ID="your_access_key_id"
R2_SECRET_ACCESS_KEY="your_secret_access_key"
R2_BUCKET_NAME="senara-media"
NEXT_PUBLIC_R2_PUBLIC_URL="https://cdn.senara.id"

# ==========================================
# PAYMENT GATEWAY (MIDTRANS)
# ==========================================
MIDTRANS_SERVER_KEY="SB-Mid-server-..."
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-..."
MIDTRANS_IS_PRODUCTION="false"

# ==========================================
# APP DOMAIN
# ==========================================
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

---

## 3. Daftar Perintah CLI Penting

Jalankan perintah selalu dari root direktori `d:\senara` menggunakan **Bun**:

### 3.1 Pengembangan & Build
```bash
# Menjalankan seluruh aplikasi dalam mode pengembangan
bun run dev

# Menjalankan build produksi untuk seluruh monorepo
bun run build

# Menjalankan pemeriksaan tipe TypeScript secara menyeluruh (Wajib untuk Vibe Coding!)
bun run check-types
```

### 3.2 Operasi Prisma & Basis Data (`@senara/db`)
```bash
# Menjalankan migrasi database di lingkungan pengembangan
bun --filter @senara/db run prisma migrate dev --name init_models

# Men-generate ulang Prisma Client setelah mengedit schema.prisma
bun --filter @senara/db run prisma generate

# Membuka Prisma Studio GUI untuk melihat isi data MySQL di browser
bun --filter @senara/db run prisma studio

# Menjalankan script seeding data awal (kategori & template)
bun --filter @senara/db run db:seed
```

### 3.3 Menambahkan Dependensi Baru
```bash
# Menambah library ke web app saja (apps/web)
bun --filter web add [nama-package]

# Menambah library ke paket API (packages/api)
bun --filter @senara/api add [nama-package]

# Menambah library ke paket UI (packages/ui)
bun --filter @senara/ui add [nama-package]
```

---

## 4. Panduan Do's & Don'ts

### ✅ LAKUKAN
- Gunakan `bun` untuk menginstal dan menjalankan skrip; hindari mencampur dengan `npm`, `yarn`, atau `pnpm` agar lockfile `bun.lock` tetap konsisten.
- Selalu uji perubahan skema dengan `bun --filter @senara/db run prisma generate` sebelum menguji kode yang bergantung padanya di `@senara/api`.
- Gunakan utility `cn()` dari `@senara/ui` saat menggabungkan kelas Tailwind CSS dinamis.

### ❌ JANGAN LAKUKAN
- Jangan menaruh rahasia produksi (`CLERK_SECRET_KEY`, `MIDTRANS_SERVER_KEY`) di variabel yang diawali `NEXT_PUBLIC_`.
- Jangan mengubah file di dalam direktori `packages/db/prisma/generated/` secara manual karena akan ditimpa setiap kali `prisma generate` dijalankan.
- Jangan mengimpor `packages/db` langsung ke komponen klien Next.js (`"use client"`). Semua akses database harus melalui server action atau tRPC procedure.

