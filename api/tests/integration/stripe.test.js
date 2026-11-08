import { vi, describe, it, expect, beforeEach } from "vitest";

// The `stripe` SDK is mocked entirely - these tests never make a real
// network call to Stripe, and no real (or test) Stripe secret key is ever
// used for an actual charge or customer.
// vi.mock(...) is hoisted above all imports and top-level statements, so the
// mock fns it references must be created through vi.hoisted() - a plain
// `const` here would still be hoisted-above by the time the factory runs.
const { mockCustomersCreate, mockSetupIntentsCreate, mockConstructEvent } = vi.hoisted(() => ({
  mockCustomersCreate: vi.fn(),
  mockSetupIntentsCreate: vi.fn(),
  mockConstructEvent: vi.fn(),
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    customers: { create: mockCustomersCreate },
    setupIntents: { create: mockSetupIntentsCreate },
    webhooks: { constructEvent: mockConstructEvent },
  })),
}));

import request from "supertest";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { asUser } from "../setup/auth.js";
import { createUser } from "../factories/user.factory.js";
import User from "../../models/user.model.js";

useDatabase();

beforeEach(() => {
  mockCustomersCreate.mockReset();
  mockSetupIntentsCreate.mockReset();
  mockConstructEvent.mockReset();
});

describe("POST /api/stripe/setup-intent", () => {
  it("creates a Stripe customer on first use and returns a client secret", async () => {
    const { user } = await createUser();
    mockCustomersCreate.mockResolvedValue({ id: "cus_fake123" });
    mockSetupIntentsCreate.mockResolvedValue({ client_secret: "seti_fake_secret" });

    const res = await request(app)
      .post("/api/stripe/setup-intent")
      .set("Cookie", asUser(user));

    expect(res.status).toBe(200);
    expect(res.body.clientSecret).toBe("seti_fake_secret");
    expect(mockCustomersCreate).toHaveBeenCalledWith(
      expect.objectContaining({ email: user.email })
    );

    const updated = await User.findById(user._id);
    expect(updated.stripeCustomerId).toBe("cus_fake123");
  });

  it("reuses an existing stripeCustomerId instead of creating a new customer", async () => {
    const { user } = await createUser({ stripeCustomerId: "cus_existing" });
    mockSetupIntentsCreate.mockResolvedValue({ client_secret: "seti_fake_secret_2" });

    const res = await request(app)
      .post("/api/stripe/setup-intent")
      .set("Cookie", asUser(user));

    expect(res.status).toBe(200);
    expect(mockCustomersCreate).not.toHaveBeenCalled();
    expect(mockSetupIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "cus_existing" })
    );
  });

  it("rejects when the user's card is already verified", async () => {
    const { user } = await createUser({ cardVerified: true });

    const res = await request(app)
      .post("/api/stripe/setup-intent")
      .set("Cookie", asUser(user));

    expect(res.status).toBe(400);
  });

  it("requires authentication", async () => {
    const res = await request(app).post("/api/stripe/setup-intent");

    expect(res.status).toBe(401);
  });
});

describe("POST /api/stripe/webhook", () => {
  it("rejects a request with an invalid signature", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const res = await request(app)
      .post("/api/stripe/webhook")
      .set("Content-Type", "application/json")
      .set("stripe-signature", "bad-signature")
      .send(JSON.stringify({ type: "setup_intent.succeeded" }));

    expect(res.status).toBe(400);
  });

  it("marks the user's card verified on setup_intent.succeeded", async () => {
    const { user } = await createUser();
    mockConstructEvent.mockReturnValue({
      type: "setup_intent.succeeded",
      data: { object: { metadata: { userId: user._id.toString() } } },
    });

    const res = await request(app)
      .post("/api/stripe/webhook")
      .set("Content-Type", "application/json")
      .set("stripe-signature", "valid-signature")
      .send(JSON.stringify({ any: "payload" }));

    expect(res.status).toBe(200);

    const updated = await User.findById(user._id);
    expect(updated.cardVerified).toBe(true);
  });

  it("ignores events without a userId in metadata", async () => {
    mockConstructEvent.mockReturnValue({
      type: "setup_intent.succeeded",
      data: { object: { metadata: {} } },
    });

    const res = await request(app)
      .post("/api/stripe/webhook")
      .set("Content-Type", "application/json")
      .set("stripe-signature", "valid-signature")
      .send(JSON.stringify({ any: "payload" }));

    expect(res.status).toBe(200);
  });
});
