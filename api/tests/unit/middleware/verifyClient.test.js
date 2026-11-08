import { describe, it, expect, vi } from "vitest";
import { verifyClient } from "../../../middleware/verifyClient.js";

describe("verifyClient middleware", () => {
  it("calls next() for a plain client (not seller, not admin)", () => {
    const next = vi.fn();

    verifyClient({ isSeller: false, isAdmin: false }, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("blocks sellers with a 403", () => {
    const next = vi.fn();

    verifyClient({ isSeller: true, isAdmin: false }, {}, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
  });

  it("blocks admins with a 403", () => {
    const next = vi.fn();

    verifyClient({ isSeller: false, isAdmin: true }, {}, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
  });
});
