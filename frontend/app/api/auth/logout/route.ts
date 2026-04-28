import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { clearAuthCookies, revokeBackendRefreshToken } from "@/lib/server-auth";

export async function POST() {
  const cookieStore = await cookies();
  await revokeBackendRefreshToken(cookieStore);
  clearAuthCookies(cookieStore);
  return new NextResponse(null, { status: 204 });
}
