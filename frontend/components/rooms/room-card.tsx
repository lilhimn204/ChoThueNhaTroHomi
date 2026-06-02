"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  ExternalLink,
  Hash,
  MapPin,
  Ruler,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaveRoomButton } from "@/components/rooms/save-room-button";
import { AmenityIcon } from "@/components/shared/amenity-icon";
import { roomStatusMeta } from "@/constants/status";
import { roomTypeLabelByValue } from "@/constants/site";
import { formatArea, formatCompactCurrency, formatDate } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";
import { buildMapSearchUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";
import type { Room, RoomSummary } from "@/types";

export function RoomCard({
  room,
  savedRoomIds = [],
  layout = "grid",
}: {
  room: Room | RoomSummary;
  savedRoomIds?: number[];
  layout?: "grid" | "list";
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const listMode = layout === "list";
  const amenityLabels =
    "highlightAmenities" in room
      ? room.highlightAmenities
      : room.amenities.map((amenity) => amenity.name);
  const carouselImages = useMemo(() => {
    if ("images" in room && room.images.length > 0) {
      return [...room.images]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((image) => ({
          src: image.imageUrl,
          alt: image.altText || room.title,
        }));
    }

    return [{ src: room.thumbnail, alt: room.title }];
  }, [room]);
  const mapHref = buildMapSearchUrl({
    address: room.address,
    districtName: room.districtName,
  });
  const roomTypeLabel = roomTypeLabelByValue[room.roomType];
  const activeImage = carouselImages[Math.min(activeImageIndex, carouselImages.length - 1)];

  return (
    <article
      className={cn(
        "motion-panel shine-surface group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:scale-[1.01] hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-brand-500)]/15 max-[520px]:grid max-[520px]:grid-cols-[42%_minmax(0,1fr)] sm:rounded-[30px]",
        listMode && "md:grid md:grid-cols-[18rem_minmax(0,1fr)] md:flex-none",
      )}
    >
      <div
        className={cn(
          "relative h-48 shrink-0 overflow-hidden max-[520px]:h-full max-[520px]:min-h-[13rem] sm:h-56",
          listMode && "md:h-full md:min-h-[18rem]",
        )}
      >
        <Image
          src={normalizeUploadImageSrc(activeImage?.src ?? room.thumbnail)}
          alt={activeImage?.alt ?? room.title}
          fill
          className="motion-soft object-cover group-hover:scale-[1.07] group-hover:saturate-[1.08]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="motion-soft absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-black/48 opacity-90 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <Badge tone={roomStatusMeta[room.status].tone}>
              {roomStatusMeta[room.status].label}
            </Badge>
            <div className="flex min-w-0 items-center gap-2">
              {room.featured ? <Badge tone="brand">Nổi bật</Badge> : null}
              <SaveRoomButton
                key={`${room.id}-${savedRoomIds.includes(room.id)}`}
                roomId={room.id}
                initialSaved={savedRoomIds.includes(room.id)}
                size="sm"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <p className="room-price-badge motion-soft w-fit rounded-full border border-[var(--room-price-badge-border)] bg-[var(--room-price-badge-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--room-price-badge-text)] shadow-[var(--room-price-badge-shadow)] group-hover:-translate-y-0.5">
            {formatCompactCurrency(room.price)}
          </p>
          {carouselImages.length > 1 ? (
            <div className="mt-3 flex items-center gap-1.5">
              {carouselImages.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  aria-label={`Xem ảnh ${index + 1}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveImageIndex(index);
                  }}
                  className={`motion-pressable h-1.5 rounded-full ${
                    activeImageIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/55 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
        {carouselImages.length > 1 ? (
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <Camera className="size-3.5" />
            {activeImageIndex + 1}/{carouselImages.length}
          </div>
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col gap-4 p-4 max-[520px]:gap-3 max-[520px]:p-3 sm:gap-5 sm:p-5">
        <div className="space-y-3">
          <Badge tone="muted">{roomTypeLabel}</Badge>

          <div className="grid gap-2">
            <h3 className="motion-soft line-clamp-2 min-w-0 text-lg font-semibold leading-snug text-[var(--color-text-strong)] group-hover:text-[var(--color-brand-800)] sm:text-xl">
              {room.title}
            </h3>
            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)] text-center text-[11px] font-semibold text-[var(--color-text-muted)]">
              <span className="truncate border-r border-[var(--color-border-soft)] px-2 py-2 text-[var(--color-brand-800)]">
                {formatCompactCurrency(room.price)}
              </span>
              <span className="truncate border-r border-[var(--color-border-soft)] px-2 py-2">
                {formatArea(room.area)}
              </span>
              <span className="truncate px-2 py-2">{room.districtName}</span>
            </div>
          </div>

          <div className="grid gap-2 text-sm text-[var(--color-text-muted)] sm:grid-cols-2">
            <p className="motion-soft flex items-center gap-2 rounded-xl hover:text-[var(--color-brand-700)]">
              <Hash className="size-4 shrink-0" />
              <span>Mã tin {room.listingCode}</span>
            </p>
            <p className="motion-soft flex items-center gap-2 rounded-xl hover:text-[var(--color-brand-700)]">
              <CalendarDays className="size-4 shrink-0" />
              <span>{formatDate(room.postedAt)}</span>
            </p>
            <p className="motion-soft flex items-center gap-2 rounded-xl hover:text-[var(--color-brand-700)]">
              <MapPin className="size-4 shrink-0" />
              <span className="min-w-0 truncate">{room.districtName}</span>
            </p>
            <p className="motion-soft flex items-center gap-2 rounded-xl hover:text-[var(--color-brand-700)]">
              <Ruler className="size-4 shrink-0" />
              <span>{formatArea(room.area)}</span>
            </p>
            <p className="motion-soft flex items-center gap-2 rounded-xl hover:text-[var(--color-brand-700)] sm:col-span-2">
              <WalletCards className="size-4 shrink-0" />
              <span className="line-clamp-2 min-w-0 sm:line-clamp-1">{room.address}</span>
            </p>
          </div>
        </div>

        <div className="flex min-h-[4.5rem] flex-wrap content-start gap-2 max-[520px]:min-h-0">
          {"amenities" in room
            ? room.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity.id}
                  className="motion-soft inline-flex items-center gap-1.5 rounded-full bg-[var(--badge-muted-bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--badge-muted-text)] hover:-translate-y-0.5 hover:text-[var(--color-brand-700)]"
                >
                  <AmenityIcon iconKey={amenity.iconKey} className="size-3.5" />
                  {amenity.name}
                </span>
              ))
            : amenityLabels.slice(0, 4).map((amenityLabel) => (
                <span
                  key={amenityLabel}
                  className="motion-soft inline-flex items-center gap-1.5 rounded-full bg-[var(--badge-muted-bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--badge-muted-text)] hover:-translate-y-0.5 hover:text-[var(--color-brand-700)]"
                >
                  <Sparkles className="size-3.5" />
                  {amenityLabel}
                </span>
              ))}
        </div>

        <div className="mt-auto grid gap-3 min-[420px]:grid-cols-[1.12fr_0.88fr]">
          <Link href={`/rooms/${room.slug}`} className="block">
            <Button
              variant="outline"
              className="w-full gap-1.5 px-3.5 text-[15px] whitespace-nowrap [&>span]:shrink-0"
              trailingIcon={<ArrowRight className="size-4" />}
            >
              Xem chi tiết
            </Button>
          </Link>
          <a href={mapHref} target="_blank" rel="noreferrer" className="block">
            <Button
              type="button"
              variant="secondary"
              className="w-full gap-1.5 px-3.5 text-[15px] whitespace-nowrap [&>span]:shrink-0"
              leadingIcon={<ExternalLink className="size-4" />}
            >
              Bản đồ
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}
