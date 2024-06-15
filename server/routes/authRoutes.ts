import { Router } from "express";
import { loginLimiter } from "../middleware/loginLimiter";
import { login, logout, refresh } from "../controllers/authController";

// Access token to be sent as JSON, stored in client memory, not stored in local store or cookie
// Refresh token to be sent as httpOnly cookie (not accessible by JS), has expiry point

const router = Router();

router.route("/")
	.post(loginLimiter, login);

router.route("/refresh")
	.get(refresh);

router.route("/logout")
	.post(logout);

export const authRoutes = router;
