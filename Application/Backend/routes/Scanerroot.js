import express from "express";
import {
  createScanSession,
  addProductToScan,
  removeProductFromScan,
  getScanSession,
  finalizeBill,
  searchProductByBarcode,
  getAllScans,
  deleteScanSession,
} from "../controllers/Scannercontroler.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// ============ SCAN SESSION ROUTES ============

// 1. Create new scan session (auto-generates sessionId: 1, 2, 3...)
// POST /scan
router.post("/", createScanSession);

// 2. Get all scan sessions
// GET /scan
router.get("/", getAllScans);

// 3. Get specific scan session details
// GET /scan/:sessionId
router.get("/:sessionId", getScanSession);

// 4. Delete scan session
// DELETE /scan/:sessionId
router.delete("/:sessionId", deleteScanSession);

// ============ PRODUCT BARCODE ROUTES ============

// 1. Search product by barcode
// POST /scan/search-barcode
// Body: { "barcode": "123456" }
router.post("/search-barcode", searchProductByBarcode);

// 2. Add product to scan by barcode
// POST /scan/:sessionId/add
// Body: { "barcode": "123456", "quantity": 1 }
router.post("/:sessionId/add", addProductToScan);

// 3. Remove product from scan by barcode
// POST /scan/:sessionId/remove
// Body: { "barcode": "123456" }
router.post("/:sessionId/remove", removeProductFromScan);

// ============ BILLING FINALIZATION ============

// Finalize bill (requires authentication)
// POST /scan/:sessionId/finalize
// Body: { "paymentMethod": "cash", "discount": 0, "tax": 0 }
// Headers: Authorization: Bearer {token}
router.post("/:sessionId/finalize", authMiddleware, finalizeBill);

export default router;
