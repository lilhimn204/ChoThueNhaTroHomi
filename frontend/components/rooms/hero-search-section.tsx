"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { MotionConfig, motion, type Variants } from "motion/react";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Button } from "@/components/ui/button";
import { normalizeUploadImageSrc } from "@/lib/images";
import type { RoomStats, RoomSummary } from "@/types";

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=86";

const easeOut = [0.16, 1, 0.3, 1] as const;

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: easeOut,
      staggerChildren: 0.08,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export function HeroSearchSection({
  stats,
  featuredRoom,
}: {
  stats: RoomStats | null;
  featuredRoom: RoomSummary | null;
}) {
  const heroImage = normalizeUploadImageSrc(featuredRoom?.thumbnail ?? fallbackHeroImage);

  return (
    <MotionConfig reducedMotion="user">
      <section className="container-shell pt-4 sm:pt-8">
        <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] sm:rounded-[36px]">
          <div className="pattern-grid pointer-events-none absolute inset-0 opacity-45" />
          <div className="relative grid lg:min-h-[39rem] lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12"
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
            <motion.p
              className="text-sm font-semibold text-[var(--color-brand-700)]"
              variants={heroItemVariants}
            >
              Phòng trọ Hà Nội cho sinh viên và người đi làm
            </motion.p>

            <motion.h1
              className="mt-3 max-w-3xl text-balance text-[2.45rem] font-semibold leading-[1.04] tracking-[-0.055em] text-[var(--color-text-strong)] sm:text-5xl lg:text-[4.25rem]"
              variants={heroItemVariants}
            >
              Tìm phòng trọ vừa túi tiền, đúng khu vực bạn cần.
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg sm:leading-8"
              variants={heroItemVariants}
            >
              Lọc theo quận, giá và tiện ích. Xem thông tin rõ ràng trước khi hẹn phòng.
            </motion.p>

            <motion.div
              className="mt-5 rounded-[22px] border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] p-2.5 shadow-[var(--shadow-card)] sm:mt-7 sm:flex sm:items-center sm:gap-3 sm:rounded-[24px]"
              variants={heroItemVariants}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2 sm:px-3">
                <Search className="size-5 shrink-0 text-[var(--color-brand-700)]" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Tìm quanh khu vực của bạn
                  </p>
                  <p className="truncate text-sm font-semibold text-[var(--color-text-strong)] sm:text-base">
                    Cầu Giấy, Thanh Xuân, Hà Đông...
                  </p>
                </div>
              </div>
              <Link href="/rooms" className="block sm:shrink-0">
                <Button
                  className="w-full"
                  size="lg"
                  trailingIcon={<ArrowRight className="size-4" />}
                >
                  Xem phòng
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-5 grid gap-2 text-sm text-[var(--color-text-muted)] sm:mt-6 sm:grid-cols-2"
              variants={heroItemVariants}
            >
              <p className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-[var(--color-brand-700)]" />
                Giá và diện tích hiển thị rõ
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-[var(--color-brand-700)]" />
                Biết trạng thái phòng trước khi gọi
              </p>
            </motion.div>
            </motion.div>

            <motion.div
              className="relative min-h-[15rem] overflow-hidden sm:min-h-[22rem] lg:min-h-full"
              initial={{ opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.08 }}
            >
            <Image
              src={heroImage}
              alt={
                featuredRoom
                  ? `Không gian phòng trọ ${featuredRoom.title} tại ${featuredRoom.districtName}`
                  : "Không gian phòng trọ sáng, gọn gàng tại Hà Nội"
              }
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,24,32,0.04),rgba(4,24,32,0.18)_55%,rgba(4,24,32,0.78))]" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="max-w-md">
                  <p className="flex items-center gap-2 text-xs font-semibold text-white/78">
                    <MapPin className="size-3.5" />
                    {featuredRoom?.districtName ?? "Khu vực nội thành Hà Nội"}
                  </p>
                  <p className="mt-2 text-lg font-semibold sm:text-xl">
                    {featuredRoom?.title ?? "Phòng sáng, thông tin rõ ràng, dễ so sánh"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/16 bg-[rgba(4,24,32,0.58)] px-4 py-3 backdrop-blur-md">
                  <p className="text-xs font-semibold text-white/70">Phòng còn trống</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--color-accent-500)]">
                    {stats ? <AnimatedCounter value={stats.availableRooms} /> : "..."}
                  </p>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
