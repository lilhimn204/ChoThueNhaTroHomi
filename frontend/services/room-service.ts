import { apiRequest, proxyRequest } from "@/services/api-client";
import type {
  AdminRoom,
  AdminRoomListItem,
  PageResponse,
  Room,
  RoomStats,
  RoomStatus,
  RoomSummary,
  RoomType,
} from "@/types";

interface SearchRoomsParams {
  keyword?: string;
  districtId?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  status?: RoomStatus | "";
  roomType?: RoomType | "";
  amenityIds?: string[];
  sort?: string;
  page?: number;
  size?: number;
}

interface AdminSearchRoomsParams {
  keyword?: string;
  districtId?: string;
  status?: RoomStatus | "";
  page?: number;
  size?: number;
}

export interface RoomImageInput {
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isThumbnail: boolean;
}

export interface RoomUpsertPayload {
  title: string;
  description: string;
  address: string;
  districtId: number;
  price: number;
  area: number;
  roomType: RoomType;
  contactName: string;
  contactPhone: string;
  status: RoomStatus;
  thumbnail?: string;
  featured?: boolean;
  amenityIds?: number[];
  images?: RoomImageInput[];
}

// Public endpoints — direct to Spring Boot (no auth needed)

export function getFeaturedRooms(signal?: AbortSignal) {
  return apiRequest<RoomSummary[]>("rooms/featured", { signal });
}

export function getRoomStats(signal?: AbortSignal) {
  return apiRequest<RoomStats>("rooms/stats", { signal });
}

export function searchRooms(params: SearchRoomsParams, signal?: AbortSignal) {
  return apiRequest<PageResponse<RoomSummary>>("rooms", {
    query: {
      keyword: params.keyword,
      districtId: params.districtId,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minArea: params.minArea,
      maxArea: params.maxArea,
      status: params.status,
      type: params.roomType,
      amenityIds: params.amenityIds,
      sort: params.sort ?? "newest",
      page: params.page ?? 0,
      size: params.size ?? 6,
    },
    signal,
  });
}

export function getRoomDetail(slug: string, signal?: AbortSignal) {
  return apiRequest<Room>(`rooms/${slug}`, { signal });
}

// Admin endpoints — through proxy (auth required)

export function searchAdminRooms(
  params: AdminSearchRoomsParams,
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<AdminRoomListItem>>("admin/rooms", {
    query: {
      keyword: params.keyword,
      districtId: params.districtId,
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function createRoom(payload: RoomUpsertPayload) {
  return proxyRequest<AdminRoom>("admin/rooms", {
    method: "POST",
    body: payload,
  });
}

export function updateRoomStatus(
  roomId: number,
  status: RoomStatus,
) {
  return proxyRequest<AdminRoom>(`admin/rooms/${roomId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteRoom(roomId: number) {
  return proxyRequest<{ message: string }>(`admin/rooms/${roomId}`, {
    method: "DELETE",
  });
}
