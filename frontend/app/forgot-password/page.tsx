import type { Metadata } from "next";
import Image from "next/image";

import { GuestOnly } from "@/components/auth/guest-only";
import { PasswordResetPanel } from "@/components/forms/password-reset-panel";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Nhận OTP qua Gmail và đặt lại mật khẩu tài khoản Homi.",
};

const resetNotes = [
  "Mã OTP chỉ gửi về email đã đăng ký tài khoản Homi.",
  "Mã có thời hạn ngắn và được giới hạn số lần gửi lại để bảo vệ tài khoản.",
  "Sau khi đổi mật khẩu, các phiên đăng nhập cũ sẽ được thu hồi.",
];

export default function ForgotPasswordPage() {
  return (
    <GuestOnly>
      <div className="container-shell grid gap-5 py-8 sm:gap-8 sm:py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="motion-panel animate-content-rise relative overflow-hidden rounded-[24px] bg-[var(--color-brand-950)] p-5 text-white shadow-[var(--shadow-card-hover)] hover:-translate-y-1 sm:rounded-[32px] sm:p-8">
          <div className="relative flex min-h-[auto] flex-col sm:min-h-[520px]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              Bảo mật Homi
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Đặt lại mật khẩu bằng OTP gửi qua Gmail.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
              Homi xác minh email trước khi cho phép tạo mật khẩu mới, giúp tài khoản của bạn
              an toàn hơn khi quên thông tin đăng nhập.
            </p>

            <div className="motion-stagger mt-8 space-y-4">
              {resetNotes.map((note) => (
                <div
                  key={note}
                  className="motion-panel group flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-white/82 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09]"
                >
                  <span className="motion-soft mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-400)] group-hover:scale-110" />
                  <span>{note}</span>
                </div>
              ))}
            </div>

            <div className="motion-panel mt-6 rounded-[22px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur hover:-translate-y-0.5 hover:border-white/20 sm:mt-auto sm:rounded-[28px] sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Email hệ thống
                  </p>
                  <p className="mt-2 text-lg font-semibold">Kiểm tra cả mục Thư rác</p>
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
        <PasswordResetPanel />
      </div>
    </GuestOnly>
  );
}
