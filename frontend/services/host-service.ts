import { proxyRequest } from "@/services/api-client";
import type {
  ContactRequestStatus,
  HostContactRequest,
  HostDashboard,
  HostProfile,
  HostRoom,
  HostRoomListItem,
  PageResponse,
  RoomStatus,
} from "@/types";
import type { RoomUpsertPayload } from "@/services/room-service";

interface HostSearchRoomsParams {
  keyword?: string;
  status?: RoomStatus | "";
  page?: number;
  size?: number;
}

interface HostSearchContactRequestsParams {
  status?: ContactRequestStatus | "";
  page?: number;
  size?: number;
}

export interface UpdateHostProfilePayload {
  fullName: string;
  phone: string;
  avatarUrl: string;
  address: string;
  hostBio: string;
}

export function getHostDashboard(signal?: AbortSignal) {
  return proxyRequest<HostDashboard>("host/dashboard", {
    signal,
  });
}

export function searchHostRooms(
  params: HostSearchRoomsParams,
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<HostRoomListItem>>("host/rooms", {
    query: {
      keyword: params.keyword,
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function getHostRoom(roomId: number, signal?: AbortSignal) {
  return proxyRequest<HostRoom>(`host/rooms/${roomId}`, {
    signal,
  });
}

export function createHostRoom(payload: RoomUpsertPayload) {
  return proxyRequest<HostRoom>("host/rooms", {
    method: "POST",
    body: payload,
  });
}

export function updateHostRoom(
  roomId: number,
  payload: RoomUpsertPayload,
) {
  return proxyRequest<HostRoom>(`host/rooms/${roomId}`, {
    method: "PUT",
    body: payload,
  });
}

export function updateHostRoomStatus(
  roomId: number,
  status: RoomStatus,
) {
  return proxyRequest<HostRoom>(`host/rooms/${roomId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteHostRoom(roomId: number) {
  return proxyRequest<{ message: string }>(`host/rooms/${roomId}`, {
    method: "DELETE",
  });
}

export function searchHostContactRequests(
  params: HostSearchContactRequestsParams,
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<HostContactRequest>>("host/contact-requests", {
    query: {
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function updateHostContactRequestStatus(
  requestId: number,
  payload: { status: ContactRequestStatus; note: string },
) {
  return proxyRequest<HostContactRequest>(`host/contact-requests/${requestId}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function getHostProfile(signal?: AbortSignal) {
  return proxyRequest<HostProfile>("host/profile", {
    signal,
  });
}

export function updateHostProfile(payload: UpdateHostProfilePayload) {
  return proxyRequest<HostProfile>("host/profile", {
    method: "PUT",
    body: payload,
  });
}
