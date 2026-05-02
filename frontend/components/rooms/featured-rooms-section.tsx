"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RoomCard } from "@/components/rooms/room-card";
import { RoomsGridSkeleton } from "@/components/rooms/rooms-page-client";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/services/api-client";
import { getFeaturedRooms } from "@/services/room-service";
import type { RoomSummary } from "@/types";

export function FeaturedRoomsSection() {
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void getFeaturedRooms(controller.signal)
      .then((response) => {
        setRooms(response.slice(0, 3));
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
  }, []);

  return (
    <section className="container-shell mt-20 space-y-8">
      <div className="motion-panel animate-content-rise rounded-[34px] border border-[var(--color-border-card)] bg-[var(--color-surface)]/80 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Phòng nổi bật"
          title="Phòng trọ Hà Nội đang được quan tâm"
          description="Một số phòng phù hợp sinh viên và người đi làm, ưu tiên khu vực gần trường đại học, giao thông thuận tiện và thông tin rõ ràng."
        />
        <Link href="/rooms">
          <Button trailingIcon={<ArrowRight className="size-4" />}>
            Xem toàn bộ danh sách
          </Button>
        </Link>
        </div>
      </div>

      {loading ? (
        <RoomsGridSkeleton />
      ) : errorMessage ? (
        <Alert
          tone="warning"
          title="Không tải được phòng nổi bật"
          description={errorMessage}
        />
      ) : rooms.length ? (
        <div className="motion-stagger grid gap-5 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa có phòng nổi bật"
          description="Khi admin đánh dấu nổi bật, khu vực này sẽ hiển thị các bài đăng được ưu tiên."
        />
      )}
    </section>
  );
}
