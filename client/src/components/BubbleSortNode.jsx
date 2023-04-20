import React from "react";

const BubbleSortNode = ({ value, idx, leftPos, radius }) => {
  function getRem(value) {
    return `${value}rem`;
  }
  return (
    <div
      className="bubbleSortNode"
      id={idx}
      style={{
        top: 0,
        left: getRem(leftPos),
        width: getRem(radius),
        height: getRem(radius),
      }}
    >
      <div className="bubbleSortNode__text">{value}</div>
      {/* <div className="bubbleSortNodeIdx">{idx}</div> */}
    </div>
  );
};

export default BubbleSortNode;
