import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * A service for use in application with base, core Redux logic contained.
 * @note The import module for createApi and fetchBaseQuery must be .../react
 * @todo: change the baseUrl before deployment
 */
export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8081" }),
	tagTypes: ["Team", "User"],
	endpoints: builder => ({})
});