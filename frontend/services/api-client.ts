import type { ApiErrorResponse, ApiFieldError } from "@/types";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
};

export class ApiError extends Error {
  status: number;
  fieldErrors: ApiFieldError[];

  constructor(message: string, status: number, fieldErrors: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function getServerApiBaseUrl() {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return apiConfig.baseUrl;
  }

  const normalizedBackendUrl = backendUrl.replace(/\/$/, "");
  return normalizedBackendUrl.endsWith("/api/v1")
    ? normalizedBackendUrl
    : `${normalizedBackendUrl}/api/v1`;
}

function getPublicApiBaseUrl() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/public`;
  }

  return getServerApiBaseUrl();
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, `${getPublicApiBaseUrl().replace(/\/$/, "")}/`);

  if (!query) {
    return url.toString();
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)));
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function parseError(response: Response) {
  let payload: ApiErrorResponse | null = null;

  try {
    payload = (await response.json()) as ApiErrorResponse;
  } catch {
    payload = null;
  }

  throw new ApiError(
    payload?.message ?? "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
    response.status,
    payload?.fieldErrors ?? [],
  );
}

/**
 * Direct API request to Spring Boot backend (for PUBLIC endpoints only).
 * For authenticated requests, use `proxyRequest` instead.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, headers, query, signal }: ApiRequestOptions = {},
) {
  const requestHeaders = new Headers(headers);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const requestBody =
    body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body);

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: requestBody,
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function buildProxyUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`/api/proxy/${path}`, window.location.origin);

  if (!query) {
    return url.toString();
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)));
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/**
 * Authenticated API request through Next.js proxy.
 * Token is automatically read from HttpOnly cookie by the proxy route.
 * Use this for all authenticated endpoints (user, admin, host, etc.).
 */
export async function proxyRequest<T>(
  path: string,
  { method = "GET", body, headers, query, signal }: ApiRequestOptions = {},
) {
  const requestHeaders = new Headers(headers);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const requestBody =
    body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body);

  const response = await fetch(buildProxyUrl(path, query), {
    method,
    headers: requestHeaders,
    body: requestBody,
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
