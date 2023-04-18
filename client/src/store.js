import { configureStore } from "@reduxjs/toolkit";
import binarySearchReducer from "./features/binarySearch/binarySearchSlice";
import authenticationReducer from "./features/authentication/authenticationSlice";

const store = configureStore({
  reducer: {
    binarySearch: binarySearchReducer,
    authentication: authenticationReducer,
  },
});

export default store;
