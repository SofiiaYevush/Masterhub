import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { asUser } from "../setup/auth.js";
import { createUser, createAdmin } from "../factories/user.factory.js";
import { createGig } from "../factories/gig.factory.js";

useDatabase();

describe("POST /api/admin/login", () => {
  it("logs in with the configured admin credentials", async () => {
    const res = await request(app)
      .post("/api/admin/login")
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/accessToken=/);
  });

  it("rejects incorrect admin credentials", async () => {
    const res = await request(app)
      .post("/api/admin/login")
      .send({ username: process.env.ADMIN_USERNAME, password: "wrong" });

    expect(res.status).toBe(401);
  });
});

describe("admin-only user management", () => {
  it("rejects a non-admin from listing users", async () => {
    const { user } = await createUser();

    const res = await request(app).get("/api/admin/users").set("Cookie", asUser(user));

    expect(res.status).toBe(403);
  });

  it("requires authentication to list users", async () => {
    const res = await request(app).get("/api/admin/users");

    expect(res.status).toBe(401);
  });

  it("lets an admin list, block and unblock users", async () => {
    const { user: admin } = await createAdmin();
    const { user: target } = await createUser();
    const adminCookie = asUser(admin);

    const list = await request(app).get("/api/admin/users").set("Cookie", adminCookie);
    expect(list.status).toBe(200);
    expect(list.body.some((u) => u._id === target._id.toString())).toBe(true);
    expect(list.body.every((u) => u.password === undefined)).toBe(true);

    const blocked = await request(app)
      .patch(`/api/admin/users/${target._id}/block`)
      .set("Cookie", adminCookie);
    expect(blocked.status).toBe(200);

    const unblocked = await request(app)
      .patch(`/api/admin/users/${target._id}/unblock`)
      .set("Cookie", adminCookie);
    expect(unblocked.status).toBe(200);
  });

  it("lets an admin delete any gig", async () => {
    const { user: admin } = await createAdmin();
    const gig = await createGig();

    const res = await request(app)
      .delete(`/api/admin/gigs/${gig._id}`)
      .set("Cookie", asUser(admin));

    expect(res.status).toBe(200);
  });
});
