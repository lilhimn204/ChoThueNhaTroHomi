import { NextRequest, NextResponse } from "next/server";

import { fetchBackend } from "@/lib/backend-fetch";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const FORBIDDEN_PATH_PATTERN = /\.\.|\\|\/\//;

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
  const backendResponse = await fetchBackend(url, {
    method: request.method,
    headers: buildHeaders(contentType),
    body,
    cache: "no-store",
  });

  if (backendResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendResponse.text();
  return new NextResponse(data, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("Content-Type") ?? "application/json",
    },
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
