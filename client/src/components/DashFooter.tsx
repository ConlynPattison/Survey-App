import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { email, firstName } = useAuth();

	const onHomeClicked = () => navigate("/dash");

	const homeButton = (
		<button title="Home" onClick={onHomeClicked}>HOME</button>
	);

	return (
		<footer>
			{pathname !== "/dash" && homeButton}
			<p>Current User: {firstName}</p>
			<p>Email: {email} </p>
		</footer>
	);
}

export default DashFooter;