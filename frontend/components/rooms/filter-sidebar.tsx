"use client";

import type { Amenity, District, RoomStatus, RoomType } from "@/types";
import { roomStatusOptions, roomTypeOptions } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

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

const minPriceOptions = [
  { label: "Không giới hạn", value: "" },
  { label: "Từ 3 triệu", value: "3000000" },
  { label: "Từ 4 triệu", value: "4000000" },
  { label: "Từ 5 triệu", value: "5000000" },
];

const maxPriceOptions = [
  { label: "Không giới hạn", value: "" },
  { label: "Đến 4 triệu", value: "4000000" },
  { label: "Đến 5 triệu", value: "5000000" },
  { label: "Đến 6 triệu", value: "6000000" },
];

const minAreaOptions = [
  { label: "Không giới hạn", value: "" },
  { label: "Từ 18 m²", value: "18" },
  { label: "Từ 20 m²", value: "20" },
  { label: "Từ 25 m²", value: "25" },
];

const maxAreaOptions = [
  { label: "Không giới hạn", value: "" },
  { label: "Đến 20 m²", value: "20" },
  { label: "Đến 25 m²", value: "25" },
  { label: "Đến 30 m²", value: "30" },
];

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

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Select
            label="Giá từ"
            options={minPriceOptions}
            value={value.minPrice}
            onChange={(event) => onChange({ ...value, minPrice: event.target.value })}
          />
          <Select
            label="Giá đến"
            options={maxPriceOptions}
            value={value.maxPrice}
            onChange={(event) => onChange({ ...value, maxPrice: event.target.value })}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Select
            label="Diện tích từ"
            options={minAreaOptions}
            value={value.minArea}
            onChange={(event) => onChange({ ...value, minArea: event.target.value })}
          />
          <Select
            label="Diện tích đến"
            options={maxAreaOptions}
            value={value.maxArea}
            onChange={(event) => onChange({ ...value, maxArea: event.target.value })}
          />
        </div>

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

        <div className="space-y-3">
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
                  {amenity.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {applyLabel && onApply ? (
        <Button className="mt-6 w-full" onClick={onApply}>
          {applyLabel}
        </Button>
      ) : null}
    </aside>
  );
}
