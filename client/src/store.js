import { configureStore } from '@reduxjs/toolkit';
import binarySearchReducer from './features/binarySearch/binarySearchSlice'

const store = configureStore({
  reducer: {
    binarySearch: binarySearchReducer
  },
});

export default store;
