import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      unique: true
    },

    resetOTP: {
      type: String,
      default: null
    },

    resetOTPExpiry: {
      type: Date,
      default: null

    },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    image: {
      type: String
    },

    createdBy: {
      type: String,
      default: "admin"
    },
  },
  {
    timestamps: true

  },
);

export default mongoose.model("User", userSchema);