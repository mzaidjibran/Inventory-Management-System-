import ScanSession from "../models/Scannermodal.js";
import Product from "../models/Productmodal.js";
import Billing from "../models/Bilingmodal.js";

// Helper: Auto-generate sequential session ID
const generateSessionId = async () => {
  try {
    const lastSession = await ScanSession.findOne().sort({ createdAt: -1 });
    if (!lastSession || !lastSession.sessionId) {
      return "1";
    }
    const lastId = parseInt(lastSession.sessionId) || 0;
    return (lastId + 1).toString();
  } catch (error) {
    return "1";
  }
};

// 1. CREATE NEW SCAN SESSION (Auto-generates sessionId)
export const createScanSession = async (request, response) => {
  try {
    const sessionId = await generateSessionId();
    
    const scanSession = await ScanSession.create({
      sessionId,
      items: [],
      totalAmount: 0,
      status: "active",
      createdBy: request.userId || null,
    });

    response.status(201).json({
      success: true,
      error: false,
      message: `New scan session created with ID: ${sessionId}`,
      data: scanSession,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// 2. ADD PRODUCT TO SCAN BY BARCODE
export const addProductToScan = async (request, response) => {
  try {
    const { sessionId, barcode, quantity = 1 } = request.body;

    if (!sessionId || !barcode) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "sessionId and barcode are required",
      });
    }

    // Find product by barcode
    const product = await Product.findOne({ barcode });
    if (!product) {
      return response.status(404).json({
        success: false,
        error: true,
        message: `Product with barcode "${barcode}" not found`,
      });
    }

    // Check stock
    const numQuantity = Number(quantity);
    if (product.stockQuantity < numQuantity) {
      return response.status(400).json({
        success: false,
        error: true,
        message: `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${numQuantity}`,
      });
    }

    // Find scan session
    let scanSession = await ScanSession.findOne({ sessionId });
    if (!scanSession) {
      return response.status(404).json({
        success: false,
        error: true,
        message: `Scan session "${sessionId}" not found`,
      });
    }

    if (scanSession.status !== "active") {
      return response.status(400).json({
        success: false,
        error: true,
        message: `Scan session is ${scanSession.status}. Cannot add items.`,
      });
    }

    // Check if product already in cart
    const existingItemIndex = scanSession.items.findIndex(
      (item) => item.product.toString() === product._id.toString()
    );

    const total = numQuantity * product.price;

    if (existingItemIndex !== -1) {
      // Update quantity
      scanSession.items[existingItemIndex].quantity += numQuantity;
      scanSession.items[existingItemIndex].total += total;
    } else {
      // Add new item
      scanSession.items.push({
        product: product._id,
        barcode,
        quantity: numQuantity,
        price: product.price,
        total,
      });
    }

    // Update total
    scanSession.totalAmount = scanSession.items.reduce((sum, item) => sum + item.total, 0);
    await scanSession.save();

    response.status(200).json({
      success: true,
      error: false,
      message: `Product "${product.title}" added to scan (Qty: ${numQuantity})`,
      data: {
        product: {
          _id: product._id,
          title: product.title,
          barcode: product.barcode,
          price: product.price,
        },
        scanSession: scanSession,
      },
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// 3. REMOVE PRODUCT FROM SCAN
export const removeProductFromScan = async (request, response) => {
  try {
    const { sessionId, barcode } = request.body;

    if (!sessionId || !barcode) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "sessionId and barcode are required",
      });
    }

    const product = await Product.findOne({ barcode });
    if (!product) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Product not found with this barcode",
      });
    }

    const scanSession = await ScanSession.findOne({ sessionId });
    if (!scanSession) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Scan session not found",
      });
    }

    const removedItem = scanSession.items.find(
      (item) => item.product.toString() === product._id.toString()
    );

    if (!removedItem) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Product not found in this scan session",
      });
    }

    scanSession.items = scanSession.items.filter(
      (item) => item.product.toString() !== product._id.toString()
    );

    scanSession.totalAmount = scanSession.items.reduce((sum, item) => sum + item.total, 0);

    await scanSession.save();

    response.status(200).json({
      success: true,
      error: false,
      message: `"${product.title}" removed from scan`,
      data: scanSession,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// 4. GET SCAN SESSION DETAILS
export const getScanSession = async (request, response) => {
  try {
    const { sessionId } = request.params;

    const scanSession = await ScanSession.findOne({ sessionId }).populate("items.product");
    if (!scanSession) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Scan session not found",
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      message: "Scan session retrieved",
      data: scanSession,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// 5. FINALIZE BILL (Convert scan to billing)
export const finalizeBill = async (request, response) => {
  try {
    const userId = request.userId;
    
    // sessionId URL params se bhi lo, body se bhi
    const sessionId = request.params.sessionId || request.body.sessionId;
    const paymentMethod = request.body.paymentMethod;
    const discount = request.body.discount || 0;
    const tax = request.body.tax || 0;

    if (!userId) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: User not authenticated",
      });
    }

    if (!sessionId || !paymentMethod) {
      return response.status(400).json({
        success: false,
        error: true,
        message: `sessionId and paymentMethod are required. Got: sessionId=${sessionId}, paymentMethod=${paymentMethod}`,
      });
    }

    // Find scan session
    const scanSession = await ScanSession.findOne({ sessionId }).populate("items.product");
    if (!scanSession) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Scan session not found",
      });
    }

    if (scanSession.items.length === 0) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Cannot finalize: Scan session is empty",
      });
    }

    // Verify stock and reduce
    for (const item of scanSession.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return response.status(404).json({
          success: false,
          error: true,
          message: `Product not found: ${item.product._id}`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return response.status(400).json({
          success: false,
          error: true,
          message: `Insufficient stock for "${product.title}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
        });
      }

      // Reduce stock
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    // Calculate totals
    const subtotal = scanSession.totalAmount;
    const numDiscount = Number(discount);
    const numTax = Number(tax);
    const totalAmount = subtotal + numTax - numDiscount;

    // Create billing
    const billing = await Billing.create({
      items: scanSession.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      totalAmount,
      discount: numDiscount,
      tax: numTax,
      paymentMethod,
      invoiceNumber: `INV-${sessionId}-${Date.now()}`,
      createdBy: userId,
      status: "completed",
    });

    // Mark scan as completed
    scanSession.status = "completed";
    await scanSession.save();

    response.status(201).json({
      success: true,
      error: false,
      message: "Bill finalized successfully. Stock updated.",
      data: {
        billing,
        scanSession,
      },
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// 6. SEARCH PRODUCT BY BARCODE
export const searchProductByBarcode = async (request, response) => {
  try {
    const { barcode } = request.body;

    if (!barcode) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Barcode is required",
      });
    }

    const product = await Product.findOne({ barcode });
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

// 7. GET ALL SCANS
export const getAllScans = async (request, response) => {
  try {
    const scans = await ScanSession.find().populate("items.product");
    response.status(200).json({
      success: true,
      error: false,
      message: "Scans fetched successfully",
      data: scans,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// 8. DELETE SCAN SESSION
export const deleteScanSession = async (request, response) => {
  try {
    const { sessionId } = request.params;

    const deletedScan = await ScanSession.findOneAndDelete({ sessionId });
    if (!deletedScan) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Scan session not found",
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      message: "Scan session deleted",
      data: deletedScan,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};
