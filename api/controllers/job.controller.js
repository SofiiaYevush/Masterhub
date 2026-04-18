import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
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

export const getJobWithApplicationForTasker = async (req, res, next) => {
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

export const getJobWithApplicationsForClient = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("clientId", "username img country");

        if (!job) return next(createError(404, "Job not found"));

        // if (job.clientId.toString() !== req.userId) {
        //     return next(createError(403, "Not allowed"));
        // }

        const applications = await Application.find({ jobId: job._id })
            .populate("taskerId", "username img desc");

        res.status(200).json({
            ...job._doc,
            applications,
        });
    } catch (err) {
        next(err);
    }
};

export const getMyJobsForClient = async (req, res, next) => {
    try {
        const jobs = await Job.find({ clientId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        next(err.message);
    }
};

export const getJobsForTasker = async (req, res, next) => {
    const q = req.query;

    const filters = {
        status: "active", // тільки активні jobs для таскерів
        ...(q.cat && { category: q.cat }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    try {
        const jobs = await Job.find(filters).sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (err) {
        next(err);
    }
};

// НЕ використовується
export const getJobForTasker = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const userId = req.userId;

        const job = await Job.findById(jobId);
        if (!job) return next(createError(404, "Job not found"));

        const application = await Application.findOne({
            jobId,
            taskerId: userId,
        });

        res.status(200).json({
            ...job._doc,
            alreadyApplied: !!application,
            applicationId: application?._id || null, // якщо потрібно для редагування
        });
    } catch (err) {
        next(err);
    }
};

export const applyToJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const userId = req.userId;

        const job = await Job.findById(jobId);
        if (!job) return next(createError(404, "Job not found"));

        if (job.status !== "active") {
            return next(createError(400, "Job is not active"));
        }

        const existing = await Application.findOne({
            jobId,
            taskerId: userId,
        });
        if (existing) return next(createError(400, "Already applied"));

        // 3. Створюємо нову заявку
        const newApplication = new Application({
            jobId,
            taskerId: userId,
            coverLetter: req.body.coverLetter || "",
            proposedPrice: req.body.proposedPrice || job.budget,
        });

        const saved = await newApplication.save();

        res.status(201).json({
            message: "Application submitted successfully",
            application: saved,
        });
    } catch (err) {
        next(err);
    }
};