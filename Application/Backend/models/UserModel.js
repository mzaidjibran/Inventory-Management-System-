import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    image: {
      type: String,
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
