import { useSelector } from "react-redux";
import { Team, selectTeamById } from "./teamsApiSlice";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

const TeamItem = ({ teamId }: { teamId: string }) => {
	const team = useSelector<RootState, Team>(state => selectTeamById(state, teamId));

	const navigate = useNavigate();

	if (team) {
		const handleEdit = () => navigate(`dash/teams/${teamId}`);

		return (
			<tr>
				<td>
					{team.name}
				</td>
				<td>
					{team.owner_id}
				</td>
				<td>
					{team.admin_ids[0]}
				</td>
				<td>
					<button onClick={handleEdit}>
						Edit
					</button>
				</td>
			</tr>
		)

	} else return null;
}

export default TeamItem;