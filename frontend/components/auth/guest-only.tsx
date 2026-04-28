"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

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

    const redirectTarget =
      redirectTo ?? (user.roles.includes("ADMIN") ? "/admin" : "/profile");

    router.replace(redirectTarget);
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
