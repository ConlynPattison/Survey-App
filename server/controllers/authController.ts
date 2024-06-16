import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

/** 
 * @desc Login
 * @route POST /auth
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const login = expressAsyncHandler(async (req: Request, res: Response) => {
	// todo: zod
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ message: "All fields are required" });
		return;
	}

	const foundUser = await User.findOne({ email }).exec();

	if (!foundUser) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const match = await bcrypt.compare(password, foundUser.password);

	if (!match) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const accessToken = jwt.sign(
		{
			"UserInfo": {
				"email": foundUser.email,
				"firstName": foundUser.first_name
			}
		}, process.env.ACCESS_TOKEN_SECRET!,
		{ expiresIn: "1d" } // todo: change (reduce) for deployment
	);

	const refreshToken = jwt.sign(
		{
			"email": foundUser.email,
			"firstName": foundUser.first_name
		},
		process.env.REFRESH_TOKEN_SECRET!,
		{ expiresIn: "1d" }
	);

	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry, 7 days
	});

	res.json({ accessToken });

});

/** 
 * @desc Refresh
 * @route GET /auth/refresh
 * @access Public => access token expired
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const refresh = expressAsyncHandler((req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const refreshToken = cookies.jwt;

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET!,
		{}, // VerifyOptions, included to move past error
		async (err, decoded) => { // VerifyCallback
			if (err) {
				res.status(403).json({ message: "Forbidden" });
				return;
			}

			// todo: zod, should check that there exists the proper records for a user's auth (occurs again in verifyJWT)
			if (!decoded || typeof decoded === "string") {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const foundUser = await User.findOne({ email: decoded?.email }).exec();

			if (!foundUser) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const accessToken = jwt.sign(
				{
					"UserInfo": {
						"email": foundUser.email,
						"firstName": foundUser.first_name
					}
				},
				process.env.ACCESS_TOKEN_SECRET!,
				{ expiresIn: "15m" }
			);
			res.json({ accessToken });
		}
	);
});

/** 
 * @desc Logout
 * @route POST /auth/logout
 * @access Public => clears cookie
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const logout = expressAsyncHandler((req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) { // No jwt content found on cookie
		res.sendStatus(204);
		return;
	}

	res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
	res.json({ message: "Cookie cleared" });
});
