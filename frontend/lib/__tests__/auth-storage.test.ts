import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  persistAuth,
  readStoredUser,
  updateStoredUser,
  clearStoredAuth,
} from "@/lib/auth-storage";
import type { UserProfile } from "@/types";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "window", {
  value: { localStorage: localStorageMock },
  writable: true,
});

const sampleUser: UserProfile = {
  id: 1,
  fullName: "Nguyễn Văn An",
  email: "an@example.com",
  phone: "0912345678",
  avatarUrl: "",
  roles: ["USER"],
  status: "ACTIVE",
};

describe("auth-storage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("persistAuth stores only the user profile in localStorage", () => {
    persistAuth(sampleUser);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "homi.current_user",
      JSON.stringify(sampleUser),
    );
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
  });

  it("readStoredUser returns the stored user profile", () => {
    persistAuth(sampleUser);

    const user = readStoredUser();

    expect(user).toEqual(sampleUser);
  });

  it("updateStoredUser replaces the cached user profile", () => {
    const updatedUser: UserProfile = {
      ...sampleUser,
      fullName: "Nguyen Van Binh",
    };

    updateStoredUser(updatedUser);

    expect(readStoredUser()).toEqual(updatedUser);
  });

  it("clearStoredAuth removes the cached user profile", () => {
    persistAuth(sampleUser);
    clearStoredAuth();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("homi.current_user");
    expect(localStorageMock.removeItem).toHaveBeenCalledTimes(1);
  });

  it("readStoredUser clears malformed cached data", () => {
    localStorageMock.setItem("homi.current_user", "{bad json");

    expect(readStoredUser()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("homi.current_user");
  });
});
