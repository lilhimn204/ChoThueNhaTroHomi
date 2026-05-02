"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SearchBar({
  query,
  onQueryChange,
  resultsCount,
  onOpenFilters,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  resultsCount: number;
  onOpenFilters: () => void;
}) {
  return (
    <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] sm:rounded-[28px] sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="group relative flex-1">
          <Search className="motion-soft pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-brand-700)]" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            aria-label="Tìm phòng"
            className="motion-soft h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] pl-11 pr-4 text-base text-[var(--color-text-strong)] outline-none hover:border-[var(--color-brand-500)] focus:border-[var(--color-brand-500)] focus:bg-[var(--color-surface-elevated)] focus:shadow-[var(--shadow-focus)] focus:ring-2 focus:ring-[var(--color-focus-ring)] sm:text-sm"
            placeholder="Tìm theo tên phòng, địa chỉ hoặc khu vực"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
          <p className="min-w-0 text-sm text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-strong)]">{resultsCount}</span> kết
            quả phù hợp
          </p>
          <Button
            variant="outline"
            size="sm"
            leadingIcon={<SlidersHorizontal className="size-4" />}
            className="shrink-0 lg:hidden"
            onClick={onOpenFilters}
          >
            Bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
}
