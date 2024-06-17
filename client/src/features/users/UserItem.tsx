import { useGetUsersQuery } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

const UserItem = ({ userId }: { userId: string }) => {
	const { user } = useGetUsersQuery(undefined, {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId]
		})
	});

	const navigate = useNavigate();

	if (user) {
		const handleEdit = () => navigate(`/dash/users/${userId}`)
		return (
			<tr>
				<td>{user.first_name}</td>
				<td>{user.email}</td>
				<td>
					<button onClick={handleEdit}>
						Edit
					</button>
				</td>
			</tr >
		);
	} else return null;
}

const memoizedUserItem = memo(UserItem);
export default memoizedUserItem;
