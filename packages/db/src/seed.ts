import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createPrismaClient } from "./index";
import { INITIAL_TEMPLATES } from "./templates";

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    return process.env.DATABASE_URL;
  }

  // Fallback: look for .env in apps/web or workspace root
  const candidatePaths = [
    resolve(process.cwd(), "apps/web/.env"),
    resolve(process.cwd(), "../../apps/web/.env"),
    resolve(process.cwd(), "../apps/web/.env"),
    resolve(process.cwd(), ".env"),
  ];

  for (const envPath of candidatePaths) {
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match?.[1]) {
        return match[1];
      }
    }
  }

  throw new Error("DATABASE_URL could not be found in environment or .env files.");
}

async function seed() {
  console.log("🌱 Starting Senara database seeding...");
  const databaseUrl = resolveDatabaseUrl();
  const db = createPrismaClient({ DATABASE_URL: databaseUrl });

  try {
    // 1. Seed Seluruh Template Bawaan (termasuk autumn-serenity)
    for (const t of INITIAL_TEMPLATES) {
      const template = await db.template.upsert({
        where: { slug: t.slug },
        update: {
          name: t.name,
          category: t.category,
          thumbnail: t.thumbnail,
          previewUrl: t.previewUrl,
          isPremium: t.isPremium,
          price: t.price,
          isActive: t.isActive,
        },
        create: {
          slug: t.slug,
          name: t.name,
          category: t.category,
          thumbnail: t.thumbnail,
          previewUrl: t.previewUrl,
          isPremium: t.isPremium,
          price: t.price,
          isActive: t.isActive,
        },
      });

      console.log(`  ✓ Template seeded: "${template.name}" [slug: ${template.slug}, category: ${template.category}, premium: ${template.isPremium}]`);
    }

    // 2. Buat atau Temukan Pengguna Demo
    let demoUser = await db.user.findFirst();
    if (!demoUser) {
      demoUser = await db.user.create({
        data: {
          id: "user_demo_senara",
          email: "demo@senara.id",
          name: "Senara Demo User",
          role: "USER",
        },
      });
      console.log(`  ✓ Demo User created: ${demoUser.email} (${demoUser.id})`);
    } else {
      console.log(`  ✓ Using existing User: ${demoUser.email} (${demoUser.id})`);
    }

    const autumnTemplate = await db.template.findUnique({
      where: { slug: "autumn-serenity" },
    });

    if (!autumnTemplate) {
      throw new Error("Autumn Serenity template could not be found.");
    }

    // 3. Seed Undangan Showcase Penuh (Mencakup Semua Fitur Terbaru)
    const showcaseSlug = "autumn-serenity-demo";

    // Konfigurasi Tema Lengkap dengan Per-Page Background dan Field Isian
    const themeConfigPayload = {
      palette: {
        primary: "#9C4121",
        secondary: "#FDF6ED",
        background: "#FAF5EE",
        accent: "#D97706",
      },
      typography: {
        headingFont: "Playfair Display, serif",
        bodyFont: "Inter, sans-serif",
      },
      buttonStyle: "rounded",
      withPhotos: true,
      fontSet: "playfair-inter",
      fontScale: 1,
      // Fitur Per-Page Background untuk Setiap Halaman
      pageBackgrounds: {
        cover: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80",
        },
        quote: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
        },
        couple: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
        },
        event: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        },
        story: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
        },
        gallery: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
        },
        gift: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80",
        },
        rsvp: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
        },
        closing: {
          type: "default",
          customUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        },
      },
      // Fitur Isian Kamu (Field Overrides Lengkap)
      fields: {
        title: "Rizky & Nadya",
        coverSubtitle: "The Celebration of Love • Walimatul 'Urs",
        eventDateText: "Sabtu, 24 Oktober 2026",
        quoteBody:
          "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
        quoteSource: "QS. Ar-Rum: 21",
        groomFullName: "Rizky Pratama, S.Kom",
        groomNickname: "Rizky",
        groomParents: "Putra pertama dari Bpk. H. Bambang Soediro & Ibu Hj. Sri Wahyuni",
        brideFullName: "Nadya Azzahra, S.Ds",
        brideNickname: "Nadya",
        brideParents: "Putri bungsu dari Bpk. H. Gunawan Wibowo & Ibu Hj. Endang Lestari",
        person1Photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        person2Photo:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        storyBadge: "Catatan Perjalanan",
        storyTitle: "Langkah Menuju Pelaminan",
        galleryTitle: "Potret Kenangan Indah",
        giftTitle: "Tanda Kasih & Doa Restu",
        rsvpTitle: "Kartu Konfirmasi Tamu (RSVP)",
        closingBody:
          "Kehadiran dan doa restu Bapak/Ibu/Saudara/i adalah karunia terindah bagi langkah baru bahtera keluarga kami. Semoga Allah membalas segala kebaikan Anda.",
      },
      uploads: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      ],
    };

    // Bersihkan undangan demo jika sebelumnya sudah ada agar bersih
    const existingInvitation = await db.invitation.findUnique({
      where: { slug: showcaseSlug },
    });

    if (existingInvitation) {
      await db.invitation.delete({
        where: { id: existingInvitation.id },
      });
      console.log(`  ✓ Old demo invitation removed for fresh seeding.`);
    }

    const invitation = await db.invitation.create({
      data: {
        userId: demoUser.id,
        templateId: autumnTemplate.id,
        title: "The Wedding of Rizky & Nadya",
        slug: showcaseSlug,
        status: "PUBLISHED",
        packageTier: "PREMIUM",
        eventDate: new Date("2026-10-24T08:00:00Z"),
        coverImageUrl:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        musicUrl:
          "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverending_Story.mp3",
        musicTitle: "Aesthetic Wedding Serenade",
        isMusicAutoplay: true,
        themeConfig: themeConfigPayload,
        // 9 Seksi Utama
        sections: {
          create: [
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
        // Rangkaian Jadwal Acara (Akad & Resepsi)
        schedules: {
          create: [
            {
              title: "Akad Nikah",
              date: new Date("2026-10-24T08:00:00Z"),
              startTime: "08:00",
              endTime: "10:00",
              timezone: "WIB",
              venueName: "Masjid Agung Al-Ikhlas",
              address: "Jl. Taman Kebon Sirih No. 18, Jakarta Pusat",
              mapsUrl: "https://maps.google.com/?q=Jakarta",
            },
            {
              title: "Resepsi Pernikahan",
              date: new Date("2026-10-24T11:00:00Z"),
              startTime: "11:00",
              endTime: "14:00",
              timezone: "WIB",
              venueName: "Grand Ballroom Hotel Senara",
              address: "Jl. Jend. Sudirman Kav. 88, Jakarta Selatan",
              mapsUrl: "https://maps.google.com/?q=Jakarta",
            },
          ],
        },
        // Kisah Klasik / Love Story
        loveStories: {
          create: [
            {
              yearOrDate: "September 2020",
              title: "Awal Berjumpa",
              story: "Pertemuan pertama di salah satu kedai kopi di Bandung yang berlanjut menjadi pertemanan akrab.",
              sortOrder: 0,
            },
            {
              yearOrDate: "Februari 2023",
              title: "Mengikat Janji",
              story: "Memutuskan untuk saling mendampingi dan melangkah bersama keluarga besar.",
              sortOrder: 1,
            },
            {
              yearOrDate: "Oktober 2026",
              title: "Menuju Pelaminan",
              story: "Dengan rasa syukur dan penuh berkah, kami melangsungkan akad pernikahan suci.",
              sortOrder: 2,
            },
          ],
        },
        // Galeri Foto Prewedding
        galleries: {
          create: [
            {
              mediaUrl:
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
              caption: "Momen Bahagia 1",
              sortOrder: 0,
            },
            {
              mediaUrl:
                "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
              caption: "Momen Bahagia 2",
              sortOrder: 1,
            },
            {
              mediaUrl:
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
              caption: "Momen Bahagia 3",
              sortOrder: 2,
            },
            {
              mediaUrl:
                "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
              caption: "Momen Bahagia 4",
              sortOrder: 3,
            },
          ],
        },
        // Amplop Digital & Rekening
        bankAccounts: {
          create: [
            {
              bankName: "BCA",
              accountNo: "1234567890",
              accountName: "Rizky Pratama",
              qrisImageUrl:
                "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SENARA_QRIS_DEMO",
            },
            {
              bankName: "Mandiri",
              accountNo: "9876543210",
              accountName: "Nadya Azzahra",
              qrisImageUrl: null,
            },
          ],
        },
        // Blok Layout Library Pre-designed Kustom di Seluruh Slot
        customContents: {
          create: [
            // Slot: after-hero
            {
              slotId: "after-hero",
              type: "TITLE",
              sortOrder: 0,
              content: {
                title: "Salam Penghormatan",
                align: "center",
                fontSize: "text-lg",
              },
            },
            {
              slotId: "after-hero",
              type: "TEXT",
              sortOrder: 1,
              content: {
                text: "<p style='text-align: center'>Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>",
                align: "center",
              },
            },
            // Slot: after-couple
            {
              slotId: "after-couple",
              type: "BUTTON",
              sortOrder: 0,
              content: {
                label: "Coba Wedding Filter Instagram ✨",
                url: "https://instagram.com",
                style: "outline",
              },
            },
            // Slot: after-event
            {
              slotId: "after-event",
              type: "MAP",
              sortOrder: 0,
              content: {
                locationName: "Grand Ballroom Hotel Senara",
                address: "Jl. Jend. Sudirman Kav. 88, Karet Semanggi, Jakarta Selatan",
                mapsUrl: "https://maps.google.com/?q=Jakarta",
              },
            },
            {
              slotId: "after-event",
              type: "BUTTON",
              sortOrder: 1,
              content: {
                label: "Buka Penunjuk Arah Google Maps",
                url: "https://maps.google.com/?q=Jakarta",
                style: "solid",
              },
            },
            // Slot: after-gallery
            {
              slotId: "after-gallery",
              type: "TITLE",
              sortOrder: 0,
              content: {
                title: "Siaran Langsung Pernikahan",
                align: "center",
                fontSize: "text-lg",
              },
            },
            {
              slotId: "after-gallery",
              type: "YOUTUBE",
              sortOrder: 1,
              content: {
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                autoPlay: false,
              },
            },
            // Slot: after-gift
            {
              slotId: "after-gift",
              type: "TEXT",
              sortOrder: 0,
              content: {
                text: "<p style='text-align: center'><strong>Panduan Busana (Dress Code):</strong><br/>Demi keselarasan dokumentasi foto, kami menyarankan busana bertema <strong>Sage Green, Earth Tone, atau Warm Gold</strong>.</p>",
                align: "center",
              },
            },
            // Slot: before-footer
            {
              slotId: "before-footer",
              type: "TEXT",
              sortOrder: 0,
              content: {
                text: "<p style='text-align: center'><strong>Turut Mengundang:</strong><br/>Keluarga Besar Bpk. H. Bambang Soediro<br/>Keluarga Besar Bpk. H. Gunawan Wibowo<br/>Beserta segenap handai taulan kedua mempelai.</p>",
                align: "center",
              },
            },
          ],
        },
      },
    });

    console.log(`\n🎉 Showcase Invitation Created Successfully!`);
    console.log(`   ID: ${invitation.id}`);
    console.log(`   Slug: /${invitation.slug}`);
    console.log(`   Editor URL: /editor/${invitation.id}`);
    console.log(`   Template: Autumn Serenity & Pagoda (${autumnTemplate.slug})`);

    const totalTemplates = await db.template.count();
    const totalInvitations = await db.invitation.count();
    console.log(`\n✨ Seeding completed! Templates: ${totalTemplates}, Invitations: ${totalInvitations}`);
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

seed();
