import express from "express";
import {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProductByBarcode,
} from "../controllers/Productcotroler.js";
import upload from "../middleware/multerniddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//product routers

router.post("/", authMiddleware, upload.single("image"), createProduct);
router.get("/", authMiddleware, getAllProducts);
router.get("/search/barcode", authMiddleware, searchProductByBarcode);
router.get("/:id", authMiddleware, getSingleProduct);
router.put("/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
