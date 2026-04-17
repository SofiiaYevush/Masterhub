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

// accept application
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

// decline application
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