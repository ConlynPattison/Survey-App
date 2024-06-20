import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

/**
 * Middleware function for validation of CRUD operations leveraging Zod schema object parsing & errors
 * @param schema Zod Schema made up of body, query, and/or params arguments
 * @returns 
 */
const validate = (schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			})
			next();
		} catch (e: any) {
			return res.status(400).send(e.errors);
		}
	};

export default validate;