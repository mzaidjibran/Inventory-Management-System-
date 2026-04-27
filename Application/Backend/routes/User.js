import express from "express"
import { createUser, deletedUser, getAllusers, getSingleuser, updatedUser } from "../controllers/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
const router = express.Router()

router.get("/getAllusers", authMiddleware, roleMiddleware(["admin", "user"]), getAllusers);
router.get("/getSingleuser/:id", authMiddleware, roleMiddleware(["admin", "user"]), getSingleuser);
router.post("/createUser", authMiddleware, roleMiddleware(["admin"]), createUser);
router.put("/updateuser/:id", authMiddleware, roleMiddleware(["admin"]), updatedUser);
router.delete("/deleteuser/:id", authMiddleware, roleMiddleware(["admin"]), deletedUser);

export default router