import express from "express";
import {
  getAllEmployees,
  createEmployee,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/Empolyeecontrooler.js";
import upload from "../middleware/multerniddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//employee routers

router.post("/", authMiddleware, upload.single("profileImage"), createEmployee);
router.get("/", authMiddleware, getAllEmployees);
router.get("/:id", authMiddleware, getSingleEmployee);
router.put("/:id", authMiddleware, upload.single("profileImage"), updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
