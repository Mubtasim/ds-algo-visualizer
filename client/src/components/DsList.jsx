import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";

const DsList = () => {
  return (
    <div className="disListPage">
      <Header />
      <div className="dsList">
        <Link to="/1">
          <button className="button">Dijkstra</button>
        </Link>
        <Link to="/2">
          <button className="button">Binary Search</button>
        </Link>
      </div>
    </div>
  );
};

export default DsList;
