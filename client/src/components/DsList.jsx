import React, { useEffect } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import DsItem from "./DsItem";
import { useDispatch, useSelector } from "react-redux";
import { setDsList } from "../features/dsAndAlgos/dsAndAlgosSlice";
import apiServiceJWT from "../ApiServiceJWT";

const DsList = () => {
  const dsList = useSelector((state) => state.dsAndAlgo.dsList);
  const userData = useSelector((state) => state.authentication.userData);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getAllDs() {
      const newDsList = await apiServiceJWT.getalldsalgo();
      dispatch(setDsList(newDsList));
    }
    getAllDs();
  }, []);

  return (
    <div className="disListPage">
      <Header />
      <div className="dsList container">
        {dsList &&
          dsList.map((item, idx) => {
            console.log(item);
            return (
              <DsItem
                key={idx}
                title={item.name}
                text={item.subTitle}
                imageUrl={item.imageUrl}
                slug={item.slug}
                ds={item}
                completed={
                  userData && userData.completedDSAlgo.includes(item._id)
                }
              />
            );
          })}
        {/* <DsItem title="Dijkstra" text="Single source shortest path algorithm" />
        <DsItem title="Dijkstra" text="Single source shortest path algorithm" />
        <DsItem title="Dijkstra" text="Single source shortest path algorithm" />
        <DsItem title="Dijkstra" text="Single source shortest path algorithm" /> */}
      </div>
    </div>
  );
};

export default DsList;
