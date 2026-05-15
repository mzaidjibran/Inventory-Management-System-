import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
    contact: {
      type: String,
      required: [true, "Client contact is required"],
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
  },
  { timestamps: true },
);

export default mongoose.model("Client", clientSchema);
