import { NextRequest, NextResponse } from "next/server";

import { fetchBackend } from "@/lib/backend-fetch";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!backendResponse.ok) {
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  }

  return new NextResponse(null, { status: 204 });
}
