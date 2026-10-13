// Vercel Best Practice: Hoist static marketing data outside components

export const ADDON_ITEMS = [
  {
    id: "STATS",
    name: "Statistik Tamu Per-Individu",
    price: 5000,
    badge: "Add-On 1",
    description:
      "Lacak siapa saja tamu yang sudah membuka undangan ({n}× buka), kapan terakhir dibuka, dan indikator pengunjung live 30 menit terakhir.",
  },
  {
    id: "PRIVATE_MODE",
    name: "Mode Privat & Kunci Perangkat HP",
    price: 15000,
    badge: "Add-On 2",
    description:
      "Kunci undangan hanya untuk tamu terdaftar dan batasi jumlah perangkat HP per tautan pribadi beserta fitur Reset HP.",
  },
] as const;

export const PRINT_VS_DIGITAL_ROWS = [
  {
    guestCount: "100 Tamu",
    printCost: "Rp 850.000",
    printTime: "7–14 Hari Cetak + Antar",
    digitalCost: "Rp 29.000",
    savings: "Hemat Rp 821.000 (97%)",
  },
  {
    guestCount: "250 Tamu",
    printCost: "Rp 2.125.000",
    printTime: "14–21 Hari Cetak + Kurir",
    digitalCost: "Rp 29.000",
    savings: "Hemat Rp 2.096.000 (99%)",
  },
  {
    guestCount: "500 Tamu",
    printCost: "Rp 4.250.000",
    printTime: "21–30 Hari Cetak + Ongkir",
    digitalCost: "Rp 29.000",
    savings: "Hemat Rp 4.221.000 (99%)",
  },
  {
    guestCount: "1.000 Tamu",
    printCost: "Rp 8.500.000",
    printTime: "30+ Hari Cetak + Distribusi",
    digitalCost: "Rp 29.000",
    savings: "Hemat Rp 8.471.000 (99.7%)",
  },
] as const;

export const DISTRIBUTION_TIMELINE = [
  {
    day: "H-90 s/d H-60",
    title: "Pilih Tema & Susun Daftar Tamu",
    desc: "Coba gratis seluruh desain di kanvas editor Senara. Kumpulkan daftar nama tamu pribadi dan grup WhatsApp.",
  },
  {
    day: "H-45 s/d H-30",
    title: "Bagikan Pengumuman Save The Date",
    desc: "Umumkan tanggal bahagia ke keluarga & sahabat agar kerabat dapat menyiapkan jadwal acara.",
  },
  {
    day: "H-14 s/d H-7",
    title: "Kirim Undangan Resmi via WhatsApp",
    desc: "Terbitkan undangan dan kirimkan tautan personal (?to=Nama+Tamu) menggunakan fitur Kirim WA sekali klik.",
  },
  {
    day: "H-3 s/d H-1",
    title: "Pantau Statistik Buka & Rekap RSVP",
    desc: "Cek siapa yang belum membuka undangan melalui Statistik Tamu dan pastikan jumlah kursi/katering sesuai pax RSVP.",
  },
] as const;

