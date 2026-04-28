import type { UserProfile } from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthBffResponse {
  user: UserProfile;
}

/**
 * Login via BFF route — token is stored in HttpOnly cookie server-side.
 */
export async function login(payload: LoginPayload): Promise<AuthBffResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Đăng nhập thất bại.");
  }

  return data as AuthBffResponse;
}

/**
 * Register via BFF route — token is stored in HttpOnly cookie server-side.
 */
export async function register(payload: RegisterPayload): Promise<AuthBffResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Đăng ký thất bại.");
  }

  return data as AuthBffResponse;
}

/**
 * Logout via BFF route — clears the HttpOnly cookie.
 */
export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

/**
 * Get current user profile via BFF route.
 * Returns null if not authenticated.
 */
export async function getMe(): Promise<UserProfile | null> {
  const response = await fetch("/api/auth/me");

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { user: UserProfile | null };
  return data.user;
}
