import express from "express";
import * as BillingController from "../controllers/BillingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireEmployee, requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Create billing (Admin/Employee)

router.post("/", verifyToken, requireEmployee, BillingController.createBilling);

// Get all billings (Admin/Employee)

router.get("/", verifyToken, requireEmployee, BillingController.getAllBilling);

// Get single billing (Admin/Employee)

router.get("/:id", verifyToken, requireEmployee, BillingController.getSingleBilling);

// Update billing (Admin/Employee)

router.put("/:id", verifyToken, requireEmployee, BillingController.updateBilling);

// Delete billing (Admin/Employee)

router.delete("/:id", verifyToken, requireEmployee, BillingController.deleteBilling);

// Get billing report/summary (Admin/Employee)

router.get("/report/summary", verifyToken, requireEmployee, BillingController.getBillingReport);

export default router;