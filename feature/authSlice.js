import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start as true to wait for initial loadUser check
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set the user and update authentication status
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    // Action to log the user in (alternative naming)
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.user;
      state.loading = false;
    },
    // Action to log the user out and reset authentication status
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    // Action to log out the user (alternative naming)
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

// Export actions and reducer
export const { setUser, userLoggedIn, logoutUser, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;