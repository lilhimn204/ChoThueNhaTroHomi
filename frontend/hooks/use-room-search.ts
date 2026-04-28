"use client";

import { startTransition, useCallback, useEffect, useReducer, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Amenity, District, PageResponse, RoomSummary, RoomStatus } from "@/types";
import { getErrorMessage } from "@/services/api-client";
import { getAmenities, getDistricts } from "@/services/lookup-service";
import { searchRooms } from "@/services/room-service";
import type { RoomFiltersValue } from "@/components/rooms/filter-sidebar";

const PAGE_SIZE = 6;

const defaultFilters: RoomFiltersValue = {
  districtId: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  status: "",
  amenityIds: [],
};

// ── URL ↔ State helpers ────────────────────────────────────────────────

function parseSearchParams(params: URLSearchParams): {
  query: string;
  sort: string;
  page: number;
  filters: RoomFiltersValue;
} {
  const amenityIdsParam = params.get("amenityIds");

  return {
    query: params.get("q") ?? "",
    sort: params.get("sort") ?? "newest",
    page: Math.max(1, Number(params.get("page")) || 1),
    filters: {
      districtId: params.get("districtId") ?? "",
      minPrice: params.get("minPrice") ?? "",
      maxPrice: params.get("maxPrice") ?? "",
      minArea: params.get("minArea") ?? "",
      maxArea: params.get("maxArea") ?? "",
      status: (params.get("status") ?? "") as "" | RoomStatus,
      amenityIds: amenityIdsParam ? amenityIdsParam.split(",").filter(Boolean) : [],
    },
  };
}

function buildSearchParams(state: {
  query: string;
  sort: string;
  page: number;
  activeFilters: RoomFiltersValue;
}): string {
  const params = new URLSearchParams();

  if (state.query) params.set("q", state.query);
  if (state.sort && state.sort !== "newest") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.activeFilters.districtId) params.set("districtId", state.activeFilters.districtId);
  if (state.activeFilters.minPrice) params.set("minPrice", state.activeFilters.minPrice);
  if (state.activeFilters.maxPrice) params.set("maxPrice", state.activeFilters.maxPrice);
  if (state.activeFilters.minArea) params.set("minArea", state.activeFilters.minArea);
  if (state.activeFilters.maxArea) params.set("maxArea", state.activeFilters.maxArea);
  if (state.activeFilters.status) params.set("status", state.activeFilters.status);
  if (state.activeFilters.amenityIds.length > 0) {
    params.set("amenityIds", state.activeFilters.amenityIds.join(","));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

// ── State ──────────────────────────────────────────────────────────────

interface RoomSearchState {
  query: string;
  sort: string;
  page: number;
  activeFilters: RoomFiltersValue;
  mobileDraftFilters: RoomFiltersValue;
  showMobileFilters: boolean;
  districts: District[];
  amenities: Amenity[];
  response: PageResponse<RoomSummary> | null;
  lookupsLoading: boolean;
  roomsLoading: boolean;
  errorMessage: string;
}

// ── Actions ────────────────────────────────────────────────────────────

type RoomSearchAction =
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_SORT"; sort: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_ACTIVE_FILTERS"; filters: RoomFiltersValue }
  | { type: "SET_MOBILE_DRAFT_FILTERS"; filters: RoomFiltersValue }
  | { type: "OPEN_MOBILE_FILTERS" }
  | { type: "CLOSE_MOBILE_FILTERS" }
  | { type: "APPLY_MOBILE_FILTERS" }
  | { type: "RESET_ALL" }
  | { type: "LOOKUPS_LOADED"; districts: District[]; amenities: Amenity[] }
  | { type: "LOOKUPS_ERROR"; message: string }
  | { type: "ROOMS_LOADED"; response: PageResponse<RoomSummary> }
  | { type: "ROOMS_ERROR"; message: string };

