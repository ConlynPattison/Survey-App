import { isSerializedError } from "../../app/api/apiUtil";
import UserItem from "./UserItem";
import { useGetUsersQuery } from "./usersApiSlice";

const UsersList = () => {
	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error
	} = useGetUsersQuery();

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

	let content

	if (isLoading) content = <p>Loading...</p>

	if (isError) {
		content = <p className="errmsg">{errorMessage()}</p>
	}

	if (isSuccess) {

		const { ids } = users

		const tableContent = ids?.length
			? ids.map(userId => <UserItem key={userId} userId={userId} />)
			: null

		content = (
			<table>
				<thead>
					<tr>
						<th scope="col">First Name</th>
						<th scope="col">Email</th>
						<th scope="col">Edit</th>
					</tr>
				</thead>
				<tbody>
					{tableContent}
				</tbody>
			</table>
		)
	}

	return content
}

export default UsersList;
