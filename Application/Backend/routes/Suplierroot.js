import express from "express";
import {
  getAllsuplier,
  createsuplier,
  getSingleSuplier,
  updateSuplier,
  deleteSuplier,
} from "../controllers/Supliercontroler.js";
import upload from "../middleware/multerniddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
//suplier routers
router.post("/", authMiddleware, upload.single("image"), createsuplier);
router.get("/", getAllsuplier);
router.get("/:id", getSingleSuplier);
router.put("/:id", upload.single("image"), updateSuplier);
router.delete("/:id", deleteSuplier);

export default router;
