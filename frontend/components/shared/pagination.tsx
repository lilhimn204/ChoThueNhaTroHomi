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
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((page) => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages);

  return (
    <div className="motion-panel grid gap-3 rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-3 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 sm:px-4">
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
      <div className="flex items-center justify-center gap-1.5">
        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const showGap = previousPage && page - previousPage > 1;

          return (
            <span key={page} className="inline-flex items-center gap-1.5">
              {showGap ? <span className="text-sm text-[var(--color-text-muted)]">...</span> : null}
              <button
                type="button"
                onClick={() => handlePageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`motion-pressable flex size-9 items-center justify-center rounded-xl text-sm font-semibold ${
                  page === currentPage
                    ? "bg-[var(--color-brand-700)] text-[var(--color-brand-contrast)] shadow-sm"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]"
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}
      </div>
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
