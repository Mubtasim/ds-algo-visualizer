import { createSlice } from "@reduxjs/toolkit";

const dsAndAlgoSlice = createSlice({
  name: "dsAndAlgo",
  initialState: { dsList: null, currentDs: null }, // Initial state for the graph
  reducers: {
    setDsList: (state, action) => {
      // Update the state with the items
      state.dsList = action.payload;
    },
    setCurrentDs: (state, action) => {
      state.currentDs = action.payload;
    },
  },
});

// Export the reducer and actions
export const { setDsList, setCurrentDs } = dsAndAlgoSlice.actions;
export default dsAndAlgoSlice.reducer;
