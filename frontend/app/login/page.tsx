import type { Metadata } from "next";

import { GuestOnly } from "@/components/auth/guest-only";
import { AuthIntroPanel } from "@/components/forms/auth-intro-panel";
import { AuthMotionRoot } from "@/components/forms/auth-motion";
import { AuthPanel } from "@/components/forms/auth-panel";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description:
    "Đăng nhập tài khoản Homi để quản lý yêu cầu xem phòng, cập nhật hồ sơ cá nhân và theo dõi lịch sử liên hệ.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <GuestOnly redirectTo={redirect}>
      <AuthMotionRoot>
        <main className="auth-page-shell container-shell min-h-[100dvh] py-4 sm:py-8 lg:py-4">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-stretch lg:gap-10">
            <AuthIntroPanel mode="login" />
            <div className="order-1 lg:order-2">
              <AuthPanel mode="login" redirectTo={redirect} />
            </div>
          </div>
        </main>
      </AuthMotionRoot>
    </GuestOnly>
  );
}
