import express from "express";
import {
  getAllorders,
  createOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/ordercontroller.js";
import upload from "../middleware/multerniddleware.js";
const router = express.Router();
//order routers
router.post("/", upload.single("image"), createOrder);
router.get("/", getAllorders);
router.get("/:id", getSingleOrder);
router.put("/:id", upload.single("image"), updateOrder);
router.delete("/:id", deleteOrder);

export default router;
