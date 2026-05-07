import express from "express";
import {
  getAllsuppliers,
  createsuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supliercontroler.js";
import upload from "../middleware/multerniddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
//supplier routers
router.post("/", upload.single("image"), createsuppliers);
router.get("/", getAllsuppliers);
router.get("/:id", getSingleSupplier);
router.put("/:id", upload.single("image"), updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;
