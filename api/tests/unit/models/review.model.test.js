import { describe, it, expect } from "vitest";
import Review from "../../../models/review.model.js";

describe("Review model", () => {
  it("accepts a valid review and defaults likes/dislikes to []", () => {
    const review = new Review({ gigId: "gig1", userId: "user1", star: 4, desc: "Nice!" });

    expect(review.validateSync()).toBeUndefined();
    expect(review.likes).toEqual([]);
    expect(review.dislikes).toEqual([]);
  });

  it("requires gigId, userId, star and desc", () => {
    const err = new Review({}).validateSync();

    ["gigId", "userId", "star", "desc"].forEach((field) =>
      expect(err.errors[field], field).toBeDefined()
    );
  });

  it("rejects a star rating outside 1-5", () => {
    const review = new Review({ gigId: "gig1", userId: "user1", star: 6, desc: "x" });

    expect(review.validateSync().errors.star).toBeDefined();
  });

  it("accepts every value from 1 to 5", () => {
    [1, 2, 3, 4, 5].forEach((star) => {
      const review = new Review({ gigId: "gig1", userId: "user1", star, desc: "x" });
      expect(review.validateSync()).toBeUndefined();
    });
  });
});
