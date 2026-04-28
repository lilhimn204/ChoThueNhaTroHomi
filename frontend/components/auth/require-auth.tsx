"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useAuth } from "@/hooks/use-auth";

export function RequireAuth({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      const redirectPath = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${redirectPath}`);
      return;
    }

    if (
      status === "authenticated" &&
      roles &&
      user &&
      !roles.some((role) => user.roles.includes(role))
    ) {
      router.replace("/");
    }
  }, [pathname, roles, router, status, user]);

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-24 rounded-[32px]" />
        <LoadingSkeleton className="h-80 rounded-[32px]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Alert
        tone="warning"
        title="Đang chuyển đến trang đăng nhập"
        description="Trang này cần đăng nhập trước khi tiếp tục."
      />
    );
  }

  if (roles && user && !roles.some((role) => user.roles.includes(role))) {
    return (
      <Alert
        tone="warning"
        title="Bạn không có quyền truy cập"
        description="Khu vực này chỉ dành cho tài khoản admin."
      />
    );
  }

  return <>{children}</>;
}
