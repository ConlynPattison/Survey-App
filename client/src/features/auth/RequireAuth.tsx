import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * Example, temporary logic here, should be role-based once team-roles are implemented
 */
const RequireAuth = ({ allowedUsers }: { allowedUsers: string[] }) => {
	const location = useLocation();
	const { firstName } = useAuth();

	return (
		allowedUsers.includes(firstName)
			? <Outlet />
			: <Navigate to="/login" state={{ from: location }} replace />
	)
}

export default RequireAuth;