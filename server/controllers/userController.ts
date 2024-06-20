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
		res.status(400).json({ message: "No users found" });
		return;
	}
	res.json(users);
}

export const createNewUserSchema = z.object({
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
		res.status(400).json({ message: error.toString() });
		return;
	}

	const { email, password, firstName, lastName } = data.body;

	// Check for duplicates
	const duplicate = await User.findOne({ email })
		.collation({ locale: 'en', strength: 2 })
		.lean().exec();
	if (duplicate) {
		res.status(409).json({ message: "User email already registered" });
		return;
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

/**
* @desc Update a user
* @route PATCH /users
* @access Private
* @param {Request} req - Express request object
* @param {Response} res - Express response object
*/
export const updateUser = async (req: Request, res: Response) => {
	const { id, email, password, firstName, lastName } = req.body;

	// Confirm data (password optional)
	// todo: Convert this to entity-dto validation with Zod
	if (!id || !email || !firstName || !lastName) {
		res.status(400).json({ message: "All fields are required" });
		return;
	}

	const user = await User.findById(id).exec();

	if (!user) {
		res.status(400).json({ message: "User not found" });
		return;
	}

	// Check for duplicates
	const duplicate = await User.findOne({ email })
		.collation({ locale: 'en', strength: 2 })
		.lean().exec();

	// Allow update for original user
	if (duplicate && duplicate._id.toString() !== id) {
		res.status(409).json({ message: "Duplicate email recieved" });
		return;
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

/**
* @desc Delete a user
* @route DELETE /users
* @access Private
* @param {Request} req - Express request object
* @param {Response} res - Express response object
*/
export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.body;

	if (!id) {
		res.status(400).json({ message: "User id required" });
		return;
	}

	// todo: Add any checks that should be done before deleting a user (teams, roles, etc)
	const user = await User.findById(id).exec();

	if (!user) {
		res.status(400).json({ message: `User id ${id} not found` });
		return;
	}

	const result = await user.deleteOne();

	const reply = `${result.deletedCount} user deleted with id ${id}`
	res.json(reply)
}
