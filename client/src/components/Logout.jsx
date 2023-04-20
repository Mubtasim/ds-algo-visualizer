import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import auth from "../utils/auth";
import apiServiceJWT from "./../ApiServiceJWT";
import {
  setAuthentication,
  setUserData,
} from "../features/authentication/authenticationSlice";
import Header from "./Header";

const Logout = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async () => {
    await removeToken();
    Cookies.remove("accessToken");
    localStorage.removeItem("userData");
    handleAuth();
  };

  const removeToken = async () => {
    await apiServiceJWT.logout("accessToken");
  };

  const handleAuth = () => {
    // props.setIsAuthenticated(false);
    dispatch(setAuthentication(false));
    dispatch(setUserData(null));
    auth.logout(() => navigate("/"));
  };

  return (
    <div className="logout">
      <Header />
      <div className="logout__confirmation">
        <h1 className="logout__title">Are you sure you want to log out?</h1>
        <div className="yesOrNo">
          <button
            className="button button-outline"
            onClick={() => handleClick()}
          >
            Yes
          </button>
          <Link to="/">
            <button className="button">No</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Logout;
