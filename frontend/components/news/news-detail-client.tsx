"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";

import { NewsCard } from "@/components/news/news-card";
import { MarkdownContent } from "@/components/news/markdown-content";
import { NewsImage } from "@/components/news/news-image";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import { getNewsArticle, searchNewsArticles } from "@/services/news-service";
import type { NewsArticle } from "@/types";

export function NewsDetailClient({
  slug,
  initialArticle,
}: {
  slug: string;
  initialArticle?: NewsArticle | null;
}) {
  const [article, setArticle] = useState<NewsArticle | null>(initialArticle ?? null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(!initialArticle);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialArticle) {
      return;
    }

    const controller = new AbortController();

    void getNewsArticle(slug, controller.signal)
      .then(setArticle)
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
  }, [initialArticle, slug]);

  useEffect(() => {
    if (!article) {
      return;
    }

    const controller = new AbortController();

    void searchNewsArticles(
      {
        category: article.category,
        size: 5,
      },
      controller.signal,
    )
      .then((response) => {
        setRelatedArticles(response.content.filter((item) => item.id !== article.id).slice(0, 3));
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRelatedArticles([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRelatedLoading(false);
        }
      });

    return () => controller.abort();
  }, [article]);

  if (loading) {
    return (
      <main className="container-shell py-8 sm:py-10">
        <LoadingSkeleton className="h-6 w-48 rounded-xl" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div className="space-y-5">
            <LoadingSkeleton className="h-[24rem] rounded-[32px]" />
            <LoadingSkeleton className="h-96 rounded-[32px]" />
          </div>
          <LoadingSkeleton className="h-80 rounded-[32px]" />
        </div>
      </main>
    );
  }

  if (errorMessage || !article) {
    return (
      <main className="container-shell py-8 sm:py-10">
        <BackToNewsLink />
        <div className="mt-6">
          <Alert
            tone="warning"
            title="Không tải được bài viết"
            description={errorMessage || "Bài viết này có thể chưa xuất bản hoặc đã bị gỡ."}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="container-shell py-8 sm:py-10">
      <BackToNewsLink />

      <article className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
        <div className="min-w-0 space-y-6">
          <div className="motion-panel overflow-hidden rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-transparent sm:rounded-[36px]">
            <NewsImage
              src={article.thumbnailUrl}
              title={article.title}
              className="aspect-[16/8] rounded-none"
            />
            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                {article.featured ? <Badge tone="warning">Nổi bật</Badge> : null}
                <Badge tone="brand">{article.category}</Badge>
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
            </div>
          </div>

          <div className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent sm:rounded-[36px] sm:p-8">
            <MarkdownContent content={article.content} />
          </div>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
              Thông tin bài viết
            </p>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="rounded-2xl bg-[var(--color-surface-soft)] p-4">
                <dt className="font-medium text-[var(--color-text-muted)]">Danh mục</dt>
                <dd className="mt-1 font-semibold text-[var(--color-text-strong)]">
                  {article.category}
                </dd>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-soft)] p-4">
                <dt className="font-medium text-[var(--color-text-muted)]">Tác giả</dt>
                <dd className="mt-1 font-semibold text-[var(--color-text-strong)]">
                  {article.authorName}
                </dd>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-soft)] p-4">
                <dt className="font-medium text-[var(--color-text-muted)]">Ngày đăng</dt>
                <dd className="mt-1 font-semibold text-[var(--color-text-strong)]">
                  {formatDate(article.publishedAt ?? article.createdAt)}
                </dd>
              </div>
            </dl>
            <Link href="/news" className="mt-5 block">
              <Button className="w-full" variant="outline">
                Xem thêm tin tức
              </Button>
            </Link>
          </div>
        </aside>
      </article>

      <section className="mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
              Cùng chủ đề
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-strong)] sm:text-3xl">
              Bài viết liên quan
            </h2>
          </div>
          <Link
            href={`/news?category=${encodeURIComponent(article.category)}`}
            className="motion-soft text-sm font-semibold text-[var(--color-brand-700)] hover:-translate-y-0.5 hover:text-[var(--color-brand-800)]"
          >
            Xem danh mục này
          </Link>
        </div>

        {relatedLoading ? (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-96 rounded-[28px]" />
            ))}
          </div>
        ) : relatedArticles.length ? (
          <div className="motion-stagger mt-5 grid gap-5 md:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <NewsCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        ) : (
          <div className="motion-panel mt-5 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-text-muted)] shadow-[var(--shadow-card)]">
            Chưa có bài viết liên quan trong danh mục này.
          </div>
        )}
      </section>
    </main>
  );
}

function BackToNewsLink() {
  return (
    <Link
      href="/news"
      className="motion-soft inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:-translate-x-0.5 hover:text-[var(--color-brand-800)]"
    >
      <ArrowLeft className="size-4" />
      Quay lại tin tức
    </Link>
  );
}
