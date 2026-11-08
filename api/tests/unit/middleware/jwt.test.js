import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../../middleware/jwt.js";

describe("verifyToken middleware", () => {
  it("calls next with a 401 when there is no accessToken cookie", () => {
    const next = vi.fn();

    verifyToken({ cookies: {} }, {}, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });

  it("calls next with a 403 when the token is invalid", async () => {
    const next = vi.fn();
    const req = { cookies: { accessToken: "not-a-real-token" } };

    verifyToken(req, {}, next);

    await vi.waitFor(() =>
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }))
    );
  });

  it("populates req.userId/isSeller/isAdmin/isClient and calls next() for a valid token", async () => {
    const token = jwt.sign(
      { id: "abc123", isSeller: true, isAdmin: false, isClient: false },
      process.env.JWT_KEY
    );
    const req = { cookies: { accessToken: token } };
    const next = vi.fn();

    verifyToken(req, {}, next);

    await vi.waitFor(() => expect(next).toHaveBeenCalled());

    expect(req.userId).toBe("abc123");
    expect(req.isSeller).toBe(true);
    expect(req.isAdmin).toBe(false);
    expect(req.isClient).toBe(false);
    expect(next).toHaveBeenCalledWith();
  });
});
