import { describe, it, expect, beforeAll } from "vitest";
import User from "../../../models/user.model.js";
import { useDatabase } from "../../setup/db.js";
import { buildUserPayload } from "../../factories/user.factory.js";

useDatabase();

describe("User model", () => {
  // Uniqueness is enforced by a DB index, which Mongoose builds asynchronously
  // in the background - wait for it so the duplicate-key tests aren't flaky.
  beforeAll(() => User.init());

  it("requires phone and desc when isSeller is true", () => {
    const user = new User(
      buildUserPayload({ isSeller: true, phone: undefined, desc: undefined })
    );
    const err = user.validateSync();

    expect(err.errors.phone).toBeDefined();
    expect(err.errors.desc).toBeDefined();
  });

  it("does not require phone/desc for a client", () => {
    const user = new User(
      buildUserPayload({ isSeller: false, phone: undefined, desc: undefined })
    );

    expect(user.validateSync()).toBeUndefined();
  });

  it("rejects a duplicate username at the database level", async () => {
    await User.create(buildUserPayload({ username: "sameusername" }));

    await expect(
      User.create(buildUserPayload({ username: "sameusername" }))
    ).rejects.toThrow();
  });

  it("rejects a duplicate email at the database level", async () => {
    await User.create(buildUserPayload({ email: "dup@example.com" }));

    await expect(
      User.create(buildUserPayload({ email: "dup@example.com" }))
    ).rejects.toThrow();
  });

  it("defaults isSeller/isBlocked/isAdmin/cardVerified to false and stripeCustomerId to null", () => {
    const user = new User(
      buildUserPayload({ isSeller: undefined, isAdmin: undefined, isBlocked: undefined })
    );

    expect(user.isSeller).toBe(false);
    expect(user.isAdmin).toBe(false);
    expect(user.isBlocked).toBe(false);
    expect(user.cardVerified).toBe(false);
    expect(user.stripeCustomerId).toBeNull();
  });
});
