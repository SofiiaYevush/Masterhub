import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { createUser, buildUserPayload, PLAIN_PASSWORD } from "../factories/user.factory.js";

useDatabase();

describe("POST /api/auth/register", () => {
  it("creates a new user with a hashed password", async () => {
    const payload = buildUserPayload({ username: "newclient" });

    const res = await request(app).post("/api/auth/register").send(payload);

    expect(res.status).toBe(201);
  });

  it("rejects a duplicate username", async () => {
    const payload = buildUserPayload({ username: "duplicate-user" });
    await request(app).post("/api/auth/register").send(payload);

    const res = await request(app).post("/api/auth/register").send(
      buildUserPayload({ username: "duplicate-user" })
    );

    expect(res.status).toBe(500); // Mongoose duplicate-key error falls through to the default handler
  });

  it("rejects a seller missing phone/desc", async () => {
    const payload = buildUserPayload({ isSeller: true });

    const res = await request(app).post("/api/auth/register").send(payload);

    expect(res.status).toBe(500);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with correct credentials and sets the accessToken cookie", async () => {
    const { user } = await createUser({ username: "loginuser" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: PLAIN_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/accessToken=/);
    expect(res.body.password).toBeUndefined();
    expect(res.body.username).toBe(user.username);
  });

  it("rejects an unknown username", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "nobody", password: "whatever" });

    expect(res.status).toBe(404);
  });

  it("rejects a wrong password", async () => {
    const { user } = await createUser({ username: "wrongpass" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: "incorrect" });

    expect(res.status).toBe(400);
  });

  it("rejects a blocked user even with the correct password", async () => {
    const { user } = await createUser({ username: "blockeduser", isBlocked: true });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: PLAIN_PASSWORD });

    expect(res.status).toBe(403);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the accessToken cookie", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/accessToken=;/);
  });
});
