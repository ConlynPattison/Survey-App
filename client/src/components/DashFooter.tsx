import { useLocation, useNavigate } from "react-router-dom";

const DashFooter = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const onHomeClicked = () => navigate("/dash");

	const homeButton = (
		<button title="Home" onClick={onHomeClicked}>HOME</button>
	);

	return (
		<footer>
			{pathname !== "/dash" && homeButton}
			<p>Current User: </p>
			<p>Email: </p>
		</footer>
	);
}

export default DashFooter;