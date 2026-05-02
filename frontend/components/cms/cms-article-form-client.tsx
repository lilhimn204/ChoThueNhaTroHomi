"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Save, Search, Star, Upload } from "lucide-react";

import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { MarkdownContent } from "@/components/news/markdown-content";
import { NewsImage } from "@/components/news/news-image";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { newsArticleStatusMeta } from "@/constants/status";
import { formatDate } from "@/lib/format";
import { ApiError, getErrorMessage } from "@/services/api-client";
import {
  createNewsArticle,
  getAdminNewsArticle,
  getAdminNewsCategories,
  updateNewsArticle,
} from "@/services/news-service";
import { uploadNewsImage } from "@/services/upload-service";
import type { NewsArticle, NewsArticleStatus, NewsCategory } from "@/types";

interface ArticleFormState {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  featured: boolean;
  category: string;
  status: NewsArticleStatus;
  publishedAt: string;
  authorName: string;
}

const statusOptions: Array<{ label: string; value: NewsArticleStatus }> = [
  { value: "DRAFT", label: newsArticleStatusMeta.DRAFT.label },
  { value: "PUBLISHED", label: newsArticleStatusMeta.PUBLISHED.label },
];

function createEmptyForm(defaultCategory = ""): ArticleFormState {
  return {
    title: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    ogImageUrl: "",
    canonicalUrl: "",
    summary: "",
    content: "",
    thumbnailUrl: "",
    featured: false,
    category: defaultCategory,
    status: "DRAFT",
    publishedAt: "",
    authorName: "Homi",
  };
}

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

