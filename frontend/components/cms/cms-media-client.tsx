"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Copy,
  FileImage,
  LibraryBig,
  RefreshCw,
  Upload,
} from "lucide-react";

import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { NewsImage } from "@/components/news/news-image";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import { searchAdminNewsArticles } from "@/services/news-service";
import { uploadNewsImage } from "@/services/upload-service";
import type { NewsArticle } from "@/types";

interface MediaAsset {
  url: string;
  fileName?: string;
  source: "article" | "uploaded" | "mixed";
  createdAt: string;
  articles: NewsArticle[];
}

export function CmsMediaClient() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [uploadedAssets, setUploadedAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadMedia = (signal?: AbortSignal) => {
    setLoading(true);
    setErrorMessage("");

    return searchAdminNewsArticles({ page: 0, size: 9999 }, signal)
      .then((response) => {
        setArticles(response.content);
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

    void searchAdminNewsArticles({ page: 0, size: 9999 }, controller.signal)
      .then((response) => {
        setArticles(response.content);
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

  const mediaAssets = useMemo(() => {
    const assetMap = new Map<string, MediaAsset>();

    for (const article of articles) {
      const url = article.thumbnailUrl?.trim();

      if (!url) {
        continue;
      }

      const current = assetMap.get(url);

      if (current) {
        current.articles.push(article);
        current.createdAt =
          new Date(article.updatedAt).getTime() > new Date(current.createdAt).getTime()
            ? article.updatedAt
            : current.createdAt;
        continue;
      }

      assetMap.set(url, {
        url,
        source: "article",
        createdAt: article.updatedAt,
        articles: [article],
      });
    }

    for (const uploaded of uploadedAssets) {
      const current = assetMap.get(uploaded.url);

      if (current) {
        assetMap.set(uploaded.url, {
          ...current,
          source: "mixed",
          fileName: uploaded.fileName,
        });
        continue;
      }

      assetMap.set(uploaded.url, uploaded);
    }

    return [...assetMap.values()].sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    );
  }, [articles, uploadedAssets]);

  const uploadedCount = mediaAssets.filter((asset) => asset.source !== "article").length;
  const usedCount = mediaAssets.filter((asset) => asset.articles.length > 0).length;

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      const uploaded = await uploadNewsImage(file);
      const asset: MediaAsset = {
        url: uploaded.url,
        fileName: uploaded.fileName,
        source: "uploaded",
        createdAt: new Date().toISOString(),
        articles: [],
      };

      setUploadedAssets((current) => [asset, ...current]);
      toast("Đã tải ảnh lên thư viện media.", "success");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Đã copy URL ảnh.", "success");
    } catch {
      toast("Không thể copy tự động. Hãy chọn và copy URL thủ công.", "warning");
    }
  };

  if (loading && !mediaAssets.length) {
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
        eyebrow="Media"
        title="Thư viện ảnh CMS"
        description="Quản lý nhanh ảnh đại diện đang dùng trong bài viết và upload ảnh mới để copy URL sang form biên tập."
      >
        <Button
          variant="outline"
          disabled={loading}
          leadingIcon={<RefreshCw className="size-4" />}
          onClick={() => void loadMedia()}
        >
          Làm mới
        </Button>
        <label className="motion-pressable inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-700)] px-5 py-2 text-sm font-medium leading-tight text-[var(--color-brand-contrast)] shadow-[var(--shadow-button)] hover:-translate-y-0.5 hover:bg-[var(--color-brand-800)] hover:shadow-[var(--shadow-button-hover)] active:translate-y-0 active:scale-[0.98]">
          <Upload className="size-4" />
          {uploading ? "Đang tải..." : "Upload ảnh"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => void handleUpload(event)}
          />
        </label>
      </CmsPageHeader>

      {errorMessage ? (
        <Alert tone="warning" title="Không thể xử lý media" description={errorMessage} />
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Tổng ảnh" value={mediaAssets.length} />
        <SummaryCard label="Đang dùng" value={usedCount} />
        <SummaryCard label="Upload phiên này" value={uploadedCount} />
        <SummaryCard label="Bài có ảnh" value={articles.filter((article) => article.thumbnailUrl).length} />
      </section>

      <section className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
              Assets
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--color-text-strong)]">
              Ảnh đang có trong CMS
            </h2>
          </div>
          <Link href="/cms/articles/create">
            <Button variant="outline">Tạo bài viết với ảnh đã copy</Button>
          </Link>
        </div>

        {mediaAssets.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mediaAssets.map((asset) => (
              <article
                key={asset.url}
                className="motion-panel overflow-hidden rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-brand-500)]"
              >
                <NewsImage
                  src={asset.url}
                  title={asset.fileName ?? asset.articles[0]?.title ?? "Ảnh CMS"}
                  className="aspect-[16/10] rounded-none"
                />
                <div className="space-y-4 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={asset.articles.length ? "brand" : "warning"}>
                      {asset.articles.length ? "Đang dùng" : "Chưa gắn bài"}
                    </Badge>
                    <Badge tone={asset.source === "article" ? "muted" : "success"}>
                      {asset.source === "article"
                        ? "Từ bài viết"
                        : asset.source === "mixed"
                          ? "Upload + bài viết"
                          : "Upload mới"}
                    </Badge>
                  </div>

                  <div>
                    <p className="line-clamp-1 text-sm font-semibold text-[var(--color-text-strong)]">
                      {asset.fileName ?? asset.articles[0]?.title ?? "Ảnh CMS"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Cập nhật {formatDate(asset.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                    <p className="break-all text-xs leading-5 text-[var(--color-text-muted)]">
                      {asset.url}
                    </p>
                  </div>

                  {asset.articles.length ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        Đang dùng trong
                      </p>
                      {asset.articles.slice(0, 2).map((article) => (
                        <Link
                          key={article.id}
                          href={`/cms/articles/${article.id}/edit`}
                          className="block rounded-xl bg-[var(--color-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-text-strong)] hover:text-[var(--color-brand-700)]"
                        >
                          {article.title}
                        </Link>
                      ))}
                      {asset.articles.length > 2 ? (
                        <p className="text-xs text-[var(--color-text-muted)]">
                          +{asset.articles.length - 2} bài viết khác
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant="outline"
                      leadingIcon={<Copy className="size-4" />}
                      onClick={() => void handleCopy(asset.url)}
                    >
                      Copy URL
                    </Button>
                    <Link href="/cms/articles/create">
                      <Button className="w-full" variant="secondary">
                        Dùng ảnh
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="Chưa có ảnh trong CMS"
              description="Upload ảnh mới hoặc tạo bài viết có ảnh đại diện để thư viện media hiển thị dữ liệu."
              actionLabel="Tạo bài viết"
              actionHref="/cms/articles/create"
            />
          </div>
        )}
      </section>

      <section className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
            <LibraryBig className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--color-text-strong)]">
              Giới hạn của Media Library giai đoạn này
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
              CMS hiện chưa có bảng `media_assets`, nên ảnh upload mới sẽ hiện ngay trong phiên làm việc và có URL để copy. Khi ảnh đó được gắn vào bài viết, lần tải lại sau sẽ xuất hiện như ảnh đang dùng trong bài viết.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-2xl font-semibold text-[var(--color-text-strong)]">{value}</p>
        <FileImage className="size-5 text-[var(--color-text-muted)]" />
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}
