import { NextRequest, NextResponse } from "next/server";

import { fetchBackend } from "@/lib/backend-fetch";
import {
  isPublicRoomPath,
  PUBLIC_ROOMS_CACHE_TAG,
} from "@/lib/public-cache";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const FORBIDDEN_PATH_PATTERN = /\.\.|\\|\/\//;
const PUBLIC_CACHE_SECONDS = 60;
const PUBLIC_STALE_SECONDS = 86_400;
const ROOM_CDN_CACHE_SECONDS = 5;

export const preferredRegion = "sin1";

async function publicProxyHandler(
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

  const url = new URL(`/api/v1/${joinedPath}`, BACKEND_URL);

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const contentType = request.headers.get("Content-Type");
  const body = await buildBody(request, contentType);
  const isCacheableGet = request.method === "GET";
  const isRoomGet = isCacheableGet && isPublicRoomPath(joinedPath);
  const backendResponse = await fetchBackend(url, {
    method: request.method,
    headers: buildHeaders(contentType),
    body,
    cache: isCacheableGet ? "force-cache" : "no-store",
    ...(isCacheableGet
      ? {
          next: {
            revalidate: PUBLIC_CACHE_SECONDS,
            ...(isRoomGet ? { tags: [PUBLIC_ROOMS_CACHE_TAG] } : {}),
          },
        }
      : {}),
  });

  if (backendResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendResponse.text();
  const headers = new Headers({
    "Content-Type": backendResponse.headers.get("Content-Type") ?? "application/json",
  });

  if (isCacheableGet && backendResponse.ok) {
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    if (isRoomGet) {
      headers.set(
        "Vercel-CDN-Cache-Control",
        `public, max-age=${ROOM_CDN_CACHE_SECONDS}, stale-if-error=${PUBLIC_STALE_SECONDS}`,
      );
    } else {
      headers.set(
        "Vercel-CDN-Cache-Control",
        `public, max-age=${PUBLIC_CACHE_SECONDS}, stale-while-revalidate=${PUBLIC_STALE_SECONDS}, stale-if-error=${PUBLIC_STALE_SECONDS}`,
      );
    }
  }

  return new NextResponse(data, {
    status: backendResponse.status,
    headers,
  });
}

function buildHeaders(contentType: string | null) {
  const headers: HeadersInit = {};

  if (contentType && !contentType.includes("multipart/form-data")) {
    headers["Content-Type"] = contentType;
  }

  return headers;
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

export const GET = publicProxyHandler;
export const POST = publicProxyHandler;
export const PUT = publicProxyHandler;
export const PATCH = publicProxyHandler;
export const DELETE = publicProxyHandler;
