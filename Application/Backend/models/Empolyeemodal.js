import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    CNIC: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      maxlength: 20,
    },
    dateOfBirth: {
      type: Date,
      default: Date.now,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Terminated", "On Leave"],
      default: "Active",
    },
    address: {
      type: mongoose.Schema.Types.Mixed,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
