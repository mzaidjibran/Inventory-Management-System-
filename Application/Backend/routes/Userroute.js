import express from "express";
import {
  createUser,
  deletedUser,
  getAllusers,
  getSingleuser,
  updatedUser,
} from "../controllers/Usercontroler.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/createUser",
  authMiddleware,
  roleMiddleware(["admin"]),
  createUser,
);

router.get(
  "/getAllusers",
  authMiddleware,
  roleMiddleware(["admin", "employee"]),
  getAllusers,
);

router.get(
  "/getSingleuser/:id",
  authMiddleware,
  roleMiddleware(["admin", "employee"]),
  getSingleuser,
);

router.put(
  "/updateuser/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updatedUser,
);

router.delete(
  "/deleteuser/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deletedUser,
);

export default router;