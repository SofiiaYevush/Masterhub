import { describe, it, expect, afterEach } from "vitest";

// authCookieOptions is computed once at import time from NODE_ENV, so each
// branch needs its own fresh module instance - a unique query string on the
// specifier busts the ESM cache without relying on vi.resetModules() timing.
describe("authCookieOptions", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("uses lax/non-secure cookies outside production (local http dev)", async () => {
    process.env.NODE_ENV = "development";
    const { authCookieOptions } = await import(
      "../../../utils/cookieOptions.js?env=development"
    );

    expect(authCookieOptions).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  });

  it("uses none/secure cookies in production (cross-site Render deploy)", async () => {
    process.env.NODE_ENV = "production";
    const { authCookieOptions } = await import(
      "../../../utils/cookieOptions.js?env=production"
    );

    expect(authCookieOptions).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  });
});
