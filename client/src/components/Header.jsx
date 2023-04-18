import React from "react";
import logo from "../assets/logo.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const isAuthenticated = useSelector(
    (state) => state.authentication.isAuthenticated
  );

  return (
    <div className="header container">
      <Link to="/" className="header__logo">
        <img src={logo} alt="logo" className="header__logoImage" />
        <span className="header__logoText">DAV</span>
      </Link>
      <ul className="header__pages">
        <li>
          <Link to="/dslist">Ds list</Link>
        </li>
      </ul>
      <div className="header__user">
        {!isAuthenticated ? (
          <Link to="/userauth">Login/Register</Link>
        ) : (
          <Link to="/logout">Logout</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
