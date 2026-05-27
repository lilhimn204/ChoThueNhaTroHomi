"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  Eye,
  ExternalLink,
  Pencil,
  Plus,
  Star,
  Tags,
  Trash2,
  Upload,
} from "lucide-react";

import { AdminTable } from "@/components/admin/admin-table";
import { MarkdownContent } from "@/components/news/markdown-content";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { newsArticleStatusMeta } from "@/constants/status";
import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { ApiError, getErrorMessage } from "@/services/api-client";
import {
  createNewsArticle,
  createNewsCategory,
  deleteNewsArticle,
  deleteNewsCategory,
  getAdminNewsCategories,
  searchAdminNewsArticles,
  updateNewsArticle,
  updateNewsArticleStatus,
  updateNewsCategory,
} from "@/services/news-service";
import { uploadNewsImage } from "@/services/upload-service";
import type { NewsArticle, NewsArticleStatus, NewsCategory, PageResponse } from "@/types";

const PAGE_SIZE = 8;

const statusOptions: Array<{ label: string; value: NewsArticleStatus }> = [
  { value: "DRAFT", label: newsArticleStatusMeta.DRAFT.label },
  { value: "PUBLISHED", label: newsArticleStatusMeta.PUBLISHED.label },
];

function createEmptyForm(defaultCategory = "") {
  return {
    title: "",
    summary: "",
    content: "",
    thumbnailUrl: "",
    featured: false,
    category: defaultCategory,
    status: "DRAFT" as NewsArticleStatus,
    publishedAt: "",
    authorName: "Homi",
  };
}

const initialCategoryForm = {
  name: "",
  description: "",
  displayOrder: "0",
  enabled: "true",
};

