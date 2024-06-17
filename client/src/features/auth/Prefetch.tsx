import { useEffect } from "react";
import { store } from "../../app/store";
import { teamsApiSlice } from "../teams/teamsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
	useEffect(() => {
		// subscribing => changed to prefetching
		store.dispatch(teamsApiSlice.util.prefetch("getTeams", undefined, { force: true }));
		store.dispatch(usersApiSlice.util.prefetch("getUsers", undefined, { force: true }));
	}, []);

	return <Outlet />;
}

export default Prefetch;