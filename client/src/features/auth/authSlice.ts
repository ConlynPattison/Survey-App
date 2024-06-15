import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
	token?: string | null
}

const initialState: AuthState = { token: null };

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken } = action.payload;
			state.token = accessToken;
		},
		logOut: (state) => {
			state.token = null;
		}
	}
});

export const { setCredentials, logOut } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;

/** Named relative to authSlice name property */
type NamedAuthState = {
	auth: AuthState
}

export const selectCurrentToken = (state: NamedAuthState) => state.auth.token;
