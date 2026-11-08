import Job from "../../models/job.model.js";

export const buildJobPayload = (overrides = {}) => ({
  title: "Need a plumber",
  desc: "Fix a leaking pipe in the kitchen",
  category: "plumbing",
  budget: 1000,
  isBudgetNegotiable: false,
  location: "Lviv",
  skills: ["plumbing"],
  languageVisibility: { en: false, uk: true },
  ...overrides,
});

export const createJob = (overrides = {}) => {
  if (!overrides.clientId) {
    throw new Error("createJob requires a clientId override");
  }
  return Job.create(buildJobPayload(overrides));
};
