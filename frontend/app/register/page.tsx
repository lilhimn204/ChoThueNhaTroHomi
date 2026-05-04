import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import { GuestOnly } from "@/components/auth/guest-only";
import { AuthPanel } from "@/components/forms/auth-panel";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Tạo tài khoản Homi để gửi yêu cầu xem phòng, lưu phòng quan tâm và theo dõi trạng thái liên hệ với chủ trọ.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <GuestOnly redirectTo={redirect}>
      <div className="container-shell grid gap-5 py-8 sm:gap-8 sm:py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--badge-brand-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--badge-brand-text)]">
            <Sparkles className="size-4" />
            Đăng ký Homi
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
            Đăng ký để lưu phòng và theo dõi lịch sử liên hệ.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
            Form đăng ký chỉ giữ những trường cần thiết. Cách trình bày này giúp
            người dùng nhập thông tin nhanh, dễ hiểu và ít bỏ ngang.
          </p>
          <div className="motion-stagger mt-6 grid gap-3">
            {[
              "Xác minh email bằng OTP để bảo vệ tài khoản.",
              "Lưu phòng quan tâm và quay lại so sánh sau.",
              "Theo dõi yêu cầu liên hệ trong tài khoản cá nhân.",
            ].map((item) => (
              <div
                key={item}
                className="motion-panel flex items-center gap-3 rounded-2xl bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-text-muted)] hover:-translate-y-0.5 hover:bg-[var(--color-border-soft)]"
              >
                <ShieldCheck className="size-4 text-[var(--color-brand-700)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--badge-success-bg)] px-4 py-3 text-sm font-semibold text-[var(--badge-success-text)]">
            <CheckCircle2 className="size-4" />
            Không đổi logic xác thực hiện tại
          </div>
        </div>
        <AuthPanel mode="register" redirectTo={redirect} />
      </div>
    </GuestOnly>
  );
}
