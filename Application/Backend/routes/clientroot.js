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
router.get("/", authMiddleware, getAllclients);
router.get("/:id", authMiddleware, getSingleClient);
router.put("/:id", authMiddleware, upload.single("image"), updateClient);
router.delete("/:id", authMiddleware, deleteClient);

export default router;
