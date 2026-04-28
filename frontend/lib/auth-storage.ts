import type { UserProfile } from "@/types";

const USER_KEY = "homi.current_user";

function canUseStorage() {
  return typeof window !== "undefined";
}

/**
 * Read stored user profile from localStorage.
 * Note: JWT token is NO LONGER stored in localStorage — it lives in an HttpOnly cookie.
 */
export function readStoredUser() {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(USER_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as UserProfile;
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function persistAuth(user: UserProfile) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateStoredUser(user: UserProfile) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(USER_KEY);
}
