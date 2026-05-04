"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Button } from "@/components/ui/button";
import { getRoomStats } from "@/services/room-service";
import type { RoomStats } from "@/types";

export function HeroSearchSection() {
  const [stats, setStats] = useState<RoomStats | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void getRoomStats(controller.signal)
      .then(setStats)
      .catch(() => {
        if (!controller.signal.aborted) {
          setStats({ visibleRooms: 0, availableRooms: 0, availableRate: 0 });
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="container-shell pt-8 sm:pt-12">
      <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-border-card)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-brand-50),var(--color-surface-soft),var(--color-surface))] p-4 shadow-[var(--shadow-card)] animate-ambient-gradient sm:rounded-[40px] sm:p-6 lg:p-8">
        <div className="pattern-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-500)] to-transparent opacity-70" />
      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="animate-content-rise space-y-6">
          <p className="motion-soft inline-flex items-center gap-2 rounded-full border border-white/35 bg-[var(--badge-brand-bg)] px-4 py-2 text-sm font-semibold text-[var(--badge-brand-text)] shadow-sm backdrop-blur-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
            <Sparkles className="size-4" />
            Homi - tìm phòng trọ quanh các trường đại học Hà Nội
          </p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-5xl lg:text-6xl">
              Tìm phòng trọ Hà Nội phù hợp với ngân sách và khu vực của bạn.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
              Lọc nhanh theo quận, mức giá, diện tích và tiện ích. Mỗi bài đăng
              hiển thị rõ giá thuê, địa chỉ, trạng thái còn phòng và thông tin liên hệ
              để bạn chủ động hẹn xem.
            </p>
            <p className="typing-line text-sm font-semibold text-[var(--color-brand-700)] sm:text-base">
              Ưu tiên phòng rõ giá, rõ vị trí, dễ liên hệ.
            </p>
          </div>

          <div className="motion-panel surface-panel pattern-grid shine-surface rounded-[32px] border border-white/80 p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-card-hover)] sm:p-5">
            <div className="motion-stagger grid gap-3 md:grid-cols-[1.2fr_0.9fr_0.9fr_auto]">
              <label className="motion-soft space-y-2 rounded-[24px] bg-[var(--color-surface-elevated)] px-4 py-3 shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Khu vực
                </span>
                <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                  Cầu Giấy, Thanh Xuân, Hà Đông
                </p>
              </label>
              <label className="motion-soft space-y-2 rounded-[24px] bg-[var(--color-surface-elevated)] px-4 py-3 shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Ngân sách
                </span>
                <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                  3 - 6 triệu / tháng
                </p>
              </label>
              <label className="motion-soft space-y-2 rounded-[24px] bg-[var(--color-surface-elevated)] px-4 py-3 shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Nhu cầu
                </span>
                <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                  Studio, có ban công
                </p>
              </label>
              <Link href="/rooms" className="self-stretch">
                <Button
                  className="h-full w-full"
                  size="lg"
                  trailingIcon={<ArrowRight className="size-4" />}
                >
                  Xem danh sách phòng
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-[var(--color-text-muted)]">
            <p className="motion-soft inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
              <MapPin className="size-4 text-[var(--color-brand-700)]" />
              Lọc theo quận/huyện để xem nhanh
            </p>
            <p className="motion-soft inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
              <ShieldCheck className="size-4 text-[var(--color-brand-700)]" />
              Biết ngay phòng còn trống hay đã hết
            </p>
          </div>
        </div>

        <div className="group relative animate-content-rise">
          <div className="motion-soft absolute inset-0 -rotate-4 rounded-[36px] bg-[linear-gradient(135deg,rgba(15,76,92,0.18),rgba(229,159,58,0.18))] group-hover:-rotate-3 group-hover:scale-[1.01]" />
          <div className="motion-panel relative overflow-hidden rounded-[36px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card-hover)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
            <div className="motion-stagger grid gap-4 sm:grid-cols-2">
              <div className="motion-soft rounded-[28px] bg-[var(--color-brand-700)] p-5 text-white shadow-[var(--shadow-button)] hover:-translate-y-0.5">
                <p className="text-sm font-medium text-white/75">Phòng đang hiển thị</p>
                <p className="mt-3 text-4xl font-semibold" aria-live="polite">
                  {stats ? <AnimatedCounter value={stats.visibleRooms} /> : "..."}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  Tính theo số bài đăng đang được hiển thị công khai.
                </p>
              </div>
              <div className="motion-soft rounded-[28px] bg-[var(--color-surface-soft)] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">Tỷ lệ phòng còn trống</p>
                <p className="mt-3 text-4xl font-semibold text-[var(--color-text-strong)]">
                  {stats ? <AnimatedCounter value={stats.availableRate} suffix="%" /> : "..."}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                  Dựa trên tỷ lệ phòng còn trống trong danh sách đang hiển thị.
                </p>
              </div>
              <div className="motion-soft rounded-[28px] border border-[var(--color-border-soft)] p-5 hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-card)] sm:col-span-2">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  Thông tin cần quan tâm
                </p>
                <ul className="mt-3 grid gap-3 text-sm text-[var(--color-text-strong)] sm:grid-cols-2">
                  <li>Giá thuê và diện tích rõ ràng</li>
                  <li>Khu vực gần trường, gần nơi làm</li>
                  <li>Trạng thái còn phòng dễ nhận biết</li>
                  <li>Gửi yêu cầu xem phòng nhanh</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
