import type { Metadata } from "next";
import { Suspense } from "react";

import { NewsPageClient } from "@/components/news/news-page-client";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Tin tức thuê phòng Hà Nội mới nhất | Homi",
  description:
    "Cập nhật kinh nghiệm thuê phòng, lưu ý hợp đồng, chi phí và thông báo mới từ Homi dành cho người tìm phòng tại Hà Nội.",
  openGraph: {
    title: "Tin tức thuê phòng Hà Nội mới nhất | Homi",
    description:
      "Các bài viết hướng dẫn tìm phòng, so sánh chi phí và cập nhật thông tin thị trường phòng trọ Hà Nội.",
  },
};

export default function NewsPage() {
  return (
    <main className="pb-12">
      <section className="border-b border-[var(--color-border-card)] bg-[var(--color-background)] pt-12 sm:pt-16">
        <div className="container-shell pb-8 text-center sm:pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
            Tin tức Homi
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-5xl lg:text-6xl">
            Tin tức thuê phòng mới nhất
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
            Thông tin ngắn gọn, dễ đọc về thị trường phòng trọ Hà Nội, kinh nghiệm thuê phòng,
            hợp đồng, chi phí và các cập nhật quan trọng từ Homi.
          </p>
        </div>
      </section>

      <Suspense fallback={<NewsPageSkeleton />}>
        <NewsPageClient />
      </Suspense>
    </main>
  );
}

function NewsPageSkeleton() {
  return (
    <section className="container-shell py-8 sm:py-10">
      <LoadingSkeleton className="h-24 rounded-[24px]" />
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <LoadingSkeleton className="aspect-[16/8] min-h-[320px] rounded-[24px]" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-4 border-b border-[var(--color-border-card)] pb-6 sm:grid-cols-[260px_minmax(0,1fr)]"
            >
              <LoadingSkeleton className="aspect-[16/10] rounded-[18px]" />
              <div className="space-y-3">
                <LoadingSkeleton className="h-4 w-48" />
                <LoadingSkeleton className="h-7 w-full" />
                <LoadingSkeleton className="h-4 w-5/6" />
                <LoadingSkeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <LoadingSkeleton className="h-72 rounded-[22px]" />
          <LoadingSkeleton className="h-96 rounded-[22px]" />
        </div>
      </div>
    </section>
  );
}
