interface CookieEnv {
  AUTH_COOKIE_SECURE?: string;
  NODE_ENV?: string;
}

export function resolveSecureCookieFlag(env: CookieEnv = process.env) {
  const configuredValue = env.AUTH_COOKIE_SECURE?.trim().toLowerCase();

  if (configuredValue === "true" || configuredValue === "1") {
    return true;
  }

  if (configuredValue === "false" || configuredValue === "0") {
    return false;
  }

  return env.NODE_ENV === "production";
}
