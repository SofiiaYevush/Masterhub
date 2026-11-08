import Order from "../../models/order.model.js";

export const createOrder = (overrides = {}) => {
  if (!overrides.gigId || !overrides.taskerId || !overrides.clientId) {
    throw new Error("createOrder requires gigId, taskerId and clientId");
  }
  return Order.create({
    price: 500,
    isPriceNegotiable: false,
    isCompleted: false,
    ...overrides,
  });
};
