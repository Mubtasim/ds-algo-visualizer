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
      <h2>Are you sure you want to log out?</h2>
      <div className="logout__confirmation">
        <Link to="/">
          <button className="confirm-btn">No</button>
        </Link>
        <button className="confirm-btn" onClick={() => handleClick()}>
          Yes
        </button>
      </div>
    </div>
  );
};

export default Logout;
