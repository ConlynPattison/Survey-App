import { useNavigate } from "react-router-dom";
import { useGetTeamsQuery } from "./teamsApiSlice";
import { memo } from "react";

const TeamItem = ({ teamId }: { teamId: string }) => {
	const { team } = useGetTeamsQuery(undefined, {
		selectFromResult: ({ data }) => ({
			team: data?.entities[teamId]
		})
	});

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

const memoizedTeamItem = memo(TeamItem);
export default memoizedTeamItem;
