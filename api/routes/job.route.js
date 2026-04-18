import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { verifyClient } from "../middleware/verifyClient.js";

import {
  createJob,
  getMyJobsForClient,
  getJob,
  getJobWithApplicationForTasker,
  getJobWithApplicationsForClient,
  getJobsForTasker,
  getJobForTasker,
  applyToJob
} from "../controllers/job.controller.js";

const router = express.Router();


router.get("/my-jobs", verifyToken, verifyClient, getMyJobsForClient);

router.get("/:id/applications", verifyToken, verifyClient, getJobWithApplicationsForClient);
router.get("/:id/details", verifyToken, verifyClient, getJobWithApplicationForTasker);

router.get("/:id/tasker", verifyToken, getJobForTasker);
router.get("/", verifyToken, getJobsForTasker);

router.get("/:id", verifyClient, getJob);

router.post("/:id/apply", verifyToken, applyToJob);
router.post("/", verifyToken, verifyClient, createJob);

export default router;