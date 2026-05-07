import Purchase from "../models/purchasemodal.js";
import Product from "../models/Productmodal.js";
import StockMovement from "../models/stockmovementmodel.js";

export const createPurchase = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { items, invoiceNumber } = req.body;

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array is required and must not be empty",
      });
    }

    let totalAmount = 0;
    const validatedItems = [];

    // Validate and process each item
    for (const item of items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a product ID",
        });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a positive quantity",
        });
      }
      if (typeof item.costPrice !== "number" || item.costPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a valid costPrice",
        });
      }

      // Check product exists
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      // Calculate item total
      const itemTotal = item.quantity * item.costPrice;
      validatedItems.push({
        product: item.product,
        quantity: item.quantity,
        costPrice: item.costPrice,
        total: itemTotal,
      });
      totalAmount += itemTotal;
    }

    // Create purchase
    const purchase = await Purchase.create({
      user: userId,
      createdBy: userId,
      items: validatedItems,
      invoiceNumber,
      totalAmount,
      suplier: req.body.suplier || req.body.supplierID,
    });

    // Update product stock for each item
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: item.quantity } },
        { new: true },
      );
    }

    return res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

//  GET ALL PURCHASES
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()

      .populate("items.product")
      .populate("suplier")
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

      .populate("items.product")
      .populate("suplier");

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
        suplier: req.body.suplier || req.body.supplierID,
      },
      { new: true },
    )
      .populate("items.product")
      .populate("suplier");

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
