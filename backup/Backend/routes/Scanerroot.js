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


router.post("/", createScanSession);
router.get("/", getAllScans);
router.get("/:sessionId", getScanSession);
router.delete("/:sessionId", deleteScanSession);

router.post("/search-barcode", searchProductByBarcode);
router.post("/:sessionId/add", addProductToScan);
router.post("/:sessionId/remove", removeProductFromScan);

router.post("/:sessionId/finalize", authMiddleware, finalizeBill);

export default router;