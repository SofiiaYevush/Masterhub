import { describe, it, expect, vi } from "vitest";
import { verifyAdmin } from "../../../middleware/verifyAdmin.js";

describe("verifyAdmin middleware", () => {
  it("calls next() when req.isAdmin is true", () => {
    const next = vi.fn();

    verifyAdmin({ isAdmin: true }, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("calls next with a 403 error when req.isAdmin is falsy", () => {
    const next = vi.fn();

    verifyAdmin({ isAdmin: false }, {}, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
  });
});
