import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    barcode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
