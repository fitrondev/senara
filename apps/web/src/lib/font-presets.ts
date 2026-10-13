export interface FontPresetItem {
  id: string;
  name: string;
  description: string;
  displayFont: string;
  scriptFont: string;
  bodyFont: string;
  sampleTitle: string;
  recommendedTemplates: string[];
}

export const FONT_PRESETS: FontPresetItem[] = [
  {
    id: "jawa",
    name: "Jawa Keraton",
    description: "Serif agung klasik bernuansa keraton & sastra Nusantara",
    displayFont: "'Cormorant Garamond', Georgia, serif",
    scriptFont: "'Great Vibes', cursive",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    sampleTitle: "Pawiwahan Agung",
    recommendedTemplates: ["jawa-biru", "crescent-linen"],
  },
  {
    id: "klasik",
    name: "Klasik Warkat",
    description: "Gaya cetak surat pos vintage & mesin ketik klasik",
    displayFont: "'Playfair Display', Georgia, serif",
    scriptFont: "'Lora', Georgia, serif",
    bodyFont: "'Courier Prime', 'Plus Jakarta Sans', monospace",
    sampleTitle: "Par Avion • 2026",
    recommendedTemplates: ["kartu-pos-vintage", "kartu-pos"],
  },
  {
    id: "kontras",
    name: "Kontras Editorial",
    description: "Perpaduan serif tajam majalah mode dan teks bersih",
    displayFont: "'Playfair Display', serif",
    scriptFont: "'Cormorant Garamond', italic, serif",
    bodyFont: "'Inter', sans-serif",
    sampleTitle: "Adinda & Bagas",
    recommendedTemplates: ["minimalis-elegan", "kartu-pos-vintage"],
  },
  {
    id: "lembut",
    name: "Lembut Pastel",
    description: "Lekuk huruf membulat yang ramah, hangat, dan ceria",
    displayFont: "'Fraunces', 'Playfair Display', serif",
    scriptFont: "'Dancing Script', cursive",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    sampleTitle: "Sweet Celebration",
    recommendedTemplates: ["blush-confetti", "floral-romance"],
  },
  {
    id: "modern",
    name: "Modern Geometris",
    description: "Sans-serif kontemporer yang tegas, rapi, dan minimalis",
    displayFont: "'Montserrat', sans-serif",
    scriptFont: "'Playfair Display', italic, serif",
    bodyFont: "'Inter', sans-serif",
    sampleTitle: "Raras & Danang",
    recommendedTemplates: ["minimalis-elegan", "blush-confetti"],
  },
  {
    id: "elegan",
    name: "Elegan Royal",
    description: "Proporsi huruf kapital mewah untuk resepsi formal",
    displayFont: "'Cinzel', 'Cormorant Garamond', serif",
    scriptFont: "'Great Vibes', cursive",
    bodyFont: "'Lora', serif",
    sampleTitle: "The Royal Wedding",
    recommendedTemplates: ["jawa-biru", "floral-romance"],
  },
  {
    id: "anggun",
    name: "Anggun Kaligrafi",
    description: "Sentuhan skrip romantis mengalir dengan keterbacaan tinggi",
    displayFont: "'Great Vibes', 'Playfair Display', cursive",
    scriptFont: "'Cormorant Garamond', italic, serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    sampleTitle: "Dua Hati Bersatu",
    recommendedTemplates: ["floral-romance"],
  },
  {
    id: "hangat",
    name: "Hangat Zaitun",
    description: "Harmoni humanis yang teduh untuk acara keluarga & syukuran",
    displayFont: "'Merriweather', Georgia, serif",
    scriptFont: "'Lora', italic, serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    sampleTitle: "Walimatul Khitan",
    recommendedTemplates: ["crescent-linen", "kartu-pos-vintage"],
  },
  {
    id: "wayang",
    name: "Wayang Pusaka",
    description: "Karakter serif ukiran tradisional dengan wibawa klasik",
    displayFont: "'Cormorant Upright', 'Cormorant Garamond', serif",
    scriptFont: "'Playfair Display', italic, serif",
    bodyFont: "'Lora', serif",
    sampleTitle: "Sri Pengantin",
    recommendedTemplates: ["jawa-biru"],
  },
  {
    id: "sakura",
    name: "Sakura Mekar",
    description: "Tipografi tipis artistik bernuansa taman bunga musim semi",
    displayFont: "'Noto Serif Display', 'Playfair Display', serif",
    scriptFont: "'Dancing Script', cursive",
    bodyFont: "'Inter', sans-serif",
    sampleTitle: "Floral Romance",
    recommendedTemplates: ["floral-romance", "blush-confetti"],
  },
  {
    id: "beludru",
    name: "Beludru Malam",
    description: "Tebal, dramatis, dan memikat untuk tema malam bertabur bintang",
    displayFont: "'DM Serif Display', Georgia, serif",
    scriptFont: "'Great Vibes', cursive",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    sampleTitle: "Malam Bahagia",
    recommendedTemplates: ["jawa-biru", "crescent-linen"],
  },
];

export function getNativeFontPresetId(templateSlug: string): string {
  if (templateSlug.includes("jawa-biru")) return "jawa";
  if (templateSlug.includes("kartu-pos")) return "klasik";
  if (templateSlug.includes("blush-confetti")) return "lembut";
  if (templateSlug.includes("crescent-linen")) return "hangat";
  if (templateSlug.includes("floral-romance")) return "anggun";
  return "kontras";
}

export function getFontPresetById(id?: string): FontPresetItem {
  return (
    FONT_PRESETS.find((item) => item.id === id) ??
    FONT_PRESETS[0]!
  );
}

