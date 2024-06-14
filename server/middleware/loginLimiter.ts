import rateLimit, { Options } from "express-rate-limit";
import { logEvents } from "./logger";
import { NextFunction, Request, Response } from "express";

/**
 * Rate limiter to be used for restricting number of requests for authentication login requests.
 */
export const loginLimiter = rateLimit({
	windowMs: 60 * 1000, // time to remember reqs
	max: 5, // limit on each IP per window
	message: {
		message: "Too many login attempts from this IP, please try again after 60 seconds."
	},
	handler: (req: Request, res: Response, next: NextFunction, options: Partial<Options>) => {
		logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log");
		res.status(options.statusCode ?? 429).send(options.message);
	},
	standardHeaders: true,
	legacyHeaders: false
});
