import express from "express";
import { deleteUser, getUser, updateUser, updatePassword } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", getUser);
router.put("/:id", verifyToken, updateUser);
router.put("/:id/password", verifyToken, updatePassword);

export default router;