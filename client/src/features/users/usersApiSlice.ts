import {
	createSelector,
	createEntityAdapter,
	EntityState
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"
import { RootState } from "../../app/store";

// Define the User type
export interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	_id: string;  // Comes from the backend
	// Add other user properties as needed
}

// Create an entity adapter for the User type
const usersAdapter = createEntityAdapter<User>();

// Define the initial state using the adapter's getInitialState method
const initialState: EntityState<User, string> = usersAdapter.getInitialState();

// Inject endpoints into the api slice
export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query<EntityState<User, string>, void>({
			query: () => '/users',
			keepUnusedDataFor: 5,
			transformResponse: (responseData: User[]) => {
				const loadedUsers = responseData.map((user) => {
					user.id = user._id;
					return user;
				});
				return usersAdapter.setAll(initialState, loadedUsers);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: 'User', id: 'LIST' } as const,
						...result.ids.map((id) => ({ type: 'User' as const, id })),
					];
				} else {
					return [{ type: 'User', id: 'LIST' } as const];
				}
			},
		}),
	}),
});

export const { useGetUsersQuery } = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
	selectUsersResult,
	usersResult => usersResult.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds
	// Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors<RootState>(state => selectUsersData(state) ?? initialState)