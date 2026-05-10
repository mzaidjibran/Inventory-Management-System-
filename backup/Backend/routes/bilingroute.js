import express from "express";
import * as Billing from "../controllers/BillingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireEmployee, requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/",                verifyToken, requireEmployee, Billing.createBilling);
router.get("/",                 verifyToken, requireEmployee, Billing.getAllBillings);
router.get("/report/summary",   verifyToken, requireEmployee, Billing.getBillingReport); 
router.get("/:id",              verifyToken, requireEmployee, Billing.getSingleBilling);
router.put("/:id",              verifyToken, requireEmployee, Billing.updateBilling);


router.delete("/:id",           verifyToken, requireAdmin,    Billing.deleteBilling);

export default router;