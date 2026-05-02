"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  FileText,
  FolderTree,
  LibraryBig,
  Newspaper,
  PenLine,
  Settings,
  Sparkles,
} from "lucide-react";

import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { NewsImage } from "@/components/news/news-image";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { newsArticleStatusMeta } from "@/constants/status";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import { getAdminNewsCategories, searchAdminNewsArticles } from "@/services/news-service";
import type { NewsArticle, NewsCategory } from "@/types";

const quickActions = [
  {
    label: "Quản lý bài viết",
    description: "Danh sách, lọc trạng thái và chuyển dần CRUD vào CMS.",
    href: "/cms/articles",
    icon: FileText,
  },
  {
    label: "Tạo bài viết",
    description: "Chuẩn bị form soạn bài mới trong không gian CMS.",
    href: "/cms/articles/create",
    icon: PenLine,
  },
  {
    label: "Danh mục",
    description: "Sắp xếp chủ đề và trạng thái hiển thị.",
    href: "/cms/categories",
    icon: FolderTree,
  },
  {
    label: "Media",
    description: "Kho ảnh dùng cho tin tức và bài viết.",
    href: "/cms/media",
    icon: LibraryBig,
  },
];

export function CmsDashboardClient() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void Promise.all([
      searchAdminNewsArticles({ page: 0, size: 9999 }, controller.signal),
      getAdminNewsCategories(controller.signal),
    ])
      .then(([articlesResponse, categoriesResponse]) => {
        setArticles(articlesResponse.content);
        setCategories(categoriesResponse);
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
  }, []);

  const dashboard = useMemo(() => {
    const published = articles.filter((article) => article.status === "PUBLISHED").length;
    const draft = articles.filter((article) => article.status === "DRAFT").length;
    const featured = articles.filter((article) => article.featured).length;
    const enabledCategories = categories.filter((category) => category.enabled).length;
    const recentArticles = [...articles]
      .sort(
        (first, second) =>
          new Date(second.lastEditedAt ?? second.updatedAt).getTime() -
          new Date(first.lastEditedAt ?? first.updatedAt).getTime(),
      )
      .slice(0, 5);
    const categoryUsage = categories
      .map((category) => ({
        category,
        count: articles.filter((article) => article.category === category.name).length,
      }))
      .sort((first, second) => second.count - first.count || first.category.displayOrder - second.category.displayOrder);

    return {
      total: articles.length,
      published,
      draft,
      featured,
      enabledCategories,
      recentArticles,
      categoryUsage,
      publishedRate: articles.length ? Math.round((published / articles.length) * 100) : 0,
    };
  }, [articles, categories]);

  if (loading) {
    return <CmsDashboardSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Tổng quan"
          title="Trung tâm quản trị nội dung Homi"
          description="Dashboard CMS lấy dữ liệu từ API admin tin tức và danh mục hiện có."
        />
        <Alert
          tone="warning"
          title="Không tải được dữ liệu CMS"
          description={errorMessage}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <CmsPageHeader
        eyebrow="Tổng quan"
        title="Trung tâm quản trị nội dung Homi"
        description="Dashboard đọc dữ liệu thật từ hệ thống tin tức hiện tại, giúp theo dõi bài viết, danh mục và tiến độ xuất bản mà không ảnh hưởng `/admin`."
      >
        <Link href="/cms/articles">
          <Button trailingIcon={<ArrowRight className="size-4" />}>Mở bài viết</Button>
        </Link>
      </CmsPageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <CmsMetricCard
          label="Tổng bài viết"
          value={dashboard.total}
          description="Tất cả bài đang có"
          icon={Newspaper}
          tone="brand"
        />
        <CmsMetricCard
          label="Đã xuất bản"
          value={dashboard.published}
          description={`${dashboard.publishedRate}% tổng nội dung`}
          icon={Sparkles}
          tone="success"
        />
        <CmsMetricCard
          label="Bản nháp"
          value={dashboard.draft}
          description="Chưa hiển thị public"
          icon={PenLine}
          tone="warning"
        />
        <CmsMetricCard
          label="Nổi bật"
          value={dashboard.featured}
          description="Được ưu tiên ở /news"
          icon={FileText}
          tone="brand"
        />
        <CmsMetricCard
          label="Danh mục bật"
          value={dashboard.enabledCategories}
          description={`${categories.length} danh mục tổng`}
          icon={FolderTree}
          tone="muted"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.62fr)_minmax(320px,0.38fr)]">
        <div className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
                Biên tập gần đây
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--color-text-strong)]">
                Bài viết vừa cập nhật
              </h2>
            </div>
            <Link href="/cms/articles">
              <Button variant="outline" trailingIcon={<ArrowRight className="size-4" />}>
                Xem tất cả
              </Button>
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {dashboard.recentArticles.length ? (
              dashboard.recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/cms/articles/${article.id}/edit`}
                  className="motion-soft group grid gap-3 rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-3 hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] sm:grid-cols-[88px_minmax(0,1fr)_auto]"
                >
                  <NewsImage
                    src={article.thumbnailUrl}
                    title={article.title}
                    className="aspect-[16/10] rounded-xl sm:aspect-square"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {article.featured ? <Badge tone="warning">Nổi bật</Badge> : null}
                      <Badge tone={newsArticleStatusMeta[article.status].tone}>
                        {newsArticleStatusMeta[article.status].label}
                      </Badge>
                      <Badge tone="muted">{article.category}</Badge>
                    </div>
                    <h3 className="mt-2 line-clamp-2 font-semibold text-[var(--color-text-strong)] group-hover:text-[var(--color-brand-700)]">
                      {article.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-[var(--color-text-muted)]">
                      {article.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)] sm:flex-col sm:items-end sm:justify-center">
                    <Clock3 className="size-4" />
                    {formatDate(article.lastEditedAt ?? article.updatedAt)}
                  </div>
                </Link>
              ))
            ) : (
              <p className="rounded-2xl bg-[var(--color-surface-soft)] p-5 text-sm text-[var(--color-text-muted)]">
                Chưa có bài viết nào trong hệ thống tin tức.
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
                  Danh mục
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--color-text-strong)]">
                  Mức sử dụng
                </h2>
              </div>
              <Link href="/cms/categories">
                <Button variant="ghost" size="sm">Quản lý</Button>
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {dashboard.categoryUsage.length ? (
                dashboard.categoryUsage.slice(0, 6).map(({ category, count }) => (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--color-text-strong)]">
                          {category.name}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-[var(--color-text-muted)]">
                          {category.description || "Chưa có mô tả danh mục."}
                        </p>
                      </div>
                      <Badge tone={category.enabled ? "success" : "muted"}>
                        {category.enabled ? "Bật" : "Ẩn"}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Bài viết</span>
                      <span className="font-semibold text-[var(--color-text-strong)]">{count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm text-[var(--color-text-muted)]">
                  Chưa có danh mục tin tức.
                </p>
              )}
            </div>
          </div>

          <div className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
              Hành động nhanh
            </p>
            <div className="mt-4 grid gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="motion-soft group rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-4 hover:-translate-y-0.5 hover:border-[var(--color-brand-500)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--color-text-strong)] group-hover:text-[var(--color-brand-700)]">
                          {action.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link href="/cms/settings">
                <Button className="w-full" variant="outline" leadingIcon={<Settings className="size-4" />}>
                  Thiết lập CMS
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function CmsMetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Newspaper;
  tone: "brand" | "success" | "warning" | "muted";
}) {
  return (
    <div className="motion-panel rounded-[26px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-brand-700)]">
          <Icon className="size-5" />
        </div>
        <Badge tone={tone}>CMS</Badge>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-[var(--color-text-strong)]">
        {value}
      </p>
      <h3 className="mt-1 text-sm font-semibold text-[var(--color-text-strong)]">{label}</h3>
      <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function CmsDashboardSkeleton() {
  return (
    <div className="space-y-5">
      <LoadingSkeleton className="h-40 rounded-[28px]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-44 rounded-[26px]" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.62fr)_minmax(320px,0.38fr)]">
        <LoadingSkeleton className="h-[34rem] rounded-[28px]" />
        <LoadingSkeleton className="h-[34rem] rounded-[28px]" />
      </div>
    </div>
  );
}
