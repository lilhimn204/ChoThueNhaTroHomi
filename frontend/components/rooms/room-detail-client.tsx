"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ExternalLink, Hash, MapPin, PhoneCall, Ruler, WalletCards } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/services/api-client";
import { getRoomDetail, searchRooms } from "@/services/room-service";
import { roomStatusMeta } from "@/constants/status";
import { ContactFormCard } from "@/components/forms/contact-form-card";
import { AmenityIcon } from "@/components/shared/amenity-icon";
import { RoomReportCard } from "@/components/rooms/room-report-card";
import { RoomCard } from "@/components/rooms/room-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatArea, formatCurrency, formatDate } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";
import { buildMapSearchUrl } from "@/lib/maps";
import type { Room, RoomSummary } from "@/types";

function uniqueImages(images: Room["images"]) {
  const seenIds = new Set<number>();

  return images.filter((image) => {
    if (seenIds.has(image.id)) {
      return false;
    }

    seenIds.add(image.id);
    return true;
  });
}

function uniqueRelatedRooms(currentRoomId: number, sources: RoomSummary[][]) {
  const seenIds = new Set<number>([currentRoomId]);
  const rooms: RoomSummary[] = [];

  for (const source of sources) {
    for (const room of source) {
      if (seenIds.has(room.id)) {
        continue;
      }

      seenIds.add(room.id);
      rooms.push(room);
    }
  }

  return rooms.slice(0, 4);
}

function getRange(value: number, ratio: number, minOffset: number) {
  const offset = Math.max(value * ratio, minOffset);
  return {
    min: Math.max(0, value - offset).toFixed(0),
    max: (value + offset).toFixed(0),
  };
}

