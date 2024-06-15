import { Router } from "express";
import { createNewTeam, deleteTeam, getAllTeams, updateTeam } from "../controllers/teamController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = Router();

router.use(verifyJWT);

router.route("/")
	.get(getAllTeams)
	.post(createNewTeam)
	.patch(updateTeam)
	.delete(deleteTeam);

export const teamRoutes = router;
