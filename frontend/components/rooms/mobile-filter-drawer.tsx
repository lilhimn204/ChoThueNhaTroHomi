"use client";

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
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(8,24,32,0.52)] lg:hidden">
      <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-[var(--color-background)] p-4">
        <div className="mb-4 flex items-center justify-between">
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
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-strong)]"
          >
            <X className="size-5" />
          </button>
        </div>

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
  );
}
