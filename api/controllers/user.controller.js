import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";

import Gig from "../models/gig.model.js";
import Job from "../models/job.model.js";
import Review from "../models/review.model.js";

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
};
export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can update only your account!"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      return next(createError(400, "Невірний старий пароль"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).send("Пароль оновлено!");
  } catch (err) {
    next(err);
  }
};


export const getPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "username img country desc isSeller cardVerified createdAt"
    );

    if (!user) {
      return next(createError(404, "User not found"));
    }

    let gigs = [];
    let jobs = [];
    let reviews = [];

    if (user.isSeller) {
      gigs = await Gig.find({ userId: user._id.toString() })
        .sort({ createdAt: -1 })
        .lean();

      const gigIds = gigs.map((gig) => gig._id.toString());

      reviews = gigIds.length
        ? await Review.find({ gigId: { $in: gigIds } })
            .sort({ createdAt: -1 })
            .lean()
        : [];

      const reviewerIds = [
        ...new Set(reviews.map((review) => review.userId)),
      ];

      const reviewers = reviewerIds.length
        ? await User.find({ _id: { $in: reviewerIds } })
            .select("username img cardVerified")
            .lean()
        : [];

      const reviewerMap = new Map(
        reviewers.map((reviewer) => [
          reviewer._id.toString(),
          reviewer,
        ])
      );

      const gigMap = new Map(
        gigs.map((gig) => [gig._id.toString(), gig])
      );

      reviews = reviews.map((review) => ({
        ...review,
        reviewer: reviewerMap.get(review.userId) || null,
        gig: gigMap.get(review.gigId)
          ? {
              _id: gigMap.get(review.gigId)._id,
              title: gigMap.get(review.gigId).title,
              cover: gigMap.get(review.gigId).cover,
            }
          : null,
      }));
    } else {
      jobs = await Job.find({
        clientId: user._id,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .lean();

      reviews = await Review.find({ userId: user._id.toString() })
        .sort({ createdAt: -1 })
        .lean();

      const gigIds = [
        ...new Set(reviews.map((review) => review.gigId)),
      ];

      const reviewedGigs = gigIds.length
        ? await Gig.find({ _id: { $in: gigIds } })
            .select("title cover userId")
            .lean()
        : [];

      const sellerIds = [
        ...new Set(reviewedGigs.map((gig) => gig.userId)),
      ];

      const sellers = sellerIds.length
        ? await User.find({ _id: { $in: sellerIds } })
            .select("username img")
            .lean()
        : [];

      const gigMap = new Map(
        reviewedGigs.map((gig) => [gig._id.toString(), gig])
      );

      const sellerMap = new Map(
        sellers.map((seller) => [seller._id.toString(), seller])
      );

      reviews = reviews.map((review) => {
        const gig = gigMap.get(review.gigId);
        const recipient = gig
          ? sellerMap.get(gig.userId)
          : null;

        return {
          ...review,
          gig: gig
            ? {
                _id: gig._id,
                title: gig.title,
                cover: gig.cover,
              }
            : null,
          recipient: recipient || null,
        };
      });
    }

    const averageRating = reviews.length
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.star, 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;

    res.status(200).json({
      user,
      gigs,
      jobs,
      reviews,
      stats: {
        reviewsCount: reviews.length,
        averageRating,
        gigsCount: gigs.length,
        jobsCount: jobs.length,
      },
    });
  } catch (err) {
    next(err);
  }
};
