import type { Metadata } from "next";
import { db } from "@/services";

interface SlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const invitation = await db.invitation.findUnique({
      where: { slug },
      select: {
        title: true,
        coverImageUrl: true,
        template: {
          select: {
            thumbnail: true,
          },
        },
      },
    });

    if (!invitation) {
      return {
        title: "Undangan Digital — Senara",
        description: "Platform undangan digital modern dan elegan.",
      };
    }

    const title = `${invitation.title} — Undangan Pernikahan Digital`;
    const description = `The Wedding of ${invitation.title}. Buka undangan digital resmi kami untuk melihat informasi jadwal dan lokasi acara.`;
    const image =
      invitation.coverImageUrl ||
      invitation.template?.thumbnail ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: "Undangan Digital — Senara",
      description: "Platform undangan digital modern dan elegan.",
    };
  }
}

export default function SlugLayout({ children }: SlugLayoutProps) {
  return <>{children}</>;
}
