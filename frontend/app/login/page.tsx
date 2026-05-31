import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, KeyRound, MapPin, ShieldCheck } from "lucide-react";

import { GuestOnly } from "@/components/auth/guest-only";
import { AuthPanel } from "@/components/forms/auth-panel";
import { AuthMotionRoot, AuthReveal } from "@/components/forms/auth-motion";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản Homi để quản lý yêu cầu xem phòng, cập nhật hồ sơ cá nhân và theo dõi lịch sử liên hệ.",
};

const loginNotes = [
  { icon: MapPin, label: "Lưu phòng phù hợp để quay lại so sánh." },
  { icon: KeyRound, label: "Theo dõi yêu cầu liên hệ bằng một tài khoản." },
  { icon: ShieldCheck, label: "Dữ liệu đăng nhập giữ nguyên theo hệ thống hiện tại." },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <GuestOnly redirectTo={redirect}>
      <AuthMotionRoot>
        <main className="container-shell min-h-[100dvh] py-4 sm:py-8 lg:py-10">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-center lg:gap-10">
            <AuthReveal
              className="order-2 relative overflow-hidden rounded-[28px] border border-white/10 bg-[var(--color-brand-950)] p-4 text-white shadow-[0_24px_70px_rgba(4,24,32,0.22)] sm:p-6 lg:order-1 lg:min-h-[620px] lg:p-8"
              hover
            >
              <div className="pattern-grid pointer-events-none absolute inset-0 opacity-20" />
              <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-[var(--color-accent-500)]/16 blur-3xl" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white p-2.5 shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
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
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                      Homi Account
                    </p>
                    <p className="text-sm font-semibold text-white/86">Tìm phòng trọ tin cậy</p>
                  </div>
                </div>

                <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.02] tracking-tight sm:text-4xl lg:mt-8 lg:text-6xl">
                  Đăng nhập gọn để tiếp tục tìm phòng.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/72 sm:text-base sm:leading-7 lg:mt-5">
                  Lưu phòng phù hợp, theo dõi yêu cầu liên hệ và quay lại quá trình tìm phòng
                  mà không phải nhập lại thông tin.
                </p>

                <div className="mt-5 grid gap-2 text-sm text-white/78 sm:grid-cols-3 lg:mt-8 lg:grid-cols-1">
                  {loginNotes.map((note) => (
                    <div
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5"
                      key={note.label}
                    >
                      <note.icon className="mt-0.5 size-4 shrink-0 text-[var(--color-accent-500)]" />
                      <span className="leading-5">{note.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 hidden rounded-[24px] border border-white/10 bg-white/[0.07] p-5 lg:mt-auto lg:block">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-[var(--color-accent-500)]" />
                    <div>
                      <p className="text-sm font-semibold text-white">Không đổi luồng xác thực</p>
                      <p className="mt-2 text-sm leading-6 text-white/64">
                        Email, mật khẩu, Google login, OTP và điều hướng sau đăng nhập vẫn dùng
                        đúng logic hiện có.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AuthReveal>
            <div className="order-1 lg:order-2">
              <AuthPanel mode="login" redirectTo={redirect} />
            </div>
          </div>
        </main>
      </AuthMotionRoot>
    </GuestOnly>
  );
}
