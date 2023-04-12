import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './features/graph/graphSlice';

const store = configureStore({
  reducer: {
    graph: graphReducer,
  },
});

export default store;
