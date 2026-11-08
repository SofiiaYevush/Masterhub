import { describe, it, expect, afterEach } from "vitest";
import getCurrentUser from "../getCurrentUser";

describe("getCurrentUser", () => {
  afterEach(() => localStorage.clear());

  it("returns null when nothing is stored", () => {
    expect(getCurrentUser()).toBeNull();
  });

  it("returns the parsed user when one is stored", () => {
    localStorage.setItem("currentUser", JSON.stringify({ _id: "u1", username: "demo" }));

    expect(getCurrentUser()).toEqual({ _id: "u1", username: "demo" });
  });
});
