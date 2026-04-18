import Application from "../models/application.model.js";
import createError from "../utils/createError.js";
import Job from "../models/job.model.js";

// get single job
export const getJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('clientId', 'username img');
        if (!job) return next(createError(404, "Job not found"));

        const applications = await Application.find({ jobId: job._id })
            .populate("taskerId", "username img desc");

        res.status(200).json({ ...job._doc, applications });
    } catch (err) {
        next(err);
    }
};

// accept application - for client
export const acceptApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return next(createError(404, "Application not found"));

        const job = await Job.findById(application.jobId);
        if (job.clientId.toString() !== req.userId) return next(createError(403, "Not your job"));

        // найняти таскера
        application.status = "accepted";
        await application.save();

        // оновити Job статус
        job.status = "hired";
        await job.save();

        // відхилити інші заявки
        await Application.updateMany(
            { jobId: job._id, _id: { $ne: application._id } },
            { status: "rejected" }
        );

        res.status(200).json({ message: "Application accepted", application });
    } catch (err) {
        next(err);
    }
};

// decline application - for client
export const declineApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return next(createError(404, "Application not found"));

        const job = await Job.findById(application.jobId);
        if (job.clientId.toString() !== req.userId) return next(createError(403, "Not your job"));

        application.status = "rejected";
        await application.save();

        res.status(200).json({ message: "Application declined", application });
    } catch (err) {
        next(err);
    }
};
//for tasker
export const getMyApplications = async (req, res, next) => {
    try {
        const q = req.query;

        const filter = {
            taskerId: req.userId,
            ...(q.status && { status: q.status }),
        };

        const applications = await Application.find(filter)
            .populate("jobId", "title category budget location status")
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (err) {
        next(err);
    }
};

// withdraw application - for tasker
export const withdrawApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return next(createError(404, "Application not found"));
        }

        // ❗ тільки власник може скасувати
        if (application.taskerId.toString() !== req.userId) {
            return next(createError(403, "Not allowed"));
        }

        // ❗ не можна якщо вже прийнято
        if (application.status === "accepted") {
            return next(createError(400, "Cannot withdraw accepted application"));
        }

        application.status = "withdrawn";
        await application.save();

        res.status(200).json({ message: "Application withdrawn" });
    } catch (err) {
        next(err);
    }
};