import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_COOKIE_NAME,
  clearAuthCookies,
  refreshAccessToken,
} from "@/lib/server-auth";
import { fetchBackend } from "@/lib/backend-fetch";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

/**
 * Catch-all API proxy for authenticated requests.
 * Reads JWT from HttpOnly cookie and forwards to Spring Boot with Authorization header.
 *
 * Usage: fetch("/api/proxy/users/me") proxies to BACKEND_URL/api/v1/users/me.
 */
const FORBIDDEN_PATH_PATTERN = /\.\.|\\|\/\//;

async function proxyHandler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const joinedPath = path.join("/");

  if (FORBIDDEN_PATH_PATTERN.test(joinedPath)) {
    return NextResponse.json(
      { message: "Đường dẫn không hợp lệ." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  let token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!token) {
    const refreshed = await refreshAccessToken(cookieStore);
    token = refreshed?.accessToken;
  }

  if (!token) {
    return NextResponse.json(
      { message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." },
      { status: 401 },
    );
  }

  const url = new URL(`/api/v1/${joinedPath}`, BACKEND_URL);

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const contentType = request.headers.get("Content-Type");
  const body = await buildBody(request, contentType);

  let backendResponse = await forwardRequest(request.method, url, token, contentType, body);

  if (backendResponse.status === 401) {
    const refreshed = await refreshAccessToken(cookieStore);
    if (refreshed?.accessToken) {
      backendResponse = await forwardRequest(request.method, url, refreshed.accessToken, contentType, body);
    }
  }

  if (backendResponse.status === 401) {
    clearAuthCookies(cookieStore);
  }

  if (backendResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendResponse.text();
  return new NextResponse(data, {
    status: backendResponse.status,
    headers: { "Content-Type": backendResponse.headers.get("Content-Type") ?? "application/json" },
  });
}

async function buildBody(request: NextRequest, contentType: string | null) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  if (contentType?.includes("multipart/form-data")) {
    return request.formData();
  }

  return request.text();
}

async function forwardRequest(
  method: string,
  url: URL,
  accessToken: string,
  contentType: string | null,
  body: BodyInit | undefined,
) {
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (contentType && !contentType.includes("multipart/form-data")) {
    headers["Content-Type"] = contentType;
  }

  return fetchBackend(url, {
    method,
    headers,
    body,
  });
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
