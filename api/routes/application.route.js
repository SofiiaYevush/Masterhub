import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { verifyClient } from "../middleware/verifyClient.js";
import {
    acceptApplication,
    declineApplication
} from "../controllers/application.controller.js";

const router = express.Router();

router.put("/:id/accept", verifyToken, verifyClient, acceptApplication);
router.put("/:id/decline", verifyToken, verifyClient, declineApplication);

export default router;