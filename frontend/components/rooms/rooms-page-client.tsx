"use client";

import { useEffect, useMemo, useState } from "react";
import { Grid2X2, List, X } from "lucide-react";

import {
  FilterSidebar,
} from "@/components/rooms/filter-sidebar";
import { MobileFilterDrawer } from "@/components/rooms/mobile-filter-drawer";
import { RoomCard } from "@/components/rooms/room-card";
import { SearchBar } from "@/components/rooms/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Select } from "@/components/ui/select";
import { roomSortOptions, roomTypeLabelByValue } from "@/constants/site";
import { roomStatusMeta } from "@/constants/status";
import { useAuth } from "@/hooks/use-auth";
import { useRoomSearch } from "@/hooks/use-room-search";
import { formatArea, formatCompactCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { batchCheckSavedRooms } from "@/services/saved-room-service";

export function RoomsPageClient() {
  const {
    query,
    sort,
    page,
    activeFilters,
    mobileDraftFilters,
    showMobileFilters,
    districts,
    amenities,
    roomsLoading,
    errorMessage,
    rooms,
    totalPages,
    resultsCount,
    setQuery,
    setSort,
    setPage,
    setActiveFilters,
    setMobileDraftFilters,
    openMobileFilters,
    closeMobileFilters,
    applyMobileFilters,
    resetAll,
  } = useRoomSearch();

  const { user } = useAuth();
  const [savedRoomIds, setSavedRoomIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Batch check saved status whenever rooms change
  useEffect(() => {
    if (!user || rooms.length === 0) {
      return;
    }

    const controller = new AbortController();
    const roomIds = rooms.map((r) => r.id);

    void batchCheckSavedRooms(roomIds, controller.signal)
      .then(setSavedRoomIds)
      .catch(() => { /* ignore */ });

    return () => controller.abort();
  }, [user, rooms]);

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];
    const selectedDistrict = districts.find((district) => String(district.id) === activeFilters.districtId);

    if (query.trim()) {
      chips.push({ key: "query", label: `Từ khóa: ${query.trim()}`, onRemove: () => setQuery("") });
    }

    if (selectedDistrict) {
      chips.push({
        key: "district",
        label: selectedDistrict.name,
        onRemove: () => setActiveFilters({ ...activeFilters, districtId: "" }),
      });
    }

    if (activeFilters.minPrice) {
      chips.push({
        key: "minPrice",
        label: `Từ ${formatCompactCurrency(Number(activeFilters.minPrice))}`,
        onRemove: () => setActiveFilters({ ...activeFilters, minPrice: "" }),
      });
    }

    if (activeFilters.maxPrice) {
      chips.push({
        key: "maxPrice",
        label: `Đến ${formatCompactCurrency(Number(activeFilters.maxPrice))}`,
        onRemove: () => setActiveFilters({ ...activeFilters, maxPrice: "" }),
      });
    }

    if (activeFilters.minArea) {
      chips.push({
        key: "minArea",
        label: `Từ ${formatArea(Number(activeFilters.minArea))}`,
        onRemove: () => setActiveFilters({ ...activeFilters, minArea: "" }),
      });
    }

    if (activeFilters.maxArea) {
      chips.push({
        key: "maxArea",
        label: `Đến ${formatArea(Number(activeFilters.maxArea))}`,
        onRemove: () => setActiveFilters({ ...activeFilters, maxArea: "" }),
      });
    }

    if (activeFilters.roomType) {
      chips.push({
        key: "roomType",
        label: roomTypeLabelByValue[activeFilters.roomType],
        onRemove: () => setActiveFilters({ ...activeFilters, roomType: "" }),
      });
    }

    if (activeFilters.status) {
      chips.push({
        key: "status",
        label: roomStatusMeta[activeFilters.status].label,
        onRemove: () => setActiveFilters({ ...activeFilters, status: "" }),
      });
    }

    for (const amenityId of activeFilters.amenityIds) {
      const amenity = amenities.find((item) => String(item.id) === amenityId);
      chips.push({
        key: `amenity-${amenityId}`,
        label: amenity?.name ?? `Tiện ích ${amenityId}`,
        onRemove: () =>
          setActiveFilters({
            ...activeFilters,
            amenityIds: activeFilters.amenityIds.filter((id) => id !== amenityId),
          }),
      });
    }

    return chips;
  }, [activeFilters, amenities, districts, query, setActiveFilters, setQuery]);

  return (
    <>
      <section className="container-shell py-8">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="hidden xl:block">
            <FilterSidebar
              districts={districts}
              amenities={amenities}
              value={activeFilters}
              onChange={setActiveFilters}
              onReset={resetAll}
            />
          </div>

          <div className="space-y-6">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              resultsCount={resultsCount}
              onOpenFilters={openMobileFilters}
            />

            {activeFilterChips.length ? (
              <div className="animate-slide-up flex flex-wrap items-center gap-2">
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="motion-pressable inline-flex items-center gap-2 rounded-full bg-[var(--badge-brand-bg)] px-3 py-2 text-sm font-semibold text-[var(--badge-brand-text)] shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                  >
                    {chip.label}
                    <X className="size-3.5" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={resetAll}
                  className="motion-soft rounded-full px-3 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-brand-700)]"
                >
                  Xóa tất cả
                </button>
              </div>
            ) : null}

            <div className="motion-panel flex flex-col gap-3 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] sm:flex-row sm:items-center sm:justify-between sm:rounded-[28px]">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
                  Tìm thấy <span className="text-[var(--color-brand-800)]">{resultsCount}</span> phòng
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Danh sách ưu tiên cách trình bày gọn: tiêu đề, giá, diện tích,
                  khu vực và trạng thái.
                </p>
              </div>
              <div className="grid w-full gap-3 sm:max-w-md sm:grid-cols-[auto_minmax(0,1fr)]">
                <div className="grid grid-cols-2 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-1">
                  <button
                    type="button"
                    aria-label="Xem dạng lưới"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "motion-pressable flex h-10 items-center justify-center rounded-xl text-[var(--color-text-muted)]",
                      viewMode === "grid" && "bg-[var(--color-surface-elevated)] text-[var(--color-brand-800)] shadow-sm",
                    )}
                  >
                    <Grid2X2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Xem dạng danh sách"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "motion-pressable flex h-10 items-center justify-center rounded-xl text-[var(--color-text-muted)]",
                      viewMode === "list" && "bg-[var(--color-surface-elevated)] text-[var(--color-brand-800)] shadow-sm",
                    )}
                  >
                    <List className="size-4" />
                  </button>
                </div>
                <Select
                  label="Sắp xếp"
                  options={roomSortOptions}
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                />
              </div>
            </div>

            {errorMessage ? (
              <Alert
                tone="warning"
                title="Không tải được danh sách phòng"
                description={errorMessage}
              />
            ) : roomsLoading ? (
              <RoomsGridSkeleton />
            ) : rooms.length ? (
              <>
                <div
                  className={cn(
                    "motion-stagger grid gap-4 sm:gap-5",
                    viewMode === "grid" ? "md:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1",
                  )}
                >
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      savedRoomIds={user ? savedRoomIds : []}
                      layout={viewMode}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <EmptyState
                title="Chưa tìm thấy phòng phù hợp"
                description="Thử bỏ bớt một vài bộ lọc, mở rộng mức giá hoặc đổi khu vực tìm kiếm để xem thêm bài đăng."
                actionLabel="Xóa bộ lọc"
                onAction={resetAll}
              />
            )}
          </div>
        </div>
      </section>

      <MobileFilterDrawer
        open={showMobileFilters}
        districts={districts}
        amenities={amenities}
        value={mobileDraftFilters}
        onChange={setMobileDraftFilters}
        onReset={() => setMobileDraftFilters({
          districtId: "",
          minPrice: "",
          maxPrice: "",
          minArea: "",
          maxArea: "",
          status: "",
          roomType: "",
          amenityIds: [],
        })}
        onClose={closeMobileFilters}
        onApply={applyMobileFilters}
      />
    </>
  );
}

export function RoomsGridSkeleton() {
  return (
    <div className="motion-stagger grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="motion-panel overflow-hidden rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:rounded-[30px]"
        >
          <LoadingSkeleton className="h-52 w-full rounded-[24px]" />
          <div className="mt-4 space-y-3">
            <LoadingSkeleton className="h-5 w-3/4" />
            <LoadingSkeleton className="h-4 w-1/2" />
            <LoadingSkeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <LoadingSkeleton className="h-8 w-24 rounded-full" />
              <LoadingSkeleton className="h-8 w-24 rounded-full" />
            </div>
            <LoadingSkeleton className="h-11 w-full rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
