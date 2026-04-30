import EmployeeDesignation from "../models/EmployeeDesignation.js";
const createproduct = async (request, response) => {
  try {
    const product = await Product.create(request.body);
    response.status(201).json(product);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export { createproduct };
//get all product
export const getAllProducts = async (request, response) => {
  try {
    const products = await Product.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching products",
      data: null,
    });
  }
};
//get product by id
export const getSingleProduct = async (request, response) => {
  try {
    const product = await Product.findById(request.params.id);
    if (!product) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching product",
    });
  }
};
//update product
export const updateProduct = async (request, response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedProduct) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating product",
    });
  }
};
//delete productexport const deleteProduct = async (request, response) => {
export const deleteProduct = async (request, response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(request.params.id);
    if (!deletedProduct) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting product",
    });
  }
};
