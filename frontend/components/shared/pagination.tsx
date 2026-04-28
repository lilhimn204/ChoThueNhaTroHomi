import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-3 shadow-[var(--shadow-card)] sm:gap-4 sm:px-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-center"
        leadingIcon={<ChevronLeft className="size-4" />}
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Trước
      </Button>
      <p className="whitespace-nowrap text-center text-sm text-[var(--color-text-muted)]">
        Trang <span className="font-semibold text-[var(--color-text-strong)]">{currentPage}</span> /{" "}
        {totalPages}
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-center"
        trailingIcon={<ChevronRight className="size-4" />}
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Sau
      </Button>
    </div>
  );
}
