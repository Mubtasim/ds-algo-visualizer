import { createSlice } from '@reduxjs/toolkit';

const binarySearchSlice = createSlice({
  name: 'binarySearch',
  initialState: { left: -1, right: -1, mid: -1, items: [], totalItems: -1, itemToFind: -1 }, // Initial state for the graph
  reducers: {
    updateItems: (state, action) => {
      // Update the state with the items
      state.items = action.payload;
    },
    updateLeft: (state, action) => {
      // Update the left pointer
      state.left = action.payload;
    },
    updateRight: (state, action) => {
      // Update the right pointer
      state.right = action.payload;
    },
    updateMid: (state, action) => {
      // Updatte the mid pointer
      state.mid = action.payload;
    },
    updateItemToFind: (state, action) => {
      // Updatte the mid pointer
      state.itemToFind = action.payload;
    },
    updateTotalItems : (state, action) => {
      // Updatte the mid pointer
      state.totalItems = action.payload;
    }
  },
});

// Export the reducer and actions
export const { updateItems, updateLeft, updateRight, updateMid, updateItemToFind, updateTotalItems } = binarySearchSlice.actions;
export default binarySearchSlice.reducer;
