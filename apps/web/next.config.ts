import type { NextConfig } from "next";

import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const withVarlock = varlockNextConfigPlugin();

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-mariadb"],
  transpilePackages: ["@senara/db", "@senara/api", "@senara/ui"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@senara/ui", "date-fns"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudeka.id",
      },
    ],
  },
};

export default withVarlock(nextConfig);
