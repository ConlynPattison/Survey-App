import { Request, Response } from "express"
import Team from "../models/Team";
import { z } from "zod";
import mongoose from "mongoose";

/** 
 * @desc Get all teams
 * @route GET /teams
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getAllTeams = async (req: Request, res: Response) => {
	const teams = await Team.find().lean().exec();
	res.json(teams);
}

const createNewTeamSchema = z.object({
	body: z.object({
		name: z.string(),
		ownerId: z.string(),
		adminIds: z.string().array().optional()
	})
});

/**
 * @desc Create a new team
 * @route POST /teams
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const createNewTeam = async (req: Request, res: Response) => {
	const { success, data, error } = createNewTeamSchema.safeParse(req);

	if (!success) {
		return res.status(400).json({ message: error.issues });
	}

	const { name, ownerId, adminIds } = data.body;

	// This should now be redundant, but leaving for now.
	// if (adminIds && !Array.isArray(adminIds)) {
	// 	res.status(400).json({ message: "Admin id(s) must be passed in an array" });
	// 	return;
	// }

	const duplicate = await Team.findOne({ name, owner_id: ownerId }).lean().exec();
	if (duplicate) {
		return res.status(409).json({ message: `Team with name ${name} already exists under user id ${ownerId}` });
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
}

const updateTeamSchema = z.object({
	body: z.object({
		id: z.string(),
		name: z.string(),
		ownerId: z.string(),
		adminIds: z.string().array()
	})
});

/**
 * @desc Update a team
 * @route PATCH /teams
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const updateTeam = async (req: Request, res: Response) => {
	const { success, error, data } = updateTeamSchema.safeParse(req);

	if (!success) {
		return res.status(400).json({ message: error.issues });
	}

	const { id, name, ownerId, adminIds } = data.body;

	if (adminIds && !Array.isArray(adminIds)) {
		return res.status(400).json({ message: "Admin id(s) must be passed in an array" });
	}

	if (!id || !name || !ownerId) {
		return res.status(400).json({ message: "All fields required" });
	}

	const team = await Team.findById(id).exec();

	if (!team) {
		return res.status(400).json({ message: "Team not found" });
	}

	const duplicate = await Team.findOne({ name, owner_id: ownerId }).lean().exec();
	if (duplicate && duplicate._id.toString() !== id) {
		return res.status(409).json({ message: `Another team with name ${name} already exists under user id ${ownerId}` });
	}

	team.name = name;
	// todo: do we want owner_id to be something that can even be changed?
	team.owner_id = new mongoose.Types.ObjectId(ownerId);
	team.admin_ids = adminIds.map(id => new mongoose.Types.ObjectId(id));

	const updatedTeam = await team.save();
	res.json({ message: `${updatedTeam.name} updated` });
}

const deleteTeamSchema = z.object({
	body: z.object({
		id: z.string()
	})
});

/**
 * @desc Remove a team
 * @route DELETE /teams
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const deleteTeam = async (req: Request, res: Response) => {
	const { success, error, data } = deleteTeamSchema.safeParse(req);

	if (!success) {
		return res.status(400).json({ message: "Team id field required" });
	}

	const { id } = data.body;

	// todo: Add any checks that should be done before deleting a team (surveys, results, etc)
	const team = await Team.findById(id).exec();

	if (!team) {
		return res.status(400).json({ message: "Team not found" });
	}

	const result = await team.deleteOne();
	res.json({ message: `${result.deletedCount} deleted team with id ${id}` });
}