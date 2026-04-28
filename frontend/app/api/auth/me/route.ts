import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE_NAME,
  clearAuthCookies,
  refreshAccessToken,
} from "@/lib/server-auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

async function fetchMe(accessToken: string) {
  return fetch(`${BACKEND_URL}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function GET() {
  const cookieStore = await cookies();
  let token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!token) {
    const refreshed = await refreshAccessToken(cookieStore);
    token = refreshed?.accessToken;
  }

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  let backendResponse = await fetchMe(token);

  if (backendResponse.status === 401) {
    const refreshed = await refreshAccessToken(cookieStore);
    if (refreshed?.accessToken) {
      backendResponse = await fetchMe(refreshed.accessToken);
    }
  }

  if (!backendResponse.ok) {
    clearAuthCookies(cookieStore);
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await backendResponse.json();
  return NextResponse.json({ user }, { status: 200 });
}
