import {
	createSelector,
	createEntityAdapter,
	EntityState
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"
import { RootState } from "../../app/store";

// Define the Team type
export interface Team {
	id: string;
	_id: string;  // Comes from the backend
	name: string;
	owner_id: string;
	admin_ids: [string];
}

// Create an entity adapter for the Team type
const teamsAdapter = createEntityAdapter<Team>();

// Define the initial state using the adapter's getInitialState method
const initialState: EntityState<Team, string> = teamsAdapter.getInitialState();

// Inject endpoints into the api slice
export const teamsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTeams: builder.query<EntityState<Team, string>, void>({
			query: () => '/teams',
			keepUnusedDataFor: 5,
			transformResponse: (responseData: Team[]) => {
				const loadedTeams = responseData.map((team) => {
					team.id = team._id;
					return team;
				});
				return teamsAdapter.setAll(initialState, loadedTeams);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: 'Team', id: 'LIST' } as const,
						...result.ids.map((id) => ({ type: 'Team' as const, id })),
					];
				} else {
					return [{ type: 'Team', id: 'LIST' } as const];
				}
			},
		}),
		addNewTeam: builder.mutation({
			query: initialTeamData => ({
				url: "/teams",
				method: "POST",
				body: {
					...initialTeamData
				}
			}),
			invalidatesTags: [{
				type: "Team", id: "LIST"
			}]
		}),
		updateTeam: builder.mutation({
			query: initialTeamData => ({
				url: "/teams",
				method: "PATCH",
				body: {
					...initialTeamData
				}
			}),
			invalidatesTags: (result, error, arg) => [{
				type: "Team", id: arg.id
			}]
		}),
		deleteTeam: builder.mutation({
			query: ({ id }) => ({
				url: "/teams",
				method: "DELETE",
				body: { id }
			}),
			invalidatesTags: (result, error, arg) => [{
				type: "Team", id: arg.id
			}]
		}),
	}),
});

export const {
	useGetTeamsQuery,
	useAddNewTeamMutation,
	useDeleteTeamMutation,
	useUpdateTeamMutation
} = teamsApiSlice;

// returns the query result object
export const selectTeamsResult = teamsApiSlice.endpoints.getTeams.select();

// creates memoized selector
const selectTeamsData = createSelector(
	selectTeamsResult,
	teamsResult => teamsResult.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllTeams,
	selectById: selectTeamById,
	selectIds: selectTeamIds
	// Pass in a selector that returns the teams slice of state
} = teamsAdapter.getSelectors<RootState>(state => selectTeamsData(state) ?? initialState)