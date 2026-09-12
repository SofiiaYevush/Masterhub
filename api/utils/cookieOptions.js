// Frontend and backend are deployed on different onrender.com subdomains,
// which browsers treat as cross-site. Cross-site cookies require
// SameSite=None + Secure, but Secure cookies won't be set over plain http
// (local dev), so we switch behavior based on NODE_ENV.
const isProd = process.env.NODE_ENV === "production";

export const authCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};