function formFromArticle(article: NewsArticle): ArticleFormState {
  return {
    title: article.title,
    slug: article.slug,
    seoTitle: article.seoTitle ?? "",
    seoDescription: article.seoDescription ?? "",
    ogImageUrl: article.ogImageUrl ?? "",
    canonicalUrl: article.canonicalUrl ?? "",
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

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thuenhahomi.id.vn").replace(/\/$/, "");
}

export function CmsArticleFormClient({
  mode,
  articleId,
}: {
  mode: "create" | "edit";
  articleId?: number;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [formData, setFormData] = useState<ArticleFormState>(createEmptyForm());
  const [contentMode, setContentMode] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(mode === "edit");
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void getAdminNewsCategories(controller.signal)
      .then((nextCategories) => {
        setCategories(nextCategories);
        setFormData((current) => {
          if (current.category || !nextCategories.length) {
            return current;
          }

          return { ...current, category: nextCategories[0].name };
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCategoryLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !articleId) {
      return;
    }

    const controller = new AbortController();

    void getAdminNewsArticle(articleId, controller.signal)
      .then((nextArticle) => {
        setArticle(nextArticle);
        setFormData(formFromArticle(nextArticle));
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
  }, [articleId, mode]);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.enabled ? category.name : `${category.name} (ẩn)`,
        value: category.name,
      })),
    [categories],
  );

  const pageTitle = mode === "create" ? "Tạo bài viết mới" : "Sửa bài viết";
  const pageDescription =
    mode === "create"
      ? "Soạn bài mới, tối ưu SEO rồi lưu nháp trước khi xuất bản."
      : "Cập nhật nội dung, ảnh đại diện, SEO và trạng thái xuất bản của bài viết.";

  const effectiveSeoTitle = formData.seoTitle.trim() || formData.title.trim() || "Tiêu đề bài viết Homi";
  const effectiveSeoDescription =
    formData.seoDescription.trim() ||
    formData.summary.trim() ||
    "Mô tả ngắn của bài viết sẽ hiển thị ở kết quả tìm kiếm và mạng xã hội.";
  const effectiveOgImage = formData.ogImageUrl.trim() || formData.thumbnailUrl.trim();
  const finalSlug = formData.slug.trim() || article?.slug || "slug-se-duoc-tao-khi-luu";
  const finalCanonical = formData.canonicalUrl.trim() || `${getSiteUrl()}/news/${finalSlug}`;

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
      setFormData((current) => ({
        ...current,
        thumbnailUrl: uploaded.url,
        ogImageUrl: current.ogImageUrl || uploaded.url,
      }));
      toast("Đã tải ảnh đại diện.", "success");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      seoTitle: formData.seoTitle.trim(),
      seoDescription: formData.seoDescription.trim(),
      ogImageUrl: formData.ogImageUrl.trim(),
      canonicalUrl: formData.canonicalUrl.trim(),
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
      const savedArticle =
        mode === "edit" && articleId
          ? await updateNewsArticle(articleId, payload)
          : await createNewsArticle(payload);

      setArticle(savedArticle);
      setFormData(formFromArticle(savedArticle));
      setSuccessMessage(mode === "edit" ? "Đã lưu thay đổi bài viết." : "Đã tạo bài viết mới.");
      toast(mode === "edit" ? "Đã lưu bài viết." : "Đã tạo bài viết.", "success");

      if (mode === "create") {
        router.replace(`/cms/articles/${savedArticle.id}/edit`);
      }
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

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-40 rounded-[28px]" />
        <LoadingSkeleton className="h-[42rem] rounded-[28px]" />
      </div>
    );
  }

  if (mode === "edit" && !articleId) {
    return (
      <Alert
        tone="warning"
        title="Không mở được bài viết"
        description="Mã bài viết không hợp lệ."
      />
    );
  }

  return (
    <div className="space-y-5">
      <CmsPageHeader eyebrow="Bài viết" title={pageTitle} description={pageDescription}>
        <Link href="/cms/articles">
          <Button variant="outline" leadingIcon={<ArrowLeft className="size-4" />}>
            Danh sách
          </Button>
        </Link>
        {article ? (
          <Link href={`/cms/articles/${article.id}/preview`} target="_blank">
            <Button variant="secondary" trailingIcon={<ExternalLink className="size-4" />}>
              Preview
            </Button>
          </Link>
        ) : null}
        {article?.status === "PUBLISHED" ? (
          <Link href={`/news/${article.slug}`} target="_blank">
            <Button variant="outline" trailingIcon={<ExternalLink className="size-4" />}>
              Public
            </Button>
          </Link>
        ) : null}
      </CmsPageHeader>

      {successMessage ? (
        <Alert tone="success" title="Đã lưu" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
      ) : null}

      <form
        className="grid gap-5 xl:grid-cols-[minmax(0,0.66fr)_minmax(360px,0.34fr)]"
        onSubmit={handleSubmit}
      >
        <section className="space-y-5">
          <div className="motion-panel space-y-4 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:p-6">
            <Input
              label="Tiêu đề"
              placeholder="Ví dụ: Cầu Giấy tiếp tục là khu vực được tìm kiếm nhiều..."
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

            <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={contentMode === "edit" ? "primary" : "ghost"}
                  onClick={() => setContentMode("edit")}
                >
                  Soạn thảo
                </Button>
                <Button
                  type="button"
                  variant={contentMode === "preview" ? "primary" : "ghost"}
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
                    className="min-h-[28rem]"
                    error={fieldErrors.content}
                  />
                ) : (
                  <div className="min-h-[28rem] rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-input-bg)] p-5">
                    <MarkdownContent content={formData.content} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <section className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
                  SEO
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--color-text-strong)]">
                  Tối ưu tìm kiếm và chia sẻ
                </h2>
              </div>
              <Search className="size-5 text-[var(--color-text-muted)]" />
            </div>

            <div className="mt-5 grid gap-4">
              <Input
                label="Slug tùy chỉnh"
                placeholder="vi-du-bai-viet-homi"
                value={formData.slug}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, slug: event.target.value }))
                }
                hint="Nếu bỏ trống, hệ thống tự tạo slug từ tiêu đề. Slug vẫn được chống trùng ở backend."
                error={fieldErrors.slug}
              />
              <Input
                label="Meta title"
                placeholder="Tiêu đề SEO hiển thị trên Google"
                value={formData.seoTitle}
                maxLength={180}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, seoTitle: event.target.value }))
                }
                hint={`${formData.seoTitle.length}/180 ký tự. Bỏ trống sẽ dùng tiêu đề bài viết.`}
                error={fieldErrors.seoTitle}
              />
              <Textarea
                label="Meta description"
                placeholder="Mô tả SEO ngắn, rõ lợi ích cho người đọc."
                value={formData.seoDescription}
                maxLength={320}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, seoDescription: event.target.value }))
                }
                hint={`${formData.seoDescription.length}/320 ký tự. Bỏ trống sẽ dùng mô tả ngắn.`}
                error={fieldErrors.seoDescription}
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <Input
                  label="OG image URL"
                  placeholder="https://... hoặc /uploads/news/..."
                  value={formData.ogImageUrl}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, ogImageUrl: event.target.value }))
                  }
                  hint="Bỏ trống sẽ dùng ảnh đại diện."
                  error={fieldErrors.ogImageUrl}
                />
                <Input
                  label="Canonical URL"
                  placeholder="https://thuenhahomi.id.vn/news/..."
                  value={formData.canonicalUrl}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, canonicalUrl: event.target.value }))
                  }
                  hint="Bỏ trống sẽ dùng URL bài viết hiện tại."
                  error={fieldErrors.canonicalUrl}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <SeoPreviewCard
                title="Google preview"
                url={finalCanonical}
                seoTitle={effectiveSeoTitle}
                description={effectiveSeoDescription}
              />
              <SocialPreviewCard
                title={effectiveSeoTitle}
                description={effectiveSeoDescription}
                imageUrl={effectiveOgImage}
              />
            </div>
          </section>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <section className="motion-panel space-y-4 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
                  Xuất bản
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--color-text-strong)]">
                  Trạng thái bài viết
                </h2>
              </div>
              <Star className={formData.featured ? "size-5 text-[var(--color-accent-500)]" : "size-5 text-[var(--color-text-muted)]"} />
            </div>

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

            <Button
              className="w-full"
              type="submit"
              disabled={submitting || categoryLoading}
              leadingIcon={<Save className="size-4" />}
            >
              {submitting ? "Đang lưu..." : mode === "edit" ? "Lưu thay đổi" : "Tạo bài viết"}
            </Button>

            {article ? (
              <div className="rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-text-muted)]">
                <p>
                  Sửa cuối:{" "}
                  <span className="font-semibold text-[var(--color-text-strong)]">
                    {formatDate(article.lastEditedAt ?? article.updatedAt)}
                  </span>
                </p>
                <p>
                  Người sửa:{" "}
                  <span className="font-semibold text-[var(--color-text-strong)]">
                    {article.updatedByName ?? article.createdByName ?? "Admin"}
                  </span>
                </p>
              </div>
            ) : null}
          </section>

          <section className="motion-panel space-y-4 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
              Phân loại
            </p>
            <Select
              label="Danh mục"
              options={categoryOptions}
              value={formData.category}
              onChange={(event) =>
                setFormData((current) => ({ ...current, category: event.target.value }))
              }
            />
            {!categories.length && !categoryLoading ? (
              <Alert
                tone="warning"
                title="Chưa có danh mục"
                description="Hãy tạo danh mục tin tức trước khi lưu bài viết."
              />
            ) : null}
          </section>

          <section className="motion-panel space-y-4 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
              Ảnh đại diện
            </p>
            <Input
              label="URL ảnh"
              placeholder="https://... hoặc /uploads/news/..."
              value={formData.thumbnailUrl}
              onChange={(event) =>
                setFormData((current) => ({ ...current, thumbnailUrl: event.target.value }))
              }
              error={fieldErrors.thumbnailUrl}
            />
            <label className="motion-soft flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-text-strong)] hover:border-[var(--color-brand-500)] hover:text-[var(--color-brand-700)]">
              <Upload className="size-4" />
              {thumbnailUploading ? "Đang tải ảnh..." : "Tải ảnh lên"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={thumbnailUploading}
                onChange={(event) => void handleThumbnailFileChange(event)}
              />
            </label>
            <NewsImage
              src={formData.thumbnailUrl}
              title={formData.title || "Ảnh đại diện bài viết"}
              className="aspect-[16/9]"
            />
          </section>
        </aside>
      </form>
    </div>
  );
}

function SeoPreviewCard({
  title,
  url,
  seoTitle,
  description,
}: {
  title: string;
  url: string;
  seoTitle: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--color-text-strong)]">{title}</p>
        <Badge tone="muted">SERP</Badge>
      </div>
      <p className="mt-4 truncate text-xs text-[#188038]">{url}</p>
      <p className="mt-1 line-clamp-1 text-lg font-medium text-[#1a0dab]">{seoTitle}</p>
      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
    </div>
  );
}

function SocialPreviewCard({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface-soft)]">
      <NewsImage
        src={imageUrl}
        title={title}
        className="aspect-[16/8] rounded-none"
      />
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            thuenhahomi.id.vn
          </p>
          <Badge tone="brand">Social</Badge>
        </div>
        <p className="mt-2 line-clamp-2 font-semibold text-[var(--color-text-strong)]">
          {title}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
