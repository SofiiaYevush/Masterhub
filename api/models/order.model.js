import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  taskerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: Number,
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
