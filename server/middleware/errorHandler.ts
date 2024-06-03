import { NextFunction, Request, Response } from "express";
import { logEvents } from "./logger";

/**
 * Middleware function for logging each error's name, message, and request method, url, and origin in logs.
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log");
	console.log(err.stack);

	const statusCode = res.statusCode ? res.statusCode : 500;
	res.status(statusCode);
	res.json({ message: err.message });
}