function toDateTimeLocal(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function formFromArticle(article: NewsArticle) {
  return {
    title: article.title,
    summary: article.summary,
    content: article.content,
    thumbnailUrl: article.thumbnailUrl ?? "",
    featured: article.featured,
    category: article.category,
    status: article.status,
    publishedAt: toDateTimeLocal(article.publishedAt),
    authorName: article.authorName,
  };
}

function categoryFormFromCategory(category: NewsCategory) {
  return {
    name: category.name,
    description: category.description ?? "",
    displayOrder: String(category.displayOrder),
    enabled: String(category.enabled),
  };
}

export function AdminNewsClient() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<NewsArticle> | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [actionArticleId, setActionArticleId] = useState<number | null>(null);
  const [categoryActionId, setCategoryActionId] = useState<number | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteCategoryId, setConfirmDeleteCategoryId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmptyForm());
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [contentMode, setContentMode] = useState<"edit" | "preview">("edit");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadArticles = (pageValue = page, signal?: AbortSignal) => {
    setLoading(true);
    setErrorMessage("");

    return searchAdminNewsArticles(
      {
        keyword: filters.keyword.trim(),
        category: filters.category,
        status: filters.status as NewsArticleStatus | "",
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

  const refreshCategories = (signal?: AbortSignal) =>
    getAdminNewsCategories(signal)
      .then((nextCategories) => {
        setCategories(nextCategories);
        setCategoryErrorMessage("");
        setFormData((current) => {
          if (current.category || !nextCategories.length) {
            return current;
          }

          return { ...current, category: nextCategories[0].name };
        });
      })
      .catch((error) => {
        if (!signal?.aborted) {
          setCategoryErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!signal?.aborted) {
          setCategoryLoading(false);
        }
      });

  useEffect(() => {
    const controller = new AbortController();

    void searchAdminNewsArticles(
      {
        keyword: filters.keyword.trim(),
        category: filters.category,
        status: filters.status as NewsArticleStatus | "",
        page: page - 1,
        size: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);
        setErrorMessage("");
        setLoading(false);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErrorMessage(getErrorMessage(error));
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [filters, page]);

  useEffect(() => {
    const controller = new AbortController();

    void refreshCategories(controller.signal);

    return () => controller.abort();
  }, []);

  const selectedArticle = useMemo(
    () => response?.content.find((article) => article.id === selectedArticleId) ?? null,
    [response, selectedArticleId],
  );

  const editingArticle = useMemo(
    () => response?.content.find((article) => article.id === editingArticleId) ?? null,
    [response, editingArticleId],
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.enabled ? category.name : `${category.name} (ẩn)`,
        value: category.name,
      })),
    [categories],
  );

  const resetForm = () => {
    setEditingArticleId(null);
    setContentMode("edit");
    setFormData(createEmptyForm(categories[0]?.name ?? ""));
    setFieldErrors({});
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryForm(initialCategoryForm);
    setCategoryErrorMessage("");
  };

  const startEditing = (article: NewsArticle) => {
    setEditingArticleId(article.id);
    setSelectedArticleId(article.id);
    setFormData(formFromArticle(article));
    setContentMode("edit");
    setFieldErrors({});
    setErrorMessage("");
    setSuccessMessage("");
  };

  const startEditingCategory = (category: NewsCategory) => {
    setEditingCategoryId(category.id);
    setCategoryForm(categoryFormFromCategory(category));
    setCategoryErrorMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      content: formData.content.trim(),
      thumbnailUrl: formData.thumbnailUrl.trim(),
      featured: formData.featured,
      category: formData.category,
      status: formData.status,
      publishedAt: toIsoDateTime(formData.publishedAt),
      authorName: formData.authorName.trim(),
    };

    try {
      const savedArticle = editingArticleId
        ? await updateNewsArticle(editingArticleId, payload)
        : await createNewsArticle(payload);
      const nextPage = editingArticleId ? page : 1;

      setSuccessMessage(
        editingArticleId ? "Đã cập nhật tin tức." : "Đã tạo tin tức mới.",
      );
      setEditingArticleId(savedArticle.id);
      setSelectedArticleId(savedArticle.id);
      setFormData(formFromArticle(savedArticle));

      if (nextPage !== page) {
        setPage(nextPage);
      }

      await loadArticles(nextPage);
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(
          Object.fromEntries(
            error.fieldErrors.map((fieldError) => [fieldError.field, fieldError.message]),
          ),
        );
      }

      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCategorySubmitting(true);
    setCategoryErrorMessage("");

    const payload = {
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim(),
      displayOrder: Number(categoryForm.displayOrder) || 0,
      enabled: categoryForm.enabled === "true",
    };

    try {
      if (editingCategoryId) {
        await updateNewsCategory(editingCategoryId, payload);
        toast("Đã cập nhật danh mục tin tức.", "success");
      } else {
        await createNewsCategory(payload);
        toast("Đã tạo danh mục tin tức.", "success");
      }

      resetCategoryForm();
      await refreshCategories();
    } catch (error) {
      setCategoryErrorMessage(getErrorMessage(error));
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleThumbnailFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setThumbnailUploading(true);
    setErrorMessage("");

    try {
      const uploaded = await uploadNewsImage(file);
      setFormData((current) => ({ ...current, thumbnailUrl: uploaded.url }));
      toast("Đã tải ảnh đại diện tin tức.", "success");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setThumbnailUploading(false);
    }
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
          ? "Đã xuất bản tin tức."
          : "Đã chuyển tin tức về bản nháp.",
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

      if (editingArticleId === updatedArticle.id) {
        setFormData(formFromArticle(updatedArticle));
      }
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
      toast("Đã xóa tin tức thành công.", "success");

      if (editingArticleId === articleId) {
        resetForm();
      }

      if (selectedArticleId === articleId) {
        setSelectedArticleId(null);
      }

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

  const handleDeleteCategory = async (categoryId: number) => {
    setCategoryActionId(categoryId);
    setCategoryErrorMessage("");

    try {
      await deleteNewsCategory(categoryId);
      toast("Đã xóa danh mục tin tức.", "success");
      await refreshCategories();
    } catch (error) {
      setCategoryErrorMessage(getErrorMessage(error));
    } finally {
      setCategoryActionId(null);
      setConfirmDeleteCategoryId(null);
    }
  };

  return (
    <div className="min-w-0 space-y-5">
      <div className="motion-panel animate-content-rise rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
              Quản lý tin tức
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] md:text-[2rem]">
              Tin tức và bài viết Homi
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
              Tạo bài viết, quản lý danh mục, ghim bài nổi bật và xem trước bản nháp trước khi xuất bản.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={resetForm}
              leadingIcon={<Plus className="size-4" />}
            >
              Tạo mới
            </Button>
            <Button
              variant="outline"
              disabled={exporting || loading}
              onClick={async () => {
                setExporting(true);
                try {
                  const all = await searchAdminNewsArticles({
                    keyword: filters.keyword.trim(),
                    category: filters.category,
                    status: filters.status as NewsArticleStatus | "",
                    page: 0,
                    size: 9999,
                  });
                  exportCsv({
                    filename: "homi-admin-news",
                    headers: [
                      "Tiêu đề",
                      "Danh mục",
                      "Trạng thái",
                      "Nổi bật",
                      "Tác giả",
                      "Người sửa cuối",
                      "Ngày đăng",
                      "Ngày cập nhật",
                    ],
                    rows: all.content.map((article) => [
                      article.title,
                      article.category,
                      newsArticleStatusMeta[article.status].label,
                      article.featured ? "Có" : "Không",
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
              }}
              leadingIcon={<Download className="size-4" />}
            >
              {exporting ? "Đang xuất..." : "Xuất CSV"}
            </Button>
          </div>
        </div>
      </div>

      {successMessage ? (
        <Alert tone="success" title="Thao tác thành công" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
      ) : null}

      <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="min-w-0 space-y-4">
          <div className="motion-panel motion-stagger grid min-w-0 gap-3 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:grid-cols-3">
            <Input
              label="Tìm tin tức"
              placeholder="Tiêu đề, nội dung, tác giả..."
              value={filters.keyword}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, keyword: event.target.value }));
                setPage(1);
              }}
            />
            <Select
              label="Danh mục"
              options={[{ label: "Tất cả", value: "" }, ...categoryOptions]}
              value={filters.category}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, category: event.target.value }));
                setPage(1);
              }}
            />
            <Select
              label="Trạng thái"
              options={[{ label: "Tất cả", value: "" }, ...statusOptions]}
              value={filters.status}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, status: event.target.value }));
                setPage(1);
              }}
            />
          </div>

          {loading && !response ? (
            <LoadingSkeleton className="h-[30rem] rounded-[28px]" />
          ) : response?.content.length ? (
            <>
              <AdminTable
                headers={["Bài viết", "Danh mục", "Trạng thái", "Tác giả", "Cập nhật", "Tác vụ"]}
                rows={response.content.map((article) => [
                  <div key={`${article.id}-title`} className="flex min-w-[18rem] items-center gap-3">
                    <NewsImage
                      src={article.thumbnailUrl}
                      title={article.title}
                      className="size-16 shrink-0 rounded-2xl"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="line-clamp-2 font-semibold text-[var(--color-text-strong)]">
                          {article.title}
                        </p>
                        {article.featured ? (
                          <Badge tone="warning" className="shrink-0">
                            Nổi bật
                          </Badge>
                        ) : null}
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
                    <p>{formatDate(article.updatedAt)}</p>
                    <p className="text-xs">bởi {article.updatedByName ?? article.createdByName ?? "Admin"}</p>
                  </div>,
                  <div key={`${article.id}-actions`} className="grid min-w-[12rem] grid-cols-2 gap-2">
                    <Button
                      className="h-9 w-full px-3 text-xs"
                      variant="ghost"
                      size="sm"
                      leadingIcon={<Eye className="size-3.5" />}
                      onClick={() => setSelectedArticleId(article.id)}
                    >
                      Xem
                    </Button>
                    <Button
                      className="h-9 w-full px-3 text-xs"
                      variant="outline"
                      size="sm"
                      leadingIcon={<Pencil className="size-3.5" />}
                      onClick={() => startEditing(article)}
                    >
                      Sửa
                    </Button>
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
                totalPages={response.totalPages}
                onPageChange={(nextPage) => {
                  setLoading(true);
                  setErrorMessage("");
                  setPage(nextPage);
                }}
              />
            </>
          ) : (
            <EmptyState
              title="Chưa có tin tức phù hợp"
              description="Thử bỏ bớt bộ lọc hoặc tạo bài viết đầu tiên ở cột bên phải."
              actionLabel="Tạo bài viết"
              onAction={resetForm}
            />
          )}
        </section>

        <aside className="min-w-0 space-y-5 2xl:sticky 2xl:top-24 2xl:max-h-[calc(100vh-7rem)] 2xl:overflow-y-auto">
          {selectedArticle ? (
            <section className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
                    Chi tiết tin tức
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-strong)]">
                    {selectedArticle.title}
                  </h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {selectedArticle.featured ? <Badge tone="warning">Nổi bật</Badge> : null}
                  <Badge tone={newsArticleStatusMeta[selectedArticle.status].tone}>
                    {newsArticleStatusMeta[selectedArticle.status].label}
                  </Badge>
                </div>
              </div>
              <NewsImage
                src={selectedArticle.thumbnailUrl}
                title={selectedArticle.title}
                className="mt-4 aspect-[16/9]"
              />
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                {selectedArticle.summary}
              </p>
              <div className="mt-4 grid gap-2 text-sm text-[var(--color-text-muted)]">
                <p>
                  <span className="font-semibold text-[var(--color-text-strong)]">Danh mục:</span>{" "}
                  {selectedArticle.category}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-text-strong)]">Tác giả:</span>{" "}
                  {selectedArticle.authorName}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-text-strong)]">Người sửa cuối:</span>{" "}
                  {selectedArticle.updatedByName ?? selectedArticle.createdByName ?? "Admin"}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-text-strong)]">Lần sửa cuối:</span>{" "}
                  {formatDate(selectedArticle.lastEditedAt ?? selectedArticle.updatedAt)}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-text-strong)]">Ngày đăng:</span>{" "}
                  {selectedArticle.publishedAt
                    ? formatDate(selectedArticle.publishedAt)
                    : "Chưa đặt"}
                </p>
              </div>
              <MarkdownContent
                content={selectedArticle.content}
                className="mt-4 max-h-72 overflow-y-auto rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm"
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button variant="outline" onClick={() => startEditing(selectedArticle)}>
                  Sửa bài này
                </Button>
                <Link href={`/admin/news/preview/${selectedArticle.id}`} target="_blank">
                  <Button
                    className="w-full"
                    variant="secondary"
                    trailingIcon={<ExternalLink className="size-4" />}
                  >
                    Preview nháp
                  </Button>
                </Link>
                {selectedArticle.status === "PUBLISHED" ? (
                  <Link href={`/news/${selectedArticle.slug}`} target="_blank" className="sm:col-span-2">
                    <Button className="w-full" variant="outline">
                      Mở trang public
                    </Button>
                  </Link>
                ) : null}
              </div>
            </section>
          ) : null}

          <section className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-strong)]">
                  {editingArticle ? "Sửa tin tức" : "Tạo tin tức mới"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  Nháp có thể xem trước trong admin; bài xuất bản sẽ hiển thị ở trang `/news`.
                </p>
              </div>
              <Star className={formData.featured ? "size-6 text-[var(--color-accent-500)]" : "size-6 text-[var(--color-text-muted)]"} />
            </div>

            <form className="motion-stagger mt-5 space-y-3" onSubmit={handleSubmit}>
              <Input
                label="Tiêu đề"
                placeholder="Kinh nghiệm thuê phòng an toàn..."
                value={formData.title}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, title: event.target.value }))
                }
                error={fieldErrors.title}
              />
              <Textarea
                label="Mô tả ngắn"
                placeholder="Tóm tắt nội dung bài viết trong 1-2 câu."
                value={formData.summary}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, summary: event.target.value }))
                }
                maxLength={360}
                error={fieldErrors.summary}
              />

              <div className="rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={contentMode === "edit" ? "primary" : "ghost"}
                    className="h-10"
                    onClick={() => setContentMode("edit")}
                  >
                    Soạn thảo
                  </Button>
                  <Button
                    type="button"
                    variant={contentMode === "preview" ? "primary" : "ghost"}
                    className="h-10"
                    onClick={() => setContentMode("preview")}
                  >
                    Xem trước
                  </Button>
                </div>
                <div className="mt-3">
                  {contentMode === "edit" ? (
                    <Textarea
                      label="Nội dung"
                      placeholder="Có thể dùng # Heading, ## Mục lớn, - danh sách, > ghi chú."
                      value={formData.content}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, content: event.target.value }))
                      }
                      className="min-h-56"
                      error={fieldErrors.content}
                    />
                  ) : (
                    <div className="min-h-56 rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-input-bg)] p-4">
                      <MarkdownContent content={formData.content} />
                    </div>
                  )}
                </div>
              </div>

              <Input
                label="Ảnh đại diện"
                placeholder="https://... hoặc /uploads/..."
                value={formData.thumbnailUrl}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, thumbnailUrl: event.target.value }))
                }
                hint="Có thể nhập URL hoặc tải ảnh trực tiếp bằng nút bên dưới."
                error={fieldErrors.thumbnailUrl}
              />
              <label className="motion-soft flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-text-strong)] hover:border-[var(--color-brand-500)] hover:text-[var(--color-brand-700)]">
                <Upload className="size-4" />
                {thumbnailUploading ? "Đang tải ảnh..." : "Tải ảnh đại diện"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={thumbnailUploading}
                  onChange={(event) => void handleThumbnailFileChange(event)}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Select
                  label="Danh mục"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, category: event.target.value }))
                  }
                />
                <Select
                  label="Trạng thái"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      status: event.target.value as NewsArticleStatus,
                    }))
                  }
                />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-text-strong)]">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--color-brand-600)]"
                  checked={formData.featured}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, featured: event.target.checked }))
                  }
                />
                Ghim nổi bật trên trang tin tức
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Ngày đăng"
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, publishedAt: event.target.value }))
                  }
                  error={fieldErrors.publishedAt}
                />
                <Input
                  label="Tác giả"
                  value={formData.authorName}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, authorName: event.target.value }))
                  }
                  error={fieldErrors.authorName}
                />
              </div>

              <div className="rounded-[22px] bg-[var(--color-surface-soft)] p-3">
                <NewsImage
                  src={formData.thumbnailUrl}
                  title={formData.title || "Xem trước ảnh đại diện"}
                  className="aspect-[16/9]"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1" type="submit" disabled={submitting || categoryLoading}>
                  {submitting
                    ? "Đang lưu..."
                    : editingArticle
                      ? "Lưu thay đổi"
                      : "Tạo tin tức"}
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  type="button"
                  disabled={submitting}
                  onClick={resetForm}
                >
                  Đặt lại
                </Button>
              </div>
            </form>
          </section>

          <section className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
                  Danh mục
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--color-text-strong)]">
                  Quản lý danh mục tin tức
                </h2>
              </div>
              <Tags className="size-5 text-[var(--color-text-muted)]" />
            </div>

            {categoryErrorMessage ? (
              <div className="mt-4">
                <Alert tone="warning" title="Không thể xử lý danh mục" description={categoryErrorMessage} />
              </div>
            ) : null}

            <form className="mt-4 space-y-3" onSubmit={handleSubmitCategory}>
              <Input
                label="Tên danh mục"
                placeholder="Kinh nghiệm thuê phòng"
                value={categoryForm.name}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, name: event.target.value }))
                }
              />
              <Textarea
                label="Mô tả"
                placeholder="Mô tả ngắn để hiển thị ở trang tin tức."
                value={categoryForm.description}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, description: event.target.value }))
                }
                maxLength={300}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Thứ tự"
                  type="number"
                  value={categoryForm.displayOrder}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      displayOrder: event.target.value,
                    }))
                  }
                />
                <Select
                  label="Hiển thị"
                  options={[
                    { label: "Đang hiển thị", value: "true" },
                    { label: "Tạm ẩn", value: "false" },
                  ]}
                  value={categoryForm.enabled}
                  onChange={(event) =>
                    setCategoryForm((current) => ({ ...current, enabled: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="submit" disabled={categorySubmitting}>
                  {categorySubmitting
                    ? "Đang lưu..."
                    : editingCategoryId
                      ? "Lưu danh mục"
                      : "Thêm danh mục"}
                </Button>
                <Button type="button" variant="outline" onClick={resetCategoryForm}>
                  Đặt lại
                </Button>
              </div>
            </form>

            <div className="mt-5 space-y-2">
              {categoryLoading ? (
                <>
                  <LoadingSkeleton className="h-16 rounded-2xl" />
                  <LoadingSkeleton className="h-16 rounded-2xl" />
                </>
              ) : categories.length ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--color-text-strong)]">
                          {category.name}
                        </p>
                        {category.description ? (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-text-muted)]">
                            {category.description}
                          </p>
                        ) : null}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge tone={category.enabled ? "success" : "muted"}>
                            {category.enabled ? "Hiển thị" : "Tạm ẩn"}
                          </Badge>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            Thứ tự {category.displayOrder}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          className="h-9 px-3"
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingCategory(category)}
                        >
                          Sửa
                        </Button>
                        <Button
                          className="h-9 px-3"
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={categoryActionId === category.id}
                          onClick={() => setConfirmDeleteCategoryId(category.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm text-[var(--color-text-muted)]">
                  Chưa có danh mục tin tức. Hãy tạo ít nhất một danh mục trước khi đăng bài.
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Xóa tin tức"
        description="Bạn chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa tin tức"
        tone="danger"
        loading={actionArticleId !== null}
        onConfirm={() => {
          if (confirmDeleteId) {
            void handleDelete(confirmDeleteId);
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmDialog
        open={confirmDeleteCategoryId !== null}
        title="Xóa danh mục tin tức"
        description="Chỉ xóa được danh mục chưa được bài viết nào sử dụng. Nếu danh mục đang có bài viết, hãy đổi danh mục bài viết trước."
        confirmLabel="Xóa danh mục"
        tone="danger"
        loading={categoryActionId !== null}
        onConfirm={() => {
          if (confirmDeleteCategoryId) {
            void handleDeleteCategory(confirmDeleteCategoryId);
          }
        }}
        onCancel={() => setConfirmDeleteCategoryId(null)}
      />
    </div>
  );
}
