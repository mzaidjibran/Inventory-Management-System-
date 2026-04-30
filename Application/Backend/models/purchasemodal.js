import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },

    costPrice: {
      type: Number,
      required: true,
      min: [0, "Cost price cannot be negative"],
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    items: {
      type: [purchaseItemSchema],
      validate: [(arr) => arr.length > 0, "At least one item is required"],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "online"],
      default: "cash",
    },

    invoiceNumber: {
      type: String,
      unique: true,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    note: {
      type: String,
      trim: true,
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

export default mongoose.model("Purchase", purchaseSchema);
