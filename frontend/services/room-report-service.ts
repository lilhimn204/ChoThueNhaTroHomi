import { proxyRequest } from "@/services/api-client";
import type {
  PageResponse,
  RoomReport,
  RoomReportReason,
  RoomReportStatus,
} from "@/types";

interface CreateRoomReportPayload {
  roomId: number;
  reason: RoomReportReason;
  details: string;
}

interface AdminSearchRoomReportsParams {
  keyword?: string;
  status?: RoomReportStatus | "";
  reason?: RoomReportReason | "";
  page?: number;
  size?: number;
}

interface UpdateRoomReportStatusPayload {
  status: RoomReportStatus;
  adminNote: string;
}

export function createRoomReport(payload: CreateRoomReportPayload) {
  return proxyRequest<RoomReport>("room-reports", {
    method: "POST",
    body: payload,
  });
}

export function searchAdminRoomReports(
  params: AdminSearchRoomReportsParams,
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<RoomReport>>("admin/room-reports", {
    query: {
      keyword: params.keyword,
      status: params.status,
      reason: params.reason,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function updateAdminRoomReportStatus(
  reportId: number,
  payload: UpdateRoomReportStatusPayload,
) {
  return proxyRequest<RoomReport>(`admin/room-reports/${reportId}/status`, {
    method: "PATCH",
    body: payload,
  });
}
