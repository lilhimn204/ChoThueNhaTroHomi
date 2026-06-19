"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionConfig, motion } from "motion/react";

import { LandingFeaturedRoomTile } from "@/components/landing/landing-featured-room-tile";
import { EmptyState } from "@/components/shared/empty-state";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { RoomSummary } from "@/types";

const easeOut = [0.16, 1, 0.3, 1] as const;

function FeaturedRoomsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr] lg:grid-rows-2">
      <div className="animate-shimmer min-h-[24rem] rounded-[26px] bg-[linear-gradient(90deg,var(--skeleton-from),var(--skeleton-via),var(--skeleton-to))] bg-[length:200%_100%] sm:rounded-[32px] lg:row-span-2 lg:min-h-[36rem]" />
      <div className="animate-shimmer min-h-[18rem] rounded-[26px] bg-[linear-gradient(90deg,var(--skeleton-from),var(--skeleton-via),var(--skeleton-to))] bg-[length:200%_100%] sm:rounded-[32px] lg:min-h-0" />
      <div className="animate-shimmer min-h-[18rem] rounded-[26px] bg-[linear-gradient(90deg,var(--skeleton-from),var(--skeleton-via),var(--skeleton-to))] bg-[length:200%_100%] sm:rounded-[32px] lg:min-h-0" />
    </div>
  );
}

export function FeaturedRoomsSection({
  rooms,
  loading,
  errorMessage,
}: {
  rooms: RoomSummary[];
  loading: boolean;
  errorMessage: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className="container-shell mt-14 space-y-6 sm:mt-20 sm:space-y-8"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.56, ease: easeOut }}
      >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[var(--color-brand-700)]">
            Phòng đang được quan tâm
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text-strong)] sm:text-4xl">
            Bắt đầu từ những phòng có hình ảnh và thông tin dễ kiểm tra.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
            So sánh nhanh giá thuê, diện tích và khu vực trước khi mở chi tiết hoặc xem vị trí.
          </p>
        </div>
        <Link href="/rooms">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            trailingIcon={<ArrowRight className="size-4" />}
          >
            Xem tất cả phòng
          </Button>
        </Link>
      </div>

      {loading ? (
        <FeaturedRoomsSkeleton />
      ) : errorMessage ? (
        <Alert
          tone="warning"
          title="Không tải được phòng nổi bật"
          description={errorMessage}
        />
      ) : rooms.length ? (
        <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr] lg:grid-rows-2">
          {rooms.map((room, index) => (
            <div key={room.id} className={index === 0 ? "lg:row-span-2" : ""}>
              <LandingFeaturedRoomTile room={room} prominent={index === 0} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa có phòng nổi bật"
          description="Khi có phòng được ưu tiên hiển thị, khu vực này sẽ cập nhật tự động."
        />
      )}
      </motion.section>
    </MotionConfig>
  );
}
