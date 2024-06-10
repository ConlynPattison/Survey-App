import { useEffect } from "react";
import { store } from "../../app/store";
import { teamsApiSlice } from "../teams/teamsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
	useEffect(() => {
		// subscribing:
		const teams = store.dispatch(teamsApiSlice.endpoints.getTeams.initiate());
		const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

		// unsubscription on leaving protected routes
		return () => {
			teams.unsubscribe();
			users.unsubscribe();
		}
	}, []);

	return <Outlet />;
}

export default Prefetch;