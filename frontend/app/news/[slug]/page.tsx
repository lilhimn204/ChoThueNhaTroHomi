import type { Metadata } from "next";

import { NewsDetailClient } from "@/components/news/news-detail-client";
import { normalizeUploadImageSrc } from "@/lib/images";
import type { NewsArticle } from "@/types";

function getServerApiBaseUrl() {
  const backendUrl = process.env.BACKEND_URL;

  if (backendUrl) {
    const normalizedBackendUrl = backendUrl.replace(/\/$/, "");
    return normalizedBackendUrl.endsWith("/api/v1")
      ? normalizedBackendUrl
      : `${normalizedBackendUrl}/api/v1`;
  }

  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1").replace(/\/$/, "");
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thuenhahomi.id.vn").replace(/\/$/, "");
}

function resolveAbsoluteUrl(url: string | null | undefined, siteUrl: string) {
  const value = url?.trim();

  if (!value) {
    return null;
  }

  try {
    return new URL(normalizeUploadImageSrc(value), siteUrl).toString();
  } catch {
    return null;
  }
}

async function fetchNewsArticle(slug: string): Promise<NewsArticle | null> {
  try {
    const response = await fetch(`${getServerApiBaseUrl()}/news/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as NewsArticle;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchNewsArticle(slug);

  if (!article) {
    return {
      title: "Tin tức không tồn tại | Homi",
      description: "Bài viết này chưa xuất bản hoặc không còn hiển thị trên Homi.",
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = getSiteUrl();
  const title = article.seoTitle?.trim() || `${article.title} | Homi`;
  const description = article.seoDescription?.trim() || article.summary;
  const canonicalUrl = article.canonicalUrl?.trim() || `${siteUrl}/news/${slug}`;
  const previewImage =
    resolveAbsoluteUrl(article.ogImageUrl || article.thumbnailUrl, siteUrl) ??
    `${siteUrl}/opengraph-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: article.publishedAt ?? article.createdAt,
      authors: [article.authorName],
      images: [{ url: previewImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [previewImage],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchNewsArticle(slug);

  return (
    <>
      <NewsDetailClient slug={slug} initialArticle={article} />
      {article ? <NewsArticleJsonLd article={article} slug={slug} /> : null}
    </>
  );
}

function NewsArticleJsonLd({ article, slug }: { article: NewsArticle; slug: string }) {
  const siteUrl = getSiteUrl();
  const image = resolveAbsoluteUrl(article.ogImageUrl || article.thumbnailUrl, siteUrl) ?? undefined;
  const canonicalUrl = article.canonicalUrl?.trim() || `${siteUrl}/news/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.seoDescription?.trim() || article.summary,
    url: canonicalUrl,
    image,
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Homi",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
