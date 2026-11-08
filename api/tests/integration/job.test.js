import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { asUser } from "../setup/auth.js";
import { createUser, createSeller } from "../factories/user.factory.js";
import { buildJobPayload, createJob } from "../factories/job.factory.js";
import { createApplication } from "../factories/application.factory.js";

useDatabase();

describe("POST /api/jobs", () => {
  it("lets a client create a job", async () => {
    const { user: client } = await createUser();

    const res = await request(app)
      .post("/api/jobs")
      .set("Cookie", asUser(client))
      .send(buildJobPayload());

    expect(res.status).toBe(201);
    expect(res.body.clientId).toBe(client._id.toString());
  });

  it("rejects a seller creating a job", async () => {
    const { user: seller } = await createSeller();

    const res = await request(app)
      .post("/api/jobs")
      .set("Cookie", asUser(seller))
      .send(buildJobPayload());

    expect(res.status).toBe(403);
  });
});

describe("GET /api/jobs (tasker feed)", () => {
  it("only returns active, non-deleted jobs", async () => {
    const { user: client } = await createUser();
    await createJob({ clientId: client._id, status: "active" });
    await createJob({ clientId: client._id, status: "closed" });
    await createJob({ clientId: client._id, isDeleted: true });

    const res = await request(app).get("/api/jobs").set("Cookie", asUser(client));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("filters by category and search term", async () => {
    const { user: client } = await createUser();
    await createJob({ clientId: client._id, category: "plumbing", title: "Fix a pipe" });
    await createJob({ clientId: client._id, category: "cleaning", title: "Deep clean" });

    const res = await request(app)
      .get("/api/jobs")
      .query({ cat: "plumbing" })
      .set("Cookie", asUser(client));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe("plumbing");
  });
});

describe("GET /api/jobs/my-jobs", () => {
  it("returns only the caller's own jobs, with application counts", async () => {
    const { user: client } = await createUser();
    const { user: otherClient } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    await createJob({ clientId: otherClient._id });
    await createApplication({ jobId: job._id, taskerId: tasker._id });

    const res = await request(app).get("/api/jobs/my-jobs").set("Cookie", asUser(client));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].applicationsCount).toBe(1);
  });

  it("rejects a seller", async () => {
    const { user: seller } = await createSeller();

    const res = await request(app).get("/api/jobs/my-jobs").set("Cookie", asUser(seller));

    expect(res.status).toBe(403);
  });
});

describe("POST /api/jobs/:id/apply", () => {
  it("lets a tasker apply to an active job", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id });

    const res = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set("Cookie", asUser(tasker))
      .send({ coverLetter: "I can help!", proposedPrice: 900 });

    expect(res.status).toBe(201);
    expect(res.body.application.taskerId).toBe(tasker._id.toString());
  });

  it("rejects a second application from the same tasker", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    await createApplication({ jobId: job._id, taskerId: tasker._id });

    const res = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set("Cookie", asUser(tasker));

    expect(res.status).toBe(400);
  });

  it("rejects applying to a non-active job", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id, status: "closed" });

    const res = await request(app)
      .post(`/api/jobs/${job._id}/apply`)
      .set("Cookie", asUser(tasker));

    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/jobs/:id (soft delete)", () => {
  it("soft-deletes the owner's job", async () => {
    const { user: client } = await createUser();
    const job = await createJob({ clientId: client._id });

    const res = await request(app)
      .delete(`/api/jobs/${job._id}`)
      .set("Cookie", asUser(client));

    expect(res.status).toBe(200);
  });

  it("forbids deleting someone else's job", async () => {
    const { user: owner } = await createUser();
    const { user: intruder } = await createUser();
    const job = await createJob({ clientId: owner._id });

    const res = await request(app)
      .delete(`/api/jobs/${job._id}`)
      .set("Cookie", asUser(intruder));

    expect(res.status).toBe(403);
  });

  it("rejects deleting an already-deleted job", async () => {
    const { user: client } = await createUser();
    const job = await createJob({ clientId: client._id, isDeleted: true });

    const res = await request(app)
      .delete(`/api/jobs/${job._id}`)
      .set("Cookie", asUser(client));

    expect(res.status).toBe(400);
  });
});

describe("GET /api/jobs/:id/details", () => {
  it("returns the job with applications for its owning client", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    await createApplication({ jobId: job._id, taskerId: tasker._id });

    const res = await request(app)
      .get(`/api/jobs/${job._id}/details`)
      .set("Cookie", asUser(client));

    expect(res.status).toBe(200);
    expect(res.body.applications).toHaveLength(1);
  });

  it("forbids a different client from viewing it", async () => {
    const { user: owner } = await createUser();
    const { user: otherClient } = await createUser();
    const job = await createJob({ clientId: owner._id });

    const res = await request(app)
      .get(`/api/jobs/${job._id}/details`)
      .set("Cookie", asUser(otherClient));

    expect(res.status).toBe(403);
  });
});

describe("GET /api/jobs/:id/applications", () => {
  it("returns applications for the job", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    await createApplication({ jobId: job._id, taskerId: tasker._id });

    const res = await request(app)
      .get(`/api/jobs/${job._id}/applications`)
      .set("Cookie", asUser(client));

    expect(res.status).toBe(200);
    expect(res.body.applications).toHaveLength(1);
  });

  // Known gap: the ownership check in this controller is commented out, so
  // any authenticated client can currently view another client's applicants.
  it("[known gap] does not currently restrict this to the job's own client", async () => {
    const { user: owner } = await createUser();
    const { user: otherClient } = await createUser();
    const job = await createJob({ clientId: owner._id });

    const res = await request(app)
      .get(`/api/jobs/${job._id}/applications`)
      .set("Cookie", asUser(otherClient));

    expect(res.status).toBe(200);
  });
});

describe("GET /api/jobs/:id", () => {
  it("returns the job for an authenticated client", async () => {
    const { user: client } = await createUser();
    const job = await createJob({ clientId: client._id });

    const res = await request(app).get(`/api/jobs/${job._id}`).set("Cookie", asUser(client));

    expect(res.status).toBe(200);
  });

  // Known gap: this route only applies verifyClient (not verifyToken), and
  // verifyClient treats a missing/absent token's undefined isSeller/isAdmin
  // as "not a seller, not an admin" - i.e. it lets unauthenticated requests
  // through entirely. This test pins that current (unintended) behavior.
  it("[known gap] is reachable with no authentication at all", async () => {
    const { user: client } = await createUser();
    const job = await createJob({ clientId: client._id });

    const res = await request(app).get(`/api/jobs/${job._id}`);

    expect(res.status).toBe(200);
  });
});
