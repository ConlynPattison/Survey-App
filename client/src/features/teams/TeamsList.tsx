import { getQueryErrorMessage } from "../../app/api/apiUtil";
import TeamItem from "./TeamItem";
import { useGetTeamsQuery } from "./teamsApiSlice";

const TeamsList = () => {
	const {
		data: teams,
		isLoading,
		isSuccess,
		isError,
		error
	} = useGetTeamsQuery(undefined, {
		pollingInterval: 60000, // requery every minute
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true
	});

	let content: JSX.Element;

	if (isLoading) content = <p>Loading...</p>;

	if (isError) {
		content = <p>{getQueryErrorMessage(isError, error)}</p>;
	}

	if (isSuccess) {
		console.log(teams)
		const { ids } = teams;

		const tableContent = ids?.length
			? ids.map(teamId => <TeamItem key={teamId} teamId={teamId} />)
			: null;

		content = (
			<table>
				<thead>
					<tr>
						<th scope="col">Team Name</th>
						<th scope="col">Owner</th>
						<th scope="col">Is Admin?</th>
					</tr>
				</thead>
				<tbody>
					{tableContent}
				</tbody>
			</table>
		)
	}

	return content;
}

export default TeamsList;
