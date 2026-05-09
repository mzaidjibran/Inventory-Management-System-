import express from "express";
import {
  SignUp,
  SignIn,
  logOut,
  refresh,
  getMyProfile,
  updateMyProfile,
  resetpassword,
  forgotpassword,
  verifyOtp,
  createEmployeeByAdmin,
  deleteEmployeeByAdmin,
  getAllUsersByAdmin,
} from "../controllers/Accountcontroler.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerniddleware.js";

const router = express.Router();

// Public
router.post("/SignUp", SignUp);
router.post("/SignIn", SignIn);
router.post("/logOut", logOut);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotpassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetpassword);

// Authenticated
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, upload.single("image"), updateMyProfile);

// Admin only
router.post("/users", authMiddleware, createEmployeeByAdmin);
router.get("/users", authMiddleware, getAllUsersByAdmin);
router.delete("/users/:id", authMiddleware, deleteEmployeeByAdmin);

export default router;