import Billing from "../models/Bilingmodal.js";
import Product from "../models/Productmodal.js";

const createbilling = async (request, response) => {
  try {
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: user id is required to generate billing",
      });
    }

    const items = Array.isArray(request.body.items) ? request.body.items : [];
    if (!items.length) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Billing items are required",
      });
    }

    // Check and reduce product stock
    const updateProductsQueue = [];
    for (const item of items) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (!product) {
          return response.status(404).json({
            success: false,
            error: true,
            message: `Product not found: ${item.product}`,
          });
        }
        if (product.stockQuantity < item.quantity) {
          return response.status(400).json({
            success: false,
            error: true,
            message: `Insufficient stock for product ${product.title}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
          });
        }
        updateProductsQueue.push({ product, quantity: item.quantity });
      }
    }

    const normalizedItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const total = Number.isFinite(Number(item.total))
        ? Number(item.total)
        : quantity * price;

      return {
        ...item,
        quantity,
        price,
        total,
      };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.total, 0);
    const discount = Number(request.body.discount || 0);
    const tax = Number(request.body.tax || 0);
    const totalAmount = subtotal + tax - discount;

    const billing = await Billing.create({
      ...request.body,
      items: normalizedItems,
      discount,
      tax,
      totalAmount,
      invoiceNumber:
        request.body.invoiceNumber ||
        `INVOICE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdBy: userId,
      status: request.body.status || "completed",
    });

    // Update product stock after successful billing
    for (const { product, quantity } of updateProductsQueue) {
      product.stockQuantity -= quantity;
      await product.save();
    }

    response.status(201).json({
      success: true,
      error: false,
      message: "Billing created successfully and stock updated",
      data: billing,
    });
  } catch (error) {
    response.status(400).json({ 
      success: false,
      error: true,
      message: error.message 
    });
  }
};
export { createbilling };
//get all billings
export const getAllbillings = async (request, response) => {
  try {
    const billings = await Billing.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Billings fetched successfully",
      data: billings,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching billings",
      data: null,
    });
  }
};
//get billing by id
export const getSingleBilling = async (request, response) => {
  try {
    const billing = await Billing.findById(request.params.id);
    if (!billing) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Billing not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Billing fetched successfully",
      data: billing,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching billing",
    });
  }
};
//update billing
export const updateBilling = async (request, response) => {
  try {
    const updatedBilling = await Billing.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedBilling) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Billing not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Billing updated successfully",
      data: updatedBilling,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating billing",
    });
  }
};
//delete billing
export const deleteBilling = async (request, response) => {
  try {
    const deletedBilling = await Billing.findByIdAndDelete(request.params.id);
    if (!deletedBilling) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Billing not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Billing deleted successfully",
      data: deletedBilling,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting billing",
    });
  }
};
