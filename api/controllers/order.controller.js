import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.body.gigId);
    if (!gig) return next(createError(404, "Gig not found"));

    if (gig.userId === req.userId) {
      return next(createError(400, "You cannot order your own gig."));
    }

    const newOrder = new Order({
      gigId: gig._id,
      taskerId: gig.userId,
      clientId: req.userId,
      price: gig.isPriceNegotiable ? undefined : gig.price,
      isPriceNegotiable: gig.isPriceNegotiable,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

export const getOrdersForUser = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ taskerId: req.userId }, { clientId: req.userId }],
    })
      .populate("gigId")
      .populate("clientId", "username email phone img")
      .populate("taskerId", "username img phone");
    
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return next(createError(404, "Order not found"));

    if (order.clientId.toString() !== req.userId) {
      return next(createError(403, "You can cancel only your own orders"));
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).send("Order cancelled");
  } catch (err) {
    next(err);
  }
};

export const completeOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return next(createError(404, "Order not found"));

    if (order.taskerId.toString() !== req.userId) {
      return next(createError(403, "Only the tasker can complete the order"));
    }

    order.isCompleted = true;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
};
