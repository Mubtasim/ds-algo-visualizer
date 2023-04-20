import { configureStore } from "@reduxjs/toolkit";
import binarySearchReducer from "./features/binarySearch/binarySearchSlice";
import authenticationReducer from "./features/authentication/authenticationSlice";
import dsAndAlgoReducer from "./features/dsAndAlgos/dsAndAlgosSlice";
import bubbleSortSlice from "./features/bubbleSort/bubbleSortSlice";

const store = configureStore({
  reducer: {
    binarySearch: binarySearchReducer,
    authentication: authenticationReducer,
    dsAndAlgo: dsAndAlgoReducer,
    bubbleSort: bubbleSortSlice,
  },
});

export default store;
