import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ExternalLink, Hash, MapPin, Ruler, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaveRoomButton } from "@/components/rooms/save-room-button";
import { roomStatusMeta } from "@/constants/status";
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

  return (
    <article className="group overflow-hidden rounded-[30px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-brand-500)]/10">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={normalizeUploadImageSrc(room.thumbnail)}
          alt={room.title}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/55 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 p-4">
          <div className="flex items-center justify-between">
            <Badge tone={roomStatusMeta[room.status].tone}>
              {roomStatusMeta[room.status].label}
            </Badge>
            <div className="flex items-center gap-2">
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

      <div className="space-y-5 p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="line-clamp-2 text-xl font-semibold text-[var(--color-text-strong)] transition-colors duration-200 group-hover:text-[var(--color-brand-800)]">
              {room.title}
            </h3>
            <p className="shrink-0 rounded-full bg-[var(--badge-brand-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--badge-brand-text)] shadow-sm">
              {formatCompactCurrency(room.price)}
            </p>
          </div>

          <div className="grid gap-2 text-sm text-[var(--color-text-muted)] sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-xl transition-colors duration-200 hover:text-[var(--color-brand-700)]">
              <Hash className="size-4" />
              <span>Mã tin {room.listingCode}</span>
            </p>
            <p className="flex items-center gap-2 rounded-xl transition-colors duration-200 hover:text-[var(--color-brand-700)]">
              <CalendarDays className="size-4" />
              <span>{formatDate(room.postedAt)}</span>
            </p>
            <p className="flex items-center gap-2 rounded-xl transition-colors duration-200 hover:text-[var(--color-brand-700)]">
              <MapPin className="size-4" />
              <span>{room.districtName}</span>
            </p>
            <p className="flex items-center gap-2 rounded-xl transition-colors duration-200 hover:text-[var(--color-brand-700)]">
              <Ruler className="size-4" />
              <span>{formatArea(room.area)}</span>
            </p>
            <p className="flex items-center gap-2 rounded-xl transition-colors duration-200 hover:text-[var(--color-brand-700)] sm:col-span-2">
              <WalletCards className="size-4" />
              <span className="line-clamp-1">{room.address}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {amenityLabels.slice(0, 4).map((amenityLabel) => (
            <Badge key={amenityLabel} tone="muted">
              {amenityLabel}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href={`/rooms/${room.slug}`} className="block">
            <Button
              variant="outline"
              className="w-full px-4"
              trailingIcon={<ArrowRight className="size-4" />}
            >
              Xem chi tiết
            </Button>
          </Link>
          <a href={mapHref} target="_blank" rel="noreferrer" className="block">
            <Button
              type="button"
              variant="secondary"
              className="w-full px-4"
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
