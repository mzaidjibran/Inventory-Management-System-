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
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Supplier email is required"],
      lowercase: true,
      trim: true,
      maxlength: [100, "Email cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Supplier", supplierSchema);
