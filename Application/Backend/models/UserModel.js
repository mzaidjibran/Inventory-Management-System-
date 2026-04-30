import mongoose from "mongoose";

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
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("UserModel", userSchema);

const UserModel = mongoose.model("UserModel", UserSchema);
export default UserModel;
