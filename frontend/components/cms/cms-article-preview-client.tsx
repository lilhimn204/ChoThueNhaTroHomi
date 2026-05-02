"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ExternalLink, Search, Share2, UserRound } from "lucide-react";

import { MarkdownContent } from "@/components/news/markdown-content";
import { NewsImage } from "@/components/news/news-image";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { newsArticleStatusMeta } from "@/constants/status";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import { getAdminNewsArticle } from "@/services/news-service";
import type { NewsArticle } from "@/types";

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thuenhahomi.id.vn").replace(/\/$/, "");
}

export function CmsArticlePreviewClient({ articleId }: { articleId: number }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void getAdminNewsArticle(articleId, controller.signal)
      .then((nextArticle) => {
        setArticle(nextArticle);
        setErrorMessage("");
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [articleId]);

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-12 w-56 rounded-2xl" />
        <LoadingSkeleton className="h-[40rem] rounded-[32px]" />
      </div>
    );
  }

  if (errorMessage || !article) {
    return (
      <div className="space-y-5">
        <BackLink />
        <Alert
          tone="warning"
          title="Không tải được preview"
          description={errorMessage || "Bài viết không tồn tại hoặc bạn không có quyền xem."}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BackLink />
        <div className="flex flex-wrap gap-2">
          <Link href={`/cms/articles/${article.id}/edit`}>
            <Button variant="outline">Sửa bài viết</Button>
          </Link>
          {article.status === "PUBLISHED" ? (
            <Link href={`/news/${article.slug}`} target="_blank">
              <Button variant="secondary" trailingIcon={<ExternalLink className="size-4" />}>
                Mở public
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      <article className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        <NewsImage
          src={article.thumbnailUrl}
          title={article.title}
          className="aspect-[16/7] rounded-none"
        />
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {article.featured ? <Badge tone="warning">Nổi bật</Badge> : null}
            <Badge tone="brand">{article.category}</Badge>
            <Badge tone={newsArticleStatusMeta[article.status].tone}>
              {newsArticleStatusMeta[article.status].label}
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)]">
              <CalendarDays className="size-4" />
              {formatDate(article.publishedAt ?? article.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)]">
              <UserRound className="size-4" />
              {article.authorName}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
            {article.summary}
          </p>

          <div className="mt-6 rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm text-[var(--color-text-muted)]">
            Người sửa cuối:{" "}
            <span className="font-semibold text-[var(--color-text-strong)]">
              {article.updatedByName ?? article.createdByName ?? "Admin"}
            </span>
            {" · "}Lần sửa cuối: {formatDate(article.lastEditedAt ?? article.updatedAt)}
          </div>

          <SeoPreviewPanel article={article} />
        </div>

        <div className="border-t border-[var(--color-border-card)] p-5 sm:p-8">
          <MarkdownContent content={article.content} />
        </div>
      </article>
    </div>
  );
}

function SeoPreviewPanel({ article }: { article: NewsArticle }) {
  const siteUrl = getSiteUrl();
  const canonicalUrl = article.canonicalUrl?.trim() || `${siteUrl}/news/${article.slug}`;
  const seoTitle = article.seoTitle?.trim() || `${article.title} | Homi`;
  const seoDescription = article.seoDescription?.trim() || article.summary;
  const imageUrl = article.ogImageUrl?.trim() || article.thumbnailUrl;

  return (
    <section className="mt-6 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
            SEO preview
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--color-text-strong)]">
            Cách bài viết hiển thị khi tìm kiếm và chia sẻ
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={article.seoTitle ? "success" : "muted"}>Meta title</Badge>
          <Badge tone={article.seoDescription ? "success" : "muted"}>Meta description</Badge>
          <Badge tone={article.ogImageUrl ? "success" : "muted"}>OG image</Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-strong)]">
            <Search className="size-4 text-[var(--color-brand-700)]" />
            Google
          </div>
          <p className="mt-4 truncate text-xs text-[#188038]">{canonicalUrl}</p>
          <p className="mt-1 line-clamp-1 text-lg font-medium text-[#1a0dab]">
            {seoTitle}
          </p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
            {seoDescription}
          </p>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)]">
          <NewsImage src={imageUrl} title={seoTitle} className="aspect-[16/8] rounded-none" />
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                thuenhahomi.id.vn
              </p>
              <Share2 className="size-4 text-[var(--color-brand-700)]" />
            </div>
            <p className="mt-2 line-clamp-2 font-semibold text-[var(--color-text-strong)]">
              {seoTitle}
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {seoDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <Link
      href="/cms/articles"
      className="motion-soft inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:-translate-x-0.5 hover:text-[var(--color-brand-800)]"
    >
      <ArrowLeft className="size-4" />
      Quay lại danh sách bài viết
    </Link>
  );
}
