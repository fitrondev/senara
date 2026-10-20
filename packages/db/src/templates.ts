export interface TemplateSeedData {
  slug: string;
  name: string;
  category: "WEDDING" | "BIRTHDAY" | "KHITANAN";
  thumbnail: string;
  previewUrl: string;
  isPremium: boolean;
  price: number;
  isActive: boolean;
  tags: string[];
  defaultSections: Array<{
    sectionKey: string;
    title: string;
    sortOrder: number;
    isVisible: boolean;
    isLocked: boolean;
  }>;
}

export const INITIAL_TEMPLATES: TemplateSeedData[] = [
  {
    slug: "kartu-pos-vintage",
    name: "Kartu Pos Vintage (Par Avion)",
    category: "WEDDING",
    thumbnail:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template/kartu-pos-vintage",
    isPremium: false,
    price: 0,
    isActive: true,
    tags: ["Aesthetic", "Vintage", "Dengan Foto", "Tanpa Foto"],
    defaultSections: [
      { sectionKey: "hero", title: "Sampul Kartu Pos", sortOrder: 0, isVisible: true, isLocked: true },
      { sectionKey: "quote", title: "Untaian Doa", sortOrder: 1, isVisible: true, isLocked: false },
      { sectionKey: "couple", title: "Mempelai", sortOrder: 2, isVisible: true, isLocked: true },
      { sectionKey: "event", title: "Waktu & Tempat", sortOrder: 3, isVisible: true, isLocked: false },
      { sectionKey: "love-story", title: "Kisah Klasik", sortOrder: 4, isVisible: true, isLocked: false },
      { sectionKey: "gallery", title: "Potret Kenangan", sortOrder: 5, isVisible: true, isLocked: false },
      { sectionKey: "gift", title: "Tanda Kasih & Amplop", sortOrder: 6, isVisible: true, isLocked: false },
      { sectionKey: "rsvp", title: "Konfirmasi & Doa", sortOrder: 7, isVisible: true, isLocked: false },
      { sectionKey: "closing", title: "Salam Hangat", sortOrder: 8, isVisible: true, isLocked: true },
    ],
  },
  {
    slug: "jawa-biru",
    name: "Jawa Biru Keraton",
    category: "WEDDING",
    thumbnail:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template/jawa-biru",
    isPremium: true,
    price: 29000,
    isActive: true,
    tags: ["Adat Jawa", "Luxury", "Klasik", "Dengan Foto", "Tanpa Foto"],
    defaultSections: [
      { sectionKey: "hero", title: "Pawiwahan Agung", sortOrder: 0, isVisible: true, isLocked: true },
      { sectionKey: "quote", title: "Sabda & Doa Restu", sortOrder: 1, isVisible: true, isLocked: false },
      { sectionKey: "couple", title: "Sri Pengantin", sortOrder: 2, isVisible: true, isLocked: true },
      { sectionKey: "event", title: "Rangkaian Hajatan", sortOrder: 3, isVisible: true, isLocked: false },
      { sectionKey: "love-story", title: "Babad Asmara", sortOrder: 4, isVisible: true, isLocked: false },
      { sectionKey: "gallery", title: "Nawala Gambar", sortOrder: 5, isVisible: true, isLocked: false },
      { sectionKey: "gift", title: "Tali Asih", sortOrder: 6, isVisible: true, isLocked: false },
      { sectionKey: "rsvp", title: "Buku Tamu Agung", sortOrder: 7, isVisible: true, isLocked: false },
      { sectionKey: "closing", title: "Atur Panuwun", sortOrder: 8, isVisible: true, isLocked: true },
    ],
  },
  {
    slug: "blush-confetti",
    name: "Blush Confetti & Party",
    category: "BIRTHDAY",
    thumbnail:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template/blush-confetti",
    isPremium: false,
    price: 0,
    isActive: true,
    tags: ["Ulang Tahun", "Ceria", "Pastel", "Dengan Foto", "Tanpa Foto"],
    defaultSections: [
      { sectionKey: "hero", title: "Sampul Pesta", sortOrder: 0, isVisible: true, isLocked: true },
      { sectionKey: "quote", title: "Harapan & Doa", sortOrder: 1, isVisible: true, isLocked: false },
      { sectionKey: "couple", title: "Yang Berulang Tahun", sortOrder: 2, isVisible: true, isLocked: true },
      { sectionKey: "event", title: "Jadwal Pesta", sortOrder: 3, isVisible: true, isLocked: false },
      { sectionKey: "love-story", title: "Cerita Pertumbuhan", sortOrder: 4, isVisible: true, isLocked: false },
      { sectionKey: "gallery", title: "Album Ceria", sortOrder: 5, isVisible: true, isLocked: false },
      { sectionKey: "gift", title: "Kado & Tanda Kasih", sortOrder: 6, isVisible: true, isLocked: false },
      { sectionKey: "rsvp", title: "Konfirmasi Kehadiran", sortOrder: 7, isVisible: true, isLocked: false },
      { sectionKey: "closing", title: "Sampai Jumpa", sortOrder: 8, isVisible: true, isLocked: true },
    ],
  },
  {
    slug: "crescent-linen",
    name: "Crescent Linen & Zaitun",
    category: "KHITANAN",
    thumbnail:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template/crescent-linen",
    isPremium: true,
    price: 29000,
    isActive: true,
    tags: ["Islami", "Khitanan", "Hangat", "Dengan Foto", "Tanpa Foto"],
    defaultSections: [
      { sectionKey: "hero", title: "Walimatul Khitan", sortOrder: 0, isVisible: true, isLocked: true },
      { sectionKey: "quote", title: "Doa Anak Sholeh", sortOrder: 1, isVisible: true, isLocked: false },
      { sectionKey: "couple", title: "Ananda Tercinta", sortOrder: 2, isVisible: true, isLocked: true },
      { sectionKey: "event", title: "Waktu & Tempat Tasyakuran", sortOrder: 3, isVisible: true, isLocked: false },
      { sectionKey: "love-story", title: "Cerita Ananda", sortOrder: 4, isVisible: true, isLocked: false },
      { sectionKey: "gallery", title: "Potret Ananda", sortOrder: 5, isVisible: true, isLocked: false },
      { sectionKey: "gift", title: "Tanda Kasih", sortOrder: 6, isVisible: true, isLocked: false },
      { sectionKey: "rsvp", title: "Doa & Kehadiran", sortOrder: 7, isVisible: true, isLocked: false },
      { sectionKey: "closing", title: "Wassalamualaikum", sortOrder: 8, isVisible: true, isLocked: true },
    ],
  },
  {
    slug: "minimalis-elegan",
    name: "Minimalis Elegan",
    category: "WEDDING",
    thumbnail:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template/minimalis-elegan",
    isPremium: false,
    price: 0,
    isActive: true,
    tags: ["Simple", "Modern", "Minimalis", "Tanpa Foto"],
    defaultSections: [
      { sectionKey: "hero", title: "Cover Minimalis", sortOrder: 0, isVisible: true, isLocked: true },
      { sectionKey: "quote", title: "Kutipan Sakral", sortOrder: 1, isVisible: true, isLocked: false },
      { sectionKey: "couple", title: "Profil Pengantin", sortOrder: 2, isVisible: true, isLocked: true },
      { sectionKey: "event", title: "Agenda Acara", sortOrder: 3, isVisible: true, isLocked: false },
      { sectionKey: "love-story", title: "Cerita Bersama", sortOrder: 4, isVisible: true, isLocked: false },
      { sectionKey: "gallery", title: "Galeri Elegan", sortOrder: 5, isVisible: true, isLocked: false },
      { sectionKey: "gift", title: "Amplop Digital", sortOrder: 6, isVisible: true, isLocked: false },
      { sectionKey: "rsvp", title: "Buku Tamu & RSVP", sortOrder: 7, isVisible: true, isLocked: false },
      { sectionKey: "closing", title: "Ungkapan Terima Kasih", sortOrder: 8, isVisible: true, isLocked: true },
    ],
  },
  {
    slug: "floral-romance",
    name: "Floral Romance",
    category: "WEDDING",
    thumbnail:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template/floral-romance",
    isPremium: true,
    price: 49000,
    isActive: true,
    tags: ["Floral", "Romantis", "Dengan Foto"],
    defaultSections: [
      { sectionKey: "hero", title: "Gerbang Bunga Romantis", sortOrder: 0, isVisible: true, isLocked: true },
      { sectionKey: "quote", title: "Ayat Suci & Harapan", sortOrder: 1, isVisible: true, isLocked: false },
      { sectionKey: "couple", title: "Dua Hati Mempelai", sortOrder: 2, isVisible: true, isLocked: true },
      { sectionKey: "event", title: "Rangkaian Momen Indah", sortOrder: 3, isVisible: true, isLocked: false },
      { sectionKey: "love-story", title: "Perjalanan Cinta Kami", sortOrder: 4, isVisible: true, isLocked: false },
      { sectionKey: "gallery", title: "Galeri Foto Prewedding", sortOrder: 5, isVisible: true, isLocked: false },
      { sectionKey: "gift", title: "Kado & Amplop Online", sortOrder: 6, isVisible: true, isLocked: false },
      { sectionKey: "rsvp", title: "Buku Doa & Kehadiran", sortOrder: 7, isVisible: true, isLocked: false },
      { sectionKey: "closing", title: "Sampai Jumpa di Hari Bahagia", sortOrder: 8, isVisible: true, isLocked: true },
    ],
  },
  {
    slug: "autumn-serenity",
    name: "Autumn Serenity & Pagoda",
    category: "WEDDING",
    thumbnail:
      "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template/autumn-serenity",
    isPremium: true,
    price: 39000,
    isActive: true,
    tags: ["Aesthetic", "Serenity", "Oriental", "Dengan Foto", "Luxury"],
    defaultSections: [
      { sectionKey: "hero", title: "Sampul Serenity", sortOrder: 0, isVisible: true, isLocked: true },
      { sectionKey: "quote", title: "Doa & Sabda Suci", sortOrder: 1, isVisible: true, isLocked: false },
      { sectionKey: "couple", title: "Kedua Mempelai", sortOrder: 2, isVisible: true, isLocked: true },
      { sectionKey: "event", title: "Rangkaian Waktu & Lokasi", sortOrder: 3, isVisible: true, isLocked: false },
      { sectionKey: "love-story", title: "Langkah Menuju Pelaminan", sortOrder: 4, isVisible: true, isLocked: false },
      { sectionKey: "gallery", title: "Potret Kenangan Indah", sortOrder: 5, isVisible: true, isLocked: false },
      { sectionKey: "gift", title: "Tanda Kasih & Doa Restu", sortOrder: 6, isVisible: true, isLocked: false },
      { sectionKey: "rsvp", title: "Kartu Konfirmasi Tamu", sortOrder: 7, isVisible: true, isLocked: false },
      { sectionKey: "closing", title: "Salam Bahagia", sortOrder: 8, isVisible: true, isLocked: true },
    ],
  },
];
