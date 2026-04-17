import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { verifyClient } from "../middleware/verifyClient.js";

import {
  createJob,
  getMyJobs,
  getJob,
  getJobWithApplications,
  getJobs,
  getJobForTasker,
  applyToJob
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/", verifyToken, verifyClient, createJob);
router.get("/my-jobs", verifyToken, verifyClient, getMyJobs);
// деталі job (без applications — публічна сторінка)
router.get("/:id", verifyClient, getJob);
// деталі job + applications (тільки для клієнта)
router.get("/:id/details", verifyToken, verifyClient, getJobWithApplications);

// список jobs (для таскерів)
router.get("/", verifyToken, getJobs);
router.get("/:id", verifyToken, getJobForTasker);
router.post("/:id/apply", verifyToken, applyToJob);

export default router;