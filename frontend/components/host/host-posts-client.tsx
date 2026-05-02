"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Download, Edit3, EyeOff, Plus, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { roomStatusMeta } from "@/constants/status";
import { roomTypeLabelByValue } from "@/constants/site";

import { exportCsv } from "@/lib/export-csv";
import { formatCompactCurrency, formatDate } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";
import { getErrorMessage } from "@/services/api-client";
import {
  deleteHostRoom,
  searchHostRooms,
  updateHostRoomStatus,
} from "@/services/host-service";
import type { HostRoomListItem, PageResponse, RoomStatus } from "@/types";

const PAGE_SIZE = 6;

const statusOptions = [
  { label: "Tất cả trạng thái", value: "" },
  { label: "Còn phòng", value: "AVAILABLE" },
  { label: "Hết phòng", value: "FULL" },
  { label: "Tạm ẩn", value: "HIDDEN" },
];

export function HostPostsClient() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<RoomStatus | "">("");
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<HostRoomListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionRoomId, setActionRoomId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [exporting, setExporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HostRoomListItem | null>(null);

  const loadPosts = useCallback((pageValue: number, signal?: AbortSignal) => {
    return searchHostRooms(
      {
        keyword: keyword.trim(),
        status,
        page: pageValue - 1,
        size: PAGE_SIZE,
      },
      signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);
      })
      .catch((error) => {
        if (signal?.aborted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
        }
      });
  }, [keyword, status]);

  useEffect(() => {
    const controller = new AbortController();
    void loadPosts(page, controller.signal);
    return () => controller.abort();
  }, [loadPosts, page]);

  const handleStatusChange = async (roomId: number, nextStatus: RoomStatus) => {
    setActionRoomId(roomId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateHostRoomStatus(roomId, nextStatus);
      setSuccessMessage("Đã cập nhật trạng thái bài đăng.");
      await loadPosts(page);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionRoomId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    const room = deleteTarget;
    setActionRoomId(room.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteHostRoom(room.id);
      setSuccessMessage("Đã xóa bài đăng thành công.");
      const nextPage = response?.content.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      }

      await loadPosts(nextPage);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionRoomId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
              Bài đăng của tôi
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
              Quản lý phòng đang cho thuê
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Theo dõi trạng thái, chỉnh sửa nội dung và xử lý các bài đã hết phòng.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:flex sm:flex-wrap lg:w-auto">
            <Link href="/host/posts/create" className="block">
              <Button className="w-full lg:w-auto" trailingIcon={<Plus className="size-4" />}>
                Thêm bài đăng
              </Button>
            </Link>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              disabled={exporting || loading}
              onClick={async () => {
                setExporting(true);
                try {
                  const all = await searchHostRooms({
                    keyword: keyword.trim(),
                    status,
                    page: 0,
                    size: 9999,
                  });
                  exportCsv({
                    filename: "homi-host-posts",
                    headers: ["Tiêu đề", "Loại phòng", "Khu vực", "Giá", "Diện tích", "Trạng thái", "Khách quan tâm", "Ngày tạo", "Cập nhật"],
                    rows: all.content.map((post) => [
                      post.title,
                      roomTypeLabelByValue[post.roomType],
                      post.districtName,
                      formatCompactCurrency(post.price),
                      `${post.area} m²`,
                      roomStatusMeta[post.status].label,
                      String(post.contactRequestCount),
                      formatDate(post.createdAt),
                      formatDate(post.updatedAt),
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

        <div className="motion-stagger mt-5 grid gap-4 sm:mt-6 lg:grid-cols-[1fr_220px]">
          <Input
            label="Tìm bài đăng / mã tin"
            placeholder="Nhập tên phòng, địa chỉ hoặc mã tin"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setLoading(true);
              setErrorMessage("");
              setPage(1);
            }}
          />
          <Select
            label="Trạng thái"
            options={statusOptions}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as RoomStatus | "");
              setLoading(true);
              setErrorMessage("");
              setPage(1);
            }}
          />
        </div>
      </section>

      {successMessage ? (
        <Alert tone="success" title="Thao tác thành công" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
      ) : null}

      {loading && !response ? (
        <div className="space-y-4">
          <LoadingSkeleton className="h-56 rounded-[30px]" />
          <LoadingSkeleton className="h-56 rounded-[30px]" />
        </div>
      ) : response?.content.length ? (
        <>
          <div className="motion-stagger space-y-4">
            {response.content.map((post) => {
              const statusMeta = roomStatusMeta[post.status];
              const nextOccupancyStatus: RoomStatus = post.status === "FULL" ? "AVAILABLE" : "FULL";

              return (
                <article
                  key={post.id}
                  className="motion-panel group grid min-w-0 gap-4 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[30px] lg:grid-cols-[190px_minmax(0,1fr)]"
                >
                  <div className="relative min-h-40 overflow-hidden rounded-[20px] bg-[var(--color-surface-soft)] sm:min-h-44 sm:rounded-[24px]">
                    {post.thumbnail ? (
                      <Image
                        src={normalizeUploadImageSrc(post.thumbnail)}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 190px, 100vw"
                        className="motion-soft object-cover group-hover:scale-[1.04] group-hover:saturate-[1.08]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[var(--color-text-muted)]">
                        Chưa có ảnh đại diện
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                          <Badge tone="muted">{roomTypeLabelByValue[post.roomType]}</Badge>
                          <Badge tone="muted">{post.contactRequestCount} khách quan tâm</Badge>
                        </div>
                        <h2 className="motion-soft mt-3 line-clamp-2 text-lg font-semibold text-[var(--color-text-strong)] group-hover:text-[var(--color-brand-700)] sm:text-xl">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
                          Mã tin {post.listingCode} · Ngày đăng {formatDate(post.postedAt)}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                          {post.districtName}
                        </p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-2xl font-semibold text-[var(--color-brand-800)]">
                          {formatCompactCurrency(post.price)}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                          {post.area} m² · Cập nhật {formatDate(post.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto grid gap-2 sm:flex sm:flex-wrap">
                      <Link href={`/host/posts/${post.id}/edit`} className="block">
                        <Button className="w-full sm:w-auto" variant="outline" size="sm" leadingIcon={<Edit3 className="size-4" />}>
                          Sửa
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full sm:w-auto"
                        disabled={actionRoomId === post.id}
                        leadingIcon={<EyeOff className="size-4" />}
                        onClick={() =>
                          handleStatusChange(post.id, post.status === "HIDDEN" ? "AVAILABLE" : "HIDDEN")
                        }
                      >
                        {post.status === "HIDDEN" ? "Hiện lại" : "Tạm ẩn"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full sm:w-auto"
                        disabled={actionRoomId === post.id}
                        onClick={() => handleStatusChange(post.id, nextOccupancyStatus)}
                      >
                        {post.status === "FULL" ? "Đánh dấu còn phòng" : "Đánh dấu hết phòng"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        disabled={actionRoomId === post.id}
                        leadingIcon={<Trash2 className="size-4" />}
                        onClick={() => setDeleteTarget(post)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

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
          title="Chưa có bài đăng phù hợp"
          description="Thử đổi bộ lọc hoặc tạo bài đăng mới để bắt đầu nhận khách liên hệ."
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Xóa bài đăng"
        description={
          deleteTarget
            ? `Bạn có chắc chắn muốn xóa bài đăng "${deleteTarget.title}"? Thao tác này không thể hoàn tác nếu bài đăng chưa có ràng buộc dữ liệu.`
            : ""
        }
        confirmLabel="Xóa bài đăng"
        tone="danger"
        loading={deleteTarget !== null && actionRoomId === deleteTarget.id}
        onConfirm={handleDelete}
        onCancel={() => {
          if (actionRoomId === null) {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
