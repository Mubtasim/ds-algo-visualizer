import React from "react";
import apiServiceJWT from "../ApiServiceJWT";
import { useDispatch } from "react-redux";
import { addDs } from "../features/authentication/authenticationSlice";

const Completed = ({ dsId }) => {
  const dispatch = useDispatch();

  async function markComplete() {
    const data = await apiServiceJWT.markcomplete(dsId);
    dispatch(addDs(dsId));
  }

  return (
    <button className="button button__completed" onClick={markComplete}>
      Mark as completed
    </button>
  );
};

export default Completed;
