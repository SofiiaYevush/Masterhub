import mongoose from "mongoose";
const { Schema } = mongoose;

const JobSchema = new Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
        category: {
            type: String,
            required: true,
        },
        budget: {
            type: Number,
        },
        isBudgetNegotiable: {
            type: Boolean,
            default: false,
        },
        location: String,
        deadline: Date,
        skills: [String],

        isClosed: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["active", "hired", "closed"],
            default: "active",
        },
        languageVisibility: {
            en: { type: Boolean, default: false },
            uk: { type: Boolean, default: true },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Job", JobSchema);