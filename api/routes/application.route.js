import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { verifyClient } from "../middleware/verifyClient.js";
import {
    acceptApplication,
    declineApplication,
    getMyApplications,
    withdrawApplication
} from "../controllers/application.controller.js";

const router = express.Router();

router.put("/:id/accept", verifyToken, verifyClient, acceptApplication);
router.put("/:id/decline", verifyToken, verifyClient, declineApplication);
router.get("/my-applications", verifyToken, getMyApplications);
router.put("/:id/withdraw", verifyToken, withdrawApplication);

export default router;