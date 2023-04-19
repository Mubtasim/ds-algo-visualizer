import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const cookie = Cookies.get("accessToken", { domain: "localhost:3000" });
let userData = null;
if (cookie) {
  const localStorageData = localStorage.getItem("userData");
  if (localStorageData) userData = JSON.parse(localStorageData);
}

const authenticationSlice = createSlice({
  name: "authentication",
  initialState: { isAuthenticated: !!cookie, userData: userData }, // Initial state for the graph
  reducers: {
    setAuthentication: (state, action) => {
      // update authentication state to true or false
      state.isAuthenticated = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    addDs: (state, action) => {
      const dsId = action.payload;
      let idx = state.userData.completedDSAlgo.indexOf(dsId);
      if (idx === -1) {
        state.userData.completedDSAlgo.push(action.payload);
      }
    },
    removeDs: (state, action) => {
      const dsId = action.payload;
      let idx = state.userData.completedDSAlgo.indexOf(dsId);
      if (idx > -1) {
        state.userData.completedDSAlgo.splice(idx, 1);
      }
    },
  },
});

// Export the reducer and actions
export const { setAuthentication, setUserData, addDs, removeDs } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;
