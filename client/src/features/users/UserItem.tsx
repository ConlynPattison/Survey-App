import { useSelector } from "react-redux";
import { User, selectUserById } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";

const UserItem = ({ userId }: { userId: string }) => {
	const user = useSelector<RootState, User>(state => selectUserById(state, userId));

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

export default UserItem;