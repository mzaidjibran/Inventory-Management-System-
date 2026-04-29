import { DataTypes } from "sequelize";
import { sequelize } from "../config/config.js";

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresIn: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "RefreshToken",
    timestamps: true,
  },
);

export default RefreshToken;
