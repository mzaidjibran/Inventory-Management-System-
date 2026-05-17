import Product from "../models/Productmodal.js";

export const createProduct = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: User ID not found",
      });
    }
    const barcode = (request.body.barcode || "").trim();
    if (!barcode) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Barcode is required",
      });
    }

    const productData = {
      ...request.body,
      barcode,
      createdBy: userId,
      image: request.file
        ? `image/${request.file.filename}`
        : request.body.image || "",
    };

    const product = await Product.create(productData);

    response.status(201).json(product);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

//get all product

export const getAllProducts = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: User ID not found",
        data: null,
      });
    }
    // Find products created by user OR legacy products without createdBy
    const products = await Product.find({
      $or: [
        { createdBy: userId },
        { createdBy: null },
        { createdBy: { $exists: false } },
      ],
    });
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
    const userId = request.userId;
    const productId = request.params.id;

    // Verify the product belongs to the current user
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    // Check if user owns this product (with backward compatibility)
    if (
      existingProduct.createdBy &&
      existingProduct.createdBy.toString() !== userId.toString()
    ) {
      return response.status(403).json({
        success: false,
        error: true,
        message: "Unauthorized: You can only update your own products",
      });
    }

    const updateData = {
      ...request.body,
      createdBy: userId,
    };

    if (Object.prototype.hasOwnProperty.call(request.body, "barcode")) {
      const barcode = (request.body.barcode || "").trim();

      if (!barcode) {
        return response.status(400).json({
          success: false,
          error: true,
          message: "Barcode cannot be empty",
        });
      }
      updateData.barcode = barcode;
    }

    if (request.file) {
      updateData.image = `image/${request.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true },
    );

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

//delete productexport

export const deleteProduct = async (request, response) => {
  try {
    const userId = request.userId;
    const productId = request.params.id;

    // Verify the product belongs to the current user
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    // Check if user owns this product (with backward compatibility)
    if (
      existingProduct.createdBy &&
      existingProduct.createdBy.toString() !== userId.toString()
    ) {
      return response.status(403).json({
        success: false,
        error: true,
        message: "Unauthorized: You can only delete your own products",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

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

// Search product by barcode

export const searchProductByBarcode = async (request, response) => {
  try {
    const { barcode } = request.query || request.body;
    const userId = request.userId;

    if (!barcode) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Barcode is required",
      });
    }

    const product = await Product.findOne({
      barcode,
      createdBy: userId,
    });
    if (!product) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Product not found with this barcode",
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      message: "Product found",
      data: product,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};
