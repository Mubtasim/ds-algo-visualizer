import { createSlice } from '@reduxjs/toolkit';

const graphSlice = createSlice({
  name: 'graph',
  initialState: { graph: null, isInitialized: false }, // Initial state for the graph
  reducers: {
    createGraph: (state, action) => {
      // Update the state with the graph and set isInitialized to true
      state.graph = action.payload;
      state.isInitialized = true;
    },
    updateGraph: (state, action) => {
      // Update the state with the updated graph
      state.graph = action.payload;
    },
    addLink: (state, action) => {
      // Update the graph with the new link
      const { fromNodeId, toNodeId, weight } = action.payload;
      state.graph.addLink(fromNodeId, toNodeId, { weight });
    },
  },
});

// Export the reducer and actions
export const { createGraph, updateGraph, addLink } = graphSlice.actions;
export default graphSlice.reducer;
