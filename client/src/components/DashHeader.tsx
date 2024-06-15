import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";
import { getQueryErrorMessage } from "../app/api/apiUtil";

const DASH_REGEX = /^\/dash(\/)?$/;
const TEAMS_REGEX = /^\/dash\/teams(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [sendLogout, {
		isLoading,
		isSuccess,
		isError,
		error
	}] = useSendLogoutMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate("/");
		}
	}, [isSuccess, navigate]);

	const onLogoutClicked = () => sendLogout(null);

	if (isLoading) {
		return (
			<p>Logging Out...</p>
		);
	}

	if (isError) {
		return (
			<p>Error: {getQueryErrorMessage(isError, error)}</p>
		);
	}

	const LogoutButton = () => (
		<button
			title="Logout"
			onClick={onLogoutClicked}
		>
			Logout
		</button>
	);

	return (
		<header>
			<div>
				<Link to="/dash">
					<h1>Survey App</h1>
				</Link>
				<nav>
					{/* todo: add nav buttons */}
					<LogoutButton />
				</nav>
			</div>
		</header>
	);
}

export default DashHeader;
