import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiConfig, apiRequest } from "@/services/api-client";

describe("api-client", () => {
  const originalBaseUrl = apiConfig.baseUrl;

  beforeEach(() => {
    apiConfig.baseUrl = "http://api.test/api/v1";
  });

  afterEach(() => {
    apiConfig.baseUrl = originalBaseUrl;
    vi.restoreAllMocks();
  });

  it("serializes scalar and array query params", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("rooms", {
      query: {
        keyword: "can ho",
        amenityIds: [1, 2],
        empty: "",
        page: 0,
      },
    });

    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);
    const requestOptions = fetchMock.mock.calls[0][1] as RequestInit;
    expect(requestedUrl.pathname).toBe("/api/v1/rooms");
    expect(requestedUrl.searchParams.get("keyword")).toBe("can ho");
    expect(requestedUrl.searchParams.getAll("amenityIds")).toEqual(["1", "2"]);
    expect(requestedUrl.searchParams.get("empty")).toBeNull();
    expect(requestedUrl.searchParams.get("page")).toBe("0");
    expect(requestOptions.cache).toBe("default");
  });

  it("does not cache public mutations", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("support-tickets", {
      method: "POST",
      body: { subject: "Can ho tro" },
    });

    const requestOptions = fetchMock.mock.calls[0][1] as RequestInit;
    expect(requestOptions.cache).toBe("no-store");
  });

  it("throws ApiError with backend field errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 400,
            error: "Bad Request",
            message: "Dữ liệu không hợp lệ.",
            fieldErrors: [{ field: "email", message: "Email không hợp lệ." }],
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    await expect(apiRequest("auth/register")).rejects.toMatchObject<ApiError>({
      name: "ApiError",
      status: 400,
      message: "Dữ liệu không hợp lệ.",
      fieldErrors: [{ field: "email", message: "Email không hợp lệ." }],
    });
  });
});
