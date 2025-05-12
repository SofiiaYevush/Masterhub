import express from "express";
import { loginAdmin, getAllUsers, blockUser, unblockUser, deleteAnyGig } from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.patch("/users/:id/block", verifyToken, verifyAdmin, blockUser);
router.patch("/users/:id/unblock", verifyToken, verifyAdmin, unblockUser);
router.delete("/gigs/:id", verifyToken, verifyAdmin, deleteAnyGig);

export default router;
