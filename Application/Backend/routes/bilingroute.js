import express from "express";
import {
  getAllbillings,
  createbilling,
  getSingleBilling,
  updateBilling,
  deleteBilling,
} from "../controllers/Bilingcontroler.js";
import upload from "../middleware/multerniddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
//billing routers
router.post("/", authMiddleware, upload.single("image"), createbilling);
router.get("/", getAllbillings);
router.get("/:id", getSingleBilling);
router.put("/:id", upload.single("image"), updateBilling);
router.delete("/:id", deleteBilling);

export default router;
