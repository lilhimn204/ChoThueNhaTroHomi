"use client";

import { useEffect } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="w-full max-w-xl rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-10 shadow-[var(--shadow-card)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
          Lỗi hệ thống
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text-strong)]">
          Đã xảy ra lỗi không mong muốn
        </h1>
        <div className="mt-6">
          <Alert
            tone="warning"
            title="Chi tiết lỗi"
            description={error.message || "Không thể xử lý yêu cầu. Vui lòng thử lại sau."}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
