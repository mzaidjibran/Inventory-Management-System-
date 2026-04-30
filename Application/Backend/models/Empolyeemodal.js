import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    // phone: {
    //   type: String,
    //   required: true,
    //   maxlength: 20,
    // },
    // CNIC: {
    //   type: String,
    //   unique: true,
    //   sparse: true,
    //   maxlength: 20,
    // },
    // dateOfBirth: {
    //   type: String,
    // },
    // gender: {
    //   type: String,
    //   enum: ["Male", "Female", "Other"],
    // },
    // dateOfJoining: {
    //   type: String,
    // },
    // salary: {
    //   type: String,
    //   default: "0",
    // },
    // status: {
    //   type: String,
    //   enum: ["Active", "Inactive", "Terminated", "On Leave"],
    //   default: "Active",
    // },
    // address: {
    //   street: String,
    //   city: String,
    //   state: String,
    //   country: String,
    //   zipCode: String,
    // },
    // department: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "EmployeeDepartment",
    // },
    // designation: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "EmployeeDesignation",
    // },
    // shift: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Shift",
    // },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "UserModel",
    // },
    // profileImage: {
    //   type: String,
    //   default: "",
    // },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
