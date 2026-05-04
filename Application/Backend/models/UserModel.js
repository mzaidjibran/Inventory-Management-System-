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
    newPassword: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
