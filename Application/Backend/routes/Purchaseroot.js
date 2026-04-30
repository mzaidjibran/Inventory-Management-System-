import express from "express";
import {
  getAllPurchases,
  createPurchase,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
} from "../controllers/Purchasecontroler.js";
import upload from "../middleware/multerniddleware.js";
const router = express.Router();
//purchase routers
router.post("/", upload.single("profileImage"), createPurchase);
router.get("/", getAllPurchases);
router.get("/:id", getSinglePurchase);
router.put("/:id", upload.single("profileImage"), updatePurchase);
router.delete("/:id", deletePurchase);

export default router;