export function RoomDetailClient({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [relatedRooms, setRelatedRooms] = useState<RoomSummary[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void getRoomDetail(slug, controller.signal)
      .then((response) => {
        setRelatedRooms([]);
        setRelatedLoading(true);
        setRoom(response);
        setErrorMessage("");
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (!room) {
      return;
    }

    const controller = new AbortController();
    const priceRange = getRange(room.price, 0.25, 500_000);
    const areaRange = getRange(room.area, 0.25, 5);
    const amenityIds = room.amenities.slice(0, 1).map((amenity) => String(amenity.id));

    void Promise.all([
      searchRooms(
        {
          districtId: String(room.districtId),
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          minArea: areaRange.min,
          maxArea: areaRange.max,
          amenityIds,
          status: "AVAILABLE",
          sort: "newest",
          size: 8,
        },
        controller.signal,
      ),
      searchRooms(
        {
          districtId: String(room.districtId),
          status: "AVAILABLE",
          sort: "newest",
          size: 8,
        },
        controller.signal,
      ),
      searchRooms(
        {
          status: "AVAILABLE",
          sort: "newest",
          size: 8,
        },
        controller.signal,
      ),
    ])
      .then(([similar, sameDistrict, latest]) => {
        setRelatedRooms(uniqueRelatedRooms(room.id, [
          similar.content,
          sameDistrict.content,
          latest.content,
        ]));
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRelatedRooms([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRelatedLoading(false);
        }
      });

    return () => controller.abort();
  }, [room]);

  if (loading) {
    return (
      <div className="container-shell py-6 sm:py-10">
        <LoadingSkeleton className="h-6 w-48 rounded-xl" />
        <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <LoadingSkeleton className="h-[28rem] rounded-[32px]" />
            <LoadingSkeleton className="h-64 rounded-[32px]" />
            <LoadingSkeleton className="h-56 rounded-[32px]" />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton className="h-72 rounded-[32px]" />
            <LoadingSkeleton className="h-48 rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !room) {
    return (
      <div className="container-shell py-6 sm:py-10">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)]"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách phòng
        </Link>

        <div className="mt-6">
          <Alert
            tone="warning"
            title="Không tải được chi tiết phòng"
            description={
              errorMessage || "Bài đăng này có thể đã bị xóa hoặc tạm thời không khả dụng."
            }
          />
        </div>
      </div>
    );
  }

  const roomImages = uniqueImages(room.images);
  const mapHref = buildMapSearchUrl({
    address: room.address,
    districtName: room.districtName,
    cityName: room.cityName,
  });
  const isOwnRoom = user && room.ownerId != null && user.id === room.ownerId;

  return (
    <div className="container-shell py-6 sm:py-10">
      <Link
        href="/rooms"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)]"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách phòng
      </Link>

      <div className="mt-5 grid min-w-0 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="min-w-0 space-y-5 sm:space-y-6">
          <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative h-64 overflow-hidden rounded-[24px] shadow-[var(--shadow-card-hover)] sm:h-[28rem] sm:rounded-[32px]">
              <Image
                src={normalizeUploadImageSrc(roomImages[0]?.imageUrl ?? room.thumbnail)}
                alt={room.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 65vw"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
              {roomImages.slice(1, 3).map((image) => (
                <div
                  key={image.id}
                  className="relative h-28 overflow-hidden rounded-[20px] border border-white/70 shadow-[var(--shadow-card)] sm:h-44 sm:rounded-[28px]"
                >
                  <Image
                    src={normalizeUploadImageSrc(image.imageUrl)}
                    alt={image.altText}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={roomStatusMeta[room.status].tone}>
                    {roomStatusMeta[room.status].label}
                  </Badge>
                  {room.featured ? <Badge tone="brand">Phòng nổi bật</Badge> : null}
                </div>
                <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
                  {room.title}
                </h1>
                <p className="flex items-start gap-2 text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
                  <MapPin className="mt-1 size-4 shrink-0" />
                  <span>{room.address}, {room.districtName}</span>
                </p>
              </div>
              <div className="w-full rounded-[22px] bg-[var(--color-brand-50)] px-4 py-4 text-left sm:w-auto sm:rounded-[28px] sm:px-5 sm:text-right">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  Giá thuê / tháng
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--color-brand-800)]">
                  {formatCurrency(room.price)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
              <div className="rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 sm:rounded-[24px] sm:px-5 sm:py-4">
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Hash className="size-4" />
                  Mã tin
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text-strong)] sm:text-lg">
                  {room.listingCode}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 sm:rounded-[24px] sm:px-5 sm:py-4">
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <CalendarDays className="size-4" />
                  Ngày đăng
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text-strong)] sm:text-lg">
                  {formatDate(room.postedAt)}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 sm:rounded-[24px] sm:px-5 sm:py-4">
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Ruler className="size-4" />
                  Diện tích
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text-strong)] sm:text-lg">
                  {formatArea(room.area)}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 sm:rounded-[24px] sm:px-5 sm:py-4">
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <MapPin className="size-4" />
                  Khu vực
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text-strong)] sm:text-lg">
                  {room.districtName}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 sm:rounded-[24px] sm:px-5 sm:py-4">
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <WalletCards className="size-4" />
                  Trạng thái
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text-strong)] sm:text-lg">
                  {roomStatusMeta[room.status].label}
                </p>
              </div>
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 transition hover:bg-[var(--color-border-soft)] sm:rounded-[24px] sm:px-5 sm:py-4"
              >
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <ExternalLink className="size-4" />
                  Bản đồ
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text-strong)] sm:text-lg">
                  Mở vị trí
                </p>
              </a>
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
              Mô tả phòng
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] sm:mt-4 sm:text-base sm:leading-8">
              {room.description}
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
              Tiện ích nổi bật
            </h2>
            <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-3">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex min-w-0 items-center gap-3 rounded-[20px] bg-[var(--color-surface-soft)] px-3 py-3 sm:rounded-[24px] sm:px-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-brand-700)] shadow-sm transition-transform duration-200 group-hover:scale-105">
                    <AmenityIcon iconKey={amenity.iconKey} className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--color-text-strong)]">
                      {amenity.name}
                    </p>
                    <p className="truncate text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      {amenity.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="min-w-0 space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Thông tin bài đăng
            </p>
            <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 xl:grid-cols-1">
              <div className="flex items-center justify-between gap-4 rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 sm:rounded-[24px]">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                  <Hash className="size-4" />
                  Mã tin
                </span>
                <span className="font-mono text-base font-semibold text-[var(--color-text-strong)]">
                  #{room.listingCode}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 sm:rounded-[24px]">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                  <CalendarDays className="size-4" />
                  Ngày đăng
                </span>
                <span className="text-base font-semibold text-[var(--color-text-strong)]">
                  {formatDate(room.postedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Liên hệ nhanh
            </p>
            <h2 className="mt-3 text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
              Cần hỗ trợ thêm thông tin?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              Nếu cần xác nhận giá, tiện ích hoặc hẹn lịch xem phòng, bạn có thể
              gọi trực tiếp hoặc gửi yêu cầu để được phản hồi.
            </p>

            <div className="mt-5 rounded-[24px] bg-[var(--color-surface-soft)] p-4 sm:mt-6 sm:rounded-[28px] sm:p-5">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                Người liên hệ
              </p>
              <p className="mt-2 text-xl font-semibold text-[var(--color-text-strong)]">
                {room.contactName}
              </p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-[var(--color-brand-800)]">
                <PhoneCall className="size-4" />
                {room.contactPhone}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:mt-6">
              <a href={`tel:${room.contactPhone}`}>
                <Button size="lg" className="w-full">
                  Gọi ngay
                </Button>
              </a>
              <Link href="/contact-history">
                <Button size="lg" variant="outline" className="w-full">
                  Xem lịch sử liên hệ
                </Button>
              </Link>
              <a href={mapHref} target="_blank" rel="noreferrer">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  leadingIcon={<ExternalLink className="size-4" />}
                >
                  Mở bản đồ
                </Button>
              </a>
            </div>
          </div>

          <Alert
            title={
              isOwnRoom
                ? "Không thể gửi yêu cầu"
                : user
                  ? "Sẵn sàng gửi yêu cầu"
                  : "Cần đăng nhập để gửi yêu cầu"
            }
            description={
              isOwnRoom
                ? "Bạn không thể gửi yêu cầu xem phòng cho bài đăng của chính mình."
                : user
                  ? "Thông tin cá nhân của bạn sẽ được điền sẵn vào form để thao tác nhanh hơn."
                  : "Đăng nhập để hệ thống lưu yêu cầu liên hệ và giúp bạn theo dõi lịch sử xem phòng."
            }
          />

          <ContactFormCard roomId={room.id} ownerId={room.ownerId} />
          <RoomReportCard roomId={room.id} />
        </aside>
      </div>

      <section className="mt-8 sm:mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
              Gợi ý thêm
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-strong)] sm:text-3xl">
              Bất động sản dành cho bạn
            </h2>
          </div>
          <Link
            href="/rooms"
            className="text-sm font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)]"
          >
            Xem tất cả phòng
          </Link>
        </div>

        {relatedLoading ? (
          <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-96 rounded-[28px]" />
            ))}
          </div>
        ) : relatedRooms.length ? (
          <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedRooms.map((relatedRoom) => (
              <RoomCard key={relatedRoom.id} room={relatedRoom} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)] sm:mt-6 sm:rounded-[28px] sm:p-6">
            Hiện chưa có phòng gợi ý phù hợp. Bạn có thể xem thêm tại danh sách phòng đang còn trống.
          </div>
        )}
      </section>
    </div>
  );
}
