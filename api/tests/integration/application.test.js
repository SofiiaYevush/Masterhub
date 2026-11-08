import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { asUser } from "../setup/auth.js";
import { createUser, createSeller } from "../factories/user.factory.js";
import { createJob } from "../factories/job.factory.js";
import { createApplication } from "../factories/application.factory.js";
import Job from "../../models/job.model.js";
import Application from "../../models/application.model.js";

useDatabase();

describe("PUT /api/applications/:id/accept", () => {
  it("accepts the application, hires the job and rejects the other applicants", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const { user: otherTasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    const application = await createApplication({ jobId: job._id, taskerId: tasker._id });
    const otherApplication = await createApplication({
      jobId: job._id,
      taskerId: otherTasker._id,
    });

    const res = await request(app)
      .put(`/api/applications/${application._id}/accept`)
      .set("Cookie", asUser(client));

    expect(res.status).toBe(200);
    expect(res.body.application.status).toBe("accepted");

    const updatedJob = await Job.findById(job._id);
    expect(updatedJob.status).toBe("hired");

    const rejected = await Application.findById(otherApplication._id);
    expect(rejected.status).toBe("rejected");
  });

  it("forbids a client who doesn't own the job", async () => {
    const { user: owner } = await createUser();
    const { user: otherClient } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: owner._id });
    const application = await createApplication({ jobId: job._id, taskerId: tasker._id });

    const res = await request(app)
      .put(`/api/applications/${application._id}/accept`)
      .set("Cookie", asUser(otherClient));

    expect(res.status).toBe(403);
  });
});

describe("PUT /api/applications/:id/decline", () => {
  it("declines the application", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    const application = await createApplication({ jobId: job._id, taskerId: tasker._id });

    const res = await request(app)
      .put(`/api/applications/${application._id}/decline`)
      .set("Cookie", asUser(client));

    expect(res.status).toBe(200);
    expect(res.body.application.status).toBe("rejected");
  });
});

describe("GET /api/applications/my-applications", () => {
  it("returns only the caller's own applications", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const { user: otherTasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    await createApplication({ jobId: job._id, taskerId: tasker._id });
    await createApplication({ jobId: job._id, taskerId: otherTasker._id });

    const res = await request(app)
      .get("/api/applications/my-applications")
      .set("Cookie", asUser(tasker));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("filters by status", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const jobA = await createJob({ clientId: client._id });
    const jobB = await createJob({ clientId: client._id });
    await createApplication({ jobId: jobA._id, taskerId: tasker._id, status: "pending" });
    await createApplication({ jobId: jobB._id, taskerId: tasker._id, status: "withdrawn" });

    const res = await request(app)
      .get("/api/applications/my-applications")
      .query({ status: "withdrawn" })
      .set("Cookie", asUser(tasker));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe("withdrawn");
  });
});

describe("PUT /api/applications/:id/withdraw", () => {
  it("lets the owning tasker withdraw a pending application", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    const application = await createApplication({ jobId: job._id, taskerId: tasker._id });

    const res = await request(app)
      .put(`/api/applications/${application._id}/withdraw`)
      .set("Cookie", asUser(tasker));

    expect(res.status).toBe(200);
  });

  it("forbids withdrawing someone else's application", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const { user: intruder } = await createSeller();
    const job = await createJob({ clientId: client._id });
    const application = await createApplication({ jobId: job._id, taskerId: tasker._id });

    const res = await request(app)
      .put(`/api/applications/${application._id}/withdraw`)
      .set("Cookie", asUser(intruder));

    expect(res.status).toBe(403);
  });

  it("rejects withdrawing an already-accepted application", async () => {
    const { user: client } = await createUser();
    const { user: tasker } = await createSeller();
    const job = await createJob({ clientId: client._id });
    const application = await createApplication({
      jobId: job._id,
      taskerId: tasker._id,
      status: "accepted",
    });

    const res = await request(app)
      .put(`/api/applications/${application._id}/withdraw`)
      .set("Cookie", asUser(tasker));

    expect(res.status).toBe(400);
  });
});
