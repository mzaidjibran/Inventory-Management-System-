import { DataTypes } from "sequelize";
import { sequelize } from "../config/config.js";

const Employee = sequelize.define(
  "Employee",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [0, 100],
      },
      set(value) {
        this.setDataValue("email", value ? value.toLowerCase().trim() : value);
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 20],
      },
    },
    CNIC: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [0, 20],
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
    },
    dateOfJoining: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    salary: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Terminated", "On Leave"),
      defaultValue: "Active",
    },
    address: {
      type: DataTypes.JSON,
    },
    department: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    designation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shift: {
      type: DataTypes.INTEGER,
    },
    user: {
      type: DataTypes.INTEGER,
    },
    profileImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    tableName: "Employee",
    timestamps: true,
  },
);

export default Employee;
