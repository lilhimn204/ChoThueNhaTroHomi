import { proxyRequest } from "@/services/api-client";
import type { AdminUser, PageResponse, UserProfile, UserRole, UserStatus } from "@/types";

interface UpdateProfilePayload {
  fullName: string;
  phone: string;
  avatarUrl: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export function getMyProfile(signal?: AbortSignal) {
  return proxyRequest<UserProfile>("users/me", {
    signal,
  });
}

export function updateMyProfile(payload: UpdateProfilePayload) {
  return proxyRequest<UserProfile>("users/me", {
    method: "PUT",
    body: payload,
  });
}

export function changeMyPassword(payload: ChangePasswordPayload) {
  return proxyRequest<{ message: string }>("users/me/password", {
    method: "PUT",
    body: payload,
  });
}

/* ── Admin user management ── */

export function searchAdminUsers(
  params: {
    keyword?: string;
    status?: UserStatus | "";
    role?: UserRole | "";
    page?: number;
    size?: number;
  },
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<AdminUser>>("admin/users", {
    query: {
      keyword: params.keyword || undefined,
      status: params.status || undefined,
      role: params.role || undefined,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function updateUserStatus(
  userId: number,
  data: { status: UserStatus; enabled?: boolean; lockReason?: string },
) {
  return proxyRequest<AdminUser>(`admin/users/${userId}/status`, {
    method: "PATCH",
    body: data,
  });
}

export function getAdminUser(userId: number, signal?: AbortSignal) {
  return proxyRequest<AdminUser>(`admin/users/${userId}`, { signal });
}

export function updateUserRoles(userId: number, roles: UserRole[]) {
  return proxyRequest<AdminUser>(`admin/users/${userId}/roles`, {
    method: "PATCH",
    body: { roles },
  });
}

export function verifyAdminUserEmail(userId: number) {
  return proxyRequest<AdminUser>(`admin/users/${userId}/verify-email`, {
    method: "PATCH",
  });
}
