"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import type { Amenity, District, RoomStatus, RoomType } from "@/types";
import { roomStatusOptions, roomTypeOptions } from "@/constants/site";
import { AmenityIcon } from "@/components/shared/amenity-icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatArea, formatCompactCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface RoomFiltersValue {
  districtId: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  status: "" | RoomStatus;
  roomType: "" | RoomType;
  amenityIds: string[];
}

interface FilterSidebarProps {
  title?: string;
  districts: District[];
  amenities: Amenity[];
  value: RoomFiltersValue;
  onChange: (nextValue: RoomFiltersValue) => void;
  onReset: () => void;
  applyLabel?: string;
  onApply?: () => void;
}

const PRICE_MAX = 12_000_000;
const PRICE_STEP = 500_000;
const AREA_MAX = 60;
const AREA_STEP = 1;

function CollapsibleFilterGroup({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="motion-pressable flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[var(--color-text-strong)]">
          {title}
        </span>
        <ChevronDown className={cn("motion-soft size-4 text-[var(--color-text-muted)]", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="animate-fade-in space-y-4 border-t border-[var(--color-border-soft)] p-4">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-[var(--color-text-muted)]">{label}</span>
        <span className="font-semibold text-[var(--color-text-strong)]">{displayValue}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-border-soft)] accent-[var(--color-brand-700)]"
      />
    </label>
  );
}

export function FilterSidebar({
  title = "Bộ lọc tìm phòng",
  districts,
  amenities,
  value,
  onChange,
  onReset,
  applyLabel,
  onApply,
}: FilterSidebarProps) {
  const toggleAmenity = (amenityId: string) => {
    const nextAmenityIds = value.amenityIds.includes(amenityId)
      ? value.amenityIds.filter((id) => id !== amenityId)
      : [...value.amenityIds, amenityId];
    onChange({ ...value, amenityIds: nextAmenityIds });
  };
  const minPrice = Number(value.minPrice || 0);
  const maxPrice = Number(value.maxPrice || PRICE_MAX);
  const minArea = Number(value.minArea || 0);
  const maxArea = Number(value.maxArea || AREA_MAX);

  const updateMinPrice = (nextValue: number) => {
    onChange({
      ...value,
      minPrice: nextValue <= 0 ? "" : String(nextValue),
      maxPrice: nextValue > maxPrice ? String(nextValue) : value.maxPrice,
    });
  };

  const updateMaxPrice = (nextValue: number) => {
    onChange({
      ...value,
      minPrice: nextValue < minPrice ? String(nextValue) : value.minPrice,
      maxPrice: nextValue >= PRICE_MAX ? "" : String(nextValue),
    });
  };

  const updateMinArea = (nextValue: number) => {
    onChange({
      ...value,
      minArea: nextValue <= 0 ? "" : String(nextValue),
      maxArea: nextValue > maxArea ? String(nextValue) : value.maxArea,
    });
  };

  const updateMaxArea = (nextValue: number) => {
    onChange({
      ...value,
      minArea: nextValue < minArea ? String(nextValue) : value.minArea,
      maxArea: nextValue >= AREA_MAX ? "" : String(nextValue),
    });
  };

  return (
    <aside className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[30px] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
          {title}
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="motion-soft rounded-xl text-sm font-medium text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
        >
          Đặt lại
        </button>
      </div>

      <div className="motion-stagger mt-5 space-y-4 sm:space-y-5">
        <Select
          label="Khu vực"
          options={[
            { label: "Tất cả khu vực", value: "" },
            ...districts.map((district) => ({
              label: district.name,
              value: String(district.id),
            })),
          ]}
          value={value.districtId}
          onChange={(event) => onChange({ ...value, districtId: event.target.value })}
        />

        <CollapsibleFilterGroup title="Khoảng giá">
          <RangeControl
            label="Giá từ"
            min={0}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={minPrice}
            displayValue={minPrice <= 0 ? "Không giới hạn" : formatCompactCurrency(minPrice)}
            onChange={updateMinPrice}
          />
          <RangeControl
            label="Giá đến"
            min={0}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={maxPrice}
            displayValue={maxPrice >= PRICE_MAX ? "Không giới hạn" : formatCompactCurrency(maxPrice)}
            onChange={updateMaxPrice}
          />
        </CollapsibleFilterGroup>

        <CollapsibleFilterGroup title="Diện tích">
          <RangeControl
            label="Từ"
            min={0}
            max={AREA_MAX}
            step={AREA_STEP}
            value={minArea}
            displayValue={minArea <= 0 ? "Không giới hạn" : formatArea(minArea)}
            onChange={updateMinArea}
          />
          <RangeControl
            label="Đến"
            min={0}
            max={AREA_MAX}
            step={AREA_STEP}
            value={maxArea}
            displayValue={maxArea >= AREA_MAX ? "Không giới hạn" : formatArea(maxArea)}
            onChange={updateMaxArea}
          />
        </CollapsibleFilterGroup>

        <CollapsibleFilterGroup title="Loại phòng và trạng thái">
          <Select
            label="Loại phòng"
            options={[{ label: "Tất cả loại phòng", value: "" }, ...roomTypeOptions]}
            value={value.roomType}
            onChange={(event) =>
              onChange({
                ...value,
                roomType: event.target.value as RoomFiltersValue["roomType"],
              })
            }
          />

          <Select
            label="Trạng thái"
            options={[{ label: "Tất cả", value: "" }, ...roomStatusOptions]}
            value={value.status}
            onChange={(event) =>
              onChange({
                ...value,
                status: event.target.value as RoomFiltersValue["status"],
              })
            }
          />
        </CollapsibleFilterGroup>

        <CollapsibleFilterGroup title="Tiện ích bắt buộc" defaultOpen={false}>
          <p className="text-sm font-semibold text-[var(--color-text-strong)]">
            Tiện ích bắt buộc
          </p>
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            Khi chọn nhiều tiện ích, kết quả chỉ gồm phòng có đủ các tiện ích đó.
          </p>
          <div className="motion-stagger flex flex-wrap gap-2">
            {amenities.map((amenity) => {
              const active = value.amenityIds.includes(String(amenity.id));

              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(String(amenity.id))}
                  className={`motion-pressable min-h-10 rounded-full px-3 py-2 text-sm font-medium active:scale-[0.98] ${
                    active
                      ? "bg-[var(--color-brand-700)] text-[var(--color-brand-contrast)] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                      : "bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] hover:-translate-y-0.5 hover:bg-[var(--color-border-soft)] hover:text-[var(--color-text-strong)]"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <AmenityIcon iconKey={amenity.iconKey} className="size-3.5" />
                  {amenity.name}
                  </span>
                </button>
              );
            })}
          </div>
        </CollapsibleFilterGroup>
      </div>

      {applyLabel && onApply ? (
        <Button className="mt-6 w-full" onClick={onApply}>
          {applyLabel}
        </Button>
      ) : null}
    </aside>
  );
}
