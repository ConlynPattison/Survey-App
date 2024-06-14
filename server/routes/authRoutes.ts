import { Router } from "express";
import { loginLimiter } from "../middleware/loginLimiter";
import { login, logout, refresh } from "../controllers/authController";

const router = Router();

router.route("/")
	.post(loginLimiter, login);

router.route("/refresh")
	.get(refresh);

router.route("/logout")
	.post(logout);

export const authRoutes = router;
