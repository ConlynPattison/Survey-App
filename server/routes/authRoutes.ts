import { Router } from "express";
import { } from "../controllers/authController";

const router = Router();

router.route("/")
	.post();

router.route("/refresh")
	.get();

router.route("/logout")
	.post();

export const authRoutes = router;
