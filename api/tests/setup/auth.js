// Test-only helpers for building the same JWT payload auth.controller.js
// signs on login, so integration tests can authenticate as any role without
// re-running the full register/login flow every time.
import jwt from "jsonwebtoken";

export const signAccessToken = ({
  id,
  isSeller = false,
  isAdmin = false,
  isClient = !isSeller && !isAdmin,
}) =>
  jwt.sign({ id, isSeller, isAdmin, isClient }, process.env.JWT_KEY);

export const authCookie = (payload) => `accessToken=${signAccessToken(payload)}`;

export const asUser = (user) =>
  authCookie({
    id: user._id.toString(),
    isSeller: user.isSeller,
    isAdmin: user.isAdmin,
  });
