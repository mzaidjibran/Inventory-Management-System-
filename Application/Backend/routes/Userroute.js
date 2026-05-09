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

// createUser — sirf admin kar sakta hai
// (Admin "Create User" button se employee/user banata hai)
router.post(
  "/createUser",
  authMiddleware,
  roleMiddleware(["admin"]),
  createUser,
);

// getAllusers — admin aur user dono dekh saktay hain
router.get(
  "/getAllusers",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  getAllusers,
);

// getSingleuser
router.get(
  "/getSingleuser/:id",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  getSingleuser,
);

// updateuser — sirf admin
router.put(
  "/updateuser/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updatedUser,
);

// deleteuser — sirf admin
router.delete(
  "/deleteuser/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deletedUser,
);

export default router;
