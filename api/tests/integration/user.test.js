import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { asUser } from "../setup/auth.js";
import { createUser, createSeller } from "../factories/user.factory.js";
import { createGig } from "../factories/gig.factory.js";
import { createJob } from "../factories/job.factory.js";
import { createReview } from "../factories/review.factory.js";

useDatabase();

describe("GET /api/users/:id", () => {
  it("returns the user for a valid id", async () => {
    const { user } = await createUser();

    const res = await request(app).get(`/api/users/${user._id}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(user.username);
  });
});

describe("PUT /api/users/:id", () => {
  it("lets a user update their own profile", async () => {
    const { user } = await createUser();

    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .set("Cookie", asUser(user))
      .send({ country: "Ukraine" });

    expect(res.status).toBe(200);
    expect(res.body.country).toBe("Ukraine");
  });

  it("forbids updating someone else's profile", async () => {
    const { user: owner } = await createUser();
    const { user: intruder } = await createUser();

    const res = await request(app)
      .put(`/api/users/${owner._id}`)
      .set("Cookie", asUser(intruder))
      .send({ country: "Hacked" });

    expect(res.status).toBe(403);
  });

  it("requires authentication", async () => {
    const { user } = await createUser();

    const res = await request(app).put(`/api/users/${user._id}`).send({ country: "X" });

    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/users/:id", () => {
  it("lets a user delete their own account", async () => {
    const { user } = await createUser();

    const res = await request(app)
      .delete(`/api/users/${user._id}`)
      .set("Cookie", asUser(user));

    expect(res.status).toBe(200);
  });

  it("forbids deleting someone else's account", async () => {
    const { user: victim } = await createUser();
    const { user: intruder } = await createUser();

    const res = await request(app)
      .delete(`/api/users/${victim._id}`)
      .set("Cookie", asUser(intruder));

    expect(res.status).toBe(403);
  });
});

describe("PUT /api/users/:id/password", () => {
  it("updates the password when oldPassword is correct", async () => {
    const { user, plainPassword } = await createUser();

    const res = await request(app)
      .put(`/api/users/${user._id}/password`)
      .set("Cookie", asUser(user))
      .send({ oldPassword: plainPassword, newPassword: "NewPassword456!" });

    expect(res.status).toBe(200);
  });

  it("rejects an incorrect oldPassword", async () => {
    const { user } = await createUser();

    const res = await request(app)
      .put(`/api/users/${user._id}/password`)
      .set("Cookie", asUser(user))
      .send({ oldPassword: "wrong", newPassword: "NewPassword456!" });

    expect(res.status).toBe(400);
  });

  // Documents an existing gap: the controller never checks req.userId against
  // req.params.id, so any authenticated user can currently change *anyone's*
  // password. This test pins today's behavior; it should start failing (and
  // be updated to expect 403) once that authorization check is added.
  it("[known gap] does not currently verify the caller owns the account", async () => {
    const { user: victim, plainPassword } = await createUser();
    const { user: intruder } = await createUser();

    const res = await request(app)
      .put(`/api/users/${victim._id}/password`)
      .set("Cookie", asUser(intruder))
      .send({ oldPassword: plainPassword, newPassword: "Hacked456!" });

    expect(res.status).toBe(200);
  });
});

describe("GET /api/users/:id/public-profile", () => {
  it("returns gigs and reviews for a seller", async () => {
    const { user: seller } = await createSeller();
    const gig = await createGig({ userId: seller._id.toString() });
    const { user: reviewer } = await createUser();
    await createReview({ gigId: gig._id.toString(), userId: reviewer._id.toString(), star: 5 });

    const res = await request(app).get(`/api/users/${seller._id}/public-profile`);

    expect(res.status).toBe(200);
    expect(res.body.gigs).toHaveLength(1);
    expect(res.body.stats.reviewsCount).toBe(1);
    expect(res.body.stats.averageRating).toBe(5);
  });

  it("returns jobs for a client", async () => {
    const { user: client } = await createUser();
    await createJob({ clientId: client._id });

    const res = await request(app).get(`/api/users/${client._id}/public-profile`);

    expect(res.status).toBe(200);
    expect(res.body.jobs).toHaveLength(1);
  });

  it("returns 404 for a non-existent user", async () => {
    const res = await request(app).get(
      "/api/users/000000000000000000000000/public-profile"
    );

    expect(res.status).toBe(404);
  });
});
