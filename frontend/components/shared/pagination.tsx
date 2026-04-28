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
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-card)]">
      <Button
        variant="ghost"
        size="sm"
        leadingIcon={<ChevronLeft className="size-4" />}
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Trước
      </Button>
      <p className="text-sm text-[var(--color-text-muted)]">
        Trang <span className="font-semibold text-[var(--color-text-strong)]">{currentPage}</span> /{" "}
        {totalPages}
      </p>
      <Button
        variant="ghost"
        size="sm"
        trailingIcon={<ChevronRight className="size-4" />}
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Sau
      </Button>
    </div>
  );
}
