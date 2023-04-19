import React from "react";
import { removeDs } from "../features/authentication/authenticationSlice";
import { useDispatch } from "react-redux";
import apiServiceJWT from "../ApiServiceJWT";

const Incompleted = ({ dsId }) => {
  const dispatch = useDispatch();

  async function markIncomplete() {
    const data = await apiServiceJWT.markincomplete(dsId);
    dispatch(removeDs(dsId));
  }

  return (
    <button className="button button__incompleted" onClick={markIncomplete}>
      Mark as incompleted
    </button>
  );
};

export default Incompleted;
