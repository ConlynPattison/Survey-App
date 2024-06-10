import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { User, selectUserById } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
	const { id } = useParams();
	const user = useSelector<RootState, User>(state => selectUserById(state, id!));

	return user ? <EditUserForm user={user} /> : <p>Loading...</p>;
}

export default EditUser;
