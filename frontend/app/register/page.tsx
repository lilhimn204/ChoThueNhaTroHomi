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
      <div className="container-shell grid gap-8 py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
            Đăng ký
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text-strong)]">
            Đăng ký để lưu phòng và theo dõi lịch sử liên hệ.
          </h1>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-muted)]">
            Form đăng ký chỉ giữ những trường cần thiết. Cách trình bày này giúp
            người dùng nhập thông tin nhanh, dễ hiểu và ít bỏ ngang.
          </p>
        </div>
        <AuthPanel mode="register" redirectTo={redirect} />
      </div>
    </GuestOnly>
  );
}
