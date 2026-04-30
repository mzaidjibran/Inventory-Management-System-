import { DataTypes } from "sequelize";
import { sequelize } from "../config/config.js";

const Product = sequelize.define(
  "Product",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
      set(value) {
        this.setDataValue("title", value ? value.trim() : value);
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
      set(value) {
        this.setDataValue("author", value ? value.trim() : value);
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
      set(value) {
        this.setDataValue("category", value ? value.trim() : value);
      },
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: "",
      validate: {
        len: [0, 500],
      },
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    tableName: "Product",
    timestamps: true,
  },
);

export default Product;
