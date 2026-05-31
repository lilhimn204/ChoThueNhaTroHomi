import type { Metadata } from "next";
import Image from "next/image";
import { BookmarkCheck, CheckCircle2, MailCheck, ShieldCheck } from "lucide-react";

import { GuestOnly } from "@/components/auth/guest-only";
import { AuthPanel } from "@/components/forms/auth-panel";
import { AuthMotionRoot, AuthReveal } from "@/components/forms/auth-motion";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Tạo tài khoản Homi để gửi yêu cầu xem phòng, lưu phòng quan tâm và theo dõi trạng thái liên hệ với chủ trọ.",
};

const registerNotes = [
  { icon: MailCheck, label: "Xác minh email bằng OTP trước khi kích hoạt." },
  { icon: BookmarkCheck, label: "Lưu phòng quan tâm và quay lại khi cần so sánh." },
  { icon: ShieldCheck, label: "Chỉ giữ các trường cần thiết cho tài khoản Homi." },
];

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <GuestOnly redirectTo={redirect}>
      <AuthMotionRoot>
        <main className="container-shell min-h-[100dvh] py-4 sm:py-8 lg:py-10">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(430px,540px)] lg:items-center lg:gap-10">
            <AuthReveal
              className="order-2 relative overflow-hidden rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[0_20px_60px_rgba(16,42,67,0.10)] ring-1 ring-[var(--color-border-soft)] sm:p-6 lg:order-1 lg:min-h-[650px] lg:p-8"
              hover
            >
              <div className="pointer-events-none absolute -left-24 top-10 size-64 rounded-full bg-[var(--color-brand-500)]/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-[var(--color-accent-500)]/14 blur-3xl" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-brand-950)] p-2.5 shadow-[0_16px_34px_rgba(4,24,32,0.16)]">
                    <Image
                      src="/logo.png"
                      alt="Logo Homi"
                      width={40}
                      height={40}
                      className="h-auto w-full object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-700)]">
                      Đăng ký Homi
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                      Một hồ sơ cho quá trình tìm phòng
                    </p>
                  </div>
                </div>

                <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.04] tracking-tight text-[var(--color-text-strong)] sm:text-4xl lg:mt-8 lg:text-6xl">
                  Tạo tài khoản để lưu phòng tốt.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7 lg:mt-5">
                  Đăng ký gọn, xác minh bằng OTP và tiếp tục gửi yêu cầu xem phòng trên cùng
                  một hồ sơ.
                </p>

                <div className="mt-5 grid gap-2 text-sm text-[var(--color-text-muted)] sm:grid-cols-3 lg:mt-8 lg:grid-cols-1">
                  {registerNotes.map((note) => (
                    <div
                      className="flex items-start gap-3 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-3 py-2.5"
                      key={note.label}
                    >
                      <note.icon className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-700)]" />
                      <span className="leading-5">{note.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 hidden rounded-[24px] border border-[var(--color-border-soft)] bg-[var(--color-brand-950)] p-5 text-white lg:mt-auto lg:block">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-[var(--color-accent-500)]" />
                    <div>
                      <p className="text-sm font-semibold">Không đổi logic đăng ký</p>
                      <p className="mt-2 text-sm leading-6 text-white/64">
                        Payload, OTP, Google login và điều hướng sau xác thực vẫn chạy qua
                        luồng hiện tại.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AuthReveal>
            <div className="order-1 lg:order-2">
              <AuthPanel mode="register" redirectTo={redirect} />
            </div>
          </div>
        </main>
      </AuthMotionRoot>
    </GuestOnly>
  );
}
