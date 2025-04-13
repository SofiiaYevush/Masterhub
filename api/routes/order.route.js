import express from "express";
import { createOrder, getOrdersForUser } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { cancelOrder } from "../controllers/order.controller.js";
import { completeOrder } from "../controllers/order.controller.js";


const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrdersForUser);
router.delete("/:id", verifyToken, cancelOrder);
router.put("/:id/complete", verifyToken, completeOrder);

export default router;
