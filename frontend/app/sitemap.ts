import type { MetadataRoute } from "next";

import { apiConfig } from "@/services/api-client";
import type { NewsArticle, RoomSummary, PageResponse } from "@/types";

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
      url: `${SITE_URL}/forgot-password`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/dang-tin`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/explore/kinh-nghiem-thue-phong`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/explore/meo-tranh-lua-dao`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/explore/khu-vuc-pho-bien`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/explore/cam-nang-sinh-vien-nguoi-di-lam`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/explore/checklist-truoc-khi-thue`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/support/huong-dan-tim-phong`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/support/faq`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/support/bao-cao-tin-sai`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/support/lien-he`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/support/chinh-sach-bao-mat`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/support/dieu-khoan-su-dung`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // Dynamic room pages
  let roomPages: MetadataRoute.Sitemap = [];
  let newsPages: MetadataRoute.Sitemap = [];

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

  try {
    const response = await fetch(
      `${apiConfig.baseUrl}/news?page=0&size=500`,
      { next: { revalidate: 3600 } },
    );

    if (response.ok) {
      const data = (await response.json()) as PageResponse<NewsArticle>;

      newsPages = data.content.map((article) => ({
        url: `${SITE_URL}/news/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Silently skip if backend is unreachable during build
  }

  return [...staticPages, ...roomPages, ...newsPages];
}
