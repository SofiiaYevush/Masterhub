import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import User from "../../models/user.model.js";

export const PLAIN_PASSWORD = "Password123!";

export const buildUserPayload = (overrides = {}) => {
  const suffix = randomUUID().slice(0, 8);
  return {
    username: `user_${suffix}`,
    email: `user_${suffix}@example.com`,
    password: PLAIN_PASSWORD,
    isSeller: false,
    isAdmin: false,
    isBlocked: false,
    ...overrides,
  };
};

// Low bcrypt cost (vs. the app's 5) - correctness is identical, just faster
// across hundreds of test-suite logins.
export const createUser = async (overrides = {}) => {
  const payload = buildUserPayload(overrides);
  const hashed = bcrypt.hashSync(payload.password, 4);
  const user = await User.create({ ...payload, password: hashed });
  return { user, plainPassword: payload.password };
};

export const createSeller = (overrides = {}) =>
  createUser({
    isSeller: true,
    phone: "+380000000000",
    desc: "Experienced tasker",
    ...overrides,
  });

export const createAdmin = (overrides = {}) =>
  createUser({ isAdmin: true, ...overrides });
