import { describe, expect, it } from "vitest";

import { isPublicRoomPath, isRoomMutation } from "@/lib/public-cache";

describe("public room cache helpers", () => {
  it("tags only public room endpoints", () => {
    expect(isPublicRoomPath("rooms")).toBe(true);
    expect(isPublicRoomPath("rooms/featured")).toBe(true);
    expect(isPublicRoomPath("rooms/sample-slug")).toBe(true);
    expect(isPublicRoomPath("rooms-extra")).toBe(false);
    expect(isPublicRoomPath("news")).toBe(false);
  });

  it("invalidates after successful host or admin room writes", () => {
    expect(isRoomMutation("POST", "host/rooms")).toBe(true);
    expect(isRoomMutation("PUT", "host/rooms/12")).toBe(true);
    expect(isRoomMutation("PATCH", "admin/rooms/12/status")).toBe(true);
    expect(isRoomMutation("DELETE", "admin/rooms/12")).toBe(true);
    expect(isRoomMutation("GET", "host/rooms")).toBe(false);
    expect(isRoomMutation("POST", "uploads/rooms")).toBe(false);
    expect(isRoomMutation("POST", "host/rooms-extra")).toBe(false);
  });
});
