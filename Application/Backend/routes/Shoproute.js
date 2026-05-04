import express from "express";
import {
  getAllpayouts,
  createPayout,
  getSinglePayout,
  updatePayout,
  deletePayout,
} from "../controllers/Shopexpencecontroler.js";
import upload from "../middleware/multerniddleware.js";
const router = express.Router();
//payout routers
router.post("/", upload.single("image"), createPayout);
router.get("/", getAllpayouts);
router.get("/:id", getSinglePayout);
router.put("/:id", upload.single("image"), updatePayout);
router.delete("/:id", deletePayout);

export default router;
