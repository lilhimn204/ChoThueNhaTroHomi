import { NextRequest, NextResponse } from "next/server";

import { fetchBackend } from "@/lib/backend-fetch";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  return NextResponse.json(data, { status: 201 });
}
