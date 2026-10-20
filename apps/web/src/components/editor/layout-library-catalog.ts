import type { LayoutTemplateItem } from "./layout-library-types";

export const LAYOUT_TEMPLATES_CATALOG: LayoutTemplateItem[] = [
  // 1. OPENING
  {
    id: "opening-circle-classic",
    name: "Opening Circle Classic",
    category: "opening",
    defaultSlot: "after-hero",
    description: "Opening sampul klasik dengan foto lingkaran dan sapaan tamu",
    previewVariant: "opening-circle",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Abu & Faizah",
          align: "center",
          fontSize: "text-2xl",
        },
      },
      {
        type: "PHOTO",
        content: {
          imageUrl:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
          caption: "Wedding Invitation",
          aspectRatio: "1:1",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Kepada Yth. Bapak/Ibu/Saudara/i:<br/><strong>Tamu Undangan Istimewa</strong></p>",
          align: "center",
        },
      },
      {
        type: "BUTTON",
        content: {
          label: "Buka Undangan",
          url: "#acara",
          style: "solid",
        },
      },
    ],
  },
  {
    id: "opening-arch-modern",
    name: "Opening Arch Modern",
    category: "opening",
    defaultSlot: "after-hero",
    description: "Desain lengkungan modern ala studio dengan tipografi elegan",
    previewVariant: "opening-arch",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "THE WEDDING OF",
          align: "center",
          fontSize: "text-xs",
        },
      },
      {
        type: "PHOTO",
        content: {
          imageUrl:
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
          caption: "Rizky & Nadya",
          aspectRatio: "4:5",
        },
      },
      {
        type: "TITLE",
        content: {
          title: "Rizky & Nadya",
          align: "center",
          fontSize: "text-2xl",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Kepada Yth.<br/>Bapak / Ibu / Saudara / i<br/><strong>Tamu Undangan</strong></p>",
          align: "center",
        },
      },
      {
        type: "BUTTON",
        content: {
          label: "Buka Undangan",
          url: "#acara",
          style: "solid",
        },
      },
    ],
  },
  {
    id: "opening-oval-aesthetic",
    name: "Opening Oval Aesthetic",
    category: "opening",
    defaultSlot: "after-hero",
    description: "Bingkai oval minimalis eropa dengan tipografi serif romantis",
    previewVariant: "opening-oval",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "YOU ARE INVITED TO THE WEDDING OF",
          align: "center",
          fontSize: "text-[11px]",
        },
      },
      {
        type: "PHOTO",
        content: {
          imageUrl:
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
          caption: "Suzan & Cameron",
          aspectRatio: "1:1",
        },
      },
      {
        type: "TITLE",
        content: {
          title: "Suzan & Cameron",
          align: "center",
          fontSize: "text-2xl",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center; font-size: 11px; letter-spacing: 0.1em'>24 • OKTOBER • 2026</p><p style='text-align: center; margin-top: 6px'>Kepada Yth:<br/><strong>Tamu Terhormat</strong></p>",
          align: "center",
        },
      },
      {
        type: "BUTTON",
        content: {
          label: "Buka Undangan",
          url: "#acara",
          style: "outline",
        },
      },
    ],
  },
  {
    id: "opening-airmail-vintage",
    name: "Opening Letter Pos",
    category: "opening",
    defaultSlot: "after-hero",
    description: "Gaya warkat pos udara vintage dengan prangko dan monogram",
    previewVariant: "opening-letter",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "PAR AVION • WARKAT RESMI",
          align: "center",
          fontSize: "text-xs",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'><em>Dear Beloved Friends & Family,</em></p><p style='text-align: center'>Kami dengan sukacita mengundang Anda untuk merayakan awal baru perjalanan hidup kami berdua.</p>",
          align: "center",
        },
      },
      {
        type: "BUTTON",
        content: {
          label: "Buka Surat Undangan",
          url: "#mempelai",
          style: "solid",
        },
      },
    ],
  },

  // 2. LOVE STORY
  {
    id: "love-story-timeline",
    name: "Love Story Journey",
    category: "love-story",
    defaultSlot: "after-story",
    description: "Linimasa kisah perjalanan cinta dari awal temu hingga pelaminan",
    previewVariant: "love-story",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Kisah Kasih & Perjalanan",
          align: "center",
          fontSize: "text-xl",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'><strong>2020 — Awal Berjumpa</strong><br/>Pertemuan pertama di bangku kuliah yang bermula dari pertemanan sederhana.</p><p style='text-align: center; margin-top: 10px'><strong>2023 — Mengikat Janji</strong><br/>Setelah saling memahami, kami memutuskan untuk melangkah ke jenjang yang lebih serius.</p><p style='text-align: center; margin-top: 10px'><strong>2026 — Menuju Pelaminan</strong><br/>Dengan ridho Allah SWT dan kedua orang tua, hari bahagia kami akhirnya tiba.</p>",
          align: "center",
        },
      },
    ],
  },

  // 3. QUOTES
  {
    id: "quotes-ar-rum",
    name: "Untaian Doa Ar-Rum",
    category: "quotes",
    defaultSlot: "after-hero",
    description: "Ayat suci Al-Qur'an QS. Ar-Rum: 21 dengan terjemahan indah",
    previewVariant: "quotes",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Untaian Doa & Ayat Suci",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center; font-style: italic; line-height: 1.6'>\"Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.\"</p><p style='text-align: center; font-weight: bold; margin-top: 10px; font-size: 11px'>— QS. Ar-Rum: 21 —</p>",
          align: "center",
        },
      },
    ],
  },
  {
    id: "quotes-classic-romance",
    name: "Romantic Quote",
    category: "quotes",
    defaultSlot: "after-hero",
    description: "Kutipan mutiara cinta romantis nan puitis",
    previewVariant: "quotes-romance",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Kutipan Cinta Klasik",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center; font-style: italic'>\"Cinta sejati bukanlah tentang menemukan seseorang yang sempurna, melainkan belajar melihat orang yang tidak sempurna menjadi begitu sempurna di hati kita.\"</p>",
          align: "center",
        },
      },
    ],
  },

  // 4. PROFIL
  {
    id: "profile-couple-card",
    name: "Profil Pasangan Eksklusif",
    category: "profile",
    defaultSlot: "after-couple",
    description: "Kartu pengenalan kedua mempelai lengkap dengan media sosial",
    previewVariant: "profile",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Profil Kedua Mempelai",
          align: "center",
          fontSize: "text-xl",
        },
      },
      {
        type: "PHOTO",
        content: {
          imageUrl:
            "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
          caption: "Rizky & Nadya",
          aspectRatio: "16:9",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Dua hati yang dipersatukan dalam ikatan suci, siap melangkah bersama mengarungi samudra kehidupan.</p>",
          align: "center",
        },
      },
    ],
  },

  // 5. SALAM
  {
    id: "salam-pembuka",
    name: "Salam Pembuka Hangat",
    category: "salam",
    defaultSlot: "after-hero",
    description: "Kata sambutan hangat dan salam penghormatan kepada para tamu",
    previewVariant: "salam",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
          align: "center",
          fontSize: "text-base",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari istimewa kami.</p>",
          align: "center",
        },
      },
    ],
  },

  // 6. COUPLE (MEMPELAI)
  {
    id: "couple-biodata",
    name: "Biodata Kedua Mempelai",
    category: "couple",
    defaultSlot: "after-couple",
    description: "Nama lengkap dan silsilah keluarga kedua mempelai",
    previewVariant: "couple",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Kedua Mempelai",
          align: "center",
          fontSize: "text-xl",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'><strong>Rizky Pratama, S.Kom</strong><br/>Putra pertama dari Bpk. Bambang & Ibu Sri Wahyuni<br/><br/><em>dengan</em><br/><br/><strong>Nadya Azzahra, S.Ds</strong><br/>Putri bungsu dari Bpk. Gunawan & Ibu Endang Lestari</p>",
          align: "center",
        },
      },
    ],
  },

  // 7. EVENT (ACARA)
  {
    id: "event-akad-resepsi",
    name: "Rangkaian Akad & Resepsi",
    category: "event",
    defaultSlot: "after-event",
    description: "Jadwal terinci prosesi ijab kabul dan pesta resepsi",
    previewVariant: "event",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Rangkaian Acara Bahagia",
          align: "center",
          fontSize: "text-xl",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'><strong>AKAD NIKAH</strong><br/>Sabtu, 24 Oktober 2026<br/>08.00 - 10.00 WIB<br/><em>Tempat: Masjid Agung Al-Ikhlas</em><br/><br/><strong>RESEPSI PERNIKAHAN</strong><br/>Sabtu, 24 Oktober 2026<br/>11.00 - 14.00 WIB<br/><em>Tempat: Grand Ballroom Hotel Senara</em></p>",
          align: "center",
        },
      },
    ],
  },

  // 8. MAPS
  {
    id: "maps-location-guide",
    name: "Peta & Petunjuk Lokasi",
    category: "maps",
    defaultSlot: "after-event",
    description: "Alamat jelas gedung acara beserta tautan Google Maps",
    previewVariant: "maps",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Lokasi & Panduan Rute",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "MAP",
        content: {
          locationName: "Grand Ballroom Hotel Senara",
          address: "Jl. Jend. Sudirman Kav. 88, Karet Semanggi, Jakarta Selatan",
          mapsUrl: "https://maps.google.com",
        },
      },
      {
        type: "BUTTON",
        content: {
          label: "Buka Penunjuk Arah (Google Maps)",
          url: "https://maps.google.com",
          style: "solid",
        },
      },
    ],
  },

  // 9. COUNTDOWN / RUNDOWN
  {
    id: "countdown-rundown",
    name: "Susunan Acara (Rundown)",
    category: "countdown",
    defaultSlot: "after-event",
    description: "Jadwal urutan kegiatan acara pernikahan dari awal hingga usai",
    previewVariant: "countdown",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Susunan Acara (Rundown)",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'><strong>08.00 - 09.00</strong> : Kedatangan Keluarga & Tamu<br/><strong>09.00 - 10.00</strong> : Prosesi Ijab Qobul & Doa Bersama<br/><strong>10.00 - 11.00</strong> : Sungkeman & Sesi Foto Intim<br/><strong>11.00 - 14.00</strong> : Resepsi Ramah Tamah & Hiburan</p>",
          align: "center",
        },
      },
    ],
  },

  // 10. FILTER
  {
    id: "filter-instagram",
    name: "Instagram Wedding Filter",
    category: "filter",
    defaultSlot: "after-gallery",
    description: "Tautan filter Instagram bertema pernikahan untuk foto tamu",
    previewVariant: "filter",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Instagram Wedding Filter",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Bagikan momen indah kebersamaan Anda di pernikahan kami menggunakan filter khusus Instagram!</p>",
          align: "center",
        },
      },
      {
        type: "BUTTON",
        content: {
          label: "Gunakan Filter Instagram Kami ✨",
          url: "https://instagram.com",
          style: "outline",
        },
      },
    ],
  },

  // 11. LIVE
  {
    id: "live-streaming",
    name: "Siaran Langsung (Live)",
    category: "live",
    defaultSlot: "after-event",
    description: "Siaran virtual bagi kerabat yang berhalangan hadir secara fisik",
    previewVariant: "live",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Siaran Langsung Virtual",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Bagi keluarga dan sahabat yang berada di kejauhan, Anda tetap dapat menyaksikan prosesi kami secara langsung.</p>",
          align: "center",
        },
      },
      {
        type: "YOUTUBE",
        content: {
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          autoPlay: false,
        },
      },
    ],
  },

  // 12. GALLERY
  {
    id: "gallery-showcase",
    name: "Galeri Potret Bahagia",
    category: "gallery",
    defaultSlot: "after-gallery",
    description: "Dokumentasi foto kenangan prewedding terindah",
    previewVariant: "gallery",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Potret Kenangan Indah",
          align: "center",
          fontSize: "text-xl",
        },
      },
      {
        type: "PHOTO",
        content: {
          imageUrl:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          caption: "Momen Bahagia Bersama",
          aspectRatio: "16:9",
        },
      },
    ],
  },

  // 13. GIFT (TANDA KASIH)
  {
    id: "gift-digital",
    name: "Amplop Digital & Rekening",
    category: "gift",
    defaultSlot: "after-gift",
    description: "Pemberian tanda kasih cashless melalui transfer bank atau QRIS",
    previewVariant: "gift",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Tanda Kasih & Hadiah Digital",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda berkenan memberikan tanda kasih, dapat melalui nomor rekening berikut:</p><p style='text-align: center; margin-top: 8px'><strong>Bank Central Asia (BCA)</strong><br/>123-456-7890<br/>a.n. Rizky Pratama</p>",
          align: "center",
        },
      },
    ],
  },

  // 14. CONTACT
  {
    id: "contact-narahubung",
    name: "Kontak & Narahubung",
    category: "contact",
    defaultSlot: "after-event",
    description: "Nomor WhatsApp panitia atau narahubung acara",
    previewVariant: "contact",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Hubungi Narahubung Acara",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Butuh bantuan seputar lokasi, akomodasi, atau informasi acara? Silakan hubungi narahubung kami.</p>",
          align: "center",
        },
      },
      {
        type: "BUTTON",
        content: {
          label: "Chat Narahubung via WhatsApp",
          url: "https://wa.me/6281234567890",
          style: "solid",
        },
      },
    ],
  },

  // 15. VIDEO
  {
    id: "video-teaser",
    name: "Teaser Video Prewedding",
    category: "video",
    defaultSlot: "after-story",
    description: "Klip video sinematik kisah cinta kedua mempelai",
    previewVariant: "video",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Sinema Kisah Cinta",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "VIDEO",
        content: {
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          isMuted: true,
        },
      },
    ],
  },

  // 16. RSVP
  {
    id: "rsvp-guide",
    name: "Konfirmasi Kehadiran Tamu",
    category: "rsvp",
    defaultSlot: "after-event",
    description: "Imbauan dan petunjuk pengisian konfirmasi RSVP kehadiran",
    previewVariant: "rsvp",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Konfirmasi Kehadiran (RSVP)",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu langsung.</p><p style='text-align: center; margin-top: 6px'>Mohon konfirmasikan kehadiran Anda sebelum <strong>17 Oktober 2026</strong>.</p>",
          align: "center",
        },
      },
    ],
  },

  // 17. DRESSCODE
  {
    id: "dresscode-guide",
    name: "Panduan Busana (Dresscode)",
    category: "dresscode",
    defaultSlot: "after-event",
    description: "Palet warna dan rekomendasi busana bagi para tamu",
    previewVariant: "dresscode",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Panduan Busana (Dress Code)",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Untuk keserasian dokumentasi foto, kami menyarankan para tamu mengenakan busana bernuansa:</p><p style='text-align: center; font-weight: bold; margin-top: 6px'>🌿 Sage Green • 🕊️ Cream Silk • ✨ Champagne Gold</p>",
          align: "center",
        },
      },
    ],
  },

  // 18. INVITATION (MENGUNDANG)
  {
    id: "invitation-turut-mengundang",
    name: "Turut Mengundang",
    category: "invitation",
    defaultSlot: "before-footer",
    description: "Daftar sanak saudara dan keluarga besar yang turut mengundang",
    previewVariant: "invitation",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Turut Mengundang",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'><strong>Keluarga Mempelai Pria:</strong><br/>Keluarga Besar Bpk. H. Bambang Soediro<br/>Keluarga Besar Alm. Bpk. R. Soepomo<br/><br/><strong>Keluarga Mempelai Wanita:</strong><br/>Keluarga Besar Bpk. H. Gunawan Wibowo<br/>Keluarga Besar Ibu Hj. Siti Rohmah</p>",
          align: "center",
        },
      },
    ],
  },

  // 19. PROTOCOL (PROTOKOL)
  {
    id: "protocol-etiquette",
    name: "Etika & Protokol Acara",
    category: "protocol",
    defaultSlot: "before-footer",
    description: "Pedoman kenyamanan dan ketertiban selama acara berlangsung",
    previewVariant: "protocol",
    blocks: [
      {
        type: "TITLE",
        content: {
          title: "Kenyamanan & Tata Tertib",
          align: "center",
          fontSize: "text-lg",
        },
      },
      {
        type: "TEXT",
        content: {
          text: "<p style='text-align: center'>Demi kelancaran dan kekhidmatan acara:<br/>• Mohon hadir tepat waktu sesuai sesi undangan<br/>• Mengkondisikan ponsel dalam mode hening saat prosesi akad<br/>• Menjaga ketertiban dan kenyamanan bersama</p>",
          align: "center",
        },
      },
    ],
  },
];

