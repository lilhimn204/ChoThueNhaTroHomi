import type { Metadata } from "next";
import { Suspense } from "react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RoomsPageClient } from "@/components/rooms/rooms-page-client";
import { RoomsGridSkeleton } from "@/components/rooms/rooms-page-client";

export const metadata: Metadata = {
  title: "Tìm phòng trọ Hà Nội — Lọc theo quận, giá, diện tích | Homi",
  description:
    "Tìm kiếm phòng trọ Hà Nội theo khu vực, mức giá và tiện ích. So sánh phòng dễ dàng với thông tin giá, diện tích và trạng thái cập nhật mới nhất.",
  openGraph: {
    title: "Tìm phòng trọ Hà Nội | Homi",
    description:
      "Lọc nhanh phòng trọ theo quận, giá thuê, diện tích và tiện ích. Mỗi phòng đều có thông tin ngắn gọn để so sánh trước khi xem chi tiết.",
  },
};

export default function RoomsPage() {
  return (
    <div className="pb-12">
      <section className="container-shell pt-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <SectionHeading
            eyebrow="Danh sách phòng"
            title="Tìm phòng trọ Hà Nội theo khu vực, ngân sách và tiện ích."
            description="Lọc nhanh theo quận, giá thuê, diện tích, trạng thái còn phòng và các tiện ích cần thiết. Mỗi phòng đều có thông tin ngắn gọn để bạn so sánh trước khi xem chi tiết."
          />
          <div className="rounded-[30px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Gợi ý tìm kiếm nhanh
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-medium text-[var(--color-text-strong)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
                Gần trường đại học
              </div>
              <div className="rounded-[22px] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-medium text-[var(--color-text-strong)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
                3 - 6 triệu / tháng
              </div>
              <div className="rounded-[22px] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-medium text-[var(--color-text-strong)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
                Còn phòng để hẹn xem
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<RoomsGridSkeleton />}>
        <RoomsPageClient />
      </Suspense>
    </div>
  );
}
