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


router.post("/", authMiddleware, createScanSession);
router.get("/", authMiddleware, getAllScans);
router.get("/:sessionId", authMiddleware, getScanSession);
router.delete("/:sessionId", authMiddleware, deleteScanSession);

router.post("/search-barcode", authMiddleware, searchProductByBarcode);
router.post("/:sessionId/add", authMiddleware, addProductToScan);
router.post("/:sessionId/remove", authMiddleware, removeProductFromScan);

router.post("/:sessionId/finalize", authMiddleware, finalizeBill);

export default router;