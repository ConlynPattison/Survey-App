import { getQueryErrorMessage } from "../../app/api/apiUtil";
import UserItem from "./UserItem";
import { useGetUsersQuery } from "./usersApiSlice";

const UsersList = () => {
	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error
	} = useGetUsersQuery(undefined, {
		pollingInterval: 60000, // requery every minute
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true
	});

	if (isLoading) return (
		<p>Loading...</p>
	);

	if (isError) return (
		<p>{getQueryErrorMessage(isError, error)}</p>
	);

	if (isSuccess) {

		const { ids } = users;

		const tableContent = ids?.length
			? ids.map(userId => <UserItem key={userId} userId={userId} />)
			: null;

		return (
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
}

export default UsersList;
