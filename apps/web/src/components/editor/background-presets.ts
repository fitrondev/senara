import type { PageBackgroundPreset } from "./background-types";

export const PAGE_BACKGROUND_PRESETS: Record<string, PageBackgroundPreset> = {
  cover: {
    pageKey: "cover",
    pageTitle: "Opening",
    modalTitle: "Background Opening",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=400&q=80",
    description: "Ilustrasi lanskap hangat arsitektur klasik bernuansa senja fajar",
  },
  quote: {
    pageKey: "quote",
    pageTitle: "Untaian Doa",
    modalTitle: "Background Doa & Kutipan",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
    description: "Tekstur kertas antik vintage dengan siluet dedaunan halus",
  },
  couple: {
    pageKey: "couple",
    pageTitle: "Mempelai",
    modalTitle: "Background Mempelai",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80",
    description: "Sapuan cat air floral lembut bernuansa merah muda anggun",
  },
  event: {
    pageKey: "event",
    pageTitle: "Acara",
    modalTitle: "Background Acara",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    description: "Tekstur marmer pualam bersih dengan aksen hangat minimalis",
  },
  story: {
    pageKey: "story",
    pageTitle: "Love Story",
    modalTitle: "Background Love Story",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
    description: "Latar langit malam bertabur bintang dan kabut romantis",
  },
  gallery: {
    pageKey: "gallery",
    pageTitle: "Galeri",
    modalTitle: "Background Galeri",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    description: "Dinding galeri studio minimalis netral untuk sorotan foto",
  },
  gift: {
    pageKey: "gift",
    pageTitle: "Hadiah",
    modalTitle: "Background Hadiah & Amplop",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80",
    description: "Pola satin sutra mewah dengan kilau emas halus",
  },
  rsvp: {
    pageKey: "rsvp",
    pageTitle: "RSVP",
    modalTitle: "Background RSVP",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
    description: "Kertas linen modern bertekstur dengan bayangan daun eukaliptus",
  },
  closing: {
    pageKey: "closing",
    pageTitle: "Penutup",
    modalTitle: "Background Penutup",
    defaultBgUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    defaultThumbnailUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    description: "Cakrawala senja damai dengan nuansa hangat penuh syukur",
  },
};

export function getPageBackgroundPreset(pageKey: string): PageBackgroundPreset {
  return (
    PAGE_BACKGROUND_PRESETS[pageKey] ?? {
      pageKey,
      pageTitle: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
      modalTitle: `Background ${pageKey.charAt(0).toUpperCase() + pageKey.slice(1)}`,
      defaultBgUrl:
        "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80",
      defaultThumbnailUrl:
        "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=400&q=80",
      description: "Background bawaan estetik",
    }
  );
}

