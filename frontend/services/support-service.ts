import { apiRequest, proxyRequest } from "@/services/api-client";
import type {
  PageResponse,
  SupportTicket,
  SupportTicketStatus,
  SupportTicketType,
} from "@/types";

export interface CreateSupportTicketPayload {
  type: SupportTicketType;
  listingReference?: string;
  reason?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
}

interface AdminSearchSupportTicketsParams {
  keyword?: string;
  type?: SupportTicketType | "";
  status?: SupportTicketStatus | "";
  page?: number;
  size?: number;
}

interface UpdateSupportTicketStatusPayload {
  status: SupportTicketStatus;
  adminNote: string;
}

export const SUPPORT_TICKETS_CHANGED_EVENT = "homi-support-tickets-changed";

export function createSupportTicket(payload: CreateSupportTicketPayload) {
  return apiRequest<SupportTicket>("support-tickets", {
    method: "POST",
    body: payload,
  });
}

export function searchAdminSupportTickets(
  params: AdminSearchSupportTicketsParams,
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<SupportTicket>>("admin/support-tickets", {
    query: {
      keyword: params.keyword,
      type: params.type,
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function updateAdminSupportTicketStatus(
  ticketId: number,
  payload: UpdateSupportTicketStatusPayload,
) {
  return proxyRequest<SupportTicket>(`admin/support-tickets/${ticketId}/status`, {
    method: "PATCH",
    body: payload,
  });
}
