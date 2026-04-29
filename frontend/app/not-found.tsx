import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center py-10 text-center sm:py-16">
      <div className="max-w-xl rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
          Trang bạn tìm hiện không tồn tại.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
          Đường dẫn có thể đã thay đổi hoặc nội dung không còn khả dụng. Bạn có
          thể quay lại trang chủ để tiếp tục tìm phòng.
        </p>
        <Link href="/" className="mt-6 block sm:mt-8 sm:inline-flex">
          <Button className="w-full sm:w-auto">Quay về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
}
