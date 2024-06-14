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

});

/** 
 * @desc Refresh
 * @route GET /auth/refresh
 * @access Public => access token expired
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const refresh = expressAsyncHandler(async (req: Request, res: Response) => {

});

/** 
 * @desc Logout
 * @route POST /auth/logout
 * @access Public => clears cookie
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const logout = expressAsyncHandler(async (req: Request, res: Response) => {

});
