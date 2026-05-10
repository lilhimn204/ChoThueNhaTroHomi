"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { getSafeAuthRedirect } from "@/lib/safe-redirect";

export function GuestOnly({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status !== "authenticated" || !user) {
      return;
    }

    router.replace(getSafeAuthRedirect(user, redirectTo));
  }, [redirectTo, router, status, user]);

  if (status === "authenticated") {
    return (
      <Alert
        title="Tài khoản đã đăng nhập"
        description="Bạn đang được chuyển đến trang phù hợp với vai trò hiện tại."
      />
    );
  }

  return <>{children}</>;
}
