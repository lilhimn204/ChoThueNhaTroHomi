"use client";

import { useEffect, useState } from "react";

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
import { roomSortOptions } from "@/constants/site";
import { useAuth } from "@/hooks/use-auth";
import { useRoomSearch } from "@/hooks/use-room-search";
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
    lookupsLoading,
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

  if (lookupsLoading && !districts.length && !amenities.length) {
    return (
      <section className="container-shell py-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <LoadingSkeleton className="hidden h-[32rem] rounded-[30px] xl:block" />
          <div className="space-y-4 sm:space-y-6">
            <LoadingSkeleton className="h-20 rounded-[28px]" />
            <LoadingSkeleton className="h-24 rounded-[28px]" />
            <RoomsGridSkeleton />
          </div>
        </div>
      </section>
    );
  }

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

            <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:rounded-[28px]">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
                  Danh sách phòng trọ
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Danh sách ưu tiên cách trình bày gọn: tiêu đề, giá, diện tích,
                  khu vực và trạng thái.
                </p>
              </div>
              <div className="w-full sm:max-w-xs">
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
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      savedRoomIds={user ? savedRoomIds : []}
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
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:rounded-[30px]"
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
