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

router.post("/", authMiddleware, upload.single("image"), createsuppliers);
router.get("/", authMiddleware, getAllsuppliers);
router.get("/:id", authMiddleware, getSingleSupplier);
router.put("/:id", authMiddleware, upload.single("image"), updateSupplier);
router.delete("/:id", authMiddleware, deleteSupplier);

export default router;
