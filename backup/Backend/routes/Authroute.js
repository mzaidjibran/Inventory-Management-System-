import express from "express";
import * as Auth from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import upload from "../middleware/multerniddleware.js";

const router = express.Router();

router.post("/signup",         Auth.SignUp);
router.post("/signin",         Auth.SignIn);
router.post("/refresh-token",  Auth.RefreshAccessToken);
router.post("/forgot-password", Auth.ForgotPassword);
router.post("/verify-otp",     Auth.VerifyOtp);
router.post("/reset-password", Auth.ResetPassword);

router.post("/logout",         verifyToken, Auth.LogOut);
router.get("/me",              verifyToken, Auth.GetCurrentUser);
router.put("/me",              verifyToken, upload.single("image"), Auth.UpdateMyProfile);

router.post("/admin/users",          verifyToken, requireAdmin, Auth.AdminCreateUser);
router.get("/admin/users",           verifyToken, requireAdmin, Auth.AdminGetAllUsers);
router.put("/admin/users/:id",       verifyToken, requireAdmin, Auth.AdminUpdateUser);
router.delete("/admin/users/:id",    verifyToken, requireAdmin, Auth.AdminDeleteUser);

export default router;