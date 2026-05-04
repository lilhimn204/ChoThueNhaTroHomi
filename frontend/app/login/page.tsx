import type { Metadata } from "next";
import Image from "next/image";
import { Building2, CalendarCheck, Users } from "lucide-react";

import { GuestOnly } from "@/components/auth/guest-only";
import { AuthPanel } from "@/components/forms/auth-panel";
import { AnimatedCounter } from "@/components/shared/animated-counter";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản Homi để quản lý yêu cầu xem phòng, cập nhật hồ sơ cá nhân và theo dõi lịch sử liên hệ.",
};

const loginBenefits = [
  "Theo dõi lịch sử yêu cầu liên hệ và lịch hẹn xem phòng.",
  "Cập nhật hồ sơ cá nhân để chủ trọ liên hệ nhanh hơn.",
  "Truy cập khu quản trị nếu tài khoản có quyền admin.",
];

const loginStats = [
  { icon: Building2, label: "Phòng gợi ý", value: 120, suffix: "+" },
  { icon: CalendarCheck, label: "Yêu cầu đã gửi", value: 340, suffix: "+" },
  { icon: Users, label: "Người dùng", value: 850, suffix: "+" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <GuestOnly redirectTo={redirect}>
      <div className="container-shell grid gap-5 py-8 sm:gap-8 sm:py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="motion-panel animate-content-rise relative overflow-hidden rounded-[24px] bg-[var(--color-brand-950)] p-5 text-white shadow-[var(--shadow-card-hover)] hover:-translate-y-1 sm:rounded-[32px] sm:p-8">
          <div className="pattern-grid pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative flex min-h-[auto] flex-col sm:min-h-[560px]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              Đăng nhập Homi
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Quản lý phòng quan tâm và lịch hẹn xem phòng.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
              Tài khoản Homi giúp bạn lưu lại các yêu cầu đã gửi, cập nhật thông tin cá nhân
              và tiếp tục thao tác nhanh khi tìm phòng trọ tại Hà Nội.
            </p>

            <div className="motion-stagger mt-8 space-y-4">
              {loginBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="motion-panel group flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-white/82 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09]"
                >
                  <span className="motion-soft mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-500)] group-hover:scale-110" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {loginStats.map((stat) => (
                <div
                  key={stat.label}
                  className="motion-panel rounded-2xl border border-white/10 bg-white/[0.06] p-3 hover:-translate-y-0.5 hover:bg-white/[0.09]"
                >
                  <stat.icon className="size-4 text-[var(--color-accent-500)]" />
                  <p className="mt-2 text-xl font-semibold">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs text-white/62">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="motion-panel mt-6 rounded-[22px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur hover:-translate-y-0.5 hover:border-white/20 sm:mt-auto sm:rounded-[28px] sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Trạng thái hồ sơ
                  </p>
                  <p className="mt-2 text-2xl font-semibold">Sẵn sàng gửi yêu cầu</p>
                </div>
                <div className="motion-soft flex size-20 shrink-0 items-center justify-center rounded-3xl bg-white p-3 shadow-[0_18px_42px_rgba(0,0,0,0.18)] hover:scale-[1.03] sm:size-24 sm:p-4">
                  <Image
                    src="/logo.png"
                    alt="Logo Homi"
                    width={72}
                    height={72}
                    className="h-auto w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <AuthPanel mode="login" redirectTo={redirect} />
      </div>
    </GuestOnly>
  );
}
