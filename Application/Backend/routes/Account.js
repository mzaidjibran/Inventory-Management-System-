import express from "express"
import { SignUp, SignIn , logOut, refresh } from "../controllers/Account.js";
const router = express.Router()

router.post("/SignUp", SignUp);
router.post("/SignIn", SignIn );
router.post("/logOut", logOut);
router.post("/refresh", refresh);

export default router
