# 📝 Backlog Tugas Vibe Coding Senara

Dokumen ini adalah daftar tugas terperinci (*bite-sized development tasks*) yang dirancang khusus untuk sesi **vibe coding**. Setiap tugas memiliki cakupan yang terisolasi, file target yang jelas, dan kriteria penyelesaian (*Definition of Done*) yang terukur.

---

## 🚦 Cara Menggunakan Backlog Ini saat Vibe Coding

1. **Pilih 1 tugas saja** dalam satu prompt (misal: `Task 1.1`).
2. Berikan referensi file yang tercantum pada tugas tersebut kepada AI.
3. Setelah tugas selesai dan lulus `bun run check-types`, beri tanda centang `[x]` pada dokumen ini.
4. Lakukan commit Git kecil (misal: `feat(db): complete task 1.1 - schema models`).
5. Lanjutkan ke tugas berikutnya secara berurutan.

---

## 📦 Epic 1: Basis Data & Skema Prisma (`packages/db`)

- [ ] **Task 1.1 — Implementasi Skema Model Inti Prisma**
  - **Berkas Target:** `packages/db/prisma/schema/schema.prisma`
  - **Deskripsi:** Menuliskan seluruh model relasional (`User`, `Template`, `Invitation`, `InvitationSection`, `InvitationCustomContent`, `EventSchedule`, `BankAccount`, `GalleryMedia`, `LoveStory`, `Guest`, `RSVPResponse`, `PageViewStat`, `Order`, `PaymentTransaction`) sesuai spesifikasi di [DATABASE_SCHEMA.md](file:///d:/senara/docs/DATABASE_SCHEMA.md).
  - **DoD:** `bun --filter @senara/db run prisma generate` berhasil tanpa galat sintaks.

- [ ] **Task 1.2 — Eksekusi Migrasi Awal Database MySQL**
  - **Berkas Target:** `packages/db/prisma/migrations/`
  - **Deskripsi:** Menjalankan `prisma migrate dev --name init_senara_core` untuk membuat tabel dan indeks pada MySQL lokal.
  - **DoD:** Tabel terbentuk di MySQL dan migration lock tersimpan rapi.

- [ ] **Task 1.3 — Script Seeding Master Template & Kategori**
  - **Berkas Target:** `packages/db/src/seed.ts`, `packages/db/package.json`
  - **Deskripsi:** Membuat script seeder untuk menyisipkan minimal 3 template master awal (*Kartu Pos Vintage*, *Minimalis Elegan*, *Floral Romance*) lengkap dengan konfigurasi section bawaan.
  - **DoD:** `bun --filter @senara/db run db:seed` berhasil mengisi tabel `Template`.

---

## ⚡ Epic 2: Lapisan Router tRPC (`packages/api`)

- [ ] **Task 2.1 — Router Template & Kategori (`template.ts`)**
  - **Berkas Target:** `packages/api/src/routers/template.ts`
  - **Prosedur:**
    - `template.getAll` (Query publik dengan filter kategori).
    - `template.getBySlug` (Query publik untuk live preview).
  - **DoD:** Terdaftar di `appRouter` dan lulus pemeriksaan tipe.

- [ ] **Task 2.2 — Router Undangan Pengguna (`invitation.ts`)**
  - **Berkas Target:** `packages/api/src/routers/invitation.ts`
  - **Prosedur:**
    - `invitation.getMyInvitations` (Query protected daftar undangan milik user).
    - `invitation.getById` (Query protected detail undangan & relasinya untuk editor).
    - `invitation.createFromTemplate` (Mutasi protected membuat draf baru dari template).
    - `invitation.updateMetadata` (Mutasi protected mengubah judul, slug, tanggal acara).
    - `invitation.duplicate` (Mutasi protected menyalin seluruh data undangan).
    - `invitation.delete` (Mutasi protected menghapus undangan dengan verifikasi kepemilikan).
  - **DoD:** Memiliki proteksi IDOR (`where: { id, userId: ctx.auth.userId }`).

- [ ] **Task 2.3 — Router Section & Fitur "Isian Kamu" (`section.ts` & `custom-content.ts`)**
  - **Berkas Target:** `packages/api/src/routers/section.ts`, `packages/api/src/routers/custom-content.ts`
  - **Prosedur:**
    - `section.reorderAndToggle` (Mutasi batch mengupdate `sortOrder` dan `isVisible`).
    - `customContent.add` (Mutasi menambah blok isian ke `slotId` tertentu).
    - `customContent.update` (Mutasi update payload JSON isian).
    - `customContent.reorder` (Mutasi menukar `sortOrder` intra-slot).
    - `customContent.deleteItem` (Mutasi menghapus 1 item).
    - `customContent.deleteSlot` (Mutasi menghapus seluruh isian di slot tersebut).
  - **DoD:** Validasi Zod ketat untuk 8 tipe konten `ContentType`.

- [ ] **Task 2.4 — Router Tamu & RSVP (`guest.ts` & `rsvp.ts`)**
  - **Berkas Target:** `packages/api/src/routers/guest.ts`, `packages/api/src/routers/rsvp.ts`
  - **Prosedur:**
    - `guest.list` & `guest.batchCreate` (Protected procedure manajemen tamu).
    - `guest.updateStatusSent` (Protected procedure tandai WhatsApp terkirim).
    - `rsvp.submit` (Public procedure pengiriman konfirmasi hadir & ucapan dari tamu).
    - `rsvp.listByInvitation` (Public/Protected procedure pagination buku ucapan).
  - **DoD:** Input disanitasi dari potensi serangan XSS.

---

## 🖥️ Epic 3: Dashboard Pengguna (`apps/web`)

- [ ] **Task 3.1 — Desain Layout & Sidebar Dashboard**
  - **Berkas Target:** `apps/web/src/app/dashboard/layout.tsx`, `apps/web/src/components/dashboard-sidebar.tsx`
  - **Deskripsi:** Membuat sidebar responsif dengan navigasi lengkap (Undangan Saya, Kirim WhatsApp, RSVP, Statistik, Tagihan, Akun, Konsultasi).
  - **DoD:** Active link state berjalan mulus dan responsif di mode mobile (drawer sheet).

- [ ] **Task 3.2 — Komponen Kartu Undangan (Invitation Card)**
  - **Berkas Target:** `apps/web/src/components/invitation-card.tsx`
  - **Deskripsi:** Menampilkan thumbnail, badge status (Draf/Terbit), sisa masa aktif draf gratis, tombol Edit, Terbitkan, dan dropdown aksi lanjutan (Duplikat, Hapus, Bagikan).
  - **DoD:** Dialog konfirmasi hapus berfungsi dengan aman.

- [ ] **Task 3.3 — Halaman Galeri Pemilihan Template Baru**
  - **Berkas Target:** `apps/web/src/app/dashboard/templates/page.tsx`
  - **Deskripsi:** Filter kategori acara, kartu template dengan modal live preview, dan tombol `Gunakan Template Ini` yang mengarahkan ke editor.
  - **DoD:** Mengklik template berhasil memicu mutasi `invitation.createFromTemplate` dan redirect ke `/editor/[id]`.

---

## 🎨 Epic 4: Visual Canvas Editor (`apps/web/src/app/editor/[invitationId]`)

- [ ] **Task 4.1 — Shell & Layout Canvas Editor**
  - **Berkas Target:** `apps/web/src/app/editor/[invitationId]/page.tsx`
  - **Deskripsi:** Header toolbar atas (Kembali, status Auto-save, tombol Tema, Urutan, Pratinjau, Terbitkan) dan area kanvas tengah yang mensimulasikan layar ponsel (375px) dengan latar desktop yang bersih.
  - **DoD:** Layout tidak terganggu oleh sidebar dashboard (tampilan fokus).

- [ ] **Task 4.2 — Mesin Auto-Save Berbasis Debounce**
  - **Berkas Target:** `apps/web/src/hooks/use-editor-autosave.ts`
  - **Deskripsi:** Hook state lokal yang merekam ketikan teks pengguna dan mengirimkan mutasi update ke tRPC setelah idle 600ms dengan indikator visual (`● Tersimpan` / `◌ Menyimpan...`).
  - **DoD:** Tidak ada request berulang berlebihan saat pengguna mengetik cepat.

- [ ] **Task 4.3 — Panel Kustomisasi Tema & Tipografi**
  - **Berkas Target:** `apps/web/src/components/editor/theme-modal.tsx`
  - **Deskripsi:** Modal pemilihan palet warna (Primary, Secondary, Background, Accent) dan font heading/body dengan pratinjau instan di kanvas.
  - **DoD:** CSS variables tema di kanvas preview langsung terupdate seketika.

- [ ] **Task 4.4 — Modal Manajemen Urutan & Visibilitas Section**
  - **Berkas Target:** `apps/web/src/components/editor/section-reorder-modal.tsx`
  - **Deskripsi:** Antarmuka daftar section dengan tombol geser urutan (*reorder*) dan sakelar toggle *show/hide* per section opsional.
  - **DoD:** Mengubah urutan dan toggle langsung memicu mutasi batch dan memperbarui tampilan kanvas.

---

## 🧩 Epic 5: Mesin "Isian Kamu" (Custom Content Slots)

- [ ] **Task 5.1 — Modal & Pemilih Slot "Isian Kamu"**
  - **Berkas Target:** `apps/web/src/components/editor/custom-content-modal.tsx`
  - **Deskripsi:** Antarmuka modal sesuai PRD Bab 13: dropdown pilihan *Muncul setelah*, keterangan persistent slot, indikator posisi (*contoh: 2/4*), dan tombol panah `↑ Naik` / `↓ Turun`.
  - **DoD:** Pemilihan slot dinamis terikat pada `slotId` yang valid.

- [ ] **Task 5.2 — Form Input untuk 8 Tipe Konten**
  - **Berkas Target:** `apps/web/src/components/editor/custom-content-forms.tsx`
  - **Deskripsi:** Form dinamis sesuai tipe terpilih: Judul, Teks, Foto, Video, Tombol CTA, Tautan Teks, YouTube Embed, Peta Lokasi.
  - **DoD:** Komponen baru langsung muncul di posisi slot pada kanvas pratinjau.

- [ ] **Task 5.3 — Aturan Persistent Slot & Hapus Bersih**
  - **Berkas Target:** `apps/web/src/components/editor/custom-content-modal.tsx`
  - **Deskripsi:** Tombol hapus satuan dan tombol `Hapus Seluruh Isian di Slot Ini` dengan modal konfirmasi protektif.
  - **DoD:** Jika section induk disembunyikan, isian tetap tampil di slot yang telah ditentukan (*persistent*).

---

## 📱 Epic 6: Undangan Publik & Pengalaman Tamu (`apps/web/src/app/[slug]`)

- [ ] **Task 6.1 — Layar Gerbang Sampul & Kepatuhan Audio Autoplay (Cover Gate)**
  - **Berkas Target:** `apps/web/src/components/invitation/cover-gate.tsx`
  - **Deskripsi:** Sampul pembuka layar penuh yang menampilkan nama acara, teks personalisasi tamu (*Kepada Yth. [Nama]*), dan tombol interaktif `✉ Buka Undangan`.
  - **DoD:** Mengklik tombol sukses memicu pemutaran audio latar (bebas blokir browser), membuka kunci scroll, dan memunculkan floating audio controller.

- [ ] **Task 6.2 — Modul Rincian Acara, Peta & Hitung Mundur (Countdown)**
  - **Berkas Target:** `apps/web/src/components/invitation/event-section.tsx`, `countdown-timer.tsx`
  - **Deskripsi:** Informasi akad/resepsi, hitung mundur real-time, tombol navigasi Google Maps, dan tombol Simpan ke Google Calendar.
  - **DoD:** Tautan Google Maps membuka koordinat yang akurat.

- [ ] **Task 6.3 — Modul Amplop Digital & QRIS (Digital Gift)**
  - **Berkas Target:** `apps/web/src/components/invitation/digital-gift-section.tsx`
  - **Deskripsi:** Daftar kartu rekening bank/e-wallet dengan tombol salin satu-klik (clipboard API + feedback toast), tampilan QRIS modal, dan alamat kirim kado fisik.
  - **DoD:** Nomor rekening tersalin sempurna di perangkat seluler.

- [ ] **Task 6.4 — Modul Buku Tamu & Form RSVP Real-Time**
  - **Berkas Target:** `apps/web/src/components/invitation/rsvp-section.tsx`
  - **Deskripsi:** Form konfirmasi kehadiran (Hadir/Tidak/Ragu, jumlah tamu, doa ucapan) dan dinding ucapan kronologis interaktif.
  - **DoD:** Ucapan yang baru disubmit langsung muncul di dinding ucapan tanpa perlu me-refresh halaman.

- [ ] **Task 6.5 — Personalisasi Tamu via Query URL (`?to=...`)**
  - **Berkas Target:** `apps/web/src/app/[slug]/page.tsx`
  - **Deskripsi:** Membaca parameter query URL `to` dan menyuntikkannya ke Cover Gate serta mengunci nama default pada form RSVP.
  - **DoD:** URL `senara.id/adinda-bagas?to=Budi+Santoso` menampilkan nama "Budi Santoso" secara otomatis.

---

## 💬 Epic 7: Manajemen Tamu & Integrasi WhatsApp (`apps/web/src/app/dashboard/guests`)

- [ ] **Task 7.1 — Tabel Daftar Tamu & Tambah Manual**
  - **Berkas Target:** `apps/web/src/app/dashboard/guests/[invitationId]/page.tsx`
  - **Deskripsi:** Tabel manajemen tamu: nama, nomor WhatsApp, kategori tamu, dan status kirim.
  - **DoD:** Tambah, edit, dan hapus tamu berjalan mulus.

- [ ] **Task 7.2 — Impor Massal Tamu dari Excel / CSV**
  - **Berkas Target:** `apps/web/src/components/guests/guest-import-dialog.tsx`
  - **Deskripsi:** Dialog unggah berkas `.xlsx` / `.csv` dengan parsing kolom `Nama`, `Nomor_WA`, `Kategori`.
  - **DoD:** Berhasil mengimpor 50+ tamu sekaligus dalam hitungan detik.

- [ ] **Task 7.3 — Generator Pesan WhatsApp & Tombol Kirim Langsung**
  - **Berkas Target:** `apps/web/src/components/guests/whatsapp-composer.tsx`
  - **Deskripsi:** Penyusunan template pesan dengan variabel `{{guest_name}}` dan `{{invitation_url}}`, dilengkapi tombol satu-klik yang membuka `https://api.whatsapp.com/send?...`.
  - **DoD:** Menandai status tamu otomatis menjadi `Sudah Dikirim` setelah tombol ditekan.

---

## 💳 Epic 8: Monetisasi, Tagihan & Payment Gateway

- [ ] **Task 8.1 — Halaman Upgrade Paket & Integrasi Midtrans Snap**
  - **Berkas Target:** `apps/web/src/app/dashboard/billing/page.tsx`, `apps/web/src/components/billing/pricing-modal.tsx`
  - **Deskripsi:** Matriks perbandingan paket Gratis vs Premium dan integrasi script Midtrans Snap untuk memunculkan modal pembayaran QRIS / Virtual Account.
  - **DoD:** Popup pembayaran Midtrans muncul dengan invoice terdaftar.

- [ ] **Task 8.2 — Webhook Handler Pembayaran Otomatis**
  - **Berkas Target:** `apps/web/src/app/api/webhooks/payment/route.ts`
  - **Deskripsi:** Route Handler Next.js yang memproses payload notifikasi pembayaran Midtrans, memvalidasi SHA-512 signature hash, dan mengupgrade status paket undangan ke `PREMIUM`.
  - **DoD:** Undangan otomatis beralih ke Premium tanpa intervensi manual.

---

## 📊 Epic 9: Analitik, SEO Open Graph & Verifikasi Akhir

- [ ] **Task 9.1 — Dashboard Statistik Kunjungan**
  - **Berkas Target:** `apps/web/src/app/dashboard/stats/[invitationId]/page.tsx`
  - **Deskripsi:** Ringkasan total views, grafik kunjungan harian, persentase perangkat seluler vs desktop, dan rasio kehadiran RSVP.
  - **DoD:** Data analitik tervisualisasi dengan grafik yang rapi (Recharts / Chart primitives).

- [ ] **Task 9.2 — Dynamic SEO & Open Graph Image**
  - **Berkas Target:** `apps/web/src/app/[slug]/layout.tsx`
  - **Deskripsi:** Implementasi `generateMetadata` Next.js untuk menyematkan Open Graph tags dinamis (`og:title`, `og:description`, `og:image`).
  - **DoD:** Kartu preview tautan di WhatsApp menampilkan judul acara dan thumbnail yang benar.

- [ ] **Task 9.3 — Audit Verifikasi Kualitas Monorepo**
  - **Deskripsi:** Menjalankan audit menyeluruh:
    ```bash
    bun run check-types
    bun run build
    ```
  - **DoD:** Seluruh paket monorepo berhasil di-build tanpa galat TypeScript atau peringatan build kritis.

