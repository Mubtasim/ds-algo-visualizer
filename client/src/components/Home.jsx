import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="hero container">
      <div className="hero__tagline">
        <h1 className="hero__title">DS & Algo Visualizer</h1>
        <div className="hero__subtitle">
          An interactive platform to visualize data structures & algorithms!
        </div>
      </div>
      <Link to="/dslist">
        <button className="hero__cta button">Start Visualizing</button>
      </Link>
    </div>
  );
};

export default Home;
