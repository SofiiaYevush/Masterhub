import express from "express";

import {
  createSetupIntent,
  handleStripeWebhook,
} from "../controllers/stripe.controller.js";

import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/setup-intent", verifyToken, createSetupIntent);

const handleWebhook = (req, res) => {
  handleStripeWebhook(req, res);
};

export default {
  router,
  handleWebhook,
};