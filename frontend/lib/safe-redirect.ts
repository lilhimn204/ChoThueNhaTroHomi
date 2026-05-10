import type { UserProfile } from "@/types";

const UNSAFE_REDIRECT_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

export function isSafeInternalRedirect(value: string | undefined | null) {
  const redirect = value?.trim();

  if (!redirect) {
    return false;
  }

  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    return false;
  }

  if (redirect.includes("\\") || UNSAFE_REDIRECT_PATTERN.test(redirect)) {
    return false;
  }

  return true;
}

export function getDefaultAuthRedirect(user: UserProfile) {
  return user.roles.includes("ADMIN") ? "/admin" : "/profile";
}

export function getSafeAuthRedirect(user: UserProfile, requestedRedirect?: string) {
  return isSafeInternalRedirect(requestedRedirect)
    ? requestedRedirect!.trim()
    : getDefaultAuthRedirect(user);
}
