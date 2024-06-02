import { format } from "date-fns";
import { v4 } from "uuid";
import fs, { promises } from "fs";
import { join } from "path";
import { NextFunction, Request, Response } from "express";

/**
 * Logs message in provided file name in logs directory. Creates directory and log if either do not exist.
 * @param message
 * @param logFileName 
 */
export const logEvents = async (message: string, logFileName: string) => {
	const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
	const logItem = `${dateTime}\t${v4()}\t${message}\n`;

	try {
		if (!fs.existsSync(join(__dirname, "..", "logs"))) {
			await promises.mkdir(join(__dirname, "..", "logs"));
		}
		await promises.appendFile(join(__dirname, "..", "logs", logFileName), logItem);
	} catch (error) {
		console.log(error);
	}
}

/**
 * Middleware function for logging each request's method, url, and origin in logs.
 * @param req 
 * @param res 
 * @param next 
 */
export const logger = (req: Request, res: Response, next: NextFunction) => {
	logEvents(
		`${req.method}\t${req.url}\t${req.headers.origin}`,
		'reqLog.log'
	);
	console.log(`${req.method} ${req.path}`);
	next();
}