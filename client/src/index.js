import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import store from "./store";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DsList from "./components/DsList";
import Stage from "./components/Stage";
import Dijkstra from "./components/Dijkstra";
import BinarySearch from "./components/BinarySearch";
import UserAuth from "./components/UserAuth";
import Logout from "./components/Logout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dslist",
    element: <DsList />,
  },
  {
    path: "/stage",
    element: <Stage />,
  },
  {
    path: "/dijkstra",
    element: <Dijkstra />,
  },
  {
    path: "/binarysearch",
    element: <BinarySearch />,
  },
  {
    path: "/userauth",
    element: <UserAuth />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
