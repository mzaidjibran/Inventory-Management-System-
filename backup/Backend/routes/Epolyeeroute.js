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

//employee routers

router.post("/", upload.single("profileImage"), createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getSingleEmployee);
router.put("/:id", upload.single("profileImage"), updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
