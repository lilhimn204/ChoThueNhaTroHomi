import { proxyRequest } from "@/services/api-client";
import type {
  AdminContactRequest,
  ContactRequest,
  ContactRequestStatus,
  ContactRequestType,
  PageResponse,
} from "@/types";

interface CreateContactRequestPayload {
  roomId: number;
  requestType: ContactRequestType;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  preferredViewingTime: string;
}

interface AdminSearchContactRequestsParams {
  keyword?: string;
  status?: ContactRequestStatus | "";
  page?: number;
  size?: number;
}

interface UpdateContactRequestStatusPayload {
  status: ContactRequestStatus;
  adminNote: string;
}

interface ContactRequestResponse {
  id: number;
  roomId: number;
  roomTitle: string;
  roomSlug: string;
  requestType: ContactRequestType;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  preferredViewingTime: string;
  status: ContactRequestStatus;
  adminNote?: string;
  handledAt?: string;
  createdAt: string;
}

function toContactRequest(item: ContactRequestResponse): ContactRequest {
  return {
    id: item.id,
    roomId: item.roomId,
    roomTitle: item.roomTitle,
    roomSlug: item.roomSlug,
    requesterName: item.fullName,
    email: item.email,
    phone: item.phone,
    message: item.message,
    preferredViewingTime: item.preferredViewingTime,
    requestType: item.requestType,
    status: item.status,
    adminNote: item.adminNote,
    handledAt: item.handledAt,
    createdAt: item.createdAt,
  };
}

export async function getMyContactRequests(
  page = 0,
  size = 10,
  signal?: AbortSignal,
) {
  const response = await proxyRequest<PageResponse<ContactRequestResponse>>("contact-requests/me", {
    query: { page, size },
    signal,
  });

  return {
    ...response,
    content: response.content.map(toContactRequest),
  } satisfies PageResponse<ContactRequest>;
}

export function createContactRequest(
  payload: CreateContactRequestPayload,
) {
  return proxyRequest<ContactRequestResponse>("contact-requests", {
    method: "POST",
    body: payload,
  }).then(toContactRequest);
}

export function cancelMyContactRequest(requestId: number) {
  return proxyRequest<ContactRequestResponse>(`contact-requests/${requestId}/cancel`, {
    method: "PATCH",
  }).then(toContactRequest);
}

export function searchAdminContactRequests(
  params: AdminSearchContactRequestsParams,
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<AdminContactRequest>>("admin/contact-requests", {
    query: {
      keyword: params.keyword,
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function updateAdminContactRequestStatus(
  requestId: number,
  payload: UpdateContactRequestStatusPayload,
) {
  return proxyRequest<AdminContactRequest>(`admin/contact-requests/${requestId}/status`, {
    method: "PATCH",
    body: payload,
  });
}
