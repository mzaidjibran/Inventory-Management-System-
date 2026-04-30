import express from "express";
import {
  getAllScans,
  createScan,
  getSingleScan,
  updateScan,
  deleteScan,
} from "../controllers/Scannercontroler.js";
import upload from "../middleware/multerniddleware.js";
const router = express.Router();
//scanner routers
router.post("/", upload.single("image"), createScan);
router.get("/", getAllScans);
router.get("/:id", getSingleScan);
router.put("/:id", upload.single("image"), updateScan);
router.delete("/:id", deleteScan);

export default router;
