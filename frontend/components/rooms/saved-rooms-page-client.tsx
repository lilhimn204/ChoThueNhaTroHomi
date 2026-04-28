"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Ruler, Scale, X } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { SectionHeading } from "@/components/shared/section-heading";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { roomStatusMeta } from "@/constants/status";
import { useAuth } from "@/hooks/use-auth";
import { formatArea, formatCompactCurrency, formatDate } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";
import { getErrorMessage } from "@/services/api-client";
import { getSavedRooms, toggleSaveRoom, type SavedRoomItem } from "@/services/saved-room-service";
import type { PageResponse } from "@/types";

const PAGE_SIZE = 12;
const MAX_COMPARE_ROOMS = 3;

export function SavedRoomsPageClient() {
  const { user, status } = useAuth();
  const authLoading = status === "loading";
  const [response, setResponse] = useState<PageResponse<SavedRoomItem> | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;

    const controller = new AbortController();

    void getSavedRooms(page - 1, PAGE_SIZE, controller.signal)
      .then((data) => {
        setResponse(data);
        setErrorMessage("");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [user, authLoading, page]);

  const rooms = useMemo(() => response?.content ?? [], [response]);
  const totalPages = response?.totalPages ?? 1;
  const selectedRooms = useMemo(
    () => selectedIds.map((roomId) => rooms.find((room) => room.roomId === roomId)).filter(Boolean) as SavedRoomItem[],
    [rooms, selectedIds],
  );

  const bestPrice = selectedRooms.length > 1 ? Math.min(...selectedRooms.map((room) => room.price)) : null;
  const largestArea = selectedRooms.length > 1 ? Math.max(...selectedRooms.map((room) => room.area)) : null;

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
    setSelectedIds([]);
  };

  const handleToggleCompare = (roomId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      }

      if (prev.length >= MAX_COMPARE_ROOMS) {
        return [...prev.slice(1), roomId];
      }

      return [...prev, roomId];
    });
  };

  const handleUnsave = async (roomId: number) => {
    try {
      await toggleSaveRoom(roomId);
      setSelectedIds((prev) => prev.filter((id) => id !== roomId));
      setResponse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.filter((item) => item.roomId !== roomId),
          totalElements: prev.totalElements - 1,
        };
      });
    } catch {
      // Keep the current UI state if the server rejects the action.
    }
  };

  if (authLoading) {
    return (
      <div className="container-shell py-10">
        <LoadingSkeleton className="h-8 w-64 rounded-xl" />
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-72 rounded-[28px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-shell py-10">
        <EmptyState
          title="Cần đăng nhập"
          description="Đăng nhập để xem danh sách phòng đã lưu."
          actionLabel="Đăng nhập"
          actionHref="/login?redirect=/saved-rooms"
        />
      </div>
    );
  }

  return (
    <div className="container-shell py-10">
      <SectionHeading
        eyebrow="Phòng đã lưu"
        title="Danh sách phòng trọ bạn quan tâm"
        description="Chọn tối đa 3 phòng để so sánh nhanh giá, diện tích, khu vực và trạng thái trước khi liên hệ."
      />

      {errorMessage ? (
        <Alert
          tone="warning"
          title="Không tải được danh sách"
          description={errorMessage}
        />
      ) : loading ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-72 rounded-[28px]" />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState
          title="Chưa lưu phòng nào"
          description="Khi duyệt phòng, nhấn biểu tượng trái tim trên ảnh phòng để lưu phòng quan tâm."
          actionLabel="Tìm phòng"
          actionHref="/rooms"
        />
      ) : (
        <>
          <SavedRoomComparison
            rooms={selectedRooms}
            bestPrice={bestPrice}
            largestArea={largestArea}
            onRemove={(roomId) => setSelectedIds((prev) => prev.filter((id) => id !== roomId))}
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((item) => {
              const selected = selectedIds.includes(item.roomId);

              return (
                <article
                  key={item.roomId}
                  className="group overflow-hidden rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={normalizeUploadImageSrc(item.thumbnail)}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 via-black/25 to-transparent p-4">
                      <div className="flex items-center justify-between">
                      <Badge tone={roomStatusMeta[item.status].tone}>
                        {roomStatusMeta[item.status].label}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleUnsave(item.roomId)}
                        aria-label="Bỏ lưu phòng"
                        className="flex size-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-red-500/40 active:scale-95"
                      >
                        <Heart className="size-4 fill-current" />
                      </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-lg font-semibold text-[var(--color-text-strong)]">
                        {item.title}
                      </h3>
                      <p className="shrink-0 rounded-full bg-[var(--badge-brand-bg)] px-3 py-1 text-sm font-semibold text-[var(--badge-brand-text)]">
                        {formatCompactCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-text-muted)]">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {item.districtName}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Ruler className="size-3.5" />
                        {formatArea(item.area)}
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button
                        type="button"
                        variant={selected ? "primary" : "secondary"}
                        size="sm"
                        className="w-full"
                        leadingIcon={<Scale className="size-4" />}
                        onClick={() => handleToggleCompare(item.roomId)}
                      >
                        {selected ? "Đã chọn" : "So sánh"}
                      </Button>
                      <Link href={`/rooms/${item.slug}`} className="block">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between"
                          trailingIcon={<ArrowRight className="size-4" />}
                        >
                          Chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

function SavedRoomComparison({
  rooms,
  bestPrice,
  largestArea,
  onRemove,
}: {
  rooms: SavedRoomItem[];
  bestPrice: number | null;
  largestArea: number | null;
  onRemove: (roomId: number) => void;
}) {
  if (rooms.length < 2) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-4 text-sm text-[var(--color-text-muted)] shadow-sm transition-colors duration-200 hover:border-[var(--color-border-strong)]">
        Chọn ít nhất 2 phòng để mở bảng so sánh nhanh.
      </div>
    );
  }

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-soft)] px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-strong)]">
            So sánh phòng đã lưu
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Giá thấp nhất và diện tích lớn nhất được đánh dấu để ra quyết định nhanh hơn.
          </p>
        </div>
        <Badge tone="brand">{rooms.length}/3 phòng</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-sm">
          <thead className="bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Tiêu chí</th>
              {rooms.map((room) => (
                <th key={room.roomId} className="px-4 py-3 font-medium">
                  <div className="flex items-start justify-between gap-3">
                    <span className="line-clamp-2 text-[var(--color-text-strong)]">{room.title}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(room.roomId)}
                      aria-label="Bỏ khỏi bảng so sánh"
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text-strong)] active:scale-95"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-soft)]">
            <ComparisonRow
              label="Giá thuê"
              rooms={rooms}
              render={(room) => formatCompactCurrency(room.price)}
              highlight={(room) => room.price === bestPrice}
            />
            <ComparisonRow
              label="Diện tích"
              rooms={rooms}
              render={(room) => formatArea(room.area)}
              highlight={(room) => room.area === largestArea}
            />
            <ComparisonRow label="Khu vực" rooms={rooms} render={(room) => room.districtName} />
            <ComparisonRow label="Địa chỉ" rooms={rooms} render={(room) => room.address} />
            <ComparisonRow
              label="Trạng thái"
              rooms={rooms}
              render={(room) => roomStatusMeta[room.status].label}
            />
            <ComparisonRow
              label="Ngày lưu"
              rooms={rooms}
              render={(room) => formatDate(room.savedAt)}
            />
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComparisonRow({
  label,
  rooms,
  render,
  highlight,
}: {
  label: string;
  rooms: SavedRoomItem[];
  render: (room: SavedRoomItem) => string;
  highlight?: (room: SavedRoomItem) => boolean;
}) {
  return (
    <tr>
      <th className="w-36 px-4 py-3 font-medium text-[var(--color-text-muted)]">{label}</th>
      {rooms.map((room) => {
        const isHighlighted = highlight?.(room) ?? false;
        return (
          <td
            key={room.roomId}
            className={`px-4 py-3 text-[var(--color-text-strong)] ${
              isHighlighted ? "bg-[var(--color-brand-50)] font-semibold text-[var(--color-brand-700)]" : ""
            }`}
          >
            {render(room)}
          </td>
        );
      })}
    </tr>
  );
}
