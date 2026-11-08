import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { useDatabase } from "../setup/db.js";
import { asUser } from "../setup/auth.js";
import { createUser, createSeller } from "../factories/user.factory.js";
import { createGig } from "../factories/gig.factory.js";
import { createOrder } from "../factories/order.factory.js";

useDatabase();

describe("POST /api/orders", () => {
  it("creates an order for a fixed-price gig", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString(), price: 750 });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", asUser(client))
      .send({ gigId: gig._id });

    expect(res.status).toBe(201);
    expect(res.body.price).toBe(750);
    expect(res.body.taskerId).toBe(seller._id.toString());
    expect(res.body.clientId).toBe(client._id.toString());
  });

  it("leaves price undefined for a negotiable gig", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({
      userId: seller._id.toString(),
      price: undefined,
      isPriceNegotiable: true,
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", asUser(client))
      .send({ gigId: gig._id });

    expect(res.status).toBe(201);
    expect(res.body.price).toBeUndefined();
    expect(res.body.isPriceNegotiable).toBe(true);
  });

  it("rejects ordering your own gig", async () => {
    const { user: seller } = await createSeller();
    const gig = await createGig({ userId: seller._id.toString() });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", asUser(seller))
      .send({ gigId: gig._id });

    expect(res.status).toBe(400);
  });

  it("returns 404 for a non-existent gig", async () => {
    const { user: client } = await createUser();

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", asUser(client))
      .send({ gigId: "000000000000000000000000" });

    expect(res.status).toBe(404);
  });
});

describe("GET /api/orders", () => {
  it("returns orders where the caller is either the client or the tasker", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const { user: stranger } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    await createOrder({ gigId: gig._id, taskerId: seller._id, clientId: client._id });

    const asClientRes = await request(app).get("/api/orders").set("Cookie", asUser(client));
    const asSellerRes = await request(app).get("/api/orders").set("Cookie", asUser(seller));
    const asStrangerRes = await request(app).get("/api/orders").set("Cookie", asUser(stranger));

    expect(asClientRes.body).toHaveLength(1);
    expect(asSellerRes.body).toHaveLength(1);
    expect(asStrangerRes.body).toHaveLength(0);
  });
});

describe("DELETE /api/orders/:id (cancel)", () => {
  it("lets the client cancel their own order", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    const order = await createOrder({ gigId: gig._id, taskerId: seller._id, clientId: client._id });

    const res = await request(app)
      .delete(`/api/orders/${order._id}`)
      .set("Cookie", asUser(client));

    expect(res.status).toBe(200);
  });

  it("forbids the tasker from cancelling the order", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    const order = await createOrder({ gigId: gig._id, taskerId: seller._id, clientId: client._id });

    const res = await request(app)
      .delete(`/api/orders/${order._id}`)
      .set("Cookie", asUser(seller));

    expect(res.status).toBe(403);
  });
});

describe("PUT /api/orders/:id/complete", () => {
  it("lets the tasker mark the order complete", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    const order = await createOrder({ gigId: gig._id, taskerId: seller._id, clientId: client._id });

    const res = await request(app)
      .put(`/api/orders/${order._id}/complete`)
      .set("Cookie", asUser(seller));

    expect(res.status).toBe(200);
    expect(res.body.isCompleted).toBe(true);
  });

  it("forbids the client from completing the order", async () => {
    const { user: seller } = await createSeller();
    const { user: client } = await createUser();
    const gig = await createGig({ userId: seller._id.toString() });
    const order = await createOrder({ gigId: gig._id, taskerId: seller._id, clientId: client._id });

    const res = await request(app)
      .put(`/api/orders/${order._id}/complete`)
      .set("Cookie", asUser(client));

    expect(res.status).toBe(403);
  });
});
