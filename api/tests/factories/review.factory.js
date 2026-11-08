import Review from "../../models/review.model.js";

export const createReview = (overrides = {}) => {
  if (!overrides.gigId || !overrides.userId) {
    throw new Error("createReview requires gigId and userId");
  }
  return Review.create({
    star: 5,
    desc: "Great service, highly recommend!",
    likes: [],
    dislikes: [],
    ...overrides,
  });
};
