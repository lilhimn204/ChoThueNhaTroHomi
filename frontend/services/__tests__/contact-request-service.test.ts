import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cancelMyContactRequest } from "@/services/contact-request-service";

describe("contact-request-service", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { location: { origin: "http://app.test" } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("cancels the current user's request through the dedicated endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 42,
          roomId: 8,
          roomTitle: "Phòng demo",
          roomSlug: "phong-demo",
          requestType: "VIEWING",
          fullName: "Nguyen Van Binh",
          email: "binh@example.com",
          phone: "0900000000",
          message: "Tôi muốn xem phòng",
          preferredViewingTime: "19:30",
          status: "CANCELLED",
          createdAt: "2026-06-20T12:00:00Z",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await cancelMyContactRequest(42);

    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);
    const requestOptions = fetchMock.mock.calls[0][1] as RequestInit;
    expect(requestedUrl.pathname).toBe("/api/proxy/contact-requests/42/cancel");
    expect(requestOptions.method).toBe("PATCH");
    expect(requestOptions.body).toBeUndefined();
    expect(requestOptions.cache).toBe("no-store");
    expect(result).toMatchObject({
      id: 42,
      requesterName: "Nguyen Van Binh",
      status: "CANCELLED",
    });
  });
});
