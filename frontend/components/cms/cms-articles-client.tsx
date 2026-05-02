"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { AdminTable } from "@/components/admin/admin-table";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { NewsImage } from "@/components/news/news-image";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { newsArticleStatusMeta } from "@/constants/status";
import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import {
  deleteNewsArticle,
  getAdminNewsCategories,
  searchAdminNewsArticles,
  updateNewsArticleStatus,
} from "@/services/news-service";
import type { NewsArticle, NewsArticleStatus, NewsCategory, PageResponse } from "@/types";

const PAGE_SIZE = 9;

const statusOptions: Array<{ label: string; value: NewsArticleStatus | "" }> = [
  { label: "Tất cả", value: "" },
  { value: "DRAFT", label: newsArticleStatusMeta.DRAFT.label },
  { value: "PUBLISHED", label: newsArticleStatusMeta.PUBLISHED.label },
];

export function CmsArticlesClient() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    status: "" as NewsArticleStatus | "",
  });
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<NewsArticle> | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [actionArticleId, setActionArticleId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadArticles = (pageValue = page, signal?: AbortSignal) => {
    setLoading(true);
    setErrorMessage("");

    return searchAdminNewsArticles(
      {
        keyword: filters.keyword.trim(),
        category: filters.category,
        status: filters.status,
        page: pageValue - 1,
        size: PAGE_SIZE,
      },
      signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);
      })
      .catch((error) => {
        if (!signal?.aborted) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();

    void searchAdminNewsArticles(
      {
        keyword: filters.keyword.trim(),
        category: filters.category,
        status: filters.status,
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
  }, [filters, page]);

  useEffect(() => {
    const controller = new AbortController();

    void getAdminNewsCategories(controller.signal)
      .then((nextCategories) => {
        setCategories(nextCategories);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCategories([]);
        }
      });

    return () => controller.abort();
  }, []);

  const articles = useMemo(() => response?.content ?? [], [response?.content]);
  const hasFilter = Boolean(filters.keyword.trim() || filters.category || filters.status);

  const summary = useMemo(() => {
    const total = response?.totalElements ?? 0;
    const published = articles.filter((article) => article.status === "PUBLISHED").length;
    const draft = articles.filter((article) => article.status === "DRAFT").length;
    const featured = articles.filter((article) => article.featured).length;

    return { total, published, draft, featured };
  }, [articles, response?.totalElements]);

  const categoryOptions = useMemo(
    () => [
      { label: "Tất cả", value: "" },
      ...categories.map((category) => ({
        label: category.enabled ? category.name : `${category.name} (ẩn)`,
        value: category.name,
      })),
    ],
    [categories],
  );

  const updateFilters = (nextFilters: Partial<typeof filters>) => {
    setLoading(true);
    setErrorMessage("");
    setFilters((current) => ({ ...current, ...nextFilters }));
    setPage(1);
  };

  const handleToggleStatus = async (article: NewsArticle) => {
    const nextStatus: NewsArticleStatus =
      article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setActionArticleId(article.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedArticle = await updateNewsArticleStatus(article.id, nextStatus);
      setSuccessMessage(
        nextStatus === "PUBLISHED"
          ? "Đã xuất bản bài viết."
          : "Đã chuyển bài viết về bản nháp.",
      );
      setResponse((current) =>
        current
          ? {
              ...current,
              content: current.content.map((item) =>
                item.id === updatedArticle.id ? updatedArticle : item,
              ),
            }
          : current,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionArticleId(null);
    }
  };

  const handleDelete = async (articleId: number) => {
    setActionArticleId(articleId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteNewsArticle(articleId);
      toast("Đã xóa bài viết.", "success");

      const nextPage = response?.content.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      }
      await loadArticles(nextPage);
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setActionArticleId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setErrorMessage("");

    try {
      const all = await searchAdminNewsArticles({
        keyword: filters.keyword.trim(),
        category: filters.category,
        status: filters.status,
        page: 0,
        size: 9999,
      });

      exportCsv({
        filename: "homi-cms-articles",
        headers: [
          "Tieu de",
          "Danh muc",
          "Trang thai",
          "Noi bat",
          "Tac gia",
          "Nguoi sua cuoi",
          "Ngay dang",
          "Ngay cap nhat",
        ],
        rows: all.content.map((article) => [
          article.title,
          article.category,
          newsArticleStatusMeta[article.status].label,
          article.featured ? "Co" : "Khong",
          article.authorName,
          article.updatedByName ?? "",
          article.publishedAt ? formatDate(article.publishedAt) : "",
          formatDate(article.updatedAt),
        ]),
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <CmsPageHeader
        eyebrow="Bài viết"
        title="Quản lý bài viết CMS"
        description="Danh sách bài viết thật từ hệ thống tin tức. Bạn có thể tạo, sửa, preview, xuất bản hoặc chuyển bài về nháp tại đây."
      >
        <Button
          variant="outline"
          disabled={exporting || loading}
          leadingIcon={<Download className="size-4" />}
          onClick={() => void handleExport()}
        >
          {exporting ? "Đang xuất..." : "Xuất CSV"}
        </Button>
        <Link href="/cms/articles/create">
          <Button leadingIcon={<Plus className="size-4" />}>Tạo bài viết</Button>
        </Link>
      </CmsPageHeader>

      {successMessage ? (
        <Alert tone="success" title="Thao tác thành công" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Tổng kết quả" value={summary.total} />
        <SummaryCard label="Trang này đã xuất bản" value={summary.published} />
        <SummaryCard label="Trang này bản nháp" value={summary.draft} />
        <SummaryCard label="Trang này nổi bật" value={summary.featured} />
      </section>

      <section className="motion-panel grid gap-3 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:grid-cols-[minmax(0,1fr)_260px_220px_auto]">
        <Input
          label="Tìm bài viết"
          placeholder="Tiêu đề, mô tả, nội dung, tác giả..."
          value={filters.keyword}
          onChange={(event) => updateFilters({ keyword: event.target.value })}
        />
        <Select
          label="Danh mục"
          options={categoryOptions}
          value={filters.category}
          onChange={(event) => updateFilters({ category: event.target.value })}
        />
        <Select
          label="Trạng thái"
          options={statusOptions}
          value={filters.status}
          onChange={(event) =>
            updateFilters({ status: event.target.value as NewsArticleStatus | "" })
          }
        />
        <Button
          className="self-end"
          type="button"
          variant="outline"
          disabled={!hasFilter}
          onClick={() => updateFilters({ keyword: "", category: "", status: "" })}
        >
          Xóa lọc
        </Button>
      </section>

      {loading && !response ? (
        <LoadingSkeleton className="h-[34rem] rounded-[28px]" />
      ) : articles.length ? (
        <>
          <AdminTable
            headers={["Bài viết", "Danh mục", "Trạng thái", "Tác giả", "Cập nhật", "Tác vụ"]}
            rows={articles.map((article) => [
              <div key={`${article.id}-title`} className="flex min-w-[20rem] items-center gap-3">
                <NewsImage
                  src={article.thumbnailUrl}
                  title={article.title}
                  className="size-16 shrink-0 rounded-2xl"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {article.featured ? <Badge tone="warning">Nổi bật</Badge> : null}
                    <p className="line-clamp-2 font-semibold text-[var(--color-text-strong)]">
                      {article.title}
                    </p>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-[var(--color-text-muted)]">
                    {article.summary}
                  </p>
                </div>
              </div>,
              article.category,
              <Badge
                key={`${article.id}-status`}
                tone={newsArticleStatusMeta[article.status].tone}
              >
                {newsArticleStatusMeta[article.status].label}
              </Badge>,
              article.authorName,
              <div key={`${article.id}-updated`} className="text-sm text-[var(--color-text-muted)]">
                <p>{formatDate(article.lastEditedAt ?? article.updatedAt)}</p>
                <p className="text-xs">bởi {article.updatedByName ?? article.createdByName ?? "Admin"}</p>
              </div>,
              <div key={`${article.id}-actions`} className="grid min-w-[14rem] grid-cols-2 gap-2">
                <Link href={`/cms/articles/${article.id}/preview`} target="_blank">
                  <Button
                    className="h-9 w-full px-3 text-xs"
                    variant="ghost"
                    size="sm"
                    leadingIcon={<Eye className="size-3.5" />}
                  >
                    Preview
                  </Button>
                </Link>
                <Link href={`/cms/articles/${article.id}/edit`}>
                  <Button
                    className="h-9 w-full px-3 text-xs"
                    variant="outline"
                    size="sm"
                    leadingIcon={<Pencil className="size-3.5" />}
                  >
                    Sửa
                  </Button>
                </Link>
                <Button
                  className="h-9 w-full px-3 text-xs"
                  variant="outline"
                  size="sm"
                  disabled={actionArticleId === article.id}
                  onClick={() => void handleToggleStatus(article)}
                >
                  {article.status === "PUBLISHED" ? "Nháp" : "Đăng"}
                </Button>
                <Button
                  className="h-9 w-full px-3 text-xs"
                  variant="ghost"
                  size="sm"
                  disabled={actionArticleId === article.id}
                  leadingIcon={<Trash2 className="size-3.5" />}
                  onClick={() => setConfirmDeleteId(article.id)}
                >
                  Xóa
                </Button>
              </div>,
            ])}
          />
          <Pagination
            currentPage={page}
            totalPages={response?.totalPages ?? 1}
            onPageChange={(nextPage) => {
              setLoading(true);
              setErrorMessage("");
              setPage(nextPage);
            }}
          />
        </>
      ) : (
        <EmptyState
          title="Chưa có bài viết phù hợp"
          description="Thử bỏ bớt bộ lọc hoặc tạo bài viết mới từ CMS."
          actionLabel={hasFilter ? "Xóa bộ lọc" : "Tạo bài viết"}
          actionHref={hasFilter ? undefined : "/cms/articles/create"}
          onAction={hasFilter ? () => updateFilters({ keyword: "", category: "", status: "" }) : undefined}
        />
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Xóa bài viết"
        description="Bạn chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa bài viết"
        tone="danger"
        loading={actionArticleId !== null}
        onConfirm={() => {
          if (confirmDeleteId) {
            void handleDelete(confirmDeleteId);
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
      <p className="text-2xl font-semibold text-[var(--color-text-strong)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}
