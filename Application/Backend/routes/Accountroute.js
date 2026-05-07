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
} from "../controllers/Accountcontroler.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerniddleware.js";

const router = express.Router();

router.post("/SignUp", SignUp);
router.post("/SignIn", SignIn);
router.post("/logOut", logOut);
router.post("/refresh", refresh);
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, upload.single("image"), updateMyProfile);

router.post("/forgot-password", forgotpassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetpassword);

export default router;
