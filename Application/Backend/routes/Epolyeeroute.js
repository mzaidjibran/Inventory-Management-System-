import express from "express";
import {
  getAllEmployees,
  createEmployee,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/Empolyeecontrooler.js";
import upload from "../middleware/multerniddleware.js";
const router = express.Router();
//empoly routers
router.post("/", upload.single("image"), createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getSingleEmployee);
router.put("/:id", upload.single("image"), updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
