import mongoose from "mongoose";
const { Schema } = mongoose;

const GigSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    cat: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: function () {
        return !this.isPriceNegotiable;
      },
    },
    isPriceNegotiable: {
      type: Boolean,
      default: false,
  },
    cover: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },
    shortTitle: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: false,
    },
    sales: {
      type: Number,
      default: 0,
    },
    languageVisibility: {
      en: { type: Boolean, default: false },
      uk: { type: Boolean, default: true },
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Gig", GigSchema);