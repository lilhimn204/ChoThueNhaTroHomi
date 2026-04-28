"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import type { Amenity, District } from "@/types";
import {
  FilterSidebar,
  type RoomFiltersValue,
} from "@/components/rooms/filter-sidebar";

export function MobileFilterDrawer({
  open,
  districts,
  amenities,
  value,
  onChange,
  onReset,
  onClose,
  onApply,
}: {
  open: boolean;
  districts: District[];
  amenities: Amenity[];
  value: RoomFiltersValue;
  onChange: (nextValue: RoomFiltersValue) => void;
  onReset: () => void;
  onClose: () => void;
  onApply: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(8,24,32,0.52)] lg:hidden">
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-hidden bg-[var(--color-background)] p-3 pt-[calc(0.75rem_+_env(safe-area-inset-top))] shadow-2xl sm:p-4">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Bộ lọc di động
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--color-text-strong)]">
              Chọn tiêu chí cần xem
            </h3>
          </div>
          <button
            type="button"
            aria-label="Đóng bộ lọc"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-strong)]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(1rem_+_env(safe-area-inset-bottom))]">
          <FilterSidebar
          title="Bộ lọc trên điện thoại"
          districts={districts}
          amenities={amenities}
          value={value}
          onChange={onChange}
          onReset={onReset}
          applyLabel="Áp dụng bộ lọc"
            onApply={onApply}
          />
        </div>
      </div>
    </div>
  );
}
