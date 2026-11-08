import { describe, it, expect } from "vitest";
import newRequest from "../newRequest";

describe("newRequest", () => {
  it("sends credentials so the httpOnly auth cookie is included cross-site", () => {
    expect(newRequest.defaults.withCredentials).toBe(true);
  });

  it("is configured with a base URL", () => {
    expect(newRequest.defaults.baseURL).toBeTruthy();
  });
});
