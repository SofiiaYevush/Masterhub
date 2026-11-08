import { describe, it, expect, afterEach, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server.js";
import { apiUrl } from "../../test/mocks/handlers.js";
import refreshCurrentUser from "../refreshCurrentUser";

describe("refreshCurrentUser", () => {
  afterEach(() => localStorage.clear());

  it("returns null and skips the request when there is no stored user", async () => {
    const result = await refreshCurrentUser();

    expect(result).toBeNull();
  });

  it("fetches the latest user data and updates localStorage", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ _id: "u1", username: "stale" }));
    server.use(
      http.get(apiUrl("/users/:id"), () =>
        HttpResponse.json({ _id: "u1", username: "fresh", isBlocked: false })
      )
    );

    const result = await refreshCurrentUser();

    expect(result.username).toBe("fresh");
    expect(JSON.parse(localStorage.getItem("currentUser")).username).toBe("fresh");
  });

  it("returns null when the request fails", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ _id: "u1" }));
    server.use(http.get(apiUrl("/users/:id"), () => HttpResponse.json({}, { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await refreshCurrentUser();

    expect(result).toBeNull();
  });
});
