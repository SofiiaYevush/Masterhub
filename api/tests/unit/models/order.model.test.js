import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import Order from "../../../models/order.model.js";

const gigId = new mongoose.Types.ObjectId();
const taskerId = new mongoose.Types.ObjectId();
const clientId = new mongoose.Types.ObjectId();

describe("Order model", () => {
  it("accepts a valid order and defaults isCompleted/isPriceNegotiable to false", () => {
    const order = new Order({ gigId, taskerId, clientId, price: 500 });

    expect(order.validateSync()).toBeUndefined();
    expect(order.isCompleted).toBe(false);
    expect(order.isPriceNegotiable).toBe(false);
  });

  it("requires gigId, taskerId and clientId", () => {
    const err = new Order({}).validateSync();

    ["gigId", "taskerId", "clientId"].forEach((field) =>
      expect(err.errors[field], field).toBeDefined()
    );
  });
});
