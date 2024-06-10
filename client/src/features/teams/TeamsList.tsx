import { isSerializedError } from "../../app/api/apiUtil";
import TeamItem from "./TeamItem";
import { useGetTeamsQuery } from "./teamsApiSlice";

const TeamsList = () => {
	const {
		data: teams,
		isLoading,
		isSuccess,
		isError,
		error
	} = useGetTeamsQuery();

	const errorMessage = () => {
		if (!isError) return;
		if (error === undefined) return;

		if (isSerializedError(error)) {
			return error?.message
		}

		switch (error.status) {
			case 400:
				// Handle specific error status codes
				return error.data?.toString(); // Assuming error.data is a string or convertible to a string
			case 'FETCH_ERROR':
				return error.error;
			case 'PARSING_ERROR':
				return `Parsing error: ${error.error}`;
			case 'TIMEOUT_ERROR':
				return 'Request timed out';
			case 'CUSTOM_ERROR':
				return error.error;
			default:
				return 'An unknown error occurred';
		}
	}

	let content;

	if (isLoading) content = <p>Loading...</p>;

	if (isError) {
		content = <p className="errmsg">{errorMessage()}</p>;
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
