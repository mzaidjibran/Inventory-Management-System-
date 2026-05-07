import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      maxlength: [100, "Supplier name cannot exceed 100 characters"],
    },
    contact: {
      type: String,
      required: [true, "Supplier contact is required"],
      trim: true,
      maxlength: [50, "Contact cannot exceed 50 characters"],
    },
    address: {
      type: String,
      required: true,
      maxlength: [50, "Address cannot exceed 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Supplier email is required"],
      lowercase: true,
      trim: true,
      maxlength: [100, "Email cannot exceed 100 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true },
);

export default mongoose.model("Supplier", supplierSchema);
