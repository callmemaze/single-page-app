import express from "express";
import { profile, signin, signup, userLogout } from "../controllers/user.js";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/logout", accessTokenAutoRefresh, userLogout);
router.get("/me", accessTokenAutoRefresh, auth, profile);

export default router;
