import { createSlice } from "@reduxjs/toolkit";

const bubbleSortSlice = createSlice({
  name: "bubbleSort",
  initialState: { items: [], totalItems: -1 }, // Initial state for the graph
  reducers: {
    updateItems: (state, action) => {
      // Update the state with the items
      state.items = action.payload;
    },
    updateTotalItems: (state, action) => {
      // Update count of totalItems
      state.totalItems = action.payload;
    },
  },
});

// Export the reducer and actions
export const { updateItems, updateTotalItems } = bubbleSortSlice.actions;
export default bubbleSortSlice.reducer;
