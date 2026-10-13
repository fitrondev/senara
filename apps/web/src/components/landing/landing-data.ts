import {
  CreditCard,
  Layers,
  MessageSquare,
  Music,
  Smartphone,
  Users,
} from "lucide-react";

export const STATS = [
  { value: "< 10 Menit", label: "Waktu Pembuatan Cepat" },
  { value: "100% Langsung", label: "Dana Amplop ke Rekening Anda" },
  { value: "0% Ribet", label: "Tanpa Coding & Siap Kirim" },
  { value: "99.9%", label: "Keandalan Musik Autoplay" },
] as const;

export const FEATURES = [
  {
    icon: Smartphone,
    title: "Visual WYSIWYG Canvas",
    description:
      "Edit langsung teks, foto, dan informasi acara di atas kanvas simulasi ponsel pintar dengan pratinjau real-time tanpa jeda.",
    badge: "Live Editor",
  },
  {
    icon: Layers,
    title: 'Fitur Unggulan "Layout Kustom"',
    description:
      "Sisipkan paragraf kustom, embed video, panduan dress code, maupun peta khusus di antara layout bawaan dengan posisi dinamis yang rapi.",
    badge: "Fleksibel",
  },
  {
    icon: Users,
    title: "Personalisasi Tamu & WhatsApp",
    description:
      "Satu undangan untuk ribuan tamu. Buat tautan unik per nama tamu dan bagikan pesan WhatsApp terformat rapi hanya dalam satu klik.",
    badge: "Hemat Waktu",
  },
  {
    icon: CreditCard,
    title: "Amplop Digital & QRIS",
    description:
      "Fasilitasi kado pernikahan dengan tombol 1-klik salin nomor rekening bank dan QRIS statis langsung ke rekening Anda tanpa potongan.",
    badge: "Bebas Potongan",
  },
  {
    icon: MessageSquare,
    title: "Buku Tamu & RSVP Real-Time",
    description:
      "Kumpulkan konfirmasi kehadiran tamu beserta doa restu hangat secara instan dan kelola datanya langsung dari dasbor analitik.",
    badge: "Interaktif",
  },
  {
    icon: Music,
    title: "Kepatuhan Musik Autoplay",
    description:
      "Gerbang Cover Gate interaktif memastikan latar musik romantis Anda berputar mulus di seluruh browser (iOS, Android, Chrome, Safari).",
    badge: "Autoplay Ready",
  },
] as const;

export const STEPS = [
  {
    step: "01",
    title: "Pilih Template Favorit",
    description:
      "Pilih dari beragam katalog tema pernikahan mulai dari Minimalist, Royal Floral, Modern Sage, hingga Rustic elegan.",
  },
  {
    step: "02",
    title: "Isi Data & Kustomisasi",
    description:
      "Ketik nama pasangan, waktu acara, lokasi Google Maps, nomor rekening amplop, serta galeri momen prewedding terindah Anda.",
  },
  {
    step: "03",
    title: "Sebarkan via WhatsApp",
    description:
      "Terbitkan website undangan, tambahkan daftar tamu, dan kirimkan tautan personalisasi eksklusif ke kerabat dan sahabat.",
  },
] as const;

export const TEMPLATES_PREVIEW = [
  {
    id: "kartu-pos",
    name: "Kartu Pos Vintage",
    category: "Pernikahan",
    description:
      "Gaya perangko surat klasik di atas tekstur kertas linen hangat dengan tipografi editorial yang intim.",
    color: "#6b543e",
    tag: "Populer",
  },
  {
    id: "jawa-biru",
    name: "Keraton Jawa Biru",
    category: "Adat & Klasik",
    description:
      "Ornamen gunungan wayang emas dan batik keraton di atas palet biru royal yang sakral dan megah.",
    color: "#172554",
    tag: "Eksklusif",
  },
  {
    id: "blush-confetti",
    name: "Blush Confetti Party",
    category: "Ulang Tahun",
    description:
      "Desain ceria penuh balon pastel dan konfeti hangat untuk perayaan ulang tahun anak maupun sweet seventeen.",
    color: "#be185d",
    tag: "Ceria",
  },
  {
    id: "crescent-linen",
    name: "Crescent Linen Syukuran",
    category: "Khitanan & Aqiqah",
    description:
      "Nuansa kubah islami emerald dan emas hangat yang menenangkan untuk walimatul khitan dan tasyakuran.",
    color: "#065f46",
    tag: "Syukuran",
  },
] as const;

