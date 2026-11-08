import Application from "../../models/application.model.js";

export const createApplication = (overrides = {}) => {
  if (!overrides.jobId || !overrides.taskerId) {
    throw new Error("createApplication requires jobId and taskerId");
  }
  return Application.create({
    coverLetter: "I would love to help with this job.",
    proposedPrice: 800,
    ...overrides,
  });
};
