import express from "express";
import {
  SignUp,
  SignIn,
  logOut,
  refresh,
  getMyProfile,
  updateMyProfile,
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

export default router;
