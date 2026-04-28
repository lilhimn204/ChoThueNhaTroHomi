import { proxyRequest } from "@/services/api-client";
import type { PageResponse, RoomStatus } from "@/types";

export interface SavedRoomItem {
  roomId: number;
  listingCode: string;
  title: string;
  slug: string;
  districtName: string;
  address: string;
  price: number;
  area: number;
  status: RoomStatus;
  thumbnail: string;
  postedAt: string;
  savedAt: string;
}

export function toggleSaveRoom(roomId: number) {
  return proxyRequest<{ saved: boolean }>(`saved-rooms/${roomId}`, {
    method: "POST",
  });
}

export function checkRoomSaved(roomId: number, signal?: AbortSignal) {
  return proxyRequest<{ saved: boolean }>(`saved-rooms/${roomId}/status`, { signal });
}

export function batchCheckSavedRooms(roomIds: number[], signal?: AbortSignal) {
  return proxyRequest<number[]>("saved-rooms/batch", {
    query: { roomIds },
    signal,
  });
}

export function getSavedRooms(page = 0, size = 12, signal?: AbortSignal) {
  return proxyRequest<PageResponse<SavedRoomItem>>("saved-rooms", {
    query: { page, size },
    signal,
  });
}
