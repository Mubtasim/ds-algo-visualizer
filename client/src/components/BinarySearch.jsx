import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  updateItems,
  updateItemToFind,
  updateTotalItems,
} from "../features/binarySearch/binarySearchSlice";
import Header from "./Header";
import BinaryItem from "./BinaryItem";
import Incompleted from "./Incompleted";
import Completed from "./completed";

const BinarySearch = () => {
  const [screenSize, setScreenSize] = useState(getCurrenDimension());

  const items = useSelector((state) => state.binarySearch.items);
  const itemToFind = useSelector((state) => state.binarySearch.itemToFind);
  const totalItems = useSelector((state) => state.binarySearch.totalItems);
  const userData = useSelector((state) => state.authentication.userData);
  const isAuthenticated = useSelector(
    (state) => state.authentication.isAuthenticated
  );
  const currentDs = useSelector((state) => state.dsAndAlgo.currentDs);

  const dispatch = useDispatch();

  function getCurrenDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrenDimension());
    };

    window.addEventListener("resize", updateDimension);
    reset();

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize, totalItems]);

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function compareFn(a, b) {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

  function createItems(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const itemCount = parseInt(formJson.itemCount, 10);
    const newItems = Array(itemCount).fill(0);
    for (let i = 0; i < itemCount; i++)
      newItems[i] = getRandomArbitrary(1, 10001);
    newItems.sort(compareFn);
    dispatch(updateTotalItems(itemCount));
    dispatch(updateItems(newItems));
  }

  function setItemToFind(e) {
    const value = parseInt(e.target.value, 10);
    dispatch(updateItemToFind(value));
  }

  function includeBarInBoundary(nodeId) {
    const barToMark = document.getElementById(`${nodeId}`);
    barToMark.children[0].classList.add("inBoundary");
  }

  function excludeFromBoundary(nodeId) {
    const barToMark = document.getElementById(`${nodeId}`);
    barToMark.children[0].classList.remove("inBoundary", "midBar");
  }

  function markBarAsMid(nodeId) {
    const barToMark = document.getElementById(`${nodeId}`);
    barToMark.children[0].classList.add("midBar");
  }

  function showFoundInfo(found, at) {
    const foundInfoElem = document.getElementById("binaryFoundOrNot");
    let foundText = "Value not found!";
    if (found && at) foundText = `Value found at index => ${at + 1}`;
    foundInfoElem.innerText = foundText;
  }

  function showInfo(nodeId, value, type) {
    const infoElem = document.getElementById(nodeId);
    let infoText = "Left Boundary";
    if (type === "r") infoText = "Right Boundary";
    if (type === "m") infoText = "Middle";
    infoText += " => ";
    infoText += value.toString();
    infoElem.innerText = infoText;
  }

  function reset() {
    const valueToFindElem = document.getElementById("binaryValueToFind");
    const leftBoundaryElem = document.getElementById("leftBoundary");
    const middleElem = document.getElementById("middle");
    const rightBoundaryElem = document.getElementById("rightBoundary");
    const foundAtElem = document.getElementById("binaryFoundOrNot");
    [
      valueToFindElem,
      leftBoundaryElem,
      middleElem,
      rightBoundaryElem,
      foundAtElem,
    ].forEach((item) => (item.innerText = ""));
    for (let i = 0; i < totalItems; i++) {
      excludeFromBoundary(i.toString());
    }
  }

  function binarySearch(e) {
    e.preventDefault();

    reset();

    const infoElem = document.getElementById("binaryValueToFind");
    infoElem.innerText = `Value to find => ${itemToFind}`;

    let l = 0;
    let r = totalItems - 1;
    let midIdx = -1;
    let prevL = 0;
    let prevR = 0;

    let found = false;
    let firstIteration = true;

    function binarySearchLoop() {
      setTimeout(() => {
        if (firstIteration) {
          for (let i = 0; i < totalItems; i++) {
            includeBarInBoundary(i.toString());
          }
          firstIteration = false;
        }

        midIdx = Math.floor((l + r) / 2);
        showInfo("leftBoundary", l + 1, "l");
        showInfo("rightBoundary", r + 1, "r");
        showInfo("middle", midIdx + 1, "m");

        for (let i = prevL; i < l; i++) {
          excludeFromBoundary(i.toString());
        }

        for (let i = r + 1; i <= prevR; i++) {
          excludeFromBoundary(i.toString());
        }

        markBarAsMid(midIdx.toString());
        const midValue = items[midIdx];

        if (midValue === itemToFind) {
          console.log("found at index", midIdx);
          showFoundInfo(true, midIdx);
          found = true;
        } else if (itemToFind > midValue) {
          prevL = l;
          l = midIdx + 1;
        } else {
          prevR = r;
          r = midIdx - 1;
        }

        if (l > r) {
          console.log("Item not found");
          showFoundInfo(false);
        } else if (!found) {
          binarySearchLoop();
        }
      }, 5000);
    }

    binarySearchLoop();
  }

  function getRelativeHeight(maxItem, currentItem, offset, highest) {
    const factor = currentItem / maxItem;
    const height = highest * factor + offset;
    return height;
  }

  function getRelativeWidth(currentScreenWidth, currentTotalItems) {
    const canTakeWidth = currentScreenWidth - 300;
    return canTakeWidth / (2 * currentTotalItems);
  }

  return (
    <div className="binarySearch">
      <Header />
      <div className="visualize">
        <div id="binaryInfos">
          <div id="binaryValueToFind"></div>
          <div id="leftBoundary"></div>
          <div id="middle"></div>
          <div id="rightBoundary"></div>
          <div id="binaryFoundOrNot" style={{ color: "lightgreen" }}></div>
          <div id="hoverValue"></div>
        </div>
        <div className="binarySearchStage">
          <div className="binaryBars">
            {items &&
              items.map((item, idx) => {
                const height = getRelativeHeight(
                  items[totalItems - 1],
                  item,
                  50,
                  400
                );
                const width = getRelativeWidth(screenSize.width, totalItems);
                return (
                  <BinaryItem
                    key={idx}
                    id={idx}
                    value={item}
                    width={width}
                    height={height}
                  />
                );
              })}
          </div>
        </div>
        <div className="configurator">
          <form className="createListForm" onSubmit={createItems}>
            <label className="formlabel">Item Count</label>
            <input
              type="number"
              name="itemCount"
              placeholder="Item Count"
              min="1"
              max="5000"
            />
            <button type="submit" className="button">
              Create List
            </button>
          </form>
          <form action="" className="findNumberForm" onSubmit={binarySearch}>
            <label className="formlabel">
              Number to find (hover over the bars to the see their values)
            </label>
            <input
              type="number"
              name="numberToFind"
              placeholder="Number to find"
              onChange={(e) => setItemToFind(e)}
            />
            <button type="submit" className="button">
              Start Searching
            </button>
          </form>
          {isAuthenticated && currentDs && (
            <div className="completed">
              {userData.completedDSAlgo.includes(currentDs._id) ? (
                <Incompleted dsId={currentDs._id} />
              ) : (
                <Completed dsId={currentDs._id} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BinarySearch;
