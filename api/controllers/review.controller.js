import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Sellers can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this gig!")
      );

    //TODO: check if the user purchased the gig.

    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};
export const deleteReview = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const reactToReview = async (req, res, next) => {
  const { type } = req.body;
  const reviewId = req.params.id;
  const userId = req.userId;

  if (!["like", "dislike"].includes(type)) {
    return next(createError(400, "Invalid reaction type"));
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return next(createError(404, "Review not found"));
    }

    const hasLiked = review.likes?.includes(userId);
    const hasDisliked = review.dislikes?.includes(userId);

    if (type === "like") {
      if (hasLiked) {
        review.likes.pull(userId);
      } else {
        review.likes.push(userId);
        if (hasDisliked) {
          review.dislikes.pull(userId);
        }
      }
    }

    if (type === "dislike") {
      if (hasDisliked) {
        review.dislikes.pull(userId);
      } else {
        review.dislikes.push(userId);
        if (hasLiked) {
          review.likes.pull(userId);
        }
      }
    }

    await review.save();
    res.status(200).send(review);
  } catch (err) {
    next(err);
  }
};