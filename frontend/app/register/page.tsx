import type { Metadata } from "next";

import { GuestOnly } from "@/components/auth/guest-only";
import { AuthIntroPanel } from "@/components/forms/auth-intro-panel";
import { AuthMotionRoot } from "@/components/forms/auth-motion";
import { AuthPanel } from "@/components/forms/auth-panel";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description:
    "Tạo tài khoản Homi để gửi yêu cầu xem phòng, lưu phòng quan tâm và theo dõi trạng thái liên hệ với chủ trọ.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <GuestOnly redirectTo={redirect}>
      <AuthMotionRoot>
        <main className="auth-page-shell container-shell min-h-[100dvh] py-4 sm:py-8 lg:py-4">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(430px,540px)] lg:items-stretch lg:gap-10">
            <AuthIntroPanel mode="register" />
            <div className="order-1 lg:order-2">
              <AuthPanel mode="register" redirectTo={redirect} />
            </div>
          </div>
        </main>
      </AuthMotionRoot>
    </GuestOnly>
  );
}
