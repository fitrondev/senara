# PRD — Senara: Platform Undangan Digital

**Versi:** 1.1 (Revisi Komprehensif)  
**Status:** Ready for Development  
**Produk:** Senara (SaaS Platform Undangan Digital)  
**Target:** Web Application (Responsive Mobile-First)  
**Bahasa Utama:** Indonesia  
**Repository Architecture:** Turborepo Monorepo (Next.js, tRPC, Prisma MySQL, Clerk, Tailwind CSS v4)

---

## Daftar Isi
1. [Ringkasan Eksekutif & Identitas Produk](#1-ringkasan-eksekutif--identitas-produk)
2. [Tujuan Produk & Metrik Keberhasilan](#2-tujuan-produk--metrik-keberhasilan)
3. [Target Pengguna & Persona](#3-target-pengguna--persona)
4. [Kategori Acara](#4-kategori-acara)
5. [Peran Pengguna & Kontrol Akses (RBAC)](#5-peran-pengguna--kontrol-akses-rbac)
6. [Struktur Navigasi & Arsitektur Informasi](#6-struktur-navigasi--arsitektur-informasi)
7. [Dashboard Pengguna — Undangan Saya](#7-dashboard-pengguna--undangan-saya)
8. [Siklus Hidup & Status Undangan](#8-siklus-hidup--status-undangan)
9. [Alur Pembuatan Undangan & Galeri Template](#9-alur-pembuatan-undangan--galeri-template)
10. [Arsitektur Sistem Template](#10-arsitektur-sistem-template)
11. [Editor Undangan (Visual WYSIWYG Canvas)](#11-editor-undangan-visual-wysiwyg-canvas)
12. [Manajemen Urutan & Visibilitas Section](#12-manajemen-urutan--visibilitas-section)
13. [Fitur "Isian Kamu" (Custom Content & Dynamic Slots)](#13-fitur-isian-kamu-custom-content--dynamic-slots)
14. [Spesifikasi Komponen Undangan Publik](#14-spesifikasi-komponen-undangan-publik)
    - 14.1 [Cover Screen & Gate "Buka Undangan" (Audio Autoplay Compliance)](#141-cover-screen--gate-buka-undangan)
    - 14.2 [Profil Mempelai / Tokoh Acara](#142-profil-mempelai--tokoh-acara)
    - 14.3 [Rincian Acara & Integrasi Peta/Kalender](#143-rincian-acara--integrasi-petakalender)
    - 14.4 [Hitung Mundur (Countdown Timer)](#144-hitung-mundur-countdown-timer)
    - 14.5 [Love Story / Timeline Cerita](#145-love-story--timeline-cerita)
    - 14.6 [Galeri Foto & Video Embed](#146-galeri-foto--video-embed)
    - 14.7 [Amplop Digital & Kado Fisik (Digital Gift)](#147-amplop-digital--kado-fisik-digital-gift)
    - 14.8 [Buku Tamu, Doa & Konfirmasi RSVP](#148-buku-tamu-doa--konfirmasi-rsvp)
    - 14.9 [Latar Musik & Pemutar Audio](#149-latar-musik--pemutar-audio)
15. [Personalisasi Tamu & Distribusi WhatsApp](#15-personalisasi-tamu--distribusi-whatsapp)
16. [Manajemen RSVP & Buku Tamu](#16-manajemen-rsvp--buku-tamu)
17. [Statistik & Analitik Kunjungan](#17-statistik--analitik-kunjungan)
18. [Monetisasi, Paket Layanan & Tagihan](#18-monetisasi-paket-layanan--tagihan)
19. [Konsultasi & Layanan Bantuan](#19-konsultasi--layanan-bantuan)
20. [Pengaturan Akun & Profil Pengguna](#20-pengaturan-akun--profil-pengguna)
21. [Panel Administrasi (Admin Dashboard)](#21-panel-administrasi-admin-dashboard)
22. [Model Data Relasional (Prisma Schema Reference)](#22-model-data-relasional-prisma-schema-reference)
23. [Media Storage & Image Pipeline](#23-media-storage--image-pipeline)
24. [Arsitektur Rute & URL](#24-arsitektur-rute--url)
25. [Kebutuhan Non-Fungsional (NFR)](#25-kebutuhan-non-fungsional-nfr)
26. [Keamanan & Perlindungan Data](#26-keamanan--perlindungan-data)
27. [Stack Teknologi & Arsitektur Kode](#27-stack-teknologi--arsitektur-kode)
28. [Roadmap Pengembangan Bertahap (Phased Rollout)](#28-roadmap-pengembangan-bertahap-phased-rollout)
29. [Kriteria Penerimaan Komprehensif (Acceptance Criteria)](#29-kriteria-penerimaan-komprehensif-acceptance-criteria)
30. [Prinsip UX & Core Product Loop](#30-prinsip-ux--core-product-loop)

---

# 1. Ringkasan Eksekutif & Identitas Produk

**Senara** adalah platform SaaS pembuatan **undangan digital berbasis website (web-based digital invitation)** modern yang dirancang khusus untuk mempermudah calon pengantin, keluarga, dan event organizer membuat undangan interaktif berkualitas tinggi dalam hitungan menit tanpa memerlukan keahlian coding atau desain grafis tingkat lanjut.

### Nilai Jual Utama (Unique Value Proposition)
1. **True WYSIWYG & Mobile-First Canvas:** Pengeditan langsung di atas pratinjau ponsel cerdas dengan umpan balik visual seketika (*instant preview*).
2. **Sistem Modular & Fleksibel ("Isian Kamu"):** Pengguna bebas menyisipkan teks, judul, foto, video, peta, maupun tombol kustom di antara section template tanpa merusak keselarasan tema.
3. **Kepatuhan Autoplay & Interaksi Halus:** Menggunakan gerbang sambutan "Buka Undangan" untuk menyiasati kebijakan pemblokiran autoplay audio pada peramban modern (Chrome, Safari, iOS/Android) sekaligus memberikan sensasi membuka amplop fisik.
4. **Personalisasi Tamu Mendalam:** URL unik per tamu (`?to=Nama+Tamu`) yang secara dinamis mengubah nama penerima di sampul dan pesan sambutan.
5. **Amplop Digital Lengkap:** Integrasi nomor rekening bank (dengan tombol salin satu-klik), QRIS statis, dan alamat pengiriman kado fisik.

Konsep alur inti produk:
> **Pilih Template → Isi Data & Sesuaikan Tema → Pratinjau Interaktif → Terbitkan → Personalisasi & Bagikan via WhatsApp**

---

# 2. Tujuan Produk & Metrik Keberhasilan

## 2.1 Tujuan Utama (Product Goals)
- Memangkas waktu pembuatan undangan dari rata-rata beberapa hari (metode konvensional/jasa manual) menjadi **kurang dari 10 menit**.
- Memberikan pengalaman pengeditan yang menyenangkan dengan *zero learning curve*.
- Memastikan performa muat halaman undangan di bawah 2,5 detik pada koneksi seluler 4G.

## 2.2 Tujuan Bisnis (Business Goals)
Platform menghasilkan pendapatan berkelanjutan melalui:
- **Paket Upgrade Premium:** Masa aktif selamanya/hingga hari-H, penghapusan watermark/branding Senara, kuota tamu tanpa batas, dan akses musik kustom.
- **Katalog Template Berbayar:** Template eksklusif atau lisensi desainer.
- **Add-on Layanan:** Custom domain (nama-pasangan.com), integrasi WhatsApp Blast otomatis, dan jasa bantuan input data (Concierge Service).

## 2.3 Metrik Keberhasilan Utama (KPIs)
- **Time to First Publish (TTFP):** Median < 15 menit sejak registrasi akun.
- **Conversion Rate Free to Premium:** > 12% dari total undangan yang dibuat.
- **RSVP Completion Rate:** > 65% tamu yang membuka undangan mengisi RSVP atau mengirim ucapan.
- **Crash/Error Rate pada Editor:** < 0,1% sesi pengeditan.

---

# 3. Target Pengguna & Persona

### 3.1 Primary User: Calon Pengantin & Keluarga
- **Karakteristik:** Mengutamakan kepraktisan, estetika, kemudahan membagikan ke kerabat, dan efisiensi biaya dibanding undangan cetak kertas.
- **Kebutuhan Utama:** Kemudahan mengetik data nama keluarga, mengunggah foto prewedding, memuat peta Google Maps, dan menerima amplop digital/RSVP.

### 3.2 Secondary User: Vendor & Event Organizers
- **Karakteristik:** Wedding Organizer (WO), Event Organizer (EO), desainer lepas, atau fotografer yang mengelola banyak acara klien.
- **Kebutuhan Utama:** Fitur duplikasi undangan, pengelolaan banyak proyek dari satu akun, opsi *white-label* (menghapus branding platform), dan ekspor data RSVP ke format Excel/Spreadsheet.

---

# 4. Kategori Acara

Senara dibangun dengan arsitektur multi-acara sehingga dapat melayani beragam momentum:
- **Pernikahan (Wedding):** Akad, Resepsi, Unduh Mantu, Ngunduh Mantu, Pemberkatan.
- **Lamaran & Pertunangan (Engagement)**
- **Ulang Tahun & Sweet Seventeen (Birthday)**
- **Khitanan / Sunatan**
- **Aqiqah & Tasyakuran Kelahiran**
- **Anniversary & Perayaan Ulang Tahun Pernikahan**
- **Wisuda & Kelulusan (Graduation)**
- **Gathering & Reuni Komunitas / Keluarga**
- **Seminar, Workshop & Webinar**
- **Acara Kustom / Formal Lainnya**

Kategori ini terintegrasi pada:
- Filter & pencarian galeri template.
- Preset section yang diaktifkan secara bawaan saat pembuatan undangan baru.
- Laporan analitik dan kurasi tema.

---

# 5. Peran Pengguna & Kontrol Akses (RBAC)

| Peran | Deskripsi | Hak Akses Utama |
|---|---|---|
| **Guest** | Pengunjung umum belum login | • Menjelajahi Landing Page & Galeri Template<br>• Mencoba Live Preview template demo<br>• Membuka halaman undangan publik tamu<br>• Registrasi & Login (Clerk) |
| **User (Customer)** | Pengguna terdaftar terotentikasi | • Membuat, menduplikasi, mengedit, dan menghapus undangan sendiri<br>• Menyimpan draf dan menerbitkan undangan<br>• Mengelola daftar tamu & buku tamu (RSVP)<br>• Melihat statistik kunjungan & konfirmasi hadir<br>• Mengelola pembelian paket, invoice, dan profil akun |
| **Admin** | Pengelola sistem & staf operasional | • Mengakses Panel Admin Senara<br>• CRUD Master Template, Kategori, Preset Tema, & Font<br>• Manajemen pengguna & suspensi akun<br>• Manajemen paket harga, kupon diskon, dan transaksi<br>• Melihat analitik global platform dan log sistem |

---

# 6. Struktur Navigasi & Arsitektur Informasi

### 6.1 Navigasi Dashboard Pengguna (Sidebar Kiri)
```text
Senara Dashboard
├── 📋 Undangan Saya        -> Daftar undangan (Draft, Terbit, Arsip)
├── 📱 Kirim WhatsApp       -> Manajemen daftar tamu & pembuat pesan personal
├── ✉️ RSVP & Buku Tamu     -> Tabel respon kehadiran & pesan ucapan
├── 📊 Statistik Kunjungan   -> Metrik pengunjung, perangkat, dan aktivitas
├── 💳 Tagihan & Pesanan    -> Riwayat order, status invoice, upgrade paket
├── 📖 Panduan Penggunaan    -> Dokumentasi & tips pembuatan undangan
├── ⚙️ Pengaturan Akun      -> Profil pengguna, keamanan, dan preferensi
├── 💬 Konsultasi / CS      -> Tautan bantuan langsung (WhatsApp Support)
└── 🚪 Keluar (Sign Out)    -> Clerk Auth Session termination
```

---

# 7. Dashboard Pengguna — Undangan Saya

## 7.1 Komponen Header
- Sambutan personal (`Halo, [Nama Pengguna]!`).
- Tombol aksi utama: `+ Buat Undangan Baru`.
- Notifikasi sistem & status paket aktif akun.

## 7.2 Alat Filter, Pencarian & Pengurutan
- **Tab Status Undangan:**
  - `Semua` (Menampilkan seluruh item)
  - `Terbit` (Hanya yang sedang aktif dan dapat diakses publik)
  - `Draf` (Undangan dalam proses pengerjaan)
  - `Kedaluwarsa / Arsip`
- **Pencarian Cepat:**
  - Input field dengan debouncing 300ms.
  - Kueri pencarian mencakup: Nama Pasangan/Judul Undangan, Nama Template, dan Slug URL.
  - Placeholder: `Cari berdasarkan judul atau slug...`
- **Opsi Pengurutan (Sort):**
  - Terakhir Diubah (*Default*)
  - Tanggal Dibuat: Terbaru
  - Tanggal Dibuat: Terlama
  - Judul: Abjad A–Z / Z–A

## 7.3 Kartu Undangan (Invitation Card)
Setiap undangan dipresentasikan dalam kartu responsif dengan rincian:
- **Thumbnail:** Pratinjau visual template yang digunakan.
- **Badge Status:** `Draf` (Kuning), `Terbit` (Hijau), `Kedaluwarsa` (Abu-abu).
- **Badge Paket:** `Gratis` (Default) atau `Premium` (Emas).
- **Metadata:** Nama Acara / Pasangan, Nama Template, Tanggal Acara, Tanggal Pembaruan Terakhir.
- **Indikator Masa Aktif:**
  - Draf Gratis: Peringatan hitung mundur sisa hari aktif (misal: *“Draf aktif 12 hari lagi. Upgrade ke Premium agar tidak kedaluwarsa”*).
  - Terbit: Tautan langsung ke URL publik `senara.id/[slug]`.
- **Aksi Cepat (Quick Actions):**
  - `Edit Undangan` (Masuk ke Canvas Editor)
  - `Terbitkan` (Jika masih status draf)
  - `Upgrade Premium` (Jika masih paket gratis)
- **Menu Aksi Lanjutan (Dropdown More `...`):**
  - Pratinjau (Buka live preview mode tamu)
  - Salin Tautan Undangan
  - Distribusi via WhatsApp
  - Duplikat Undangan
  - Ganti Template
  - Arsipkan Undangan
  - Hapus Undangan (Membutuhkan dialog konfirmasi protektif)

---

# 8. Siklus Hidup & Status Undangan

```text
┌────────────────┐
│  + Buat Baru   │
└───────┬────────┘
        ▼
   ┌─────────┐       Publikasikan      ┌───────────┐
   │  DRAF   ├────────────────────────►│  TERBIT   │
   └────┬────┘  (Validasi Field Lolos) └─────┬─────┘
        │                                    │
        │ Lewat Masa Aktif                   │ Lewat Tanggal Acara + Grace
        ▼ (Hanya Paket Free)                 ▼ Period (Paket Free)
   ┌─────────┐                         ┌───────────┐
   │ EXPIRED │                         │  EXPIRED  │
   └────┬────┘                         └─────┬─────┘
        │                                    │
        └──────────────┬─────────────────────┘
                       │ User mengarsipkan
                       ▼
                 ┌───────────┐
                 │ ARSIPKAN  │
                 └───────────┘
```

1. **Draf (Draft):**
   - Undangan baru dibuat atau sedang disunting.
   - Tidak dapat diakses tamu publik tanpa otentikasi pemilik.
   - Akun gratis memiliki masa draf 14 hari sebelum otomatis kedaluwarsa jika tidak diterbitkan atau di-upgrade.
2. **Terbit (Published):**
   - Undangan aktif, terindeks, dan dapat diakses publik via URL unik `senara.id/[slug]`.
   - Siap menerima ucapan dan konfirmasi RSVP dari tamu.
3. **Kedaluwarsa (Expired):**
   - Terjadi bila masa aktif paket gratis habis. Halaman publik menampilkan pesan santun bahwa acara telah selesai atau tautan telah nonaktif. Data undangan tetap tersimpan di database dan dapat diaktifkan kembali melalui upgrade.
4. **Diarsipkan (Archived):**
   - Disembunyikan dari daftar utama dashboard tanpa menghapus data secara permanen.

---

# 9. Alur Pembuatan Undangan & Galeri Template

## 9.1 Alur Pengguna (User Flow)
```text
Dashboard -> Klik "+ Buat Undangan"
    ↓
Pilih Kategori Acara (Pernikahan, Ulang Tahun, dll.)
    ↓
Jelajahi Galeri Template (Filter Tema, Gaya, Warna)
    ↓
Buka Pratinjau Demo Template (Mode Ponsel & Desktop)
    ↓
Klik "Gunakan Template Ini"
    ↓
Inisialisasi Data Undangan (Salin struktur default template)
    ↓
Masuk ke Visual Canvas Editor
```

## 9.2 Fitur Galeri Template
- **Pencarian Multi-parameter:** Pencarian teks berdasarkan nama tema, warna dominan (pastel, emerald, gold, earthy), nuansa budaya (Jawa, Minang, Sunda, Modern, Minimalis, Floral).
- **Filter Kategori Dinamis:** Tab filter kategori acara dan filter badge `Gratis` vs `Premium`.
- **Kartu Template:**
  - Gambar cover berkualitas tinggi.
  - Tag gaya desain & warna palet.
  - Tombol interaktif: `👁 Pratinjau Demo` dan `✎ Gunakan Template`.

## 9.3 Modal / Halaman Pratinjau Template Demo
- Menampilkan simulasi tampilan layar smartphone nyata (iPhone/Android bezel) dengan kemampuan scroll lancar.
- Tombol penggantian viewport: Ponsel (375px) vs Layar Penuh Desktop.
- Ringkasan fitur template: Jumlah slot foto, dukungan video, palet warna yang disertakan, dan badge lisensi template.

---

# 10. Arsitektur Sistem Template

Untuk memastikan skalabilitas jangka panjang dan isolasi data yang bersih, template di Senara menggunakan pola **Component & Slot Tree** yang memisahkan kode tampilan (*presentational layout*) dari data pengguna (*content state*).

```text
Template Definition (JSON Registry / Code Component)
  │
  ├── Section 1: Cover & Gate (Slot: 'hero-gate')
  ├── Section 2: Ayat / Quote (Slot: 'opening-quote')
  ├── Section 3: Profil Pasangan (Slot: 'couple-profile')
  ├── [Custom Content Slot: 'after-couple']  <─── Tempat "Isian Kamu"
  ├── Section 4: Rangkaian Acara (Slot: 'event-schedule')
  ├── [Custom Content Slot: 'after-event']   <─── Tempat "Isian Kamu"
  ├── Section 5: Galeri Foto (Slot: 'gallery-media')
  ├── Section 6: Cerita Cinta (Slot: 'love-story')
  ├── Section 7: Amplop Digital (Slot: 'digital-gift')
  ├── Section 8: RSVP & Ucapan (Slot: 'rsvp-guestbook')
  └── Section 9: Penutup / Salam (Slot: 'closing-footer')
```

### Karakteristik Desain:
- **Zero Hardcoding Data:** Teks, URL gambar, nama pasangan, dan koordinat maps disuntikkan secara dinamis melalui data store undangan.
- **Dynamic Variable Tokens:** Menyediakan fallback dan interpolasi variabel seperti `{{groom_name}}`, `{{bride_name}}`, `{{event_date}}`, dan `{{guest_name}}`.
- **Reusable Component Blocks:** Seluruh elemen (Cover, Acara, RSVP, Gallery) adalah komponen React terisolasi yang mengonsumsi konfigurasi desain global (CSS variables tema).

---

# 11. Editor Undangan (Visual WYSIWYG Canvas)

Editor adalah fitur inti Senara. Pengguna dapat langsung melihat hasil perubahan secara nyata tanpa perlu berpindah-pindah tab pratinjau.

## 11.1 Tata Letak Antarmuka (Editor UI Layout)
```text
┌────────────────────────────────────────────────────────────────────────┐
│ ← Kembali | ● Tersimpan (Auto)      🎨 Tema   ⇅ Urutan   👁 Pratinjau   🚀 Terbitkan │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                          TOOLBAR PENGATURAN CEPAT                      │
│                  [ 📱 Mode Mobile ]   [ 💻 Mode Desktop ]              │
│                                                                        │
│                      ┌───────────────────────────┐                     │
│                      │ 📱 MOBILE PREVIEW CANVAS  │                     │
│                      │                           │                     │
│                      │  [ Cover: Buka Undangan ] │                     │
│                      │                           │                     │
│                      │  Adinda & Bagas (Click to │                     │
│                      │  edit inline text)        │                     │
│                      │                           │                     │
│                      │  [ + Tambah Isian Kamu ]  │                     │
│                      │                           │                     │
│                      │  Rangkaian Acara...       │                     │
│                      │                           │                     │
│                      └───────────────────────────┘                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## 11.2 Toolbar Bagian Atas
1. **Navigasi Kembali:** Tombol panah kembali ke Dashboard dengan konfirmasi simpan jika ada mutasi tertunda.
2. **Indikator Status Penyimpanan Real-time:**
   - `● Tersimpan` (Hijau: status mutasi bersih).
   - `◌ Menyimpan...` (Kuning berputar: debounce mutation sedang berlangsung).
   - `✕ Gagal Menyimpan` (Merah: koneksi terputus, dilengkapi tombol coba lagi).
3. **Menu Aksi Modal:**
   - **Tema:** Membuka panel penyesuaian palet warna, jenis tipografi (Google Fonts), dan gaya tombol.
   - **Urutan:** Membuka modal drag-and-drop daftar section untuk mengatur susunan atau menyembunyikan bagian.
   - **Pratinjau:** Membuka undangan di jendela baru persis seperti yang akan dialami oleh tamu.
   - **Terbitkan:** Memicu validasi kelengkapan data sebelum mengubah status draf menjadi terbit.

## 11.3 Mekanisme Inline Editing (Direct WYSIWYG)
- Klik pada teks mana pun di kanvas preview akan mengaktifkan mode inline-edit dengan input/textarea kontekstual tanpa merusak layout.
- Mendukung formatting ringan (Bold, Italic, Link) pada blok teks deskripsi cerita.
- Saat elemen gambar/foto diklik, modal pengelola media (Crop, Rotate, Ganti Foto) langsung terbuka.

## 11.4 Auto-Save & Debounce Engine
- Setiap ketukan tombol pada kanvas editor dicatat di state lokal React dan dikirimkan ke tRPC server menggunakan debouncing 600ms.
- Memiliki fallback `localStorage` cadangan untuk mencegah hilangnya data pengguna jika koneksi internet terputus secara tiba-tiba.

---

# 12. Manajemen Urutan & Visibilitas Section

Panel **Urutan Section** memungkinkan kustomisasi tata letak vertikal undangan.

## 12.1 Fitur Panel Urutan
- **Drag-and-Drop Reordering:** Pengguna dapat menggeser urutan section ke atas atau ke bawah.
- **Toggle Visibilitas (Show/Hide):** Setiap section opsional dapat dimatikan dengan tombol switch tanpa menghapus data isian di dalamnya.
  - Contoh: Pasangan yang tidak ingin mengadakan sesi resepsi terpisah dapat mematikan blok Resepsi.
  - Pasangan yang memilih tidak menampilkan amplop digital dapat menonaktifkan blok Kado/Gift.
- **Status Kunci (Locked / Mandatory):** Section penting seperti Cover dan Akad/Informasi Acara Utama ditandai sebagai esensial (*required*) untuk menjaga fungsi utama undangan.

Contoh hirarki urutan:
```text
1. [Wajib] Cover & Pembuka               [👁 Selalu Tampil]
2. [Opsional] Ayat Suci / Kutipan Bijak  [👁 Aktif]
3. [Wajib] Profil Mempelai               [👁 Aktif]
4. [Opsional] Rangkaian Acara (Akad)     [👁 Aktif]
5. [Opsional] Rangkaian Acara (Resepsi)  [👁 Aktif]
6. [Opsional] Kisah Cinta (Love Story)   [👁 Dinonaktifkan]
7. [Opsional] Galeri Foto & Video        [👁 Aktif]
8. [Opsional] Amplop Digital & Kado      [👁 Aktif]
9. [Opsional] Konfirmasi RSVP & Ucapan   [👁 Aktif]
10. [Wajib] Penutup & Hak Cipta          [👁 Selalu Tampil]
```

---

# 13. Fitur "Isian Kamu" (Custom Content & Dynamic Slots)

Fitur unggulan **Isian Kamu** memberikan fleksibilitas tanpa batas bagi pengguna untuk menambahkan konten kustom di luar section baku template tanpa merusak keindahan desain.

## 13.1 Konsep Dynamic Slot Binding
Setiap template menyediakan titik jangkar (*anchor slot*) yang dapat disisipi satu atau banyak komponen kustom. Isian terikat secara logis pada atribut `slotId`, bukan indeks array visual absolut.

### Keunggulan Slot Binding:
Jika pengguna mengaitkan isian pada slot `after-couple` (muncul setelah bagian Profil Mempelai), dan suatu saat bagian Profil Mempelai disembunyikan, isian tersebut **tetap tersimpan dan tetap ditampilkan di posisi runtutan yang relevan** (*Persistent Slot Rule*).

## 13.2 Antarmuka Modal "Isian Kamu"
```text
┌─────────────────────────────────────────────────────────────┐
│                       Isian Kamu                            │
├─────────────────────────────────────────────────────────────┤
│ Muncul setelah:                                             │
│ [ Busana Acara / Dress Code                            ▼ ]  │
│                                                             │
│ ℹ️ Isian tetap berada di posisi ini meskipun section       │
│    sebelumnya dimatikan.                                    │
│                                                             │
│ Urutan di posisi ini: 2 dari 3                              │
│ Tombol urutan internal:                 [ ↑ Naik ] [ ↓ Turun ]│
├─────────────────────────────────────────────────────────────┤
│ Daftar Konten di Slot Ini:                                  │
│ 1. [Judul] Ketentuan Pakaian                                │
│ 2. [Teks] Tamu diharapkan mengenakan batik bernuansa pastel │
│ 3. [Tombol] Lihat Panduan Warna                             │
│                                                             │
│ Tambah Komponen Baru ke Slot Ini:                           │
│ [+ Judul]   [+ Teks]   [+ Foto]   [+ Video]                 │
│ [+ Tombol]  [+ Tautan] [+ YouTube] [+ Peta Lokasi]          │
├─────────────────────────────────────────────────────────────┤
│ 🗑 [Hapus Seluruh Isian di Slot Ini]               [Selesai]│
└─────────────────────────────────────────────────────────────┘
```

## 13.3 Tipe-Tipe Konten "Isian Kamu"

### 1. Judul (Heading)
- **Fungsi:** Menambahkan sub-judul atau penanda bagian baru.
- **Properti:** Teks, perataan (Kiri, Tengah, Kanan), gaya font (Heading/Script), ukuran font.

### 2. Teks (Paragraph)
- **Fungsi:** Menuliskan pengumuman khusus, protokol kesehatan, akomodasi penginapan, dress code, atau permohonan doa.
- **Properti:** Konten teks (multi-baris), perataan, ukuran.

### 3. Foto Tunggal / Banner
- **Fungsi:** Menyisipkan foto dekoratif, denah lokasi tradisional, atau poster acara.
- **Properti:** File gambar, teks keterangan (caption), rasio aspek (1:1, 4:5, 16:9), border radius.

### 4. Video (Self-Hosted / Storage URL)
- **Fungsi:** Menayangkan klip pendek video prewedding atau salam pembuka.
- **Properti:** URL video MP4/WebM, thumbnail poster, kontrol suara/mute.

### 5. Tombol Aksi (CTA Button)
- **Fungsi:** Tombol interaktif untuk mengarahkan tamu ke tautan eksternal (misal: Buku Panduan PDF, Grup WhatsApp Keluarga).
- **Properti:** Label tombol, URL tujuan, gaya tombol (Solid, Outline), target (`_blank`).

### 6. Tautan Teks (Hyperlink)
- **Fungsi:** Tautan sebaris sederhana ke website pendukung atau akun media sosial.
- **Properti:** Label tautan, URL tujuan.

### 7. YouTube Embed
- **Fungsi:** Menayangkan video siaran langsung (Live Streaming Akad) atau video sinematik.
- **Properti:** URL YouTube / Video ID, rasio aspek 16:9, opsi mulai otomatis dengan audio nonaktif (*muted*).

### 8. Peta Lokasi Tambahan
- **Fungsi:** Menampilkan peta kedua (misal: lokasi acara resepsi hari kedua atau penginapan rekomendasi).
- **Properti:** Nama lokasi, alamat lengkap, koordinat latitude/longitude, URL Google Maps.

## 13.4 Aturan Bisnis & Validasi "Isian Kamu"
1. **Urutan Internal Slot:** Tombol `↑ Naik` dan `↓ Turun` hanya menukar urutan komponen di dalam slot yang sama (*intra-slot reordering*).
2. **Penghapusan Aman:**
   - Menghapus 1 komponen: langsung dapat dilakukan dengan tombol hapus di samping item.
   - Menghapus seluruh isian pada slot: sistem wajib menampilkan modal konfirmasi destruktif (*“Apakah Anda yakin ingin menghapus seluruh isian di posisi ini?”*).
3. **Empty State:** Jika sebuah slot dibuat tetapi belum memiliki konten, editor menampilkan kotak panduan bertitik (*dashed border placeholder*) bertuliskan *“Isian ini masih kosong. Silakan pilih jenis konten di atas.”* Slot kosong otomatis diabaikan (*hidden*) pada halaman publik tamu.

---

# 14. Spesifikasi Komponen Undangan Publik

Setiap undangan yang diterbitkan terdiri dari modul-modul interaktif dengan spesifikasi fungsional sebagai berikut:

## 14.1 Cover Screen & Gate "Buka Undangan"
- **Tujuan Teknis & Etika:** Peramban modern melarang pemutaran audio otomatis tanpa interaksi fisik pengguna (*user gesture*). Layar gerbang ini menyajikan sampul elegan bergaya kartu pos/amplop virtual.
- **Elemen Tampilan:**
  - Foto utama pasangan atau ilustrasi tema.
  - Judul Acara (misal: *The Wedding of Adinda & Bagas*).
  - Nama Tamu yang Dipersonalisasi (*“Kepada Yth. Bapak/Ibu/Saudara/i: [Nama Tamu]”*).
  - Tombol Utama: `✉ Buka Undangan`.
- **Perilaku Interaksi:**
  - Saat tombol diklik: gerbang sampul membuka dengan animasi transisi halus (*fade-out* atau *envelope unfolding*).
  - Kunci scroll peramban dilepaskan (*unlock body scroll*).
  - Musik latar otomatis mulai diputar (*trigger audio play*).
  - Floating audio button muncul di sudut kanan bawah.

## 14.2 Profil Mempelai / Tokoh Acara
- Menampilkan foto mempelai pria dan mempelai wanita.
- Nama lengkap beserta gelar akademik/keagamaan.
- Nama orang tua (Putra dari Bapak X & Ibu Y).
- Tautan akun media sosial (opsional, misal: Instagram handle).

## 14.3 Rincian Acara & Integrasi Peta/Kalender
- Mendukung pemisahan sesi acara (misal: Sesi 1 Akad Nikah & Sesi 2 Resepsi).
- Informasi: Hari, Tanggal, Rentang Waktu (WIB/WITA/WIT), Nama Gedung/Kediaman, Alamat Lengkap.
- **Tombol Navigasi Peta:** Tombol `Buka Google Maps` yang membuka aplikasi peta resmi atau link web navigasi instan.
- **Tombol Simpan ke Kalender:** Menghasilkan tautan Google Calendar (`calendar.google.com/calendar/render?...`) dan file `.ics` untuk Apple/Outlook Calendar.

## 14.4 Hitung Mundur (Countdown Timer)
- Menghitung mundur waktu secara *real-time* ke tanggal dan jam acara utama: Hari, Jam, Menit, Detik.
- Ketika waktu tercapai: menampilkan teks elegan *“Hari Bahagia Telah Tiba”*.

## 14.5 Love Story / Timeline Cerita
- Garis waktu vertikal (*vertical timeline*) yang menceritakan perjalanan cinta/momen penting:
  - Tahun 2021: Pertama Berjumpa
  - Tahun 2024: Momen Lamaran
  - Tahun 2026: Menuju Hari Bahagia
- Setiap titik dapat memuat tahun/tanggal, judul cerita, paragraf singkat, dan satu foto kenangan.

## 14.6 Galeri Foto & Video Embed
- **Tampilan Grid & Masonry:** Penyusunan foto rapi yang dapat diklik untuk membuka mode Lightbox layar penuh dengan navigasi geser (*swipeable gallery*).
- **Video Teaser:** Pemutar video YouTube atau rekaman prewedding.

## 14.7 Amplop Digital & Kado Fisik (Digital Gift)
- **Tujuan:** Memudahkan tamu yang tidak dapat hadir langsung untuk mengirimkan doa restu berupa tanda kasih digital.
- **Komponen Bank & E-Wallet:**
  - Logo Bank (BCA, Mandiri, BRI, BNI, BSI) atau Dompet Digital (GoPay, OVO, Dana).
  - Nomor Rekening / Akun.
  - Nama Pemilik Rekening (*A.N. Bagas Pratama*).
  - **Tombol Salin Rekening:** Sekali klik menyalin nomor rekening ke clipboard perangkat dan menampilkan feedback toast (*“Nomor rekening berhasil disalin!”*).
- **Komponen QRIS:** Pratinjau gambar QRIS statis yang dapat disimpan/diunduh tamu untuk pembayaran lintas aplikasi perbankan.
- **Alamat Kirim Kado Fisik:** Alamat rumah pasangan/keluarga penerima paket kado fisik lengkap dengan tombol salin alamat.

## 14.8 Buku Tamu, Doa & Konfirmasi RSVP
- **Formulir Kehadiran:**
  - Nama Tamu (otomatis terisi jika membuka via link personalisasi).
  - Pilihan Status: `Hadir`, `Tidak Hadir`, atau `Masih Ragu`.
  - Jumlah Orang yang Hadir (1, 2, atau lebih).
  - Kolom Ucapan Doa & Harapan.
- **Feed Ucapan Interaktif (Guestbook Wall):**
  - Menampilkan daftar ucapan yang telah dikirim tamu secara kronologis.
  - Dilengkapi badge status kehadiran di samping nama pengirim ucapan.
  - Pagination atau *infinite scrolling* untuk menjaga kecepatan loading jika ucapan mencapai ratusan.

## 14.9 Latar Musik & Pemutar Audio
- Floating action button transparan di pojok layar dengan ikon animasi disc/equalizer berputar.
- Kontrol: Putar (*Play*), Jeda (*Pause*), dan status *Mute*.
- Koleksi musik bawaan berlisensi bebas royalti (Romantis, Akustik, Islami, Klasik, Pop) serta opsi unggah lagu kustom (file MP3, batas 5MB).

---

# 15. Personalisasi Tamu & Distribusi WhatsApp

Fitur ini menjadi alasan utama pengguna memilih undangan digital Senara dibanding sebar gambar statis.

## 15.1 Format Tautan Tamu & URL Query
Sistem mendukung dua format URL personal:
1. **Query Parameter (Standar):**  
   `https://senara.id/adinda-bagas?to=Budi+Santoso`
2. **Slug Tamu Bersih:**  
   `https://senara.id/adinda-bagas/kpd/budi-santoso`

Ketika tautan tersebut dibuka oleh tamu:
- Teks sampul gerbang otomatis menampilkan: *Kepada Yth. Budi Santoso*.
- Form RSVP otomatis mengunci nama pengisi sebagai *Budi Santoso* untuk menghindari salah ketik.

## 15.2 Manajemen Buku Tamu (Guest List Manager)
Pengguna dapat mengelola daftar undangan di dashboard:
- **Input Manual:** Menambah nama tamu, kategori (Keluarga, Sahabat, Teman Kantor, VIP), dan nomor WhatsApp.
- **Impor Massal:** Mendukung unggah berkas spreadsheet (Excel `.xlsx` atau `.csv`) dengan template kolom standar (`Nama`, `Nomor_WA`, `Kategori`).
- **Ekspor Data:** Kemampuan mengunduh seluruh data tamu dan status kirim ke file Excel.

## 15.3 Pembuat Pesan WhatsApp Otomatis (Message Generator)
Pengguna dapat menyusun draf pesan personal yang dilengkapi variabel dinamis:
```text
Assalamu'alaikum Wr. Wb. / Salam Sejahtera,

Yth. {{guest_name}},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami:

Adinda & Bagas

Untuk informasi lengkap mengenai detail acara dan lokasi, silakan mengunjungi tautan undangan digital berikut:
{{invitation_url}}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih,
Adinda & Bagas
```

- **Tombol Satu-Klik Kirim WhatsApp (`wa.me` deep-link):**  
  Menghasilkan URL `https://api.whatsapp.com/send?phone=6281xxx&text=...` yang saat diklik langsung membuka aplikasi WhatsApp di ponsel atau WhatsApp Web di desktop dengan pesan yang sudah terisi rapi.
- **Status Pelacakan Pengiriman:** Tanda centang status pengiriman (`Belum Dikirim`, `Sudah Dikirim`) untuk memudahkan evaluasi daftar sebar.

---

# 16. Manajemen RSVP & Buku Tamu

## 16.1 Dashboard Rekapitulasi RSVP
Menyajikan ringkasan visual real-time bagi penyelenggara acara:
- **Ringkasan Angka:**
  - Total Tamu Terkonfirmasi Hadir (akumulasi kepala tamu).
  - Total Konfirmasi: Hadir, Tidak Hadir, Masih Ragu.
  - Total Ucapan Diterima.
- **Tabel Data Respons RSVP:**
  - Kolom: Waktu Kirim, Nama Tamu, Status, Jumlah Kehadiran, Pesan Ucapan.
  - Fitur Filter: Berdasarkan status kehadiran.
  - Fitur Moderasi: Pemilik undangan dapat menyembunyikan atau menghapus ucapan yang tidak pantas dari dinding publik.
  - Fitur Ekspor: Tombol `Unduh Rekap RSVP (.xlsx)`.

---

# 17. Statistik & Analitik Kunjungan

Senara menyediakan dashboard analitik ringan berbasis privasi (tanpa cookie pihak ketiga yang invasif) untuk melihat dampak penyebaran undangan:
- **Metrik Utama:**
  - Total Kunjungan (Pageviews).
  - Pengunjung Unik (Unique Visitors berdasarkan fingerprint anonim).
  - Kunjungan Hari Ini vs Kemarin.
- **Grafik Aktivitas Waktu:** Grafik garis tren kunjungan per jam dan per hari (mengetahui kapan waktu terbaik tamu membuka undangan).
- **Rincian Perangkat:** Persentase pembuka via Smartphone (Android / iOS) vs Laptop/Desktop.
- **Rincian Browser:** Chrome, Safari, WhatsApp In-App Browser, TikTok/Instagram In-App Browser.
- **Tautan Referensi (Referral Source):** WhatsApp, Instagram Bio, Tautan Langsung.

---

# 18. Monetisasi, Paket Layanan & Tagihan

## 18.1 Matriks Paket Pengguna

| Fitur | Paket Gratis (Free) | Paket Premium (Lengkap) |
|---|---|---|
| **Harga** | Rp0 | Rp49.000 – Rp99.000 (Sekali Bayar) |
| **Masa Aktif Draf** | 14 Hari | Selamanya (Tanpa Batas Waktu) |
| **Masa Aktif Halaman Publik** | 7 Hari Setelah Hari-H | Aktif Selamanya (Momen Kenangan) |
| **Pilihan Template** | Katalog Template Dasar | Akses Seluruh Template Premium |
| **Watermark Platform** | Ada Badge *“Dibuat dengan Senara”* | Bebas Watermark (Clean White-label) |
| **Kustomisasi Slug URL** | Format standar acak | Bebas Tentukan Slug (`senara.id/adinda-bagas`) |
| **Kapasitas Galeri Foto** | Maksimal 5 Foto | Hingga 30 Foto + Lightbox HD |
| **Musik Latar** | Koleksi Default Terbatas | Bebas Pilih Lagu & Unggah MP3 Sendiri |
| **Amplop Digital & QRIS** | 1 Nomor Rekening | Banyak Rekening + Gambar QRIS + Kado |
| **Buku Tamu & RSVP** | Maksimal 30 Data | Tanpa Batas (Unlimited Tamu) |
| **Kirim WhatsApp Personal** | Maksimal 15 Tamu | Tanpa Batas Tamu + Impor Excel |
| **Analitik Statistik** | Ringkasan Dasar | Analitik Lengkap & Ekspor Data |

## 18.2 Alur Transaksi & Pembayaran (Payment Gateway)
1. Pengguna menekan tombol `Upgrade ke Premium` pada dashboard atau editor.
2. Memilih paket atau add-on (misal: Tambahan Domain Kustom).
3. Memasukkan kode kupon promosi (jika ada).
4. Checkout terhubung dengan payment gateway lokal (Midtrans / Xendit).
5. Metode Pembayaran:
   - QRIS (GoPay, ShopeePay, Dana, LinkAja, BCA Mobile, dll.)
   - Virtual Account Bank (BCA, Mandiri, BRI, BNI, Permata)
   - Gerai Retail (Indomaret, Alfamart)
6. **Webhook & Instant Activation:** Sistem menerima notifikasi HTTP webhook dari payment gateway, memverifikasi tanda tangan digital (*signature key*), dan secara otomatis mengubah level paket undangan menjadi `PREMIUM` dalam tempo detik tanpa verifikasi manual.
7. Penerbitan invoice otomatis yang dapat diunduh pada tab `Tagihan & Pesanan`.

---

# 19. Konsultasi & Layanan Bantuan

Menu **Konsultasi** di dashboard menyediakan kanal bantuan langsung untuk meminimalisir churn dan membantu pengguna yang kesulitan:
- **WhatsApp Live Support:** Tautan langsung ke nomor WhatsApp Customer Care Senara dengan pesan template otomatis yang menyertakan User ID dan Invitation ID.
- **Pusat Panduan (Knowledge Base):** Video tutorial singkat (durasi 1 menit) mengenai cara mengatur musik, cara menambahkan rekening, dan tips mengirim undangan massal.
- **Layanan Jasa Input (Concierge Add-on):** Penawaran opsi bagi calon pengantin yang terlalu sibuk untuk menyerahkan seluruh materi acara kepada tim Senara agar dibuatkan sampai selesai.

---

# 20. Pengaturan Akun & Profil Pengguna

Tersedia antarmuka mandiri bagi pengguna untuk mengelola:
- **Profil Pribadi:** Nama lengkap, alamat email utama, nomor WhatsApp aktif, foto avatar.
- **Keamanan (Didukung oleh Clerk):**
  - Autentikasi aman tanpa password (*Social Login: Google*) atau email magic link.
  - Pengelolaan sesi aktif pada berbagai perangkat.
  - Tombol *Sign Out from all devices*.
- **Preferensi Notifikasi:** Pilihan menerima rangkuman konfirmasi kehadiran tamu harian via email atau notifikasi WhatsApp.

---

# 21. Panel Administrasi (Admin Dashboard)

Khusus untuk peran staf dan manajemen internal Senara:
- **Ringkasan Metrik Platform:** Total pengguna aktif, total undangan dibuat, rasio konversi draf ke terbit, total omzet harian/bulanan.
- **Master Template Engine:**
  - Tambah/edit template baru, unggah thumbnail cover, tetapkan kategori, dan tentukan status *Free* vs *Premium*.
  - Atur konfigurasi section bawaan dan slot default template.
- **Manajemen Transaksi & Order:** Daftar riwayat pembayaran Midtrans/Xendit, filter status sukses/menunggu/gagal, dan kemampuan memicu pengecekan ulang status secara manual.
- **Manajemen Kupon Diskon:** Membuat kode voucher promo, persentase/potongan nominal, kuota penggunaan, dan masa berlaku.
- **Moderasi Konten & Pengguna:** Memblokir atau menghapus undangan publik yang melanggar hukum, norma, atau mengandung spam.

---

# 22. Model Data Relasional (Prisma Schema Reference)

Arsitektur basis data relasional dirancang menggunakan **Prisma ORM** dengan database target **MySQL** (sesuai setup pada paket `@senara/db`).

```text
User (Clerk Auth Id)
 ├── Invitation (1 to N)
 │    ├── Template (N to 1)
 │    ├── InvitationSection (1 to N)
 │    ├── InvitationCustomContent (1 to N, Fitur "Isian Kamu")
 │    ├── EventSchedule (1 to N)
 │    ├── BankAccount (1 to N)
 │    ├── GalleryMedia (1 to N)
 │    ├── LoveStory (1 to N)
 │    ├── Guest (1 to N)
 │    ├── RSVPResponse (1 to N)
 │    └── PageViewStat (1 to N)
 └── Order (1 to N)
      └── PaymentTransaction (1 to 1)
```

### Definisi Skema Inti (Prisma Blueprint):

```prisma
enum Role {
  USER
  ADMIN
}

enum InvitationStatus {
  DRAFT
  PUBLISHED
  EXPIRED
  ARCHIVED
}

enum PackageTier {
  FREE
  PREMIUM
}

enum AttendanceStatus {
  ATTENDING
  NOT_ATTENDING
  UNCERTAIN
}

enum OrderStatus {
  PENDING
  PAID
  FAILED
  EXPIRED
  REFUNDED
}

enum ContentType {
  TITLE
  TEXT
  PHOTO
  VIDEO
  BUTTON
  LINK
  YOUTUBE
  MAP
}

model User {
  id          String       @id // Clerk User ID (e.g. user_2xyz...)
  email       String       @unique
  name        String?
  phone       String?
  avatarUrl   String?
  role        Role         @default(USER)
  invitations Invitation[]
  orders      Order[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([email])
}

model Template {
  id          String        @id @default(cuid())
  slug        String        @unique
  name        String
  category    String        // WEDDING, BIRTHDAY, KHITANAN, etc.
  thumbnail   String
  previewUrl  String?
  isPremium   Boolean       @default(false)
  price       Decimal       @default(0.00) @db.Decimal(10, 2)
  isActive    Boolean       @default(true)
  invitations Invitation[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([category, isPremium, isActive])
}

model Invitation {
  id              String            @id @default(cuid())
  userId          String
  templateId      String
  title           String            // e.g. "Adinda & Bagas"
  slug            String            @unique // e.g. "adinda-bagas"
  status          InvitationStatus  @default(DRAFT)
  packageTier     PackageTier       @default(FREE)
  eventDate       DateTime?
  themeConfig     Json?             // Palet warna, typography, style overrides
  musicUrl        String?
  musicTitle      String?
  isMusicAutoplay Boolean           @default(true)
  coverImageUrl   String?
  publishedAt     DateTime?
  expiresAt       DateTime?
  
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  template        Template          @relation(fields: [templateId], references: [id])
  sections        InvitationSection[]
  customContents  InvitationCustomContent[]
  schedules       EventSchedule[]
  bankAccounts    BankAccount[]
  galleries       GalleryMedia[]
  loveStories     LoveStory[]
  guests          Guest[]
  rsvps           RSVPResponse[]
  stats           PageViewStat[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([userId])
  @@index([slug])
  @@index([status])
}

model InvitationSection {
  id           String      @id @default(cuid())
  invitationId String
  sectionKey   String      // e.g. "hero", "couple", "event", "gallery", "gift", "rsvp"
  title        String?
  sortOrder    Int         @default(0)
  isVisible    Boolean     @default(true)
  isLocked     Boolean     @default(false)
  dataPayload  Json?       // Data spesifik section

  invitation   Invitation  @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@unique([invitationId, sectionKey])
  @@index([invitationId, sortOrder])
}

model InvitationCustomContent {
  id           String      @id @default(cuid())
  invitationId String
  slotId       String      // e.g. "after-couple", "after-event", "before-footer"
  type         ContentType
  sortOrder    Int         @default(0) // Urutan dalam slot yang sama (1, 2, 3...)
  content      Json        // Payload: { text, url, caption, mapUrl, buttonLabel, etc. }
  isVisible    Boolean     @default(true)

  invitation   Invitation  @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@index([invitationId, slotId, sortOrder])
}

model EventSchedule {
  id           String     @id @default(cuid())
  invitationId String
  title        String     // e.g. "Akad Nikah", "Resepsi Siang"
  date         DateTime
  startTime    String     // "08:00"
  endTime      String?    // "Selesai" atau "11:00"
  timezone     String     @default("WIB")
  venueName    String     // "Masjid Agung Al-Barkah"
  address      String     @db.Text
  mapsUrl      String?    @db.Text
  latitude     Float?
  longitude    Float?

  invitation   Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@index([invitationId])
}

model BankAccount {
  id           String     @id @default(cuid())
  invitationId String
  bankName     String     // "BCA", "Mandiri", "GoPay"
  accountNo    String
  accountName  String     // "Adinda Rahma"
  qrisImageUrl String?

  invitation   Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@index([invitationId])
}

model GalleryMedia {
  id           String     @id @default(cuid())
  invitationId String
  mediaUrl     String
  mediaType    String     @default("IMAGE") // IMAGE atau VIDEO
  caption      String?
  sortOrder    Int        @default(0)

  invitation   Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@index([invitationId, sortOrder])
}

model LoveStory {
  id           String     @id @default(cuid())
  invitationId String
  yearOrDate   String     // "Oktober 2022"
  title        String     // "Awal Bertemu"
  story        String     @db.Text
  imageUrl     String?
  sortOrder    Int        @default(0)

  invitation   Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@index([invitationId, sortOrder])
}

model Guest {
  id           String        @id @default(cuid())
  invitationId String
  name         String
  phone        String?
  category     String?       // VIP, Keluarga, Teman
  customSlug   String?
  isSentWa     Boolean       @default(false)
  sentWaAt     DateTime?
  rsvps        RSVPResponse[]

  invitation   Invitation    @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@index([invitationId, name])
}

model RSVPResponse {
  id           String           @id @default(cuid())
  invitationId String
  guestId      String?
  guestName    String
  attendance   AttendanceStatus
  guestCount   Int              @default(1)
  message      String?          @db.Text
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime         @default(now())

  invitation   Invitation       @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  guest        Guest?           @relation(fields: [guestId], references: [id], onDelete: SetNull)

  @@index([invitationId, createdAt])
}

model PageViewStat {
  id           String     @id @default(cuid())
  invitationId String
  viewedAt     DateTime   @default(now())
  deviceType   String?    // mobile, desktop, tablet
  browser      String?    // chrome, safari, in-app
  referrer     String?
  city         String?

  invitation   Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@index([invitationId, viewedAt])
}

model Order {
  id          String              @id @default(cuid())
  orderNumber String              @unique // INV-202610-001
  userId      String
  tier        PackageTier
  amount      Decimal             @db.Decimal(10, 2)
  status      OrderStatus         @default(PENDING)
  payment     PaymentTransaction?

  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@index([userId, status])
}

model PaymentTransaction {
  id            String    @id @default(cuid())
  orderId       String    @unique
  gateway       String    // "MIDTRANS" atau "XENDIT"
  transactionId String?   @unique
  paymentType   String?   // "qris", "bank_transfer", dll.
  vaNumber      String?
  paymentStatus String
  rawResponse   Json?
  paidAt        DateTime?

  order         Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

---

# 23. Media Storage & Image Pipeline

Unggahan foto berkualitas tinggi dari ponsel pengguna seringkali berukuran besar (5–15 MB), yang dapat menyebabkan beban loading parah bagi tamu.

## 23.1 Alur Pemrosesan Gambar (Optimization Pipeline)
```text
Pengguna Unggah Foto di Editor Canvas
    ↓
Presigned URL Request ke tRPC Server
    ↓
Unggah Langsung ke Cloudflare R2 (Bypass Next.js server payload limit)
    ↓
Edge Worker / Cloudflare Image Transformation
    • Kompresi cerdas (Lossy compression ~80% quality)
    • Konversi otomatis ke format WebP / AVIF
    • Pembuatan varian resolusi: Thumbnail (300px), Medium (800px), Full HD (1600px)
    ↓
Aset Disajikan via Cloudflare Global CDN
    ↓
Klien Tamu Mengonsumsi Gambar Cepat & Hemat Kuota
```

## 23.2 Batasan Ukuran Berkas
- **Foto:** Maksimal 10 MB per berkas. Format: JPG, PNG, WebP, HEIC (otomatis dikonversi ke JPEG).
- **Audio Musik:** Maksimal 5 MB per berkas. Format: MP3, AAC.
- **Video:** Maksimal 25 MB jika direct upload; lebih direkomendasikan menggunakan embed tautan YouTube.

---

# 24. Arsitektur Rute & URL

Struktur routing menggunakan **Next.js App Router** pada monorepo `apps/web`:

### 24.1 Rute Publik & Pemasaran
- `/` : Landing Page utama Senara (Katalog fitur, testimoni, harga).
- `/template` : Galeri template publik dengan filter kategori.
- `/template/[slug]` : Detail showcase template demo interaktif.
- `/sign-in` & `/sign-up` : Halaman otentikasi didukung Clerk.

### 24.2 Rute Terotentikasi (Aplikasi Pengguna)
- `/dashboard` : Ringkasan akun dan daftar undangan pengguna.
- `/dashboard/invitations` : Manajemen koleksi undangan (Undangan Saya).
- `/dashboard/templates` : Pemilihan template untuk undangan baru.
- `/dashboard/guests/[invitationId]` : Manajemen daftar tamu & pengiriman WhatsApp.
- `/dashboard/rsvp/[invitationId]` : Rekapitulasi respon RSVP dan buku ucapan.
- `/dashboard/stats/[invitationId]` : Laporan statistik dan analitik pengunjung.
- `/dashboard/billing` : Tagihan, riwayat invoice, dan status pesanan.
- `/dashboard/account` : Pengaturan akun dan profil.

### 24.3 Rute Canvas Editor
- `/editor/[invitationId]` : Halaman editor visual WYSIWYG utama (bebas sidebar dashboard, layar penuh untuk fokus desain).

### 24.4 Rute Undangan Tamu (High-Performance Edge Serving)
- `/[slug]` : Tampilan undangan publik (misal: `senara.id/adinda-bagas`).
- `/[slug]?to=[encodedGuestName]` : Tampilan personalisasi tamu (misal: `senara.id/adinda-bagas?to=Budi+Sekeluarga`).
- `/[slug]/kpd/[guestSlug]` : Rute alternatif personalisasi ramah SEO/sosial media.

---

# 25. Kebutuhan Non-Fungsional (NFR)

## 25.1 Performa (Performance)
- **Core Web Vitals Halaman Tamu:**
  - Largest Contentful Paint (LCP) < 2,5 detik pada jaringan 4G seluler.
  - Cumulative Layout Shift (CLS) < 0,1.
  - First Input Delay (FID) / INP < 100ms.
- **Penerapan Lazy Loading:** Foto galeri di bawah viewport wajib menggunakan native `loading="lazy"` dengan placeholder blur (*Blurhash / Low-Quality Image Placeholder*).

## 25.2 Desain Responsif (Responsive & Cross-Device)
- **Hierarki Perangkat:** Mobile First (360px – 430px) > Tablet (768px) > Desktop (1024px+).
- Lebih dari 90% tamu undangan digital mengakses melalui peramban webview aplikasi smartphone (WhatsApp browser, Instagram in-app browser). Semua komponen wajib teruji anti-patah (*anti-overflow*) pada peramban webview ini.

## 25.3 Optimasi Mesin Pencari & Pratinjau Sosial (SEO & Open Graph)
- Saat tautan undangan dibagikan di WhatsApp, Telegram, Facebook, atau Twitter, kartu Open Graph (OG Tag) wajib tampil sempurna:
  - `og:title` : *Pernikahan Adinda & Bagas* (atau *Undangan Spesial untuk [Nama Tamu]*).
  - `og:description` : *Minggu, 18 Oktober 2026 — Merupakan suatu kehormatan atas kehadiran Anda.*
  - `og:image` : Gambar thumbnail berukuran rasio 1.91:1 (1200 x 630 px) dari cover utama yang dipilih pengantin.

---

# 26. Keamanan & Perlindungan Data

1. **Isolasi Kepemilikan Data (Multi-tenant Authorization):**  
   Setiap mutasi tRPC wajib memvalidasi sesi Clerk pengguna. Pengguna dilarang keras dapat membaca, mengubah, atau menghapus undangan milik pengguna lain (*IDOR prevention*).
2. **Sanitasi Konten & Pencegahan XSS:**  
   Pesan ucapan pada buku tamu yang diinput publik disaring ketat (*HTML escaping*) untuk mencegah injeksi skrip berbahaya (*Cross-Site Scripting*).
3. **Perlindungan Spam RSVP & Rate Limiting:**  
   Endpoint submit ucapan dan RSVP dilindungi oleh Redis / Upstash Rate Limiter (maksimal 5 kali submit per menit per alamat IP) dan validasi honeypot tersembunyi untuk menangkal bot spam.
4. **Keamanan Webhook Transaksi:**  
   Endpoint webhook Midtrans/Xendit memvalidasi tanda tangan kriptografi (*SHA-512 signature*) sebelum memperbarui status order menjadi lunas.

---

# 27. Stack Teknologi & Arsitektur Kode

Sesuai dengan konfigurasi monorepo Senara yang ada:
- **Monorepo Manager:** Turborepo + Bun runtime.
- **Frontend Framework:** Next.js (App Router, React 19) di `apps/web`.
- **API Communication:** tRPC v11 (`@senara/api`) bersinergi dengan `@tanstack/react-query` untuk end-to-end type safety tanpa boilerplate manual.
- **Desain & UI Components:** Tailwind CSS v4, Base UI, dan `@senara/ui` (komponen berbasis Shadcn UI).
- **Database & ORM:** MySQL dengan Prisma ORM di `packages/db`.
- **Autentikasi:** Clerk Auth (`@clerk/nextjs`).
- **Objek Storage & CDN:** Cloudflare R2 dengan custom domain media.
- **Gerbang Pembayaran:** Midtrans / Xendit Snap & Core API.
- **Validasi Skema:** Zod di seluruh lapisan request dan input form.

---

# 28. Roadmap Pengembangan Bertahap (Phased Rollout)

## Fase 1 — Pondasi Inti & Editor Canvas (MVP - Selesai dalam 3 Minggu)
- Konfigurasi skema Prisma database dan relasi multi-tabel di `packages/db`.
- Alur Autentikasi Clerk (Sign In, Sign Up, Profil).
- Dashboard Pengguna (Daftar Undangan, Buat Undangan Baru).
- Galeri Template & Katalog Awal (3 Template Pernikahan Modern).
- Visual Canvas Editor:
  - Inline Text Editing.
  - Penggantian & Pengunggahan Foto.
  - Pengatur Warna Tema & Font.
  - Fitur "Isian Kamu" (Tambah Judul, Teks, Foto, Tombol, Peta).
  - Drag-and-drop urutan section & toggle hide/show.
  - Auto-save engine berbasis debounce.
- Halaman Tamu Publik (`/[slug]`) dengan Cover Gate "Buka Undangan".

## Fase 2 — Interaksi Tamu & Distribusi (Minggu ke-4 s.d. ke-5)
- Personalisasi URL Tamu (`?to=Nama+Tamu`).
- Modul RSVP & Dinding Buku Tamu Interaktif.
- Modul Amplop Digital (Salin rekening bank & gambar QRIS).
- Integrasi Musik Latar & Floating Audio Player.
- Fitur Manajemen Buku Tamu & Generator Tautan Pesan WhatsApp.

## Fase 3 — Monetisasi & Pembayaran Otomatis (Minggu ke-6)
- Integrasi Payment Gateway Midtrans/Xendit (QRIS & Virtual Account).
- Penegakan Fitur Gratis vs Premium (Watermark, batas draf, kuota tamu).
- Webhook aktivasi instan & halaman Riwayat Tagihan.

## Fase 4 — Analitik & Panel Admin (Minggu ke-7)
- Dashboard Analitik Pengunjung Undangan (Grafik per hari, perangkat).
- Admin Dashboard: Kelola User, Kelola Transaksi, Kelola Kupon Diskon.
- Template Manager untuk mempublikasikan template baru tanpa deployment ulang kode.

---

# 29. Kriteria Penerimaan Komprehensif (Acceptance Criteria)

### 29.1 Canvas Editor & Fitur "Isian Kamu"
- [ ] Pengguna dapat mengetik langsung teks pada canvas preview dan melihat hasil instan.
- [ ] Pengguna dapat membuka modal "Isian Kamu" dan memilih slot jangkar tujuan (*Muncul setelah*).
- [ ] Isian kustom tidak hilang dan tetap tampil di posisi relatif yang benar meskipun section di atasnya dinonaktifkan.
- [ ] Pengguna dapat menambahkan 8 tipe konten isian (Judul, Teks, Foto, Video, Tombol, Tautan, YouTube, Peta).
- [ ] Pengguna dapat menukar urutan komponen di dalam slot yang sama menggunakan panah Naik/Turun.
- [ ] Menghapus seluruh isian di satu slot selalu memunculkan modal konfirmasi protektif.
- [ ] Semua perubahan editor tersimpan otomatis ke database tanpa mengharuskan pengguna menekan tombol simpan manual.

### 29.2 Undangan Publik & Pengalaman Tamu
- [ ] Halaman undangan publik dapat dibuka dengan lancar di peramban seluler (Chrome & Safari iOS/Android).
- [ ] Layar gerbang "Buka Undangan" muncul di awal dengan nama tamu yang sesuai parameter `?to=...`.
- [ ] Mengklik "Buka Undangan" secara konsisten memutar musik latar dan membuka kunci scroll halaman.
- [ ] Tombol salin nomor rekening berhasil menyalin angka ke clipboard dengan notifikasi toast visual yang jelas.
- [ ] Formulir RSVP berhasil mencatat data kehadiran dan menampilkan ucapan di feed buku tamu secara real-time.
- [ ] Metadata Open Graph (judul dan gambar pratinjau) tampil dengan benar saat tautan dibagikan ke WhatsApp.

### 29.3 Transaksi & Pembayaran
- [ ] Pengguna dapat memilih opsi Upgrade Premium dan mendapatkan kode pembayaran QRIS atau Virtual Account.
- [ ] Webhook pembayaran berhasil memverifikasi pembayaran lunas dan seketika mencabut watermark serta membuka status premium undangan.

---

# 30. Prinsip UX & Core Product Loop

```text
┌─────────────────────────────────────────────────────────────┐
│                    CORE PRODUCT LOOP                        │
│                                                             │
│  1. Pilih Template ───────► 2. Isi Data & Personalisasi     │
│          ▲                              │                   │
│          │                              ▼                   │
│  6. Tamu Terkesan           3. Pratinjau & Terbitkan        │
│     & Mendaftar Buat                    │                   │
│     Undangan Sendiri                    ▼                   │
│          │                  4. Sebarkan via WhatsApp        │
│          │                              │                   │
│          └──────── 5. Tamu Hadir & ─────┘                   │
│                       Isi Buku Tamu                         │
└─────────────────────────────────────────────────────────────┘
```

1. **Kecepatan di Atas Kerumitan (*Speed over Complexity*):** Alur pembuatan tidak boleh membebani pengguna dengan formulir beranak yang membosankan. Konsep utamanya adalah mengedit langsung apa yang dilihat.
2. **Keindahan Visual Selaras (*Design Guardrails*):** Sekalipun pengguna memiliki kebebasan menambahkan "Isian Kamu", sistem tetap menjaga konsistensi padding, jenis font, dan palet warna agar undangan tetap terlihat elegan seperti karya desainer profesional.
3. **Viralitas Alami (*Growth Loop*):** Setiap undangan digital yang disebarkan kepada ratusan tamu menjadi media pemasaran terbaik bagi Senara. Badge footer santun pada paket gratis dan pengalaman tamu yang mulus menjadi motor utama akuisisi pengguna baru secara organik.
