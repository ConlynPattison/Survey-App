import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost:8081",
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;

		if (token) {
			headers.set("authorization", `Bearer: ${token}`);
		}
		return headers;
	}
});

const baseQueryWithReAuth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.status === 403) {
		console.log("sending refresh token");

		// send refresh token to fetch new access token
		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

		if (refreshResult?.data) {
			// store access token
			api.dispatch(setCredentials({ ...refreshResult.data }));

			// retry query
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403) {
				refreshResult.error.data = "Your login has expired. ";
			}
			return refreshResult;
		}
	}
	return result;
}

/**
 * A service for use in application with base, core Redux logic contained.
 * @note The import module for createApi and fetchBaseQuery must be .../react
 * @todo: change the baseUrl before deployment
 */
export const apiSlice = createApi({
	baseQuery: baseQueryWithReAuth,
	tagTypes: ["Team", "User"],
	endpoints: builder => ({})
});
