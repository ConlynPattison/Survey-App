import User from "../models/User";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getAllUsers = async (req: Request, res: Response) => {
	const users = await User.find().select("-password").lean();
	if (users?.length === 0) {
		return res.status(400).json({ message: "No users found" });
	}
	res.json(users);
}

const createNewUserSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(4).max(12).optional(),
		firstName: z.string(),
		lastName: z.string()
	}).required()
});

/**
* @desc Create new user
* @route POST /users
* @access Private
* @param {Request} req - Express request object
* @param {Response} res - Express response object
*/
export const createNewUser = async (req: Request, res: Response) => {
	const { success, data, error } = createNewUserSchema.safeParse(req);

	// Confirm data
	if (!success) {
		return res.status(400).json({ message: error.issues });
	}

	const { email, password, firstName, lastName } = data.body;

	// Check for duplicates
	const duplicate = await User.findOne({ email })
		.collation({ locale: 'en', strength: 2 })
		.lean().exec();
	if (duplicate) {
		return res.status(409).json({ message: "User email already registered" });
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 10) // salt rounds

	const userObject = {
		email,
		password: hashedPassword,
		first_name: firstName,
		last_name: lastName
	}
	const user = await User.create(userObject);

	if (user) {
		res.status(201).json({ message: `New user ${email} created` });
	} else {
		res.status(400).json({ message: "Invalid user data recieved, user not created" });
	}
}

const updateUserSchema = z.object({
	body: z.object({
		id: z.string(),
		email: z.string().email(),
		password: z.string().min(4).max(12).optional(),
		firstName: z.string(),
		lastName: z.string()
	}).required()
});

/**
* @desc Update a user
* @route PATCH /users
* @access Private
* @param {Request} req - Express request object
* @param {Response} res - Express response object
*/
export const updateUser = async (req: Request, res: Response) => {
	const { success, data, error } = updateUserSchema.safeParse(req);

	// Confirm data (password optional)
	if (!success) {
		return res.status(400).json({ message: error.issues });
	}

	const { id, email, password, firstName, lastName } = data.body;

	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	// Check for duplicates
	const duplicate = await User.findOne({ email })
		.collation({ locale: 'en', strength: 2 })
		.lean().exec();

	// Allow update for original user
	if (duplicate && duplicate._id.toString() !== id) {
		return res.status(409).json({ message: "Duplicate email recieved" });
	}

	user.email = email;
	user.first_name = firstName;
	user.last_name = lastName;

	if (password) {
		user.password = await bcrypt.hash(password, 10);
	}

	const updatedUser = await user.save();

	res.json({ message: `${updatedUser.email} updated` });
}

const deleteUserSchema = z.object({
	body: z.object({
		id: z.string()
	}).required()
});

/**
* @desc Delete a user
* @route DELETE /users
* @access Private
* @param {Request} req - Express request object
* @param {Response} res - Express response object
*/
export const deleteUser = async (req: Request, res: Response) => {
	const { success, data, error } = deleteUserSchema.safeParse(req);

	if (!success) {
		return res.status(400).json({ message: error.issues });
	}

	const { id } = data.body;

	// todo: Add any checks that should be done before deleting a user (teams, roles, etc)
	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(400).json({ message: `User id ${id} not found` });
	}

	const result = await user.deleteOne();

	const reply = `${result.deletedCount} user deleted with id ${id}`
	res.json(reply)
}
