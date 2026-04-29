import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { type BackendAuthResponse, setAuthCookies } from "@/lib/server-auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  const cookieStore = await cookies();
  setAuthCookies(cookieStore, data as BackendAuthResponse);

  return NextResponse.json({ user: data.user }, { status: 200 });
}
