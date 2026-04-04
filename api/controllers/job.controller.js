import Job from "../models/job.model.js";
import createError from "../utils/createError.js";

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("clientId", "username img country");

    if (!job) {
      return next(createError(404, "Job not found"));
    }

    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req, res, next) => {
    try {
        if (req.isSeller) {
            return next(createError(403, "Only clients can create jobs"));
        }

        const newJob = new Job({
            clientId: req.userId,
            ...req.body,
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        next(err);
    }
};

export const getJobWithApplications = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return next(createError(404, "Job not found"));

        if (job.clientId.toString() !== req.userId) {
            return next(createError(403, "Not allowed"));
        }

        const applications = await Application.find({ jobId: job._id })
            .populate("taskerId", "username img desc");

        res.status(200).json({
            job,
            applications,
        });
    } catch (err) {
        next(err);
    }
};

export const getMyJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ clientId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        next(err);
    }
};

