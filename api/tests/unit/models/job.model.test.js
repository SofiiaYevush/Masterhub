import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import Job from "../../../models/job.model.js";
import { buildJobPayload } from "../../factories/job.factory.js";

const clientId = new mongoose.Types.ObjectId();

describe("Job model", () => {
  it("accepts a fully valid job", () => {
    const job = new Job(buildJobPayload({ clientId }));

    expect(job.validateSync()).toBeUndefined();
  });

  it("requires clientId, title, desc and category", () => {
    const err = new Job({}).validateSync();

    ["clientId", "title", "desc", "category"].forEach((field) =>
      expect(err.errors[field], field).toBeDefined()
    );
  });

  it("defaults status to active, isClosed/isDeleted to false", () => {
    const job = new Job(buildJobPayload({ clientId }));

    expect(job.status).toBe("active");
    expect(job.isClosed).toBe(false);
    expect(job.isDeleted).toBe(false);
  });

  it("rejects a status outside the allowed enum", () => {
    const job = new Job(buildJobPayload({ clientId, status: "banana" }));

    expect(job.validateSync().errors.status).toBeDefined();
  });

  it("defaults languageVisibility to { en: false, uk: true }", () => {
    const job = new Job(buildJobPayload({ clientId, languageVisibility: undefined }));

    expect(job.languageVisibility.en).toBe(false);
    expect(job.languageVisibility.uk).toBe(true);
  });
});