function roomSearchReducer(state: RoomSearchState, action: RoomSearchAction): RoomSearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.query, page: 1, roomsLoading: true, errorMessage: "" };

    case "SET_SORT":
      return { ...state, sort: action.sort, page: 1, roomsLoading: true, errorMessage: "" };

    case "SET_PAGE":
      return { ...state, page: action.page, roomsLoading: true, errorMessage: "" };

    case "SET_ACTIVE_FILTERS":
      return {
        ...state,
        activeFilters: action.filters,
        page: 1,
        roomsLoading: true,
        errorMessage: "",
      };

    case "SET_MOBILE_DRAFT_FILTERS":
      return { ...state, mobileDraftFilters: action.filters };

    case "OPEN_MOBILE_FILTERS":
      return { ...state, showMobileFilters: true, mobileDraftFilters: state.activeFilters };

    case "CLOSE_MOBILE_FILTERS":
      return { ...state, showMobileFilters: false };

    case "APPLY_MOBILE_FILTERS":
      return {
        ...state,
        activeFilters: state.mobileDraftFilters,
        showMobileFilters: false,
        page: 1,
        roomsLoading: true,
        errorMessage: "",
      };

    case "RESET_ALL":
      return {
        ...state,
        query: "",
        sort: "newest",
        activeFilters: defaultFilters,
        page: 1,
        roomsLoading: true,
        errorMessage: "",
      };

    case "LOOKUPS_LOADED":
      return {
        ...state,
        districts: action.districts,
        amenities: action.amenities,
        lookupsLoading: false,
        errorMessage: "",
      };

    case "LOOKUPS_ERROR":
      return { ...state, lookupsLoading: false, errorMessage: action.message };

    case "ROOMS_LOADED":
      return { ...state, response: action.response, roomsLoading: false, errorMessage: "" };

    case "ROOMS_ERROR":
      return { ...state, roomsLoading: false, errorMessage: action.message };
  }
}

// ── Hook ───────────────────────────────────────────────────────────────

export function useRoomSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL params for initial state
  const parsed = parseSearchParams(searchParams);

  const [state, dispatch] = useReducer(roomSearchReducer, {
    query: parsed.query,
    sort: parsed.sort,
    page: parsed.page,
    activeFilters: parsed.filters,
    mobileDraftFilters: defaultFilters,
    showMobileFilters: false,
    districts: [],
    amenities: [],
    response: null,
    lookupsLoading: true,
    roomsLoading: true,
    errorMessage: "",
  });

  // Track whether this is the initial render (skip URL push on mount)
  const isInitialMount = useRef(true);

  // Sync state → URL whenever search params change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const url = `/rooms${buildSearchParams(state)}`;
    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.query, state.sort, state.page, state.activeFilters]);

  // Fetch lookup data (districts, amenities) once on mount
  useEffect(() => {
    const controller = new AbortController();

    void Promise.all([
      getDistricts(controller.signal),
      getAmenities(controller.signal),
    ])
      .then(([districts, amenities]) => {
        dispatch({ type: "LOOKUPS_LOADED", districts, amenities });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        dispatch({ type: "LOOKUPS_ERROR", message: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, []);

  // Fetch rooms whenever search params change
  useEffect(() => {
    const controller = new AbortController();

    void searchRooms(
      {
        keyword: state.query.trim(),
        districtId: state.activeFilters.districtId,
        minPrice: state.activeFilters.minPrice,
        maxPrice: state.activeFilters.maxPrice,
        minArea: state.activeFilters.minArea,
        maxArea: state.activeFilters.maxArea,
        status: state.activeFilters.status,
        amenityIds: state.activeFilters.amenityIds,
        sort: state.sort,
        page: state.page - 1,
        size: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((response) => {
        dispatch({ type: "ROOMS_LOADED", response });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        dispatch({ type: "ROOMS_ERROR", message: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [state.activeFilters, state.query, state.page, state.sort]);

  // Derived values
  const rooms = state.response?.content ?? [];
  const totalPages = state.response?.totalPages ?? 1;
  const resultsCount = state.response?.totalElements ?? 0;

  // Memoized actions
  const setQuery = useCallback((query: string) => {
    startTransition(() => dispatch({ type: "SET_QUERY", query }));
  }, []);

  const setSort = useCallback((sort: string) => {
    dispatch({ type: "SET_SORT", sort });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", page });
  }, []);

  const setActiveFilters = useCallback((filters: RoomFiltersValue) => {
    startTransition(() => dispatch({ type: "SET_ACTIVE_FILTERS", filters }));
  }, []);

  const setMobileDraftFilters = useCallback((filters: RoomFiltersValue) => {
    dispatch({ type: "SET_MOBILE_DRAFT_FILTERS", filters });
  }, []);

  const openMobileFilters = useCallback(() => dispatch({ type: "OPEN_MOBILE_FILTERS" }), []);
  const closeMobileFilters = useCallback(() => dispatch({ type: "CLOSE_MOBILE_FILTERS" }), []);

  const applyMobileFilters = useCallback(() => {
    startTransition(() => dispatch({ type: "APPLY_MOBILE_FILTERS" }));
  }, []);

  const resetAll = useCallback(() => {
    startTransition(() => dispatch({ type: "RESET_ALL" }));
  }, []);

  return {
    // State
    ...state,
    rooms,
    totalPages,
    resultsCount,

    // Actions
    setQuery,
    setSort,
    setPage,
    setActiveFilters,
    setMobileDraftFilters,
    openMobileFilters,
    closeMobileFilters,
    applyMobileFilters,
    resetAll,
  };
}
