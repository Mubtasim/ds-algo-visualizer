import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setAuthentication,
  setUserData,
} from "../features/authentication/authenticationSlice";
import auth from "../utils/auth";
import apiServiceJWT from "./../ApiServiceJWT";
import Header from "./Header";

const initialState = {
  email: "",
  password: "",
  fullName: "",
};

const SignUp = ({ toggleSignUp }) => {
  let navigate = useNavigate();
  const [state, setState] = useState(initialState);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Check the client-session to see how to handle redirects
    e.preventDefault();
    // Add logic to send send a request to the API service /register

    // This sets isAuthenticated = true and redirects to profile
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    await apiServiceJWT.register(formJson);
    const data = await apiServiceJWT.login(formJson);
    const userData = {
      email: data.data.email,
      fullName: data.data.fullName,
      completedDSAlgo: data.data.completedDSAlgo,
    };
    // localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    Cookies.set("accessToken", data.accessToken);
    // props.setIsAuthenticated(true);
    dispatch(setAuthentication(true));
    dispatch(setUserData(userData));
    auth.login(() => navigate("/"));
  };

  const validateForm = () => {
    return !state.email || !state.password || !state.fullName;
  };

  return (
    <div className="signUpPage">
      <Header />
      <div className="signUp">
        <h1 className="formTitle">Create Account</h1>
        <form action="#" className="signUp__form form" onSubmit={handleSubmit}>
          <label htmlFor="name" className="formlabel">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={state.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <label htmlFor="email" className="formlabel">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <label htmlFor="password" className="formlabel">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <button type="submit" className="button" disabled={validateForm()}>
            Sign Up
          </button>
        </form>
        <div className="toggler">
          Already a user? &nbsp; &nbsp;
          <button className="button button-outline" onClick={toggleSignUp}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
