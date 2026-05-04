import express from "express";
import {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/Productcotroler.js";
import upload from "../middleware/multerniddleware.js";
const router = express.Router();
//product routers
router.post("/", upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
