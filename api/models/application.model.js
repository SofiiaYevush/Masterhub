import mongoose from "mongoose";
const { Schema } = mongoose;

const ApplicationSchema = new Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        taskerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverLetter: {
            type: String,
        },
        proposedPrice: Number,
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "withdrawn"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);