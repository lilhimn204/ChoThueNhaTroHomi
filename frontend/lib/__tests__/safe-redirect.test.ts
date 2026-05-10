import { describe, expect, it } from "vitest";

import {
  getSafeAuthRedirect,
  isSafeInternalRedirect,
} from "@/lib/safe-redirect";
import type { UserProfile } from "@/types";

const user: UserProfile = {
  id: 1,
  fullName: "Nguyen Van An",
  email: "an@example.com",
  phone: "0912345678",
  avatarUrl: "",
  roles: ["USER"],
  status: "ACTIVE",
};

const admin: UserProfile = {
  ...user,
  id: 2,
  roles: ["ADMIN"],
};

describe("safe-redirect", () => {
  it("accepts internal app paths", () => {
    expect(isSafeInternalRedirect("/profile")).toBe(true);
    expect(isSafeInternalRedirect("/rooms?districtId=1")).toBe(true);
    expect(isSafeInternalRedirect(" /host/posts ")).toBe(true);
  });

  it("rejects external or executable redirects", () => {
    expect(isSafeInternalRedirect("https://example.com")).toBe(false);
    expect(isSafeInternalRedirect("//example.com")).toBe(false);
    expect(isSafeInternalRedirect("javascript:alert(1)")).toBe(false);
    expect(isSafeInternalRedirect("/\\example.com")).toBe(false);
    expect(isSafeInternalRedirect(undefined)).toBe(false);
  });

  it("falls back by role when requested redirect is unsafe", () => {
    expect(getSafeAuthRedirect(user, "https://example.com")).toBe("/profile");
    expect(getSafeAuthRedirect(admin, "//example.com")).toBe("/admin");
  });

  it("returns trimmed internal redirect when safe", () => {
    expect(getSafeAuthRedirect(user, " /saved-rooms ")).toBe("/saved-rooms");
  });
});
