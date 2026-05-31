"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, MapPin, Ruler } from "lucide-react";
import { motion } from "motion/react";

import { SaveRoomButton } from "@/components/rooms/save-room-button";
import { Button } from "@/components/ui/button";
import { roomStatusMeta } from "@/constants/status";
import { formatArea, formatCompactCurrency } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";
import { buildMapSearchUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";
import type { RoomSummary } from "@/types";

export function LandingFeaturedRoomTile({
  room,
  prominent = false,
}: {
  room: RoomSummary;
  prominent?: boolean;
}) {
  const mapHref = buildMapSearchUrl({
    address: room.address,
    districtName: room.districtName,
  });

  return (
    <motion.article
      className={cn(
        "group relative isolate flex min-h-[18rem] overflow-hidden rounded-[26px] bg-[var(--color-brand-950)] shadow-[var(--shadow-card)] sm:rounded-[32px]",
        prominent ? "md:min-h-[24rem] lg:min-h-[36rem]" : "lg:min-h-0",
      )}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image
        src={normalizeUploadImageSrc(room.thumbnail)}
        alt={`Phòng trọ ${room.title} tại ${room.districtName}`}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
        sizes={
          prominent
            ? "(max-width: 1024px) 100vw, 58vw"
            : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 38vw"
        }
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,24,32,0.08)_15%,rgba(4,24,32,0.28)_48%,rgba(4,24,32,0.96)_100%)]" />

      <div className="absolute right-4 top-4 z-10">
        <SaveRoomButton roomId={room.id} size="sm" />
      </div>

      <div className="relative mt-auto w-full p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-white/80">
          <span className="inline-flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full",
                room.status === "AVAILABLE" ? "bg-emerald-400" : "bg-[var(--color-accent-500)]",
              )}
            />
            {roomStatusMeta[room.status].label}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {room.districtName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="size-3.5" />
            {formatArea(room.area)}
          </span>
        </div>

        <h3
          className={cn(
            "mt-3 max-w-xl text-balance font-semibold tracking-tight",
            prominent ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
          )}
        >
          {room.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xl font-semibold text-[var(--color-accent-500)] sm:text-2xl">
            {formatCompactCurrency(room.price)}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              aria-label={`Mở bản đồ cho ${room.title}`}
              className="motion-pressable inline-flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)]"
            >
              <ExternalLink className="size-4" />
            </a>
            <Link href={`/rooms/${room.slug}`}>
              <Button
                variant="warm"
                className="border-0"
                trailingIcon={<ArrowRight className="size-4" />}
              >
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
