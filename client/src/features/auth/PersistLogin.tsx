import { useSelector } from "react-redux";
import usePersist from "../../hooks/usePersist";
import { selectCurrentToken } from "./authSlice";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { Link, Outlet } from "react-router-dom";
import { getQueryErrorMessage } from "../../app/api/apiUtil";

const PersistLogin = () => {
	const [persist] = usePersist();
	const token = useSelector(selectCurrentToken);
	const effectRan = useRef(false);

	const [trueSuccess, setTrueSuccess] = useState(false);

	const [refresh, {
		isUninitialized,
		isLoading,
		isSuccess,
		isError,
		error
	}] = useRefreshMutation();

	useEffect(() => {
		// React 18 Strict Mode handling
		if (effectRan.current === true || process.env.NODE_ENV !== "development") {
			const verifyRefreshToken = async () => {
				console.log("verifying refresh token");
				try {
					await refresh(null);
					setTrueSuccess(true);
				} catch (err) {
					console.error(err);
				}
			}
			if (!token && persist) verifyRefreshToken();
		}
		return () => { effectRan.current = true };
	}, [])

	if (!persist) { // persist: no
		console.log('no persist');
		return (
			<Outlet />
		);
	}

	if (isLoading) { // persist: yes, token: no => hang
		console.log('loading');
		return (
			<p>Loading...</p>
		);
	}

	if (isError) { // persist: yes, token: no => bad request for token
		console.log('error');
		return (
			<p className='errmsg'>
				{getQueryErrorMessage(isError, error)}
				<Link to="/login">Please login again</Link>.
			</p>
		);
	}

	if (isSuccess && trueSuccess) { // persist: yes, token: yes
		console.log('success');
		return (
			<Outlet />
		);
	}

	if (token && isUninitialized) { // persist: yes, token: yes
		console.log('token and uninit');
		console.log(isUninitialized);
		return (
			<Outlet />
		);
	}
}

export default PersistLogin;