"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CalendarDays, Search, TrendingUp, UserRound } from "lucide-react";

import { NewsImage } from "@/components/news/news-image";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/services/api-client";
import { getNewsCategories, searchNewsArticles } from "@/services/news-service";
import type { NewsArticle, NewsCategory, PageResponse } from "@/types";

const PAGE_SIZE = 9;

function getPageValue(value: string | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function getArticleDate(article: NewsArticle) {
  return article.publishedAt ?? article.createdAt;
}

function formatNewsDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(value))
    .replace(",", "");
}

function sortForPopular(articles: NewsArticle[]) {
  return [...articles]
    .sort((first, second) => {
      if (first.featured !== second.featured) {
        return first.featured ? -1 : 1;
      }

      return new Date(getArticleDate(second)).getTime() - new Date(getArticleDate(first)).getTime();
    })
    .slice(0, 5);
}

export function NewsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = getPageValue(searchParams.get("page"));
  const [draftKeyword, setDraftKeyword] = useState(keyword);
  const [response, setResponse] = useState<PageResponse<NewsArticle> | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void searchNewsArticles(
      {
        keyword,
        category,
        page: page - 1,
        size: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);
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
  }, [keyword, category, page]);

  useEffect(() => {
    const controller = new AbortController();

    void getNewsCategories(controller.signal)
      .then(setCategories)
      .catch(() => {
        if (!controller.signal.aborted) {
          setCategories([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCategoryLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const resultsCount = response?.totalElements ?? 0;
  const articles = useMemo(() => response?.content ?? [], [response]);
  const featuredArticle = articles[0] ?? null;
  const latestArticles = articles.slice(1, 4);
  const feedArticles = articles.slice(4);
  const listArticles = feedArticles.length ? feedArticles : articles.slice(1);
  const popularArticles = useMemo(() => sortForPopular(articles), [articles]);

  const activeSummary = useMemo(() => {
    if (keyword && category) {
      return `Kết quả cho "${keyword}" trong danh mục ${category}.`;
    }

    if (keyword) {
      return `Kết quả tìm kiếm cho "${keyword}".`;
    }

    if (category) {
      return `Tin thuộc danh mục ${category}.`;
    }

    return "Các bài viết mới nhất từ Homi.";
  }, [keyword, category]);

  const updateQuery = (next: { q?: string; category?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    setLoading(true);
    setErrorMessage("");

    if (next.q !== undefined) {
      setDraftKeyword(next.q);
      if (next.q.trim()) {
        params.set("q", next.q.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
    }

    if (next.category !== undefined) {
      if (next.category) {
        params.set("category", next.category);
      } else {
        params.delete("category");
      }
      params.delete("page");
    }

    if (next.page !== undefined) {
      if (next.page > 1) {
        params.set("page", String(next.page));
      } else {
        params.delete("page");
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `/news?${queryString}` : "/news");
  };

  return (
    <section className="container-shell py-8 sm:py-10">
      <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:p-5">
        <form
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            updateQuery({ q: draftKeyword });
          }}
        >
          <Input
            label="Tìm bài viết"
            placeholder="Kinh nghiệm thuê phòng, hợp đồng, chi phí..."
            value={draftKeyword}
            onChange={(event) => setDraftKeyword(event.target.value)}
          />
          <Button className="self-end" type="submit" leadingIcon={<Search className="size-4" />}>
            Tìm kiếm
          </Button>
        </form>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <CategoryChip
            active={!category}
            label="Tất cả"
            onClick={() => updateQuery({ category: "" })}
          />
          {categoryLoading ? (
            <>
              <LoadingSkeleton className="h-10 w-28 shrink-0 rounded-full" />
              <LoadingSkeleton className="h-10 w-32 shrink-0 rounded-full" />
            </>
          ) : null}
          {categories.map((option) => (
            <CategoryChip
              key={option.id}
              active={category === option.name}
              label={option.name}
              onClick={() => updateQuery({ category: option.name })}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-text-strong)]">
            {category || (keyword ? "Kết quả tìm kiếm" : "Bài viết mới cập nhật")}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {activeSummary} {resultsCount > 0 ? `${resultsCount} bài viết.` : ""}
          </p>
        </div>
        {keyword || category ? (
          <Button variant="outline" onClick={() => updateQuery({ q: "", category: "" })}>
            Xóa lọc
          </Button>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="mt-6">
          <Alert tone="warning" title="Không tải được tin tức" description={errorMessage} />
        </div>
      ) : loading && !response ? (
        <div className="mt-8">
          <EditorialSkeleton />
        </div>
      ) : articles.length && featuredArticle ? (
        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <div className="min-w-0 space-y-8">
            <FeaturedArticle article={featuredArticle} />

            <section className="space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
                    Danh sách bài viết
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-[var(--color-text-strong)]">
                    Tin mới dành cho người thuê phòng
                  </h2>
                </div>
              </div>

              {listArticles.length ? (
                <div className="space-y-0">
                  {listArticles.map((article) => (
                    <NewsListItem key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[20px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 text-sm leading-7 text-[var(--color-text-muted)]">
                  Hiện chỉ có một bài viết trong nhóm này. Homi sẽ tiếp tục cập nhật thêm nội dung mới.
                </div>
              )}
            </section>

            <Pagination
              currentPage={page}
              totalPages={response?.totalPages ?? 1}
              onPageChange={(nextPage) => updateQuery({ page: nextPage })}
            />
          </div>

          <aside className="min-w-0 space-y-6 xl:sticky xl:top-24">
            <LatestArticles articles={latestArticles} />
            <PopularArticles articles={popularArticles} />
            <CategoryPanel
              categories={categories}
              activeCategory={category}
              loading={categoryLoading}
              onSelect={(nextCategory) => updateQuery({ category: nextCategory })}
            />
          </aside>
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="Chưa có bài viết phù hợp"
            description="Thử đổi từ khóa, bỏ chọn danh mục hoặc quay lại sau khi Homi cập nhật tin mới."
            actionLabel="Xóa bộ lọc"
            onAction={() => updateQuery({ q: "", category: "" })}
          />
        </div>
      )}
    </section>
  );
}

function CategoryChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "motion-soft shrink-0 rounded-full bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-[var(--color-brand-contrast)] shadow-sm"
          : "motion-soft shrink-0 rounded-full border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:border-[var(--color-brand-500)] hover:text-[var(--color-text-strong)]"
      }
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function FeaturedArticle({ article }: { article: NewsArticle }) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
      <Link href={`/news/${article.slug}`} className="block">
        <NewsImage
          src={article.thumbnailUrl}
          title={article.title}
          className="aspect-[16/8] min-h-[320px] rounded-none sm:min-h-[420px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/0" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white/90">
            <span>{formatNewsDate(getArticleDate(article))}</span>
            <span>·</span>
            <span>{article.category}</span>
          </div>
          <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white transition-colors group-hover:text-white sm:text-4xl">
            {article.title}
          </h2>
          <p className="mt-4 line-clamp-3 max-w-3xl text-base font-medium leading-8 text-white/85">
            {article.summary}
          </p>
        </div>
      </Link>
    </article>
  );
}

function LatestArticles({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-5 text-[var(--color-brand-700)]" />
        <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">Tin mới nhất</h2>
      </div>
      <div className="mt-4 divide-y divide-[var(--color-border-card)]">
        {articles.length ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group block py-4 first:pt-0 last:pb-0"
            >
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                {formatNewsDate(getArticleDate(article))} · {article.category}
              </p>
              <h3 className="mt-2 line-clamp-3 text-base font-semibold leading-7 text-[var(--color-text-strong)] transition-colors group-hover:text-[var(--color-brand-700)]">
                {article.title}
              </h3>
            </Link>
          ))
        ) : (
          <p className="py-4 text-sm leading-6 text-[var(--color-text-muted)]">
            Chưa có thêm bài viết mới trong trang này.
          </p>
        )}
      </div>
    </section>
  );
}

function NewsListItem({ article }: { article: NewsArticle }) {
  return (
    <article className="group grid gap-4 border-b border-[var(--color-border-card)] py-6 first:pt-0 sm:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
      <Link
        href={`/news/${article.slug}`}
        className="relative block overflow-hidden rounded-[18px] border border-[var(--color-border-card)]"
      >
        <NewsImage
          src={article.thumbnailUrl}
          title={article.title}
          className="aspect-[16/10] rounded-none"
        />
        <span className="absolute left-3 top-3 rounded-md bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {article.category}
        </span>
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span>{formatNewsDate(getArticleDate(article))}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-4" />
            {article.authorName}
          </span>
        </div>

        <Link href={`/news/${article.slug}`} className="mt-2 block">
          <h2 className="line-clamp-2 text-2xl font-semibold leading-tight text-[var(--color-text-strong)] transition-colors group-hover:text-[var(--color-brand-700)]">
            {article.title}
          </h2>
        </Link>

        <p className="mt-3 line-clamp-3 text-base leading-7 text-[var(--color-text-muted)]">
          {article.summary}
        </p>

        <Link
          href={`/news/${article.slug}`}
          className="motion-soft mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:-translate-y-0.5 hover:text-[var(--color-brand-800)]"
        >
          Đọc tiếp
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function PopularArticles({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-5 text-[var(--color-brand-700)]" />
        <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
          Bài viết được quan tâm
        </h2>
      </div>
      <div className="mt-5 divide-y divide-[var(--color-border-card)]">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group grid grid-cols-[32px_minmax(0,1fr)] gap-3 py-4 first:pt-0 last:pb-0"
          >
            <span className="mt-1 flex size-8 items-center justify-center rounded-full bg-[var(--badge-warning-bg)] text-sm font-semibold text-[var(--badge-warning-text)]">
              {index + 1}
            </span>
            <h3 className="line-clamp-3 text-sm font-semibold leading-6 text-[var(--color-text-strong)] transition-colors group-hover:text-[var(--color-brand-700)]">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CategoryPanel({
  categories,
  activeCategory,
  loading,
  onSelect,
}: {
  categories: NewsCategory[];
  activeCategory: string;
  loading: boolean;
  onSelect: (category: string) => void;
}) {
  return (
    <section className="rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
      <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">Chủ đề tin tức</h2>
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          className={
            activeCategory
              ? "motion-soft rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]"
              : "motion-soft rounded-2xl bg-[var(--badge-brand-bg)] px-4 py-3 text-left text-sm font-semibold text-[var(--badge-brand-text)]"
          }
          onClick={() => onSelect("")}
        >
          Tất cả tin tức
        </button>
        {loading ? (
          <>
            <LoadingSkeleton className="h-11 rounded-2xl" />
            <LoadingSkeleton className="h-11 rounded-2xl" />
          </>
        ) : null}
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={
              activeCategory === category.name
                ? "motion-soft rounded-2xl bg-[var(--badge-brand-bg)] px-4 py-3 text-left text-sm font-semibold text-[var(--badge-brand-text)]"
                : "motion-soft rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]"
            }
            onClick={() => onSelect(category.name)}
          >
            <span>{category.name}</span>
            {category.description ? (
              <span className="mt-1 block text-xs font-medium text-[var(--color-text-muted)]">
                {category.description}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}

function EditorialSkeleton() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">
        <LoadingSkeleton className="aspect-[16/8] min-h-[320px] rounded-[24px]" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-4 border-b border-[var(--color-border-card)] pb-6 sm:grid-cols-[260px_minmax(0,1fr)]"
          >
            <LoadingSkeleton className="aspect-[16/10] rounded-[18px]" />
            <div className="space-y-3">
              <LoadingSkeleton className="h-4 w-48" />
              <LoadingSkeleton className="h-7 w-full" />
              <LoadingSkeleton className="h-4 w-5/6" />
              <LoadingSkeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <LoadingSkeleton className="h-72 rounded-[22px]" />
        <LoadingSkeleton className="h-96 rounded-[22px]" />
      </div>
    </div>
  );
}
