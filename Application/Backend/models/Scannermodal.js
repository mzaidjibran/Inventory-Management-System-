import mongoose from "mongoose";

const scanItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    barcode: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const scanSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [scanItemSchema],
      default: [],
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ScanSession", scanSessionSchema);
