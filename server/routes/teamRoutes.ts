import { Router } from "express";
import { createNewTeam, deleteTeam, getAllTeams, updateTeam } from "../controllers/teamController";

const router = Router();

router.route("/")
	.get(getAllTeams)
	.post(createNewTeam)
	.patch(updateTeam)
	.delete(deleteTeam);

export const teamRoutes = router;
