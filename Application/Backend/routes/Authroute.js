import express from "express";
import * as AuthController from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin, requireEmployee } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/signup", AuthController.SignUp);
router.post("/signin", AuthController.SignIn);
router.post("/refresh-token", AuthController.RefreshAccessToken);

router.post("/logout", verifyToken, AuthController.LogOut);
router.get("/me", verifyToken, AuthController.GetCurrentUser);

router.post("/admin/create-user", verifyToken, requireAdmin, AuthController.AdminCreateUser);
router.get("/admin/all-users", verifyToken, requireAdmin, AuthController.AdminGetAllUsers);
router.put("/admin/update-user/:id", verifyToken, requireAdmin, AuthController.AdminUpdateUser);
router.delete("/admin/delete-user/:id", verifyToken, requireAdmin, AuthController.AdminDeleteUser);

export default router;