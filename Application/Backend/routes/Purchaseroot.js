import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllPurchases,
  createPurchase,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
} from "../controllers/Purchasecontroler.js";

const router = express.Router();

// All purchase routes require authentication
router.post("/", authMiddleware, createPurchase);
router.get("/", authMiddleware, getAllPurchases);
router.get("/:id", authMiddleware, getSinglePurchase);
router.put("/:id", authMiddleware, updatePurchase);
router.delete("/:id", authMiddleware, deletePurchase);

export default router;
