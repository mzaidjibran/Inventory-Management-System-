import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
