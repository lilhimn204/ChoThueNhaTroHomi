import { describe, expect, it } from "vitest";

import { resolveSecureCookieFlag } from "@/lib/auth-cookie-config";

describe("auth-cookie-config", () => {
  it("allows explicit secure cookie override", () => {
    expect(resolveSecureCookieFlag({ AUTH_COOKIE_SECURE: "true", NODE_ENV: "development" })).toBe(true);
    expect(resolveSecureCookieFlag({ AUTH_COOKIE_SECURE: "1", NODE_ENV: "development" })).toBe(true);
  });

  it("allows explicit insecure cookie override for local HTTP runners", () => {
    expect(resolveSecureCookieFlag({ AUTH_COOKIE_SECURE: "false", NODE_ENV: "production" })).toBe(false);
    expect(resolveSecureCookieFlag({ AUTH_COOKIE_SECURE: "0", NODE_ENV: "production" })).toBe(false);
  });

  it("falls back to production node env when no override is configured", () => {
    expect(resolveSecureCookieFlag({ NODE_ENV: "production" })).toBe(true);
    expect(resolveSecureCookieFlag({ NODE_ENV: "development" })).toBe(false);
  });
});
