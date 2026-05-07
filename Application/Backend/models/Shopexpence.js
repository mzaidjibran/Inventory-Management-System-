import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    type: {
      type: String,
      enum: ["salary", "rent", "utility", "supplier", "other"],
      required: true,
    },

    // paymentMethod: {
    //   type: String,
    //   enum: ["cash", "bank", "online"],
    //   default: "cash",
    // },

    payoutDate: {
      type: Date,
      default: Date.now,
    },

    // optional references
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },

    note: {
      type: String,
      trim: true,
    },

    receipt: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Payout", payoutSchema);
