import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ExternalLink, Hash, MapPin, Ruler, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaveRoomButton } from "@/components/rooms/save-room-button";
import { roomStatusMeta } from "@/constants/status";
import { roomTypeLabelByValue } from "@/constants/site";
import { formatArea, formatCompactCurrency, formatDate } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";
import { buildMapSearchUrl } from "@/lib/maps";
import type { Room, RoomSummary } from "@/types";

export function RoomCard({
  room,
  savedRoomIds = [],
}: {
  room: Room | RoomSummary;
  savedRoomIds?: number[];
}) {
  const amenityLabels =
    "highlightAmenities" in room
      ? room.highlightAmenities
      : room.amenities.map((amenity) => amenity.name);
  const mapHref = buildMapSearchUrl({
    address: room.address,
    districtName: room.districtName,
  });
  const roomTypeLabel = roomTypeLabelByValue[room.roomType];

  return (
    <article className="motion-panel group flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:scale-[1.01] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-brand-500)]/10 sm:rounded-[30px]">
      <div className="relative h-48 shrink-0 overflow-hidden sm:h-56">
        <Image
          src={normalizeUploadImageSrc(room.thumbnail)}
          alt={room.title}
          fill
          className="motion-soft object-cover group-hover:scale-[1.05] group-hover:saturate-[1.08]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="motion-soft absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/55 opacity-90 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <Badge tone={roomStatusMeta[room.status].tone}>
              {roomStatusMeta[room.status].label}
            </Badge>
            <div className="flex min-w-0 items-center gap-2">
              {room.featured ? <Badge tone="brand">Nổi bật</Badge> : null}
              <SaveRoomButton
                roomId={room.id}
                initialSaved={savedRoomIds.includes(room.id)}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="space-y-3">
          <Badge tone="muted">{roomTypeLabel}</Badge>

          <div className="grid gap-2 sm:flex sm:items-center sm:justify-between sm:gap-3">
            <h3 className="motion-soft line-clamp-2 min-w-0 text-lg font-semibold leading-snug text-[var(--color-text-strong)] group-hover:text-[var(--color-brand-800)] sm:text-xl">
              {room.title}
            </h3>
            <p className="motion-soft w-fit shrink-0 rounded-full bg-[var(--badge-brand-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--badge-brand-text)] shadow-sm group-hover:shadow-md">
              {formatCompactCurrency(room.price)}
            </p>
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

        <div className="flex min-h-[5rem] flex-wrap content-start gap-2">
          {amenityLabels.slice(0, 4).map((amenityLabel) => (
            <Badge key={amenityLabel} tone="muted">
              {amenityLabel}
            </Badge>
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
