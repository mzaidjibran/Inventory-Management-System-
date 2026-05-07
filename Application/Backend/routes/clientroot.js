import express from "express";
import {
  getAllclients,
  createclient,
  getSingleClient,
  updateClient,
  deleteClient,
} from "../controllers/clientcontroler.js";
import upload from "../middleware/multerniddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
//client routers
router.post("/", authMiddleware, upload.single("image"), createclient);
router.get("/", getAllclients);
router.get("/:id", getSingleClient);
router.put("/:id", upload.single("image"), updateClient);
router.delete("/:id", deleteClient);

export default router;
