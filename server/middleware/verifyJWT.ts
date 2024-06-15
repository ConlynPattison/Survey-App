import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader || typeof authHeader !== "string" || authHeader.startsWith("Bearer: ")) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET!,
		(err, decoded) => {
			if (err) {
				res.status(403).json({ message: "Forbidden" });
				return;
			}

			if (!decoded || typeof decoded === "string") {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			req.user = decoded.UserInfo.email;
			next();
		}
	);
}