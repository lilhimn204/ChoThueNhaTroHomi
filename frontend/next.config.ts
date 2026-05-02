import type { NextConfig } from "next";

function getAllowedDevOrigins() {
  const configuredOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins?.length ? configuredOrigins : ["thuenhahomi.id.vn"];
}

function getBackendOrigin() {
  const apiUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

  try {
    return new URL(apiUrl).origin;
  } catch {
    return "http://localhost:8080";
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 128, 256, 384, 480],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${getBackendOrigin()}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
