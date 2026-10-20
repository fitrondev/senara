export interface MediaAssetItem {
  id: string;
  name: string;
  category: "wedding" | "bank" | "ornament";
  tags: string[];
  url: string;
}

// Koleksi Aset Ilustrasi Vektor SVG Mandiri (Ringan, Tajam, & Terintegrasi)
export const MEDIA_ASSETS_CATALOG: MediaAssetItem[] = [
  // --- KATEGORI 1: PENGANTIN & AVATAR ---
  {
    id: "asset-pengantin-jawa",
    name: "Pengantin Adat Jawa",
    category: "wedding",
    tags: ["pengantin", "jawa", "kartun", "adat", "beskap", "kebaya", "avatar"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#fdf8f0" stroke="#d4af37" stroke-width="2"/>
        <!-- Pria Jawa (Kiri) -->
        <circle cx="60" cy="65" r="18" fill="#f6d5b8"/>
        <!-- Blangkon -->
        <path d="M42 62 C42 46 78 46 78 62 Z" fill="#4a3525"/>
        <circle cx="43" cy="65" r="4" fill="#3a2515"/>
        <!-- Mata & Senyum Pria -->
        <circle cx="54" cy="65" r="2" fill="#2b2b2b"/>
        <circle cx="66" cy="65" r="2" fill="#2b2b2b"/>
        <path d="M57 73 Q60 76 63 73" stroke="#94583b" stroke-width="1.5" fill="none"/>
        <!-- Beskap Pria -->
        <path d="M42 83 L78 83 L78 125 L42 125 Z" fill="#2b2b2b"/>
        <path d="M56 83 L64 83 L60 100 Z" fill="#d4af37"/>

        <!-- Wanita Jawa (Kanan) -->
        <circle cx="100" cy="68" r="18" fill="#fbe0cb"/>
        <!-- Sanggul & Paes -->
        <ellipse cx="118" cy="66" rx="7" ry="9" fill="#1f1a17"/>
        <path d="M82 66 C82 50 118 50 118 66 Z" fill="#1f1a17"/>
        <path d="M92 56 Q100 62 108 56" fill="#1f1a17"/>
        <!-- Cunduk Mentul Emas -->
        <circle cx="100" cy="45" r="3.5" fill="#facc15" stroke="#ca8a04"/>
        <line x1="100" y1="48" x2="100" y2="53" stroke="#ca8a04" stroke-width="1.5"/>
        <circle cx="92" cy="47" r="3" fill="#facc15" stroke="#ca8a04"/>
        <circle cx="108" cy="47" r="3" fill="#facc15" stroke="#ca8a04"/>
        <!-- Mata & Senyum Wanita -->
        <circle cx="94" cy="68" r="2" fill="#2b2b2b"/>
        <circle cx="106" cy="68" r="2" fill="#2b2b2b"/>
        <path d="M97 76 Q100 79 103 76" stroke="#c2410c" stroke-width="1.5" fill="none"/>
        <circle cx="90" cy="73" r="2.5" fill="#f43f5e" opacity="0.4"/>
        <circle cx="110" cy="73" r="2.5" fill="#f43f5e" opacity="0.4"/>
        <!-- Kebaya Beludru Hitam Emas -->
        <path d="M82 86 L118 86 L118 125 L82 125 Z" fill="#1e1b18"/>
        <line x1="100" y1="86" x2="100" y2="125" stroke="#eab308" stroke-width="2"/>
        <circle cx="100" cy="95" r="2" fill="#eab308"/>
        <circle cx="100" cy="107" r="2" fill="#eab308"/>
      </svg>
    `),
  },
  {
    id: "asset-pengantin-sunda",
    name: "Pengantin Adat Sunda",
    category: "wedding",
    tags: ["pengantin", "sunda", "siger", "adat", "melati", "kartun", "avatar"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#fbfcf8" stroke="#10b981" stroke-width="2"/>
        <!-- Pria Sunda -->
        <circle cx="58" cy="68" r="17" fill="#f6d5b8"/>
        <!-- Bendo Sunda -->
        <path d="M41 65 C41 50 75 50 75 65 Z" fill="#d97706"/>
        <circle cx="52" cy="68" r="2" fill="#2b2b2b"/>
        <circle cx="64" cy="68" r="2" fill="#2b2b2b"/>
        <path d="M55 76 Q58 79 61 76" stroke="#94583b" stroke-width="1.5" fill="none"/>
        <!-- Jas Buka Putih -->
        <path d="M41 85 L75 85 L75 125 L41 125 Z" fill="#f8fafc" stroke="#cbd5e1"/>
        <path d="M53 85 L63 85 L58 105 Z" fill="#10b981"/>

        <!-- Wanita Sunda (Mahkota Siger) -->
        <circle cx="102" cy="70" r="17" fill="#fbe0cb"/>
        <path d="M85 68 C85 54 119 54 119 68 Z" fill="#1f1a17"/>
        <!-- Siger Emas Sunda -->
        <path d="M84 62 L90 48 L96 55 L102 43 L108 55 L114 48 L120 62 Z" fill="#facc15" stroke="#b45309" stroke-width="1"/>
        <!-- Ronce Melati Kanan -->
        <circle cx="119" cy="75" r="2.5" fill="#f8fafc" stroke="#10b981" stroke-width="0.5"/>
        <circle cx="120" cy="83" r="2.5" fill="#f8fafc" stroke="#10b981" stroke-width="0.5"/>
        <circle cx="121" cy="91" r="2.5" fill="#f8fafc" stroke="#10b981" stroke-width="0.5"/>
        <circle cx="96" cy="70" r="2" fill="#2b2b2b"/>
        <circle cx="108" cy="70" r="2" fill="#2b2b2b"/>
        <path d="M99 78 Q102 81 105 78" stroke="#be123c" stroke-width="1.5" fill="none"/>
        <!-- Kebaya Putih Elegan -->
        <path d="M85 87 L119 87 L119 125 L85 125 Z" fill="#f8fafc" stroke="#cbd5e1"/>
        <path d="M98 87 L106 87 L102 110 Z" fill="#facc15"/>
      </svg>
    `),
  },
  {
    id: "asset-pengantin-muslim",
    name: "Pengantin Muslim Modern",
    category: "wedding",
    tags: ["pengantin", "muslim", "hijab", "modern", "jas", "gaun", "putih", "avatar"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#f0fdf4" stroke="#059669" stroke-width="2"/>
        <!-- Pria Jas Modern -->
        <circle cx="58" cy="65" r="17" fill="#f6d5b8"/>
        <!-- Rambut Pria -->
        <path d="M41 62 C41 48 75 48 75 62 C70 54 48 54 41 62 Z" fill="#1e293b"/>
        <circle cx="52" cy="65" r="2" fill="#0f172a"/>
        <circle cx="64" cy="65" r="2" fill="#0f172a"/>
        <path d="M55 73 Q58 76 61 73" stroke="#94583b" stroke-width="1.5" fill="none"/>
        <!-- Jas & Dasi Pria -->
        <path d="M41 82 L75 82 L75 125 L41 125 Z" fill="#0f172a"/>
        <path d="M52 82 L64 82 L58 100 Z" fill="#ffffff"/>
        <polygon points="57,86 59,86 60,94 58,98 56,94" fill="#059669"/>

        <!-- Wanita Berhijab -->
        <ellipse cx="102" cy="74" rx="20" ry="24" fill="#f8fafc" stroke="#e2e8f0"/>
        <circle cx="102" cy="68" r="14" fill="#fbe0cb"/>
        <!-- Tiara di Hijab -->
        <path d="M94 56 L98 50 L102 54 L106 50 L110 56 Z" fill="#facc15" stroke="#ca8a04" stroke-width="0.8"/>
        <circle cx="97" cy="68" r="2" fill="#0f172a"/>
        <circle cx="107" cy="68" r="2" fill="#0f172a"/>
        <path d="M99 76 Q102 79 105 76" stroke="#e11d48" stroke-width="1.5" fill="none"/>
        <circle cx="94" cy="73" r="2.5" fill="#f43f5e" opacity="0.35"/>
        <circle cx="110" cy="73" r="2.5" fill="#f43f5e" opacity="0.35"/>
        <!-- Gaun Pengantin Putih Hijab -->
        <path d="M82 88 L122 88 L122 125 L82 125 Z" fill="#f8fafc" stroke="#e2e8f0"/>
        <circle cx="102" cy="98" r="2" fill="#10b981"/>
        <circle cx="102" cy="110" r="2" fill="#10b981"/>
      </svg>
    `),
  },
  {
    id: "asset-pengantin-minang",
    name: "Pengantin Adat Minang",
    category: "wedding",
    tags: ["pengantin", "minang", "padang", "suntiang", "deta", "merah", "emas", "avatar"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#fff7ed" stroke="#c2410c" stroke-width="2"/>
        <!-- Pria (Deta Saluak Minang) -->
        <circle cx="58" cy="70" r="17" fill="#f6d5b8"/>
        <!-- Topi Deta Merah Emas -->
        <path d="M39 64 L77 64 L72 48 L44 48 Z" fill="#991b1b"/>
        <path d="M44 56 L72 56" stroke="#facc15" stroke-width="2"/>
        <circle cx="52" cy="70" r="2" fill="#2b2b2b"/>
        <circle cx="64" cy="70" r="2" fill="#2b2b2b"/>
        <path d="M55 78 Q58 81 61 78" stroke="#94583b" stroke-width="1.5" fill="none"/>
        <path d="M41 87 L75 87 L75 125 L41 125 Z" fill="#991b1b"/>
        <line x1="58" y1="87" x2="58" y2="125" stroke="#facc15" stroke-width="2"/>

        <!-- Wanita (Suntiang Megah Emas) -->
        <circle cx="102" cy="74" r="16" fill="#fbe0cb"/>
        <!-- Suntiang Minang Bertingkat -->
        <path d="M80 64 C80 34 124 34 124 64 Z" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>
        <path d="M86 52 C86 38 118 38 118 52 Z" fill="#fbbf24"/>
        <circle cx="96" cy="74" r="2" fill="#2b2b2b"/>
        <circle cx="108" cy="74" r="2" fill="#2b2b2b"/>
        <path d="M99 82 Q102 85 105 82" stroke="#be123c" stroke-width="1.5" fill="none"/>
        <!-- Baju Kurung Merah Emas -->
        <path d="M85 90 L119 90 L119 125 L85 125 Z" fill="#991b1b"/>
        <line x1="102" y1="90" x2="102" y2="125" stroke="#facc15" stroke-width="2"/>
      </svg>
    `),
  },

  // --- KATEGORI 2: ORNAMEN & KALIGRAFI ---
  {
    id: "asset-kaligrafi-bismillah",
    name: "Kaligrafi Bismillah",
    category: "ornament",
    tags: ["bismillah", "kaligrafi", "arab", "doa", "islam", "ornamen"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80">
        <rect width="240" height="80" rx="12" fill="#fafafa"/>
        <g fill="#1f2937" stroke="#1f2937">
          <text x="120" y="48" font-family="'Scheherazade New', 'Amiri', 'Traditional Arabic', serif" font-size="28" font-weight="bold" text-anchor="middle" direction="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </text>
        </g>
      </svg>
    `),
  },
  {
    id: "asset-wayang-gunungan",
    name: "Wayang Gunungan Emas",
    category: "ornament",
    tags: ["wayang", "gunungan", "jawa", "kayon", "emas", "ornamen", "budaya"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <path d="M80 15 C85 45 130 95 120 135 L40 135 C30 95 75 45 80 15 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
        <path d="M80 30 C84 55 115 95 108 125 L52 125 C45 95 76 55 80 30 Z" fill="none" stroke="#ca8a04" stroke-width="1.5"/>
        <!-- Pintu Gerbang Gunungan -->
        <rect x="68" y="100" width="24" height="35" rx="3" fill="#ca8a04"/>
        <path d="M68 100 Q80 88 92 100" fill="#ca8a04"/>
        <line x1="80" y1="100" x2="80" y2="135" stroke="#fef08a" stroke-width="1.5"/>
        <!-- Tangkai Gagang Bawah -->
        <rect x="76" y="135" width="8" height="20" rx="2" fill="#a16207"/>
      </svg>
    `),
  },
  {
    id: "asset-cincin-kawin",
    name: "Cincin Kawin & Permata",
    category: "ornament",
    tags: ["cincin", "kawin", "pernikahan", "ring", "berlian", "emas", "romantis"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <!-- Cincin Kiri -->
        <circle cx="68" cy="88" r="32" fill="none" stroke="#eab308" stroke-width="9"/>
        <!-- Cincin Kanan dengan Berlian -->
        <circle cx="96" cy="80" r="32" fill="none" stroke="#facc15" stroke-width="9"/>
        <!-- Berlian di Cincin Kanan -->
        <polygon points="96,35 106,45 86,45" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
        <polygon points="86,45 96,55 106,45" fill="#bae6fd"/>
        <!-- Kilauan Cahaya -->
        <polygon points="112,32 114,38 120,40 114,42 112,48 110,42 104,40 110,38" fill="#fef08a"/>
      </svg>
    `),
  },
  {
    id: "asset-pin-maps-lokasi",
    name: "Pin Peta & Lokasi 3D",
    category: "ornament",
    tags: ["maps", "lokasi", "pin", "peta", "gedung", "alamat"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <!-- Bayangan Bawah -->
        <ellipse cx="80" cy="140" rx="28" ry="8" fill="#cbd5e1"/>
        <!-- Pin Marker Merah -->
        <path d="M80 25 C58 25 40 43 40 65 C40 92 80 135 80 135 C80 135 120 92 120 65 C120 43 102 25 80 25 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
        <circle cx="80" cy="65" r="16" fill="#ffffff"/>
        <circle cx="80" cy="65" r="9" fill="#b91c1c"/>
      </svg>
    `),
  },
  {
    id: "asset-bunga-dekorasi",
    name: "Bunga Rustik & Daun Emas",
    category: "ornament",
    tags: ["bunga", "daun", "floral", "rustik", "botanical", "emas", "dekorasi"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="72" fill="#fffaf0" stroke="#fde047" stroke-width="1.5"/>
        <!-- Ranting & Daun -->
        <path d="M35 115 Q80 80 125 45" stroke="#15803d" stroke-width="3" fill="none"/>
        <ellipse cx="55" cy="98" rx="8" ry="4" transform="rotate(-30 55 98)" fill="#22c55e"/>
        <ellipse cx="75" cy="85" rx="8" ry="4" transform="rotate(-30 75 85)" fill="#22c55e"/>
        <ellipse cx="100" cy="68" rx="8" ry="4" transform="rotate(-30 100 68)" fill="#22c55e"/>
        <!-- Bunga Mawar Rose -->
        <circle cx="80" cy="80" r="18" fill="#fb7185"/>
        <circle cx="80" cy="80" r="12" fill="#f43f5e"/>
        <circle cx="80" cy="80" r="6" fill="#be123c"/>
        <!-- Bunga Kecil -->
        <circle cx="62" cy="70" r="8" fill="#fda4af"/>
        <circle cx="98" cy="90" r="8" fill="#fda4af"/>
      </svg>
    `),
  },

  // --- KATEGORI 3: LOGO BANK & E-WALLET ---
  {
    id: "asset-bank-bca",
    name: "Bank BCA",
    category: "bank",
    tags: ["bca", "bank", "transfer", "rekening", "amplop"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#003594"/>
        <text x="90" y="52" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="34" letter-spacing="2" text-anchor="middle">BCA</text>
      </svg>
    `),
  },
  {
    id: "asset-bank-mandiri",
    name: "Bank Mandiri",
    category: "bank",
    tags: ["mandiri", "bank", "transfer", "rekening", "amplop"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#002d62"/>
        <text x="90" y="48" fill="#ffffff" font-family="Arial, sans-serif" font-weight="800" font-size="24" text-anchor="middle">mandırı</text>
        <path d="M125 45 C132 40 145 42 148 48 C140 45 130 48 125 45 Z" fill="#f59e0b"/>
      </svg>
    `),
  },
  {
    id: "asset-bank-bri",
    name: "Bank BRI",
    category: "bank",
    tags: ["bri", "bank", "transfer", "rekening", "amplop"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#00529c"/>
        <text x="90" y="52" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="32" letter-spacing="1" text-anchor="middle">BRI</text>
      </svg>
    `),
  },
  {
    id: "asset-bank-bni",
    name: "Bank BNI",
    category: "bank",
    tags: ["bni", "bank", "transfer", "rekening", "amplop"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="75" y="52" fill="#005e6a" font-family="Arial, sans-serif" font-weight="900" font-size="32" text-anchor="middle">BNI</text>
        <circle cx="125" cy="45" r="10" fill="#f97316"/>
      </svg>
    `),
  },
  {
    id: "asset-bank-bsi",
    name: "Bank Syariah Indonesia (BSI)",
    category: "bank",
    tags: ["bsi", "syariah", "bank", "transfer", "rekening"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#00a39d"/>
        <text x="90" y="52" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="30" letter-spacing="1" text-anchor="middle">BSI</text>
      </svg>
    `),
  },
  {
    id: "asset-ewallet-dana",
    name: "DANA E-Wallet",
    category: "bank",
    tags: ["dana", "ewallet", "dompet", "digital", "transfer"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#118eea"/>
        <text x="90" y="52" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="30" letter-spacing="2" text-anchor="middle">DANA</text>
      </svg>
    `),
  },
  {
    id: "asset-ewallet-gopay",
    name: "GoPay E-Wallet",
    category: "bank",
    tags: ["gopay", "gojek", "ewallet", "dompet", "digital", "transfer"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#00aed6"/>
        <text x="90" y="51" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="1" text-anchor="middle">gopay</text>
      </svg>
    `),
  },
  {
    id: "asset-ewallet-ovo",
    name: "OVO E-Wallet",
    category: "bank",
    tags: ["ovo", "ewallet", "dompet", "digital", "transfer"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#4c3494"/>
        <text x="90" y="53" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="34" letter-spacing="3" text-anchor="middle">OVO</text>
      </svg>
    `),
  },
  {
    id: "asset-qris-standar",
    name: "QRIS Nasional",
    category: "bank",
    tags: ["qris", "barcode", "scan", "digital", "pembayaran"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="90" y="48" fill="#ea1d25" font-family="Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="2" text-anchor="middle">QRIS</text>
        <rect x="40" y="55" width="100" height="3" fill="#000000"/>
      </svg>
    `),
  },
  {
    id: "asset-bank-nagari",
    name: "Bank Nagari",
    category: "bank",
    tags: ["nagari", "bank", "sumbar", "transfer", "rekening"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="90" y="48" fill="#1e3a8a" font-family="Arial, sans-serif" font-weight="800" font-size="20" text-anchor="middle">Bank Nagari</text>
      </svg>
    `),
  },
  {
    id: "asset-bank-brksyariah",
    name: "BRK Syariah",
    category: "bank",
    tags: ["brksyariah", "brk", "syariah", "riau", "bank", "transfer"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="90" y="48" fill="#15803d" font-family="Arial, sans-serif" font-weight="800" font-size="18" text-anchor="middle">brksyariah</text>
      </svg>
    `),
  },
  {
    id: "asset-bank-btn",
    name: "Bank BTN",
    category: "bank",
    tags: ["btn", "bank", "transfer", "rekening"],
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="180" height="80">
        <rect width="180" height="80" rx="10" fill="#003b73"/>
        <text x="90" y="52" fill="#facc15" font-family="Arial, sans-serif" font-weight="900" font-size="32" letter-spacing="2" text-anchor="middle">btn</text>
      </svg>
    `),
  },
];

