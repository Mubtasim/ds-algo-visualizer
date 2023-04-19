import React from "react";
import { Link } from "react-router-dom";
import dsItemDemoImage from "../assets/dsItemDemoImage.jpg";
import completedIcon from "../assets/completedIcon.svg";
import { setCurrentDs } from "../features/dsAndAlgos/dsAndAlgosSlice";
import { useDispatch } from "react-redux";

const DsItem = ({ title, text, imageUrl, slug, ds, completed }) => {
  const dispatch = useDispatch();

  return (
    <div className="dsItem">
      <img
        src={completedIcon}
        alt=""
        className={completed ? "completed" : "incompleted"}
      />
      <img src={imageUrl} alt="Demo" className="dsItem__image" />
      <div className="dsItem__body">
        <h4 className="dsItem__title">{title}</h4>
        <p className="dsItem__text">{text}</p>
        <Link
          to={`/${slug}`}
          className="button dsItem__button"
          onClick={() => dispatch(setCurrentDs(ds))}
        >
          Visualize
        </Link>
      </div>
    </div>
  );
};

export default DsItem;
