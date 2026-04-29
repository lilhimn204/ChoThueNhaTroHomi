import type { Metadata } from "next";

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
        <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
            Đăng ký
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
            Đăng ký để lưu phòng và theo dõi lịch sử liên hệ.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
            Form đăng ký chỉ giữ những trường cần thiết. Cách trình bày này giúp
            người dùng nhập thông tin nhanh, dễ hiểu và ít bỏ ngang.
          </p>
        </div>
        <AuthPanel mode="register" redirectTo={redirect} />
      </div>
    </GuestOnly>
  );
}
