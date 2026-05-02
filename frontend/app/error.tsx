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
    <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center py-10 sm:py-16">
      <div className="motion-panel animate-content-rise w-full max-w-xl rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
          Lỗi hệ thống
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
          Đã xảy ra lỗi không mong muốn
        </h1>
        <div className="mt-6">
          <Alert
            tone="warning"
            title="Chi tiết lỗi"
            description={error.message || "Không thể xử lý yêu cầu. Vui lòng thử lại sau."}
          />
        </div>
        <div className="mt-6 grid gap-3 sm:flex">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
