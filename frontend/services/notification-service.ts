import { proxyRequest } from "@/services/api-client";
import type { AppNotification, PageResponse } from "@/types";

export function getUnreadCount(signal?: AbortSignal) {
  return proxyRequest<{ count: number }>("notifications/unread-count", {
    signal,
  });
}

export function getNotifications(
  params: { unreadOnly?: boolean; page?: number; size?: number },
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<AppNotification>>("notifications", {
    query: {
      unreadOnly: params.unreadOnly ?? false,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function markAsRead(notificationId: number) {
  return proxyRequest<AppNotification>(`notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}

export function markAllAsRead() {
  return proxyRequest<{ message: string }>("notifications/read-all", {
    method: "PATCH",
  });
}
