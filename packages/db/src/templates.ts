export interface TemplateSeedData {
  slug: string;
  name: string;
  category: string;
  thumbnail: string;
  previewUrl: string;
  isPremium: boolean;
  price: number;
  isActive: boolean;
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
    name: "Kartu Pos Vintage",
    category: "WEDDING",
    thumbnail:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/preview/kartu-pos-vintage",
    isPremium: false,
    price: 0,
    isActive: true,
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
    slug: "minimalis-elegan",
    name: "Minimalis Elegan",
    category: "WEDDING",
    thumbnail:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    previewUrl: "/preview/minimalis-elegan",
    isPremium: false,
    price: 0,
    isActive: true,
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
    previewUrl: "/preview/floral-romance",
    isPremium: true,
    price: 49000,
    isActive: true,
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
];

