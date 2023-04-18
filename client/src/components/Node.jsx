import React from "react";

const Node = ({ idx }) => {
  return (
    <div className="node">
      <div className="node__value">{idx}</div>
    </div>
  );
};

export default Node;
