import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import Application from "../../../models/application.model.js";

const jobId = new mongoose.Types.ObjectId();
const taskerId = new mongoose.Types.ObjectId();

describe("Application model", () => {
  it("accepts a valid application and defaults status to pending", () => {
    const application = new Application({ jobId, taskerId });

    expect(application.validateSync()).toBeUndefined();
    expect(application.status).toBe("pending");
  });

  it("requires jobId and taskerId", () => {
    const err = new Application({}).validateSync();

    expect(err.errors.jobId).toBeDefined();
    expect(err.errors.taskerId).toBeDefined();
  });

  it("rejects a status outside the allowed enum", () => {
    const application = new Application({ jobId, taskerId, status: "banana" });

    expect(application.validateSync().errors.status).toBeDefined();
  });

  it("accepts every documented status", () => {
    ["pending", "accepted", "rejected", "withdrawn"].forEach((status) => {
      const application = new Application({ jobId, taskerId, status });
      expect(application.validateSync()).toBeUndefined();
    });
  });
});
