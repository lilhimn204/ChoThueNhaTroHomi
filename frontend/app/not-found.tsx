import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="max-w-xl rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-10 shadow-[var(--shadow-card)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text-strong)]">
          Trang bạn tìm hiện không tồn tại.
        </h1>
        <p className="mt-4 text-base leading-8 text-[var(--color-text-muted)]">
          Đường dẫn có thể đã thay đổi hoặc nội dung không còn khả dụng. Bạn có
          thể quay lại trang chủ để tiếp tục tìm phòng.
        </p>
        <Link href="/" className="mt-8 inline-flex">
          <Button>Quay về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
}
