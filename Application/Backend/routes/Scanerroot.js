import express from "express";
import {
  getAllscaners,
  createScaner,
  getSingleScaner,
  updateScaner,
  deleteScaner,
} from "../controllers/scanercontroller.js";
import upload from "../middleware/multerniddleware.js";
const router = express.Router();
//scaner routers
router.post("/", upload.single("image"), createScaner);
router.get("/", getAllscaners);
router.get("/:id", getSingleScaner);
router.put("/:id", upload.single("image"), updateScaner);
router.delete("/:id", deleteScaner);

export default router;
