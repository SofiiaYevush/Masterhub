import { describe, it, expect } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { asUser } from "../setup/auth.js";
import { createSeller, createUser } from "../factories/user.factory.js";
import { buildGigPayload, createGig } from "../factories/gig.factory.js";
import { createOrder } from "../factories/order.factory.js";

useDatabase();

describe("POST /api/gigs", () => {
  it("lets a seller create a gig with a fixed price", async () => {
    const { user: seller } = await createSeller();

    const res = await request(app)
      .post("/api/gigs")
      .set("Cookie", asUser(seller))
      .send(buildGigPayload({ userId: seller._id.toString() }));

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(seller._id.toString());
  });

  it("lets a seller create a gig with a negotiable price and no price field", async () => {
    const { user: seller } = await createSeller();

    const res = await request(app)
      .post("/api/gigs")
      .set("Cookie", asUser(seller))
      .send(
        buildGigPayload({
          userId: seller._id.toString(),
          price: undefined,
          isPriceNegotiable: true,
        })
      );

    expect(res.status).toBe(201);
  });

  // Known gap: the controller builds the gig as
  // `new Gig({ userId: req.userId, ...req.body })` - since req.body is
  // spread *after* userId, a client-supplied `userId` in the request body
  // silently overrides the authenticated seller. The real frontend happens
  // to always send the current user's own id (see gigReducer's
  // INITIAL_STATE), which is why this goes unnoticed in normal use, but any
  // client can currently attribute a gig to a different seller entirely.
  it("[known gap] lets the request body's userId override the authenticated seller", async () => {
    const { user: seller } = await createSeller();
    const spoofedUserId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post("/api/gigs")
      .set("Cookie", asUser(seller))
      .send(buildGigPayload({ userId: spoofedUserId }));

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(spoofedUserId);
  });

  it("rejects a client (non-seller) creating a gig", async () => {
    const { user: client } = await createUser();

    const res = await request(app)
      .post("/api/gigs")
      .set("Cookie", asUser(client))
      .send(buildGigPayload());

    expect(res.status).toBe(403);
  });

  it("rejects a missing price when not negotiable", async () => {
    const { user: seller } = await createSeller();

    const res = await request(app)
      .post("/api/gigs")
      .set("Cookie", asUser(seller))
      .send(buildGigPayload({ price: undefined, isPriceNegotiable: false }));

    expect(res.status).toBe(400);
  });

  it("rejects visibility in zero languages", async () => {
    const { user: seller } = await createSeller();

    const res = await request(app)
      .post("/api/gigs")
      .set("Cookie", asUser(seller))
      .send(buildGigPayload({ languageVisibility: { en: false, uk: false } }));

    expect(res.status).toBe(400);
  });

  it("rejects visibility in both languages at once", async () => {
    const { user: seller } = await createSeller();

    const res = await request(app)
      .post("/api/gigs")
      .set("Cookie", asUser(seller))
      .send(buildGigPayload({ languageVisibility: { en: true, uk: true } }));

    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/gigs/:id", () => {
  it("lets the owning seller delete their gig", async () => {
    const { user: seller } = await createSeller();
    const gig = await createGig({ userId: seller._id.toString() });

    const res = await request(app)
      .delete(`/api/gigs/${gig._id}`)
      .set("Cookie", asUser(seller));

    expect(res.status).toBe(200);
  });

  it("forbids deleting someone else's gig", async () => {
    const { user: seller } = await createSeller();
    const { user: otherSeller } = await createSeller();
    const gig = await createGig({ userId: seller._id.toString() });

    const res = await request(app)
      .delete(`/api/gigs/${gig._id}`)
      .set("Cookie", asUser(otherSeller));

    expect(res.status).toBe(403);
  });
});

describe("GET /api/gigs/single/:id", () => {
  it("returns a single gig", async () => {
    const gig = await createGig();

    const res = await request(app).get(`/api/gigs/single/${gig._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(gig.title);
  });
});

describe("GET /api/gigs", () => {
  it("filters by category", async () => {
    await createGig({ cat: "cleaning" });
    await createGig({ cat: "plumbing" });

    const res = await request(app).get("/api/gigs").query({ cat: "plumbing" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].cat).toBe("plumbing");
  });

  it("filters by userId and enriches the response with seller + client info", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    await createOrder({ gigId: gig._id, taskerId: seller._id, clientId: client._id });

    const res = await request(app).get("/api/gigs").query({ userId: seller._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].username).toBe(seller.username);
    expect(res.body[0].clients).toHaveLength(1);
    expect(res.body[0].clients[0].username).toBe(client.username);
  });

  it("filters by search term (case-insensitive title match)", async () => {
    await createGig({ title: "Deep house cleaning" });
    await createGig({ title: "Garden maintenance" });

    const res = await request(app).get("/api/gigs").query({ search: "cleaning" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("filters by language visibility", async () => {
    await createGig({ languageVisibility: { en: true, uk: false } });
    await createGig({ languageVisibility: { en: false, uk: true } });

    const res = await request(app).get("/api/gigs").query({ language: "en" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].languageVisibility.en).toBe(true);
  });
});
