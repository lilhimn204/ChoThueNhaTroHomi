import type { MetadataRoute } from "next";

import { apiConfig } from "@/services/api-client";
import type { RoomSummary, PageResponse } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/rooms`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/login`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/register`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/dang-tin`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic room pages
  let roomPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(
      `${apiConfig.baseUrl}/rooms?page=0&size=500&sort=newest`,
      { next: { revalidate: 3600 } },
    );

    if (response.ok) {
      const data = (await response.json()) as PageResponse<RoomSummary>;

      roomPages = data.content.map((room) => ({
        url: `${SITE_URL}/rooms/${room.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Silently skip if backend is unreachable during build
  }

  return [...staticPages, ...roomPages];
}
