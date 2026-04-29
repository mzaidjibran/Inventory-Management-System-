import { DataTypes } from "sequelize";
import { sequelize } from "../config/config.js";

const UserModel = sequelize.define(
  "UserModel",
  {
    User_Name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
  },
  {
    tableName: "UserModel",
    timestamps: true,
  },
);

export default UserModel;
