import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const cookie = Cookies.get("accessToken", { domain: "localhost:3000" });

const authenticationSlice = createSlice({
  name: "authentication",
  initialState: { isAuthenticated: !!cookie }, // Initial state for the graph
  reducers: {
    setAuthentication: (state, action) => {
      // update authentication state to true or false
      state.isAuthenticated = action.payload;
    },
  },
});

// Export the reducer and actions
export const { setAuthentication } = authenticationSlice.actions;
export default authenticationSlice.reducer;
