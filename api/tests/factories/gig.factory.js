import mongoose from "mongoose";
import Gig from "../../models/gig.model.js";

export const buildGigPayload = (overrides = {}) => ({
  // userId is a loose (unpopulated) String reference to a User's ObjectId -
  // controllers call User.findById(gig.userId), so it must look like a real
  // ObjectId even when no specific seller is relevant to the test.
  userId: overrides.userId ?? new mongoose.Types.ObjectId().toString(),
  title: "Professional house cleaning",
  desc: "Deep cleaning service for apartments and houses.",
  cat: "cleaning",
  price: 500,
  isPriceNegotiable: false,
  cover: "https://example.com/cover.jpg",
  images: [],
  shortTitle: "House cleaning",
  shortDesc: "Quick and thorough cleaning",
  deliveryTime: 1,
  location: "Kyiv",
  features: ["Eco-friendly products"],
  languageVisibility: { en: false, uk: true },
  ...overrides,
});

export const createGig = (overrides = {}) => Gig.create(buildGigPayload(overrides));