export const PRICING_PLANS = [
  {
    name: "Gratis (Draf Eksplorasi)",
    price: "Rp 0",
    period: "tanpa batas waktu draf",
    description:
      "Bebas berkreasi dan mencoba seluruh fitur editor visual sebelum siap menerbitkan undangan.",
    features: [
      "Akses Penuh Kanvas Editor WYSIWYG",
      "Bebas Ganti Tema & Pasangan Font Kurasi",
      "Modal Edit Teks & Warna Bebas Kustom",
      "Uji Coba Pasang Musik Latar & Drag-and-Drop Layout",
      "Bagikan Tautan Pratinjau ke Pasangan",
      "Watermark Draf Senara",
      "Dapat Di-upgrade ke Premium Kapan Saja",
    ],
    ctaText: "Mulai Desain Gratis",
    popular: false,
    variant: "outline" as const,
  },
  {
    name: "Paket Premium",
    price: "Rp 29.000",
    period: "sekali bayar",
    description:
      "Solusi lengkap tanpa batas untuk menerbitkan dan menyebarkan undangan resmi ke seluruh tamu.",
    features: [
      "Semua Fitur Paket Gratis",
      "Tautan Publik Aktif Selamanya (Tanpa Watermark)",
      "Personalisasi Nama Tamu Tanpa Batas (?to=)",
      "Kirim Undangan WhatsApp 1-Klik & Link Grup WA",
      "Impor Tamu Massal (Excel/CSV) & Export Rekap RSVP",
      "Musik Latar Autoplay (Pustaka, MP3 & YouTube)",
      "Galeri Foto & Pemutar Video Kenangan Tanpa Batas",
      "Amplop Digital, Rekening Bank & QRIS Statis",
      "Buku Tamu Ucapan & Konfirmasi RSVP Real-Time",
      "Blok Modular Layout Kustom Tanpa Batas",
    ],
    ctaText: "Pilih Paket Premium",
    popular: true,
    variant: "default" as const,
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Senara sangat membantu kami! Dalam 15 menit undangan selesai dan tamu-tamu kami sangat kagum dengan lagu yang otomatis terputar begitu dibuka. Amplop digitalnya juga langsung masuk ke rekening.",
    author: "Adinda & Dimas",
    event: "Pernikahan di Jakarta • Menikah Sep 2026",
  },
  {
    quote:
      "Fitur personalisasi tamu dengan WhatsApp benar-benar penyelamat waktu. Kami mengirimkan 800 undangan tanpa salah sebut nama. Tampilannya elegan sekali di handphone tamu.",
    author: "Rizky & Amanda",
    event: "Pernikahan di Bandung • Menikah Ags 2026",
  },
  {
    quote:
      "Sebagai Wedding Organizer, fitur Layout Kustom dan susun ulang urutan layout sangat fleksibel untuk mengakomodasi rundown adat tradisional keluarga klien. Sangat saya rekomendasikan!",
    author: "Citra Kirana",
    event: "Owner Harmony Wedding Planner",
  },
] as const;

export const FAQS = [
  {
    question: "Apa perbedaan Paket Gratis dan Paket Premium di Senara?",
    answer:
      "Paket Gratis (Mode Eksplorasi) memungkinkan Anda mendesain draf undangan sepuasnya tanpa batas waktu, mencoba seluruh tema dan layout, serta membagikan link pratinjau draf. Begitu siap disebarkan ke tamu resmi, Anda dapat meng-upgrade ke Paket Premium (Rp 29.000 sekali bayar) untuk mengaktifkan tautan publik selamanya tanpa watermark draf, nama tamu tanpa batas (?to=), kirim WhatsApp 1-klik, musik latar, amplop digital, dan buku tamu RSVP real-time.",
  },
  {
    question:
      "Apakah tamu undangan perlu mengunduh aplikasi untuk membuka undangan?",
    answer:
      "Sama sekali tidak. Undangan Senara berbasis tautan website (web-based) yang responsif dan dapat diakses dengan cepat dari peramban apa pun (Chrome, Safari, Firefox) di smartphone maupun laptop tanpa perlu memasang aplikasi tambahan.",
  },
  {
    question: "Bagaimana cara kerja musik autoplay di smartphone?",
    answer:
      "Browser modern memblokir audio otomatis tanpa interaksi pengguna. Senara menggunakan fitur inovatif 'Cover Gate' (Layar Buka Undangan). Saat tamu menekan tombol 'Buka Undangan', interaksi tersebut secara resmi mengizinkan musik pengiring terputar seketika dengan mulus.",
  },
  {
    question:
      "Apakah ada potongan biaya untuk uang yang dikirimkan lewat Amplop Digital?",
    answer:
      "Tidak ada potongan sama sekali (0% fee). Tamu mentransfer langsung ke nomor rekening bank atau dompet digital Anda, atau memindai QRIS Anda sendiri. Seluruh dana 100% masuk langsung ke rekening pengantin.",
  },
  {
    question:
      "Bisakah saya mengubah informasi acara setelah undangan disebarkan?",
    answer:
      "Tentu saja bisa. Anda dapat memperbarui data waktu acara, lokasi gedung, foto galeri, atau teks kapan saja melalui editor Senara. Perubahan akan langsung tercermin secara otomatis bagi siapa pun yang membuka tautan undangan.",
  },
  {
    question: "Bagaimana cara kerja personalisasi nama tamu di WhatsApp?",
    answer:
      "Anda cukup menginput daftar nama tamu (atau mengimpor dari file CSV). Senara akan membuat tautan khusus per tamu (misal: senara.id/adinda-dimas?to=Bpk.+Budi) dan menyediakan tombol 1-klik untuk membuka pesan WhatsApp dengan teks pengantar yang sopan dan telah disesuaikan.",
  },
] as const;
