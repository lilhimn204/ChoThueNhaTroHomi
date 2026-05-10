import { cookies } from "next/headers";

import { fetchBackend } from "@/lib/backend-fetch";
import { resolveSecureCookieFlag } from "@/lib/auth-cookie-config";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export const ACCESS_COOKIE_NAME = "homi_token";
export const REFRESH_COOKIE_NAME = "homi_refresh_token";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMinutes: number;
  refreshExpiresInMinutes: number;
  user: unknown;
}

export function setAuthCookies(cookieStore: CookieStore, data: BackendAuthResponse) {
  const secure = resolveSecureCookieFlag();

  cookieStore.set(ACCESS_COOKIE_NAME, data.accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: data.expiresInMinutes * 60,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, data.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: data.refreshExpiresInMinutes * 60,
  });
}

export function clearAuthCookies(cookieStore: CookieStore) {
  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

export async function refreshAccessToken(cookieStore: CookieStore) {
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    clearAuthCookies(cookieStore);
    return null;
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!backendResponse.ok) {
    clearAuthCookies(cookieStore);
    return null;
  }

  const data = (await backendResponse.json()) as BackendAuthResponse;
  setAuthCookies(cookieStore, data);
  return data;
}

export async function revokeBackendRefreshToken(cookieStore: CookieStore) {
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return;
  }

  await fetchBackend(`${BACKEND_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}`,
    },
  }).catch(() => undefined);
}
