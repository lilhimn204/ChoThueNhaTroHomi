"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FolderTree, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import {
  createNewsCategory,
  deleteNewsCategory,
  getAdminNewsCategories,
  searchAdminNewsArticles,
  updateNewsCategory,
  type NewsCategoryPayload,
} from "@/services/news-service";
import type { NewsArticle, NewsCategory } from "@/types";

const initialForm = {
  name: "",
  description: "",
  displayOrder: "0",
  enabled: "true",
};

function formFromCategory(category: NewsCategory) {
  return {
    name: category.name,
    description: category.description ?? "",
    displayOrder: String(category.displayOrder),
    enabled: String(category.enabled),
  };
}

export function CmsCategoriesClient() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionCategoryId, setActionCategoryId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = (signal?: AbortSignal) => {
    setLoading(true);
    setErrorMessage("");

    return Promise.all([
      getAdminNewsCategories(signal),
      searchAdminNewsArticles({ page: 0, size: 9999 }, signal),
    ])
      .then(([categoryResponse, articleResponse]) => {
        setCategories(categoryResponse);
        setArticles(articleResponse.content);
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

    void Promise.all([
      getAdminNewsCategories(controller.signal),
      searchAdminNewsArticles({ page: 0, size: 9999 }, controller.signal),
    ])
      .then(([categoryResponse, articleResponse]) => {
        setCategories(categoryResponse);
        setArticles(articleResponse.content);
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

  const categoryRows = useMemo(
    () =>
      categories.map((category) => ({
        category,
        articleCount: articles.filter((article) => article.category === category.name).length,
      })),
    [articles, categories],
  );

  const editingCategory = useMemo(
    () => categories.find((category) => category.id === editingCategoryId) ?? null,
    [categories, editingCategoryId],
  );

  const enabledCount = categories.filter((category) => category.enabled).length;
  const usedCount = categoryRows.filter((row) => row.articleCount > 0).length;

  const resetForm = () => {
    setEditingCategoryId(null);
    setFormData(initialForm);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const startEditing = (category: NewsCategory) => {
    setEditingCategoryId(category.id);
    setFormData(formFromCategory(category));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const toPayload = (): NewsCategoryPayload => ({
    name: formData.name.trim(),
    description: formData.description.trim(),
    displayOrder: Number(formData.displayOrder) || 0,
    enabled: formData.enabled === "true",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingCategoryId) {
        await updateNewsCategory(editingCategoryId, toPayload());
        setSuccessMessage("Đã cập nhật danh mục.");
        toast("Đã cập nhật danh mục.", "success");
      } else {
        await createNewsCategory(toPayload());
        setSuccessMessage("Đã tạo danh mục mới.");
        toast("Đã tạo danh mục.", "success");
      }

      resetForm();
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEnabled = async (category: NewsCategory) => {
    setActionCategoryId(category.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateNewsCategory(category.id, {
        name: category.name,
        description: category.description ?? "",
        displayOrder: category.displayOrder,
        enabled: !category.enabled,
      });
      toast(!category.enabled ? "Đã bật danh mục." : "Đã tạm ẩn danh mục.", "success");
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionCategoryId(null);
    }
  };

  const handleDelete = async (categoryId: number) => {
    setActionCategoryId(categoryId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteNewsCategory(categoryId);
      toast("Đã xóa danh mục.", "success");

      if (editingCategoryId === categoryId) {
        resetForm();
      }

      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionCategoryId(null);
      setConfirmDeleteId(null);
    }
  };

  if (loading && !categories.length) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-40 rounded-[28px]" />
        <LoadingSkeleton className="h-[36rem] rounded-[28px]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <CmsPageHeader
        eyebrow="Danh mục"
        title="Quản lý danh mục nội dung"
        description="Tạo, sửa, bật/tắt và sắp xếp danh mục tin tức. Khi đổi tên danh mục, backend sẽ đồng bộ các bài viết đang dùng danh mục đó."
      >
        <Button
          variant="outline"
          disabled={loading}
          leadingIcon={<RefreshCw className="size-4" />}
          onClick={() => void loadData()}
        >
          Làm mới
        </Button>
        <Button leadingIcon={<Plus className="size-4" />} onClick={resetForm}>
          Tạo danh mục
        </Button>
      </CmsPageHeader>

      {successMessage ? (
        <Alert tone="success" title="Thao tác thành công" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Tổng danh mục" value={categories.length} />
        <SummaryCard label="Đang hiển thị" value={enabledCount} />
        <SummaryCard label="Đang có bài viết" value={usedCount} />
        <SummaryCard label="Tổng bài viết" value={articles.length} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-3">
          {categoryRows.length ? (
            categoryRows.map(({ category, articleCount }) => (
              <article
                key={category.id}
                className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={category.enabled ? "success" : "muted"}>
                        {category.enabled ? "Đang hiển thị" : "Tạm ẩn"}
                      </Badge>
                      <Badge tone={articleCount > 0 ? "brand" : "warning"}>
                        {articleCount} bài viết
                      </Badge>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        Thứ tự {category.displayOrder}
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold text-[var(--color-text-strong)]">
                      {category.name}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
                      {category.description || "Chưa có mô tả cho danh mục này."}
                    </p>

                    <div className="mt-3 grid gap-2 text-sm text-[var(--color-text-muted)] sm:grid-cols-2">
                      <p>
                        Slug:{" "}
                        <span className="font-semibold text-[var(--color-text-strong)]">
                          {category.slug}
                        </span>
                      </p>
                      <p>
                        Cập nhật:{" "}
                        <span className="font-semibold text-[var(--color-text-strong)]">
                          {formatDate(category.updatedAt)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
                    <Button
                      className="h-10 px-4"
                      type="button"
                      variant="outline"
                      leadingIcon={<Pencil className="size-4" />}
                      onClick={() => startEditing(category)}
                    >
                      Sửa
                    </Button>
                    <Button
                      className="h-10 px-4"
                      type="button"
                      variant="secondary"
                      disabled={actionCategoryId === category.id}
                      onClick={() => void handleToggleEnabled(category)}
                    >
                      {category.enabled ? "Ẩn" : "Bật"}
                    </Button>
                    <Button
                      className="h-10 px-4"
                      type="button"
                      variant="ghost"
                      disabled={actionCategoryId === category.id}
                      leadingIcon={<Trash2 className="size-4" />}
                      onClick={() => setConfirmDeleteId(category.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title="Chưa có danh mục tin tức"
              description="Tạo danh mục đầu tiên để tổ chức bài viết trên trang tin tức."
              actionLabel="Tạo danh mục"
              onAction={resetForm}
            />
          )}
        </section>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <section className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
                <FolderTree className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
                  {editingCategory ? "Sửa danh mục" : "Tạo danh mục"}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--color-text-strong)]">
                  {editingCategory?.name ?? "Danh mục mới"}
                </h2>
              </div>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Tên danh mục"
                placeholder="Ví dụ: Tin dự án"
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, name: event.target.value }))
                }
              />
              <Textarea
                label="Mô tả"
                placeholder="Mô tả ngắn hiển thị ở bộ lọc tin tức."
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, description: event.target.value }))
                }
                maxLength={300}
              />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <Input
                  label="Thứ tự"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(event) =>
                    setFormData((current) => ({
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
                  value={formData.enabled}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, enabled: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Đang lưu..."
                    : editingCategory
                      ? "Lưu thay đổi"
                      : "Tạo danh mục"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Đặt lại
                </Button>
              </div>
            </form>

            <div className="mt-5 rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-text-muted)]">
              Không thể xóa danh mục đang có bài viết. Hãy đổi danh mục cho bài viết trước khi xóa.
              <Link
                href="/cms/articles"
                className="mt-2 block font-semibold text-[var(--color-brand-700)]"
              >
                Mở danh sách bài viết
              </Link>
            </div>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Xóa danh mục tin tức"
        description="Chỉ xóa được danh mục chưa có bài viết nào sử dụng. Nếu danh mục đang có bài viết, hãy đổi danh mục của các bài viết đó trước."
        confirmLabel="Xóa danh mục"
        tone="danger"
        loading={actionCategoryId !== null}
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
