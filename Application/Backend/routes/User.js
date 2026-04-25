import express from "express"
import { createUser, deletedUser, getAllusers, getSingleuser, updatedUser } from "../controllers/User.js";
const router = express.Router()

router.get("/getAllusers", getAllusers);
router.get("/getSingleuser/:id", getSingleuser);
router.post("/createUser", createUser);
router.put("/updateuser/:id", updatedUser);
router.delete("/deleteuser/:id", deletedUser);

export default router