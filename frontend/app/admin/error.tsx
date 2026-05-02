"use client";

import { useEffect } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div
      className="animate-content-rise mx-auto py-10"
      style={{ width: "min(1600px, calc(100% - 2rem))" }}
    >
      <Alert
        tone="warning"
        title="Lỗi khu quản trị"
        description={error.message || "Không thể tải dữ liệu quản trị. Vui lòng kiểm tra quyền truy cập và thử lại."}
      />
      <Button className="mt-5" onClick={reset}>
        Thử lại
      </Button>
    </div>
  );
}
