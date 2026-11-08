import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { asUser } from "../setup/auth.js";
import { createUser, createSeller } from "../factories/user.factory.js";
import { createGig } from "../factories/gig.factory.js";
import { createReview } from "../factories/review.factory.js";
import Gig from "../../models/gig.model.js";

useDatabase();

// NOTE: deleteReview (DELETE /api/reviews/:id) is intentionally not covered
// here. Its handler body is an empty try/catch that never sends a response,
// and the route also has no verifyToken guard - calling it would hang the
// request until the test runner's own timeout. This is a real bug to fix in
// application code, not something a test can safely exercise as-is.

describe("POST /api/reviews", () => {
  it("lets a client post a review and increments the gig's star totals", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });

    const res = await request(app)
      .post("/api/reviews")
      .set("Cookie", asUser(client))
      .send({ gigId: gig._id.toString(), desc: "Fantastic work!", star: 5 });

    expect(res.status).toBe(201);

    const updatedGig = await Gig.findById(gig._id);
    expect(updatedGig.totalStars).toBe(5);
    expect(updatedGig.starNumber).toBe(1);
  });

  it("rejects a seller posting a review", async () => {
    const { user: seller } = await createSeller();
    const gig = await createGig({ userId: seller._id.toString() });

    const res = await request(app)
      .post("/api/reviews")
      .set("Cookie", asUser(seller))
      .send({ gigId: gig._id.toString(), desc: "Nice", star: 4 });

    expect(res.status).toBe(403);
  });

  it("rejects a second review by the same client for the same gig", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    await createReview({ gigId: gig._id.toString(), userId: client._id.toString() });

    const res = await request(app)
      .post("/api/reviews")
      .set("Cookie", asUser(client))
      .send({ gigId: gig._id.toString(), desc: "Again", star: 3 });

    expect(res.status).toBe(403);
  });
});

describe("GET /api/reviews/:gigId", () => {
  it("returns the reviews for a gig", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    await createReview({ gigId: gig._id.toString(), userId: client._id.toString() });

    const res = await request(app).get(`/api/reviews/${gig._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("PUT /api/reviews/:id/react", () => {
  it("adds a like", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const { user: reactor } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    const review = await createReview({ gigId: gig._id.toString(), userId: client._id.toString() });

    const res = await request(app)
      .put(`/api/reviews/${review._id}/react`)
      .set("Cookie", asUser(reactor))
      .send({ type: "like" });

    expect(res.status).toBe(200);
    expect(res.body.likes).toContain(reactor._id.toString());
  });

  it("moves a vote from like to dislike", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const { user: reactor } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    const review = await createReview({ gigId: gig._id.toString(), userId: client._id.toString() });
    const cookie = asUser(reactor);

    await request(app).put(`/api/reviews/${review._id}/react`).set("Cookie", cookie).send({ type: "like" });
    const res = await request(app)
      .put(`/api/reviews/${review._id}/react`)
      .set("Cookie", cookie)
      .send({ type: "dislike" });

    expect(res.body.likes).not.toContain(reactor._id.toString());
    expect(res.body.dislikes).toContain(reactor._id.toString());
  });

  it("toggles a like off when reacted twice", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const { user: reactor } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    const review = await createReview({ gigId: gig._id.toString(), userId: client._id.toString() });
    const cookie = asUser(reactor);

    await request(app).put(`/api/reviews/${review._id}/react`).set("Cookie", cookie).send({ type: "like" });
    const res = await request(app)
      .put(`/api/reviews/${review._id}/react`)
      .set("Cookie", cookie)
      .send({ type: "like" });

    expect(res.body.likes).not.toContain(reactor._id.toString());
  });

  it("rejects an invalid reaction type", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const { user: reactor } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    const review = await createReview({ gigId: gig._id.toString(), userId: client._id.toString() });

    const res = await request(app)
      .put(`/api/reviews/${review._id}/react`)
      .set("Cookie", asUser(reactor))
      .send({ type: "love" });

    expect(res.status).toBe(400);
  });

  it("returns 404 for a non-existent review", async () => {
    const { user: reactor } = await createUser();

    const res = await request(app)
      .put("/api/reviews/000000000000000000000000/react")
      .set("Cookie", asUser(reactor))
      .send({ type: "like" });

    expect(res.status).toBe(404);
  });
});
