import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express"
import Team from "../models/Team";


/** 
 * @desc Get all teams
 * @route GET /teams
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getAllTeams = expressAsyncHandler(async (req: Request, res: Response) => {
	const teams = await Team.find().lean().exec();
	if (teams?.length === 0) {
		res.status(400).json({ message: "No teams found" });
		return;
	}
	res.json(teams);
});

/**
 * @desc Create a new team
 * @route POST /teams
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const createNewTeam = expressAsyncHandler(async (req: Request, res: Response) => {
	// todo: change this to a zod parse
	const { name, ownerId, adminIds } = req.body;

	if (adminIds && !Array.isArray(adminIds)) {
		res.status(400).json({ message: "Admin id(s) must be passed in an array" });
		return;
	}

	if (!name || !ownerId) {
		res.status(400).json({ message: "All fields required" });
		return;
	}

	const duplicate = await Team.findOne({ name, owner_id: ownerId }).lean().exec();
	if (duplicate) {
		res.status(409).json({ message: `Team with name ${name} already exists under user id ${ownerId}` });
		return;
	}

	const hasValidAdminIds = adminIds && Array.isArray(adminIds);

	const teamObject = {
		name,
		owner_id: ownerId,
		...(hasValidAdminIds && { admin_ids: adminIds })
	};

	const team = await Team.create(teamObject);
	if (team) {
		res.status(201).json({ message: `New team ${name} created` });
	} else {
		res.status(400).json({ message: "Invalid team data recieved, team not created" });
	}
});

/**
 * @desc Update a team
 * @route PATCH /teams
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const updateTeam = expressAsyncHandler(async (req: Request, res: Response) => {
});

/**
 * @desc Remove a team
 * @route DELETE /teams
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const deleteTeam = expressAsyncHandler(async (req: Request, res: Response) => {
});