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

    const totalCount = await db.template.count();
    console.log(`✨ Seeding completed successfully! Total templates in database: ${totalCount}`);
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

seed();
