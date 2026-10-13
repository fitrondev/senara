# 📝 Backlog Tugas Vibe Coding Senara

Dokumen ini adalah daftar tugas terperinci (_bite-sized development tasks_) yang dirancang khusus untuk sesi **vibe coding**. Setiap tugas memiliki cakupan yang terisolasi, file target yang jelas, dan kriteria penyelesaian (_Definition of Done_) yang terukur.

---

## 🚦 Cara Menggunakan Backlog Ini saat Vibe Coding

1. **Pilih 1 tugas saja** dalam satu prompt (misal: `Task 1.1`).
2. Berikan referensi file yang tercantum pada tugas tersebut kepada AI.
3. Setelah tugas selesai dan lulus `bun run check-types`, beri tanda centang `[x]` pada dokumen ini.
4. Lakukan commit Git kecil (misal: `feat(db): complete task 1.1 - schema models`).
5. Lanjutkan ke tugas berikutnya secara berurutan.

---

## 📦 Epic 1: Basis Data & Skema Prisma (`packages/db`)

- [x] **Task 1.1 — Implementasi Skema Model Inti Prisma**
  - **Berkas Target:** `packages/db/prisma/schema/schema.prisma`
  - **Deskripsi:** Menuliskan seluruh model relasional (`User`, `Template`, `Invitation`, `InvitationSection`, `InvitationCustomContent`, `EventSchedule`, `BankAccount`, `GalleryMedia`, `LoveStory`, `Guest`, `RSVPResponse`, `PageViewStat`, `Order`, `PaymentTransaction`) sesuai spesifikasi di [DATABASE_SCHEMA.md](file:///d:/senara/docs/DATABASE_SCHEMA.md).
  - **DoD:** `bun --filter @senara/db run prisma generate` berhasil tanpa galat sintaks.

- [x] **Task 1.2 — Eksekusi Migrasi Awal Database MySQL**
  - **Berkas Target:** `packages/db/prisma/migrations/`
  - **Deskripsi:** Menjalankan `prisma migrate dev --name init_senara_core` untuk membuat tabel dan indeks pada MySQL lokal.
  - **DoD:** Tabel terbentuk di MySQL dan migration lock tersimpan rapi.

- [x] **Task 1.3 — Script Seeding Master Template & Kategori**
  - **Berkas Target:** `packages/db/src/seed.ts`, `packages/db/package.json`
  - **Deskripsi:** Membuat script seeder untuk menyisipkan minimal 3 template master awal (_Kartu Pos Vintage_, _Minimalis Elegan_, _Floral Romance_) lengkap dengan konfigurasi section bawaan.
  - **DoD:** `bun --filter @senara/db run db:seed` berhasil mengisi tabel `Template`.

---

## ⚡ Epic 2: Lapisan Router tRPC (`packages/api`)

- [x] **Task 2.1 — Router Template & Kategori (`template.ts`)**
  - **Berkas Target:** `packages/api/src/routers/template.ts`
  - **Prosedur:**
    - `template.getAll` (Query publik dengan filter kategori).
    - `template.getBySlug` (Query publik untuk live preview).
  - **DoD:** Terdaftar di `appRouter` dan lulus pemeriksaan tipe.

- [x] **Task 2.2 — Router Undangan Pengguna (`invitation.ts`)**
  - **Berkas Target:** `packages/api/src/routers/invitation.ts`
  - **Prosedur:**
    - `invitation.getMyInvitations` (Query protected daftar undangan milik user).
    - `invitation.getById` (Query protected detail undangan & relasinya untuk editor).
    - `invitation.createFromTemplate` (Mutasi protected membuat draf baru dari template).
    - `invitation.updateMetadata` (Mutasi protected mengubah judul, slug, tanggal acara).
    - `invitation.duplicate` (Mutasi protected menyalin seluruh data undangan).
    - `invitation.delete` (Mutasi protected menghapus undangan dengan verifikasi kepemilikan).
  - **DoD:** Memiliki proteksi IDOR (`where: { id, userId: ctx.auth.userId }`).

- [x] **Task 2.3 — Router Section & Fitur "Isian Kamu" (`section.ts` & `custom-content.ts`)**
  - **Berkas Target:** `packages/api/src/routers/section.ts`, `packages/api/src/routers/custom-content.ts`
  - **Prosedur:**
    - `section.reorderAndToggle` (Mutasi batch mengupdate `sortOrder` dan `isVisible`).
    - `customContent.add` (Mutasi menambah blok isian ke `slotId` tertentu).
    - `customContent.update` (Mutasi update payload JSON isian).
    - `customContent.reorder` (Mutasi menukar `sortOrder` intra-slot).
    - `customContent.deleteItem` (Mutasi menghapus 1 item).
    - `customContent.deleteSlot` (Mutasi menghapus seluruh isian di slot tersebut).
  - **DoD:** Validasi Zod ketat untuk 8 tipe konten `ContentType`.

- [x] **Task 2.4 — Router Tamu & RSVP (`guest.ts` & `rsvp.ts`)**
  - **Berkas Target:** `packages/api/src/routers/guest.ts`, `packages/api/src/routers/rsvp.ts`
  - **Prosedur:**
    - `guest.list` & `guest.batchCreate` (Protected procedure manajemen tamu).
    - `guest.updateStatusSent` (Protected procedure tandai WhatsApp terkirim).
    - `rsvp.submit` (Public procedure pengiriman konfirmasi hadir & ucapan dari tamu).
    - `rsvp.listByInvitation` (Public/Protected procedure pagination buku ucapan).
  - **DoD:** Input disanitasi dari potensi serangan XSS.

---

## 🖥️ Epic 3: Dashboard Pengguna (`apps/web`)

- [x] **Task 3.1 — Desain Layout & Sidebar Dashboard**
  - **Berkas Target:** `apps/web/src/app/dashboard/layout.tsx`, `apps/web/src/components/dashboard-sidebar.tsx`
  - **Deskripsi:** Membuat sidebar responsif dengan navigasi lengkap (Undangan Saya, Kirim WhatsApp, RSVP, Statistik, Tagihan, Akun, Konsultasi).
  - **DoD:** Active link state berjalan mulus dan responsif di mode mobile (drawer sheet).

- [x] **Task 3.2 — Komponen Kartu Undangan (Invitation Card)**
  - **Berkas Target:** `apps/web/src/components/invitation-card.tsx`
  - **Deskripsi:** Menampilkan thumbnail, badge status (Draf/Terbit), sisa masa aktif draf gratis, tombol Edit, Terbitkan, dan dropdown aksi lanjutan (Duplikat, Hapus, Bagikan).
  - **DoD:** Dialog konfirmasi hapus berfungsi dengan aman.

- [x] **Task 3.3 — Halaman Galeri Pemilihan Template Baru**
  - **Berkas Target:** `apps/web/src/app/dashboard/templates/page.tsx`
  - **Deskripsi:** Filter kategori acara, kartu template dengan modal live preview, dan tombol `Gunakan Template Ini` yang mengarahkan ke editor.
  - **DoD:** Mengklik template berhasil memicu mutasi `invitation.createFromTemplate` dan redirect ke `/editor/[id]`.

---

## 🎨 Epic 4: Visual Canvas Editor (`apps/web/src/app/editor/[invitationId]`)

- [x] **Task 4.1 — Shell & Layout Canvas Editor**
  - **Berkas Target:** `apps/web/src/app/editor/[invitationId]/page.tsx`
  - **Deskripsi:** Header toolbar atas (Kembali, status Auto-save, tombol Tema, Urutan, Pratinjau, Terbitkan) dan area kanvas tengah yang mensimulasikan layar ponsel (375px) dengan latar desktop yang bersih.
  - **DoD:** Layout tidak terganggu oleh sidebar dashboard (tampilan fokus).

- [x] **Task 4.2 — Mesin Auto-Save Berbasis Debounce**
  - **Berkas Target:** `apps/web/src/hooks/use-editor-autosave.ts`
  - **Deskripsi:** Hook state lokal yang merekam ketikan teks pengguna dan mengirimkan mutasi update ke tRPC setelah idle 600ms dengan indikator visual (`● Tersimpan` / `◌ Menyimpan...`).
  - **DoD:** Tidak ada request berulang berlebihan saat pengguna mengetik cepat.

- [x] **Task 4.3 — Panel Kustomisasi Tema & Tipografi**
  - **Berkas Target:** `apps/web/src/components/editor/theme-modal.tsx`
  - **Deskripsi:** Modal pemilihan palet warna (Primary, Secondary, Background, Accent) dan font heading/body dengan pratinjau instan di kanvas.
  - **DoD:** CSS variables tema di kanvas preview langsung terupdate seketika.

- [x] **Task 4.4 — Modal Manajemen Urutan & Visibilitas Section**
  - **Berkas Target:** `apps/web/src/components/editor/section-reorder-modal.tsx`
  - **Deskripsi:** Antarmuka daftar section dengan tombol geser urutan (_reorder_) dan sakelar toggle _show/hide_ per section opsional.
  - **DoD:** Mengubah urutan dan toggle langsung memicu mutasi batch dan memperbarui tampilan kanvas.

---

## 🧩 Epic 5: Mesin "Isian Kamu" (Custom Content Slots)

- [x] **Task 5.1 — Modal & Pemilih Slot "Isian Kamu"**
  - **Berkas Target:** `apps/web/src/components/editor/custom-content-modal.tsx`
  - **Deskripsi:** Antarmuka modal sesuai PRD Bab 13: dropdown pilihan _Muncul setelah_, keterangan persistent slot, indikator posisi (_contoh: 2/4_), dan tombol panah `↑ Naik` / `↓ Turun`.
  - **DoD:** Pemilihan slot dinamis terikat pada `slotId` yang valid.

- [x] **Task 5.2 — Form Input untuk 8 Tipe Konten**
  - **Berkas Target:** `apps/web/src/components/editor/custom-content-forms.tsx`
  - **Deskripsi:** Form dinamis sesuai tipe terpilih: Judul, Teks, Foto, Video, Tombol CTA, Tautan Teks, YouTube Embed, Peta Lokasi.
  - **DoD:** Komponen baru langsung muncul di posisi slot pada kanvas pratinjau.

- [x] **Task 5.3 — Aturan Persistent Slot & Hapus Bersih**
  - **Berkas Target:** `apps/web/src/components/editor/custom-content-modal.tsx`
  - **Deskripsi:** Tombol hapus satuan dan tombol `Hapus Seluruh Isian di Slot Ini` dengan modal konfirmasi protektif.
  - **DoD:** Jika section induk disembunyikan, isian tetap tampil di slot yang telah ditentukan (_persistent_).

---

## 📱 Epic 6: Undangan Publik & Pengalaman Tamu (`apps/web/src/app/[slug]`)

- [x] **Task 6.1 — Layar Gerbang Sampul & Kepatuhan Audio Autoplay (Cover Gate)**
  - **Berkas Target:** `apps/web/src/components/invitation/cover-gate.tsx`
  - **Deskripsi:** Sampul pembuka layar penuh yang menampilkan nama acara, teks personalisasi tamu (_Kepada Yth. [Nama]_), dan tombol interaktif `✉ Buka Undangan`.
  - **DoD:** Mengklik tombol sukses memicu pemutaran audio latar (bebas blokir browser), membuka kunci scroll, dan memunculkan floating audio controller.

- [x] **Task 6.2 — Modul Rincian Acara, Peta & Hitung Mundur (Countdown)**
  - **Berkas Target:** `apps/web/src/components/invitation/event-section.tsx`, `countdown-timer.tsx`
  - **Deskripsi:** Informasi akad/resepsi, hitung mundur real-time, tombol navigasi Google Maps, dan tombol Simpan ke Google Calendar.
  - **DoD:** Tautan Google Maps membuka koordinat yang akurat.

- [x] **Task 6.3 — Modul Amplop Digital & QRIS (Digital Gift)**
  - **Berkas Target:** `apps/web/src/components/invitation/digital-gift-section.tsx`
  - **Deskripsi:** Daftar kartu rekening bank/e-wallet dengan tombol salin satu-klik (clipboard API + feedback toast), tampilan QRIS modal, dan alamat kirim kado fisik.
  - **DoD:** Nomor rekening tersalin sempurna di perangkat seluler.

- [x] **Task 6.4 — Modul Buku Tamu & Form RSVP Real-Time**
  - **Berkas Target:** `apps/web/src/components/invitation/rsvp-section.tsx`
  - **Deskripsi:** Form konfirmasi kehadiran (Hadir/Tidak/Ragu, jumlah tamu, doa ucapan) dan dinding ucapan kronologis interaktif.
  - **DoD:** Ucapan yang baru disubmit langsung muncul di dinding ucapan tanpa perlu me-refresh halaman.

- [x] **Task 6.5 — Personalisasi Tamu via Query URL (`?to=...`)**
  - **Berkas Target:** `apps/web/src/app/[slug]/page.tsx`
  - **Deskripsi:** Membaca parameter query URL `to` dan menyuntikkannya ke Cover Gate serta mengunci nama default pada form RSVP.
  - **DoD:** URL `senara.id/adinda-bagas?to=Budi+Santoso` menampilkan nama "Budi Santoso" secara otomatis.

---

## 💬 Epic 7: Manajemen Tamu & Integrasi WhatsApp (`apps/web/src/app/dashboard/guests`)

- [x] **Task 7.1 — Tabel Daftar Tamu & Tambah Manual**
  - **Berkas Target:** `apps/web/src/app/dashboard/guests/[invitationId]/page.tsx`
  - **Deskripsi:** Tabel manajemen tamu: nama, nomor WhatsApp, kategori tamu, dan status kirim.
  - **DoD:** Tambah, edit, dan hapus tamu berjalan mulus.

- [x] **Task 7.2 — Impor Massal Tamu dari Excel / CSV**
  - **Berkas Target:** `apps/web/src/components/guests/guest-import-dialog.tsx`
  - **Deskripsi:** Dialog unggah berkas `.xlsx` / `.csv` dengan parsing kolom `Nama`, `Nomor_WA`, `Kategori`.
  - **DoD:** Berhasil mengimpor 50+ tamu sekaligus dalam hitungan detik.

- [x] **Task 7.3 — Generator Pesan WhatsApp & Tombol Kirim Langsung**
  - **Berkas Target:** `apps/web/src/components/guests/whatsapp-composer.tsx`
  - **Deskripsi:** Penyusunan template pesan dengan variabel `{{guest_name}}` dan `{{invitation_url}}`, dilengkapi tombol satu-klik yang membuka `https://api.whatsapp.com/send?...`.
  - **DoD:** Menandai status tamu otomatis menjadi `Sudah Dikirim` setelah tombol ditekan.

---

## 💳 Epic 8: Monetisasi, Tagihan & Payment Gateway

- [x] **Task 8.1 — Halaman Upgrade Paket & Integrasi Midtrans Snap**
  - **Berkas Target:** `apps/web/src/app/dashboard/billing/page.tsx`, `apps/web/src/components/billing/pricing-modal.tsx`
  - **Deskripsi:** Matriks perbandingan paket Gratis vs Premium dan integrasi script Midtrans Snap untuk memunculkan modal pembayaran QRIS / Virtual Account.
  - **DoD:** Popup pembayaran Midtrans muncul dengan invoice terdaftar.

- [x] **Task 8.2 — Webhook Handler Pembayaran Otomatis**
  - **Berkas Target:** `apps/web/src/app/api/webhooks/payment/route.ts`
  - **Deskripsi:** Route Handler Next.js yang memproses payload notifikasi pembayaran Midtrans, memvalidasi SHA-512 signature hash, dan mengupgrade status paket undangan ke `PREMIUM`.
  - **DoD:** Undangan otomatis beralih ke Premium tanpa intervensi manual.

---

## 📊 Epic 9: Analitik, SEO Open Graph & Verifikasi Akhir

- [x] **Task 9.1 — Dashboard Statistik Kunjungan**
  - **Berkas Target:** `apps/web/src/app/dashboard/stats/[invitationId]/page.tsx`
  - **Deskripsi:** Ringkasan total views, grafik kunjungan harian, persentase perangkat seluler vs desktop, dan rasio kehadiran RSVP.
  - **DoD:** Data analitik tervisualisasi dengan grafik yang rapi (Recharts / Chart primitives).

- [x] **Task 9.2 — Dynamic SEO & Open Graph Image**
  - **Berkas Target:** `apps/web/src/app/[slug]/layout.tsx`
  - **Deskripsi:** Implementasi `generateMetadata` Next.js untuk menyematkan Open Graph tags dinamis (`og:title`, `og:description`, `og:image`).
  - **DoD:** Kartu preview tautan di WhatsApp menampilkan judul acara dan thumbnail yang benar.

- [x] **Task 9.3 — Audit Verifikasi Kualitas Monorepo**
  - **Deskripsi:** Menjalankan audit menyeluruh:
    ```bash
    bun run check-types
    bun run build
    ```
  - **DoD:** Seluruh paket monorepo berhasil di-build tanpa galat TypeScript atau peringatan build kritis.

---

## 🛡️ Epic 10: Super Admin & Panel Administrasi Platform (`packages/api` & `apps/web/src/app/(admin)/admin`)

- [x] **Task 10.1 — RBAC Middleware, Skema Admin & `adminProcedure` (`packages/db` & `packages/api`)**
  - **Berkas Target:** `packages/db/prisma/schema/schema.prisma`, `packages/api/src/index.ts`, `packages/api/src/routers/admin.ts`
  - **Deskripsi:**
    - Menambahkan model pendukung di Prisma (`Coupon`, `CreditBalance`, `SystemSetting`, serta kolom `proofImageUrl` pada `PaymentTransaction`).
    - Membuat `adminProcedure` di tRPC yang memvalidasi `user.role === "ADMIN"` (atau daftar email Super Admin dari environment variable).
  - **DoD:** Request non-admin ke `admin.*` ditolak dengan `TRPCError({ code: "FORBIDDEN" })`.

- [x] **Task 10.2 — Layout & Dashboard Metrik Global Super Admin (`/admin`)**
  - **Berkas Target:** `apps/web/src/app/(admin)/admin/layout.tsx`, `apps/web/src/app/(admin)/admin/page.tsx`, `apps/web/src/components/admin/admin-sidebar.tsx`
  - **Deskripsi:** Menampilkan ringkasan KPI global platform: Total Pengguna, Total Undangan (Draf vs Terbit), Total Pendapatan (Omzet Harian/Bulanan), rasio konversi, grafik pertumbuhan, dan daftar transaksi terbaru.
  - **DoD:** Hanya Super Admin yang dapat membuka `/admin` dan seluruh statistik terhitung akurat dari database.

- [x] **Task 10.3 — Master Template & Kategori Manager (`/admin/templates`)**
  - **Berkas Target:** `apps/web/src/app/(admin)/admin/templates/page.tsx`
  - **Deskripsi:** Antarmuka CRUD Master Template untuk menambah/mengedit template, mengatur slug, kategori utama (`WEDDING`, `BIRTHDAY`, `KHITANAN`), sub-kategori/tag (_Aesthetic, Simple, Islami, Adat Jawa, Tanpa Foto_, dll.), harga, thumbnail, status aktif, dan preset section bawaan tanpa perlu deploy ulang kode.
  - **DoD:** Template baru yang ditambahkan dari `/admin/templates` langsung tampil di galeri publik dan dashboard pengguna.

- [x] **Task 10.4 — Manajemen Transaksi, Verifikasi Bukti Transfer & Kupon Promo (`/admin/orders` & `/admin/coupons`)**
  - **Berkas Target:** `apps/web/src/app/(admin)/admin/orders/page.tsx`, `apps/web/src/app/(admin)/admin/coupons/page.tsx`
  - **Deskripsi:**
    - Daftar seluruh pesanan pengguna dengan filter status (`PENDING`, `PAID`, `FAILED`), peninjauan gambar bukti transfer bank manual, serta tombol **Setujui Lunas (Approve)** / **Tolak (Reject)**.
    - CRUD kode promo/diskon (`Coupon`: kode promo, tipe potongan persen/nominal, batas kuota pemakaian, dan tanggal kedaluwarsa).
  - **DoD:** Saat Super Admin menyetujui bukti transfer manual, status pesanan otomatis menjadi `PAID` dan undangan pengguna langsung aktif sebagai `PREMIUM`.

- [x] **Task 10.5 — Manajemen Pengguna, Kredit Reseller & Moderasi Undangan (`/admin/users` & `/admin/invitations`)**
  - **Berkas Target:** `apps/web/src/app/(admin)/admin/users/page.tsx`, `apps/web/src/app/(admin)/admin/invitations/page.tsx`
  - **Deskripsi:** Tabel daftar seluruh pengguna (ubah role `USER` / `ADMIN`, kelola kuota kredit reseller) serta tabel moderasi seluruh undangan publik (pratinjau, _unpublish_ paksa, atau hapus undangan spam/melanggar ketentuan).
  - **DoD:** Perubahan role dan moderasi undangan langsung tercatat di basis data.

---

## 🎭 Epic 11: Arsitektur `<Invitation />` Terpadu (Contoh, Edit, dan Publik dalam 1 Komponen seperti UndangYuk)

- [x] **Task 11.1 — Unified `<Invitation />` Engine & `EditContext` (`apps/web/src/components/invitation/unified-invitation.tsx`)**
  - **Berkas Target:** `apps/web/src/components/invitation/unified-invitation.tsx`, `apps/web/src/components/invitation/edit-context.tsx`
  - **Deskripsi:**
    - Membangun arsitektur 1 komponen utama `<Invitation />` yang digunakan bersama oleh 3 halaman:
      1. **Mode Contoh (`demo={true}`, `editing={false}`)** untuk `/template/[slug]`.
      2. **Mode Edit (`editing={true}`, `onPatch`, `onOpenEditor`, `onToggleSection`, `onReorder`)** untuk `/editor/[invitationId]`.
      3. **Mode Publik Tamu (`live={true}`, `editing={false}`, `guestName`)** untuk `/[slug]`.
    - Menyertakan _viewport measurement script_ (`--vh100`, `100svh`, dan _Android soft-keyboard guard_) agar tampilan undangan di HP tidak menyusut saat tamu mengetik ucapan RSVP.
  - **DoD:** Ketiga mode merender komponen template yang identik tanpa duplikasi kode layout.

- [x] **Task 11.2 — Primitif Kanvas Interaktif: `<EditableField />`, `<EditableRegion />`, `<SectionSwitch />` & `<GuestHint />`**
  - **Berkas Target:** `apps/web/src/components/invitation/primitives.tsx`
  - **Deskripsi:**
    - `<EditableField />` (`[data-field]`): Teks biasa saat mode tamu/contoh, dan langsung dapat diklik/diketik _inline_ saat `editing={true}`.
    - `<EditableRegion />` (`.inv-region` & `.inv-region-pill`): Menampilkan tombol kapsul mengambang di pojok blok (Foto, Acara & Tempat, Galeri, Cerita, Rekening Tanda Kasih, Busana Acara, Siaran Langsung, Keluarga) untuk membuka modal editor spesifik.
    - `<SectionSwitch />` (`.inv-section-bar` & `.inv-switch`): Menampilkan sakelar on/off di bawah setiap section pada kanvas editor; jika dimatikan, menampilkan pita `.inv-section-off` bertuliskan _"Bagian ini disembunyikan"_.
    - `<GuestHint />` (`[data-guest-hint]`): Garis bawah putus-putus emas pada nama tamu di sampul yang saat diklik membuka _bottom sheet_ penjelasan _"✨ Nama tamu terisi otomatis"_.
  - **DoD:** Seluruh interaksi edit dapat dilakukan langsung di atas kanvas undangan tanpa berpindah halaman.

- [x] **Task 11.3 — Halaman Pratinjau Publik `/template/[slug]` & Sakelar "Foto / Tanpa Foto" (`PhotoChoice`)**
  - **Berkas Target:** `apps/web/src/app/(root)/template/[slug]/page.tsx`, `apps/web/src/components/invitation/photo-switch.tsx`
  - **Deskripsi:**
    - Membuat halaman showcase `/template/[slug]` dengan bar atas: tombol `← Semua template`, judul desain, sakelar interaktif **Foto / Tanpa foto** (yang secara instan mengosongkan/menampilkan seluruh slot foto di pratinjau), daftar tag kategori, dan tombol `Coba Gratis` / `Pakai Template Ini`.
  - **DoD:** Pengunjung dapat mencoba mode Dengan Foto maupun Tanpa Foto secara _real-time_ sebelum memilih template.

- [x] **Task 11.4 — Implementasi Desain Template Otentik Multi-Acara (Pernikahan, Ulang Tahun, Khitanan)**
  - **Berkas Target:** `apps/web/src/components/invitation/templates/kartu-pos.tsx`, `jawa-biru.tsx`, `blush-confetti.tsx`, `crescent-linen.tsx`
  - **Deskripsi:**
    - Merancang komponen `<Cover />` dan `<Body />` yang memiliki identitas visual khas per tema:
      - _Kartu Pos_ (Pernikahan): Tekstur kertas kraft `#F6EEDC`, bingkai garis pos udara (_Par Avion_) merah-biru, perangko, dan cap pos.
      - _Jawa Biru / Adat Nusantara_ (Pernikahan): Ornamen klasik keraton & tipografi serif Jawa.
      - _Blush Confetti / Dino Picnic_ (Ulang Tahun): Label section otomatis menyesuaikan acara ulang tahun (_Yang Berulang Tahun_, _Cerita_).
      - _Crescent Linen / Zaitun Morning_ (Khitanan): Ornamen Islami hangat dengan label khusus khitanan (_Ananda_, _Cerita Ananda_).
  - **DoD:** Masing-masing kategori acara memiliki template dengan tampilan visual khas dan mendukung mode _Foto / Tanpa Foto_.

---

## 🎨 Epic 12: Fitur Editor Lanjutan ala UndangYuk (Tipografi, Musik YouTube, Ganti Tema, Fokus Foto)

- [x] **Task 12.1 — Katalog Preset Pasangan Tipografi (`fontSet`) & Skala Proporsional**
  - **Berkas Target:** `apps/web/src/lib/font-presets.ts`, `apps/web/src/components/editor/font-modal.tsx`
  - **Deskripsi:** Menyediakan daftar pasangan font kurasi (_Jawa, Klasik, Kontras, Lembut, Modern, Elegan, Anggun, Hangat, Wayang, Sakura, Beludru_, dll.) dengan indikator `★ Font asli desain ini` dan bagian _Disarankan untuk desain ini_.
  - **DoD:** Mengganti pasangan font langsung memperbarui `--f-display`, `--f-script`, dan `--f-body` di kanvas undangan.

- [x] **Task 12.2 — Pengelola Musik Lanjutan (Pustaka, Upload MP3/M4A, Link YouTube & Slider "Mulai Dari")**
  - **Berkas Target:** `apps/web/src/components/editor/music-modal.tsx`
  - **Deskripsi:**
    - 3 tab pemilihan musik: **Pilih Lagu** (pustaka bawaan), **Lagu Kamu Sendiri** (unggah MP3/M4A), dan **Dari YouTube** (input URL YouTube).
    - Slider **"Mulai dari"** (`startAt`) untuk menentukan detik awal pemutaran lagu ketika tamu menekan _Buka Undangan_, serta fitur auto-pause musik latar saat tamu memutar video di galeri.
  - **DoD:** Lagu mulai diputar tepat dari detik `startAt` yang dipilih pengguna saat gerbang sampul dibuka.

- [x] **Task 12.3 — Fitur "Ganti Tema" Tanpa Kehilangan Data & Deteksi Konflik Multi-Tab**
  - **Berkas Target:** `apps/web/src/components/editor/change-theme-modal.tsx`, `packages/api/src/routers/invitation.ts`
  - **Deskripsi:**
    - Memungkinkan pengguna mengganti template desain dari dalam editor sementara seluruh teks, tanggal, acara, dan foto yang sudah diisi tetap terjaga (hanya field yang masih berisi teks contoh yang mengikuti tema baru).
    - Menambahkan pengecekan `updatedAt` untuk mendeteksi jika undangan sedang diubah di tab/perangkat lain (_"Undangan ini diubah di tab lain. Ketuk untuk muat ulang"_).
  - **DoD:** Berpindah dari template _Kartu Pos_ ke _Jawa Biru_ tidak menghapus data mempelai dan jadwal acara pengguna.

- [x] **Task 12.4 — Modal Atur Posisi/Zoom Foto (`photoFocus`) & Galeri "Foto yang Sudah Kamu Unggah"**
  - **Berkas Target:** `apps/web/src/components/editor/photo-framer-modal.tsx`
  - **Deskripsi:**
    - Antarmuka _drag-to-pan_ dan slider _Zoom_ (`{ x, y, zoom }`) dengan bingkai rasio aspek yang sama persis seperti di undangan, plus tombol _Atur ulang_ dan _Tanpa foto_.
    - Menyimpan riwayat URL foto yang pernah diunggah pada undangan tersebut (`uploads`) agar dapat dipilih kembali di bagian lain tanpa unggah ulang.
  - **DoD:** Koordinat fokus dan zoom foto tersimpan dan dirender presisi pada sampul maupun section undangan.

---

## 👥 Epic 13: Ruang Kerja Tamu Terpadu, Link Grup & 2 Add-On Unggulan (Statistik Tamu & Mode Privat)

- [x] **Task 13.1 — Halaman "Tamu & Balasan RSVP" Terpadu + Fitur Link Grup (`/dashboard/guests/[invitationId]`)**
  - **Berkas Target:** `apps/web/src/app/(dashboard)/dashboard/guests/[invitationId]/page.tsx`, `packages/api/src/routers/guest.ts`
  - **Deskripsi:**
    - Menggabungkan manajemen Daftar Tamu, Kirim WA, dan Balasan RSVP dalam satu halaman terpadu:
      - 4 kartu ringkasan di atas: **Tamu**, **Hadir**, **Tidak Hadir**, **Belum Konfirmasi**.
      - Tab tambah tamu **Manual** & **CSV** (beserta unduh contoh CSV).
      - Fitur **Link Grup** (misal _"Keluarga Besar"_): membuat satu tautan untuk grup WhatsApp di mana nama grup tertulis di sampul dan seluruh balasan RSVP dari grup tersebut terkumpul rapi.
      - Aksi per baris tamu: badge status buka (`Dibuka {n}×`), status RSVP & pax, tombol **Lihat ucapan**, **Kirim WA**, **Salin Link**, dan tombol mata **Lihat seperti tamu** (`Tampilan untuk {name}`).
  - **DoD:** Pengguna dapat mengelola tamu, mengirim WA, membuat link grup, dan memantau balasan RSVP dari satu layar.

- [x] **Task 13.2 — Add-On 1: Statistik Tamu Per-Individu & Live Visitor Counter (`Rp 5.000`)**
  - **Berkas Target:** `packages/db/prisma/schema/schema.prisma`, `packages/api/src/routers/analytics.ts`, `apps/web/src/app/(dashboard)/dashboard/stats/[invitationId]/page.tsx`
  - **Deskripsi:**
    - Mencatat kunjungan per `guestId` menggunakan `navigator.sendBeacon`: melacak berapa kali tiap tamu membuka undangan (`{n}× buka`) dan kapan terakhir dibuka (`baru saja`, `5 menit lalu`).
    - Menampilkan indikator _live_: `"{n} orang buka undangan dalam 30 menit terakhir"`, serta tab filter **Semua**, **Sudah buka**, **Belum buka**, dan **Tamu lain (link umum)**.
  - **DoD:** Pemilik undangan dapat melihat daftar nama tamu yang sudah membuka maupun yang belum membuka undangan sama sekali.

- [x] **Task 13.3 — Add-On 2: Mode Privat / Kunci Undangan & Pembatasan Perangkat HP (`Rp 15.000`)**
  - **Berkas Target:** `packages/db/prisma/schema/schema.prisma`, `packages/api/src/routers/invitation.ts`, `apps/web/src/app/[slug]/page.tsx`
  - **Deskripsi:**
    - Saat **Mode Privat** diaktifkan pada undangan, tautan umum tanpa kode tamu yang valid akan menampilkan layar **Undangan Terkunci** (_"Undangan ini khusus untuk tamu yang diundang"_).
    - Mencatat fingerprint perangkat/browser pada setiap link tamu (maksimal `{n}` HP per link pribadi) dan menyediakan tombol **Reset HP** di halaman Tamu jika tamu berganti ponsel.
  - **DoD:** Tautan yang diteruskan ke orang lain di luar batas perangkat otomatis ditolak hingga pemilik menekan _Reset HP_.

---

## 🤝 Epic 14: Program Reseller White-Label & Halaman Publik Edukasi (`/reseller`, `/harga`, `/panduan`)

- [x] **Task 14.1 — Halaman Publik `/harga`, `/panduan` & `/reseller` dengan Kalkulator Keuntungan**
  - **Berkas Target:** `apps/web/src/app/(root)/harga/page.tsx`, `apps/web/src/app/(root)/panduan/page.tsx`, `apps/web/src/app/(root)/reseller/page.tsx`
  - **Deskripsi:**
    - `/harga`: Kartu perbandingan Coba Gratis (`Rp 0`) vs Terbit Per Undangan (`Rp 29.000`) + 2 Add-On, tabel perbandingan biaya Undangan Cetak vs Digital (100–1.000 tamu), dan timeline penyebaran `H-90` s/d `H-1`.
    - `/reseller`: Penjelasan program reseller white-label, kalkulator interaktif _"Hitung Untungmu"_ (slider harga jual ke klien & jumlah undangan terbit/bulan), serta tabel harga paket kredit (1, 5, 10, 20, 50 kredit).
    - `/panduan`: Video panduan singkat, contoh teks undangan siap salin (Islami, umum, formal, santai), dan panduan pembuatan dari HP.
  - **DoD:** Ketiga halaman pemasaran tampil responsif, informatif, dan terhubung di navigasi utama.

- [x] **Task 14.2 — Dashboard Reseller, White-Label Merek Sendiri & "Link Isian untuk Klien"**
  - **Berkas Target:** `apps/web/src/app/(dashboard)/dashboard/reseller/page.tsx`, `apps/web/src/app/intake/[token]/page.tsx`, `packages/api/src/routers/reseller.ts`
  - **Deskripsi:**
    - Pengelolaan saldo kredit reseller (1 kredit = 1 undangan terbit, tidak ada masa hangus).
    - Pengaturan **White-Label Branding** (mengganti footer _"Created with Senara"_ pada undangan menjadi nama dan logo bisnis reseller).
    - Fitur **Link Isian Klien** (`/intake/[token]`): Reseller membuat tautan formulir khusus untuk dikirim ke klien via WhatsApp agar klien mengisi sendiri nama, tanggal, dan lokasi acara tanpa harus dikejar lewat chat.
  - **DoD:** Data yang diisi klien melalui `/intake/[token]` otomatis membentuk draf undangan siap edit di akun reseller.

---

## 💳 Epic 15: Checkout Lanjutan (Add-On Bundling, Kode Promo, Bukti Transfer Manual) & Keamanan Publikasi

- [x] **Task 15.1 — Modal/Halaman Pembayaran dengan Pilihan Add-On, Kode Promo & Upload Bukti Transfer**
  - **Berkas Target:** `apps/web/src/components/billing/pricing-modal.tsx`, `apps/web/src/app/(dashboard)/dashboard/billing/page.tsx`, `packages/api/src/routers/order.ts`
  - **Deskripsi:**
    - Menampilkan pilihan checklist 2 Add-On (_Statistik Tamu Rp 5.000_, _Mode Privat Rp 15.000_) baik saat menerbitkan undangan maupun saat membeli tambahan dari kartu undangan yang sudah terbit.
    - Input **Kode Promo** dengan perhitungan potongan harga otomatis.
    - Mendukung 2 metode pembayaran: **QRIS Instan** (dengan tombol _Download QRIS_ & _Cek Status_) dan **Transfer Bank Manual** (dengan unggah foto bukti transfer untuk diverifikasi di Super Admin).
  - **DoD:** Total tagihan menghitung harga dasar + add-on terpilih dikurangi diskon kupon secara presisi.

- [x] **Task 15.2 — Fitur "Bagikan Pratinjau" untuk Pasangan, Kunci Alamat Slug & Konfirmasi Ketik `HAPUS`**
  - **Berkas Target:** `apps/web/src/components/invitation-card.tsx`, `apps/web/src/components/editor/publish-modal.tsx`
  - **Deskripsi:**
    - Fitur **Bagikan Pratinjau**: menghasilkan link pratinjau dan pesan WhatsApp otomatis (_"Halo, ini pratinjau undangan kami. Tolong dicek dulu ya sebelum kami terbitkan"_) dengan validasi bahwa nama mempelai bukan lagi nama contoh template.
    - Mengunci perubahan `slug` URL setelah undangan pernah diterbitkan atau link pratinjaunya sudah dibagikan agar tautan di tangan tamu tidak mati.
    - Fitur **Sembunyikan (Unpublish)** sementara, serta proteksi penghapusan undangan berbayar yang mewajibkan pengguna mengetik kata `HAPUS`.
  - **DoD:** Seluruh aturan proteksi siklus hidup undangan berjalan aman sesuai standar UndangYuk.
