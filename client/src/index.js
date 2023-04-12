import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import store from './store'
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import DsList from './components/DsList';
import Stage from './components/Stage';
import Dijkstra from './components/Dijkstra';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />
    },
    {
      path: "/dslist",
      element: <DsList />
    },
    {
      path: "/stage",
      element: <Stage />
    },
    {
      path: "/1",
      element: <Dijkstra />
    }
  ]
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
