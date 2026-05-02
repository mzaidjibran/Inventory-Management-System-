import Purchase from "../models/purchasemodal.js";
import Product from "../models/productmodel.js";
import StockMovement from "../models/stockmovementmodel.js";
//  CREATE PURCHASE (WITH STOCK + TOTAL LOGIC)
export const createPurchase = async (req, res) => {
  try {
    const { items, invoiceNumber } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    let totalAmount = 0;

    for (const item of items) {
      if (!item.product || item.quantity <= 0) {
        return res.status(400).json({ message: "Invalid item data" });
      }

      // calculate total
      item.total = item.quantity * item.costPrice;
      totalAmount += item.total;

      // increase stock
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
      });

      // stock movement log
      await StockMovement.create({
        product: item.product,
        type: "IN",
        quantity: item.quantity,
        referenceId: purchase._id,
      });
    }

    const purchase = await Purchase.create({
      createdBy: req.user._id,
      items,
      invoiceNumber,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  GET ALL PURCHASES
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()

      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Purchases fetched successfully",
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  GET SINGLE PURCHASE
export const getSinglePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)

      .populate("items.product");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase fetched successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PURCHASE
export const updatePurchase = async (req, res) => {
  try {
    const existingPurchase = await Purchase.findById(req.params.id);

    if (!existingPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    for (const item of existingPurchase.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    const { items } = req.body;

    let totalAmount = 0;

    for (const item of items) {
      item.total = item.quantity * item.costPrice;
      totalAmount += item.total;

      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
      });
    }

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        totalAmount,
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully",
      data: updatedPurchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  DELETE PURCHASE (
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    for (const item of purchase.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    await Purchase.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Purchase deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
