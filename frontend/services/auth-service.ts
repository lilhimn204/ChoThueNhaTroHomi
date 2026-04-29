import type { ApiErrorResponse, UserProfile } from "@/types";
import { ApiError } from "@/services/api-client";

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

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface ResendOtpPayload {
  email: string;
}

interface GoogleLoginPayload {
  idToken: string;
}

interface AuthBffResponse {
  user: UserProfile;
}

export interface RegistrationOtpResponse {
  email: string;
  expiresInMinutes: number;
  resendCooldownSeconds: number;
  message: string;
}

async function parseJson<T>(response: Response) {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function throwAuthError(response: Response, fallbackMessage: string): Promise<never> {
  const data = await parseJson<ApiErrorResponse>(response);
  throw new ApiError(data?.message ?? fallbackMessage, response.status, data?.fieldErrors ?? []);
}

/**
 * Login via BFF route. Tokens are stored in HttpOnly cookies server-side.
 */
export async function login(payload: LoginPayload): Promise<AuthBffResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwAuthError(response, "Đăng nhập thất bại.");
  }

  return (await response.json()) as AuthBffResponse;
}

/**
 * Start email/password registration. The account is not logged in until OTP verification succeeds.
 */
export async function register(payload: RegisterPayload): Promise<RegistrationOtpResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwAuthError(response, "Đăng ký thất bại.");
  }

  return (await response.json()) as RegistrationOtpResponse;
}

/**
 * Verify registration OTP. On success, the BFF stores tokens in HttpOnly cookies.
 */
export async function verifyRegistrationOtp(payload: VerifyOtpPayload): Promise<AuthBffResponse> {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwAuthError(response, "Xác minh OTP thất bại.");
  }

  return (await response.json()) as AuthBffResponse;
}

/**
 * Request a new registration OTP for a pending local account.
 */
export async function resendRegistrationOtp(
  payload: ResendOtpPayload,
): Promise<RegistrationOtpResponse> {
  const response = await fetch("/api/auth/resend-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwAuthError(response, "Không thể gửi lại OTP.");
  }

  return (await response.json()) as RegistrationOtpResponse;
}

/**
 * Login/register with Google ID token. Tokens are stored in HttpOnly cookies server-side.
 */
export async function loginWithGoogle(payload: GoogleLoginPayload): Promise<AuthBffResponse> {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwAuthError(response, "Đăng nhập Google thất bại.");
  }

  return (await response.json()) as AuthBffResponse;
}

/**
 * Logout via BFF route. Clears the HttpOnly cookies.
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
