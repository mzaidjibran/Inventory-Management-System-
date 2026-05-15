import Billing from "../models/Bilingmodal.js";
import Product from "../models/Productmodal.js";
import Client from "../models/Clientmodal.js";

// --- Create Billing (with stock deduction) ---

export const createBilling = async (request, response) => {
  try {
    const userId = request.userId;

    const items = Array.isArray(request.body.items) ? request.body.items : [];
    if (!items.length) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Billing items are required!",
      });
    }

    // --- Validate stock before touching anything ---
    const stockQueue = [];

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
            message: `Insufficient stock for "${product.title}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
          });
        }
        stockQueue.push({ product, quantity: item.quantity });
      }
    }

    // --- Normalise items and calculate totals ---
    const normalizedItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const total = Number.isFinite(Number(item.total))
        ? Number(item.total)
        : quantity * price;
      return { ...item, quantity, price, total };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.total, 0);
    const discount = Number(request.body.discount || 0);
    const tax = Number(request.body.tax || 0);
    const totalAmount = subtotal + tax - discount;

    // --- Create billing record ---
    const billing = await Billing.create({
      ...request.body,
      items: normalizedItems,
      discount,
      tax,
      totalAmount,
      invoiceNumber:
        request.body.invoiceNumber ||
        `INVOICE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      // ── Save customer info ──
      customer: {
        name: request.body.customerName || "",
        phone: request.body.customerPhone || "",
        address: request.body.customerAddress || "",
      },
      createdBy: userId,
      status: request.body.status || "completed",
    });

    // ── Auto-save new customer if name & phone provided ──
    if (request.body.customerName && request.body.customerPhone) {
      const existingClient = await Client.findOne({
        phone: request.body.customerPhone,
      });
      if (!existingClient) {
        try {
          await Client.create({
            name: request.body.customerName,
            phone: request.body.customerPhone,
            address: request.body.customerAddress || "",
          });
        } catch (clientErr) {
          console.log("Auto-save customer note:", clientErr.message);
        }
      }
    }

    // --- Deduct stock only after successful billing creation ---
    for (const { product, quantity } of stockQueue) {
      product.stockQuantity -= quantity;
      await product.save();
    }

    return response.status(201).json({
      success: true,
      error: false,
      message: "Bill created successfully and stock updated!",
      data: billing,
    });
  } catch (error) {
    response
      .status(400)
      .json({ success: false, error: true, message: error.message });
  }
};

// --- Get All Billings ---

export const getAllBillings = async (request, response) => {
  try {
    const billings = await Billing.find()
      .populate({
        path: "items.product",
        select: "title name price",
      })
      .sort({ createdAt: -1 });

    return response.status(200).json({
      success: true,
      error: false,
      total: billings.length,
      data: billings,
    });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, error: true, message: error.message });
  }
};

// --- Get Single Billing ---

export const getSingleBilling = async (request, response) => {
  try {
    const billing = await Billing.findById(request.params.id).populate({
      path: "items.product",
      select: "title name price",
    });
    if (!billing) {
      return response
        .status(404)
        .json({ success: false, error: true, message: "Bill not found!" });
    }
    return response
      .status(200)
      .json({ success: true, error: false, data: billing });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, error: true, message: error.message });
  }
};

// --- Update Billing ---

export const updateBilling = async (request, response) => {
  try {
    const updated = await Billing.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updated) {
      return response
        .status(404)
        .json({ success: false, error: true, message: "Bill not found!" });
    }
    return response.status(200).json({
      success: true,
      error: false,
      message: "Bill updated successfully!",
      data: updated,
    });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, error: true, message: error.message });
  }
};

// --- Delete Billing ---

export const deleteBilling = async (request, response) => {
  try {
    const deleted = await Billing.findByIdAndDelete(request.params.id);
    if (!deleted) {
      return response
        .status(404)
        .json({ success: false, error: true, message: "Bill not found!" });
    }
    return response.status(200).json({
      success: true,
      error: false,
      message: "Bill deleted successfully!",
      data: deleted,
    });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, error: true, message: error.message });
  }
};

// --- Billing Report / Summary ---

export const getBillingReport = async (request, response) => {
  try {
    const { startDate, endDate } = request.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const billings = await Billing.find(query).sort({ createdAt: -1 });
    const totalAmount = billings.reduce(
      (sum, bill) => sum + (bill.totalAmount || 0),
      0,
    );

    return response.status(200).json({
      success: true,
      error: false,
      total: billings.length,
      totalAmount,
      data: billings,
    });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, error: true, message: error.message });
  }
};
