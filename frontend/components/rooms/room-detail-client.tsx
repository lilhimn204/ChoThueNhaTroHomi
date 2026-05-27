"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Hash,
  MapPin,
  PhoneCall,
  Ruler,
  WalletCards,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/services/api-client";
import { getRoomDetail, searchRooms } from "@/services/room-service";
import { roomStatusMeta } from "@/constants/status";
import { roomTypeLabelByValue } from "@/constants/site";
import { ContactFormCard } from "@/components/forms/contact-form-card";
import { AmenityIcon } from "@/components/shared/amenity-icon";
import { RoomReportCard } from "@/components/rooms/room-report-card";
import { RoomCard } from "@/components/rooms/room-card";
import { SaveRoomButton } from "@/components/rooms/save-room-button";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatArea, formatCurrency, formatDate } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";
import { buildMapSearchUrl } from "@/lib/maps";
import { checkRoomSaved } from "@/services/saved-room-service";
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [initialSaved, setInitialSaved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    void getRoomDetail(slug, controller.signal)
      .then((response) => {
        setRelatedRooms([]);
        setRelatedLoading(true);
        setActiveImageIndex(0);
        setInitialSaved(false);
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
    if (!user || !room) {
      return;
    }

    const controller = new AbortController();

    void checkRoomSaved(room.id, controller.signal)
      .then((response) => setInitialSaved(response.saved))
      .catch(() => {
        if (!controller.signal.aborted) {
          setInitialSaved(false);
        }
      });

    return () => controller.abort();
  }, [room, user]);

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
          roomType: room.roomType,
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

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

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
          className="motion-soft inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:-translate-x-0.5 hover:text-[var(--color-brand-800)]"
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
  const galleryImages = roomImages.length
    ? roomImages
    : [{
        id: -1,
        imageUrl: room.thumbnail,
        altText: room.title,
        sortOrder: 0,
        isThumbnail: true,
      }];
  const activeImage = galleryImages[Math.min(activeImageIndex, galleryImages.length - 1)];
  const mapHref = buildMapSearchUrl({
    address: room.address,
    districtName: room.districtName,
    cityName: room.cityName,
  });
  const isOwnRoom = user && room.ownerId != null && user.id === room.ownerId;
  const roomTypeLabel = roomTypeLabelByValue[room.roomType];
  const showPreviousImage = () => {
    setActiveImageIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };
  const showNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % galleryImages.length);
  };
  const handleTouchEnd = (clientX: number) => {
    if (touchStartX == null) {
      return;
    }

    const deltaX = touchStartX - clientX;
    if (Math.abs(deltaX) > 36) {
      if (deltaX > 0) {
        showNextImage();
      } else {
        showPreviousImage();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="container-shell py-6 sm:py-10">
      <Link
        href="/rooms"
        className="motion-soft inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:-translate-x-0.5 hover:text-[var(--color-brand-800)]"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách phòng
      </Link>

      <div className="mt-5 grid min-w-0 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="min-w-0 space-y-5 sm:space-y-6">
          <div className="animate-content-rise min-w-0 space-y-3 sm:space-y-4">
            <button
              type="button"
              className="group relative h-64 w-full overflow-hidden rounded-[24px] text-left shadow-[var(--shadow-card-hover)] sm:h-[28rem] sm:rounded-[32px]"
              onClick={() => setLightboxOpen(true)}
              onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
              onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
            >
              <Image
                src={normalizeUploadImageSrc(activeImage.imageUrl)}
                alt={activeImage.altText || room.title}
                fill
                className="object-cover transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:saturate-[1.08]"
                sizes="(max-width: 1200px) 100vw, 65vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                {activeImageIndex + 1}/{galleryImages.length}
              </div>
            </button>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`motion-pressable relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border shadow-sm sm:h-24 sm:w-36 ${
                    activeImageIndex === index
                      ? "border-[var(--color-brand-500)] ring-2 ring-[var(--color-focus-ring)]"
                      : "border-[var(--color-border-card)] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  <Image
                    src={normalizeUploadImageSrc(image.imageUrl)}
                    alt={image.altText || room.title}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <div className="space-y-5">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={roomStatusMeta[room.status].tone}>
                    {roomStatusMeta[room.status].label}
                  </Badge>
                  <Badge tone="muted">{roomTypeLabel}</Badge>
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

              <div className="grid gap-3 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.6fr)]">
                <div className="rounded-[22px] bg-[var(--color-brand-50)] px-4 py-4 text-left sm:rounded-[28px] sm:px-5">
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">
                    Giá thuê / tháng
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--color-brand-800)]">
                    {formatCurrency(room.price)}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="motion-soft flex min-h-24 items-center justify-between gap-4 rounded-[22px] bg-[var(--color-surface-soft)] px-4 py-3 hover:-translate-y-0.5 hover:bg-[var(--color-border-soft)] sm:rounded-[28px] sm:px-5">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                      <Hash className="size-4" />
                      Mã tin
                    </span>
                    <span className="font-mono text-lg font-semibold text-[var(--color-text-strong)]">
                      #{room.listingCode}
                    </span>
                  </div>

                  <div className="motion-soft flex min-h-24 items-center justify-between gap-4 rounded-[22px] bg-[var(--color-surface-soft)] px-4 py-3 hover:-translate-y-0.5 hover:bg-[var(--color-border-soft)] sm:rounded-[28px] sm:px-5">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                      <CalendarDays className="size-4" />
                      Ngày đăng
                    </span>
                    <span className="text-right text-lg font-semibold text-[var(--color-text-strong)]">
                      {formatDate(room.postedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card tổng bao quanh */}
            <div className="mt-6 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface-soft)]/35 p-5 shadow-sm sm:p-6">
              <div className="motion-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
                {/* Diện tích */}
                <div className="motion-soft flex min-h-[110px] flex-col justify-between rounded-2xl border border-[var(--color-border-soft)]/60 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)] shadow-sm">
                    <Ruler className="size-4" />
                  </div>
                  <div className="mt-3 min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Diện tích</p>
                    <p className="mt-0.5 text-sm font-semibold leading-tight text-[var(--color-text-strong)] sm:text-base">
                      {formatArea(room.area)}
                    </p>
                  </div>
                </div>

                {/* Khu vực */}
                <div className="motion-soft flex min-h-[110px] flex-col justify-between rounded-2xl border border-[var(--color-border-soft)]/60 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)] shadow-sm">
                    <MapPin className="size-4" />
                  </div>
                  <div className="mt-3 min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Khu vực</p>
                    <p className="mt-0.5 text-sm font-semibold leading-tight text-[var(--color-text-strong)] sm:text-base break-words">
                      {room.districtName}
                    </p>
                  </div>
                </div>

                {/* Loại phòng */}
                <div className="motion-soft flex min-h-[110px] flex-col justify-between rounded-2xl border border-[var(--color-border-soft)]/60 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)] shadow-sm">
                    <Building2 className="size-4" />
                  </div>
                  <div className="mt-3 min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Loại phòng</p>
                    <p className="mt-0.5 text-sm font-semibold leading-tight text-[var(--color-text-strong)] sm:text-base break-words">
                      {roomTypeLabel}
                    </p>
                  </div>
                </div>

                {/* Trạng thái */}
                <div className="motion-soft flex min-h-[110px] flex-col justify-between rounded-2xl border border-[var(--color-border-soft)]/60 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)] shadow-sm">
                    <WalletCards className="size-4" />
                  </div>
                  <div className="mt-3 min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Trạng thái</p>
                    <p className="mt-0.5 text-sm font-semibold leading-tight text-[var(--color-text-strong)] sm:text-base">
                      {roomStatusMeta[room.status].label}
                    </p>
                  </div>
                </div>

                {/* Bản đồ / Mở vị trí */}
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="motion-soft col-span-2 flex min-h-[110px] flex-col justify-between rounded-2xl border border-[var(--color-brand-100)] bg-[var(--color-brand-50)]/70 p-4 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-brand-100)]/90 hover:shadow-md sm:col-span-1"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-brand-700)] shadow-sm">
                    <ExternalLink className="size-4" />
                  </div>
                  <div className="mt-3 min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-brand-700)]">Bản đồ</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold leading-tight text-[var(--color-brand-900)] sm:text-base">
                      Mở vị trí
                      <ExternalLink className="size-3.5 shrink-0 opacity-70" />
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
              Mô tả phòng
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] sm:mt-4 sm:text-base sm:leading-8">
              {room.description}
            </p>
          </div>

          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
              Tiện ích nổi bật
            </h2>
            <div className="motion-stagger mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-3">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="motion-soft group flex min-w-0 items-center gap-3 rounded-[20px] bg-[var(--color-surface-soft)] px-3 py-3 hover:-translate-y-0.5 hover:bg-[var(--color-border-soft)] sm:rounded-[24px] sm:px-4"
                >
                  <div className="motion-soft flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-brand-700)] shadow-sm group-hover:scale-105 group-hover:shadow-md">
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
          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
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

            <div className="motion-soft mt-5 rounded-[24px] bg-[var(--color-surface-soft)] p-4 hover:bg-[var(--color-border-soft)] sm:mt-6 sm:rounded-[28px] sm:p-5">
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
              {user ? (
                <div className="flex items-center gap-3 rounded-[22px] bg-[var(--color-surface-soft)] px-4 py-3">
                  <SaveRoomButton
                    key={`${room.id}-${initialSaved}`}
                    roomId={room.id}
                    initialSaved={initialSaved}
                    size="md"
                  />
                  <span className="text-sm font-semibold text-[var(--color-text-strong)]">
                    Lưu phòng để quay lại so sánh sau
                  </span>
                </div>
              ) : null}
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

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[80] bg-black/88 p-3 backdrop-blur-sm animate-overlay-in sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phòng"
          onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
          onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
        >
          <button
            type="button"
            aria-label="Đóng ảnh"
            onClick={() => setLightboxOpen(false)}
            className="motion-pressable absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/18"
          >
            <X className="size-5" />
          </button>

          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Ảnh trước"
                onClick={showPreviousImage}
                className="motion-pressable absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/18"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label="Ảnh sau"
                onClick={showNextImage}
                className="motion-pressable absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/18"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}

          <div className="relative mx-auto flex h-full max-w-6xl items-center justify-center">
            <Image
              src={normalizeUploadImageSrc(activeImage.imageUrl)}
              alt={activeImage.altText || room.title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
            {activeImageIndex + 1}/{galleryImages.length}
          </div>
        </div>
      ) : null}

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
            className="motion-soft text-sm font-semibold text-[var(--color-brand-700)] hover:-translate-y-0.5 hover:text-[var(--color-brand-800)]"
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
          <div className="motion-stagger mt-5 flex snap-x gap-4 overflow-x-auto pb-2 sm:mt-6 sm:gap-5">
            {relatedRooms.map((relatedRoom) => (
              <div key={relatedRoom.id} className="w-[min(22rem,85vw)] shrink-0 snap-start">
                <RoomCard room={relatedRoom} />
              </div>
            ))}
          </div>
        ) : (
          <div className="motion-panel mt-5 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)] sm:mt-6 sm:rounded-[28px] sm:p-6">
            Hiện chưa có phòng gợi ý phù hợp. Bạn có thể xem thêm tại danh sách phòng đang còn trống.
          </div>
        )}
      </section>
    </div>
  );
}
