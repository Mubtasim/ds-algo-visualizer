import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import Incompleted from "./Incompleted";
import Completed from "./completed";
import {
  updateItems,
  updateTotalItems,
} from "../features/bubbleSort/bubbleSortSlice";
import BubbleSortNode from "./BubbleSortNode";
import { setCurrentDs } from "../features/dsAndAlgos/dsAndAlgosSlice";

const BubbleSort = () => {
  const [isTutorialText, setIsTutorialText] = useState(false);
  const [isTutorialVideo, setIsTutorialVideo] = useState(false);
  const [speedInMiliSecond, setspeedInMiliSecond] = useState(1000);

  const items = useSelector((state) => state.bubbleSort.items);
  const totalItems = useSelector((state) => state.bubbleSort.totalItems);

  const userData = useSelector((state) => state.authentication.userData);
  const isAuthenticated = useSelector(
    (state) => state.authentication.isAuthenticated
  );
  const currentDs = useSelector((state) => state.dsAndAlgo.currentDs);
  const dsList = useSelector((state) => state.dsAndAlgo.dsList);

  const dispatch = useDispatch();

  useEffect(() => {
    if (dsList)
      dsList.forEach((ds) => {
        if (ds.slug === window.location.pathname.substring(1)) {
          dispatch(setCurrentDs(ds));
        }
      });
  }, []);

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function createItems(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const itemCount = parseInt(formJson.itemCount, 10);
    const newItems = Array(itemCount).fill(0);
    for (let i = 0; i < itemCount; i++)
      newItems[i] = getRandomArbitrary(1, 100);
    dispatch(updateTotalItems(itemCount));
    dispatch(updateItems(newItems));
  }

  function addToChecking(elem1, elem2) {
    elem1.classList.add("checking");
    elem2.classList.add("checking");
  }

  function addToSwapping(elem1, elem2) {
    elem1.classList.add("swapping");
    elem2.classList.add("swapping");
  }

  function unsetCheckingAndSwapping() {
    for (let i = 0; i < totalItems; i++) {
      const elem = document.getElementById(i);
      elem.classList.remove("swapping", "checking");
    }
  }

  function startBubbleSort(e) {
    e.preventDefault();

    let currentIdx = 0;
    let checking = true;
    let swapped = false;

    const bubbleArray = Array.from(Array(totalItems), () => Array(2).fill(-1));
    for (let i = 0; i < totalItems; i++) {
      bubbleArray[i][0] = items[i];
      bubbleArray[i][1] = i;
      // console.log("item[i], idx, bubbleArray[i]", items[i], i, bubbleArray[i]);
    }

    function bubbleSortLoop() {
      setTimeout(() => {
        unsetCheckingAndSwapping();
        if (currentIdx === totalItems - 1) {
          if (!swapped) return;
          currentIdx = 0;
          swapped = false;
          checking = true;
        } else {
          let nextIdx = currentIdx + 1;
          if (checking) {
            const currentDomId = bubbleArray[currentIdx][1];
            const nextDomId = bubbleArray[nextIdx][1];
            const currElem = document.getElementById(currentDomId);
            const nextElem = document.getElementById(nextDomId);
            addToChecking(currElem, nextElem);
            if (bubbleArray[currentIdx][0] > bubbleArray[nextIdx][0]) {
              checking = false;
            } else {
              currentIdx++;
            }
          } else {
            const currentDomId = bubbleArray[currentIdx][1];
            const nextDomId = bubbleArray[nextIdx][1];
            const currElem = document.getElementById(currentDomId);
            const nextElem = document.getElementById(nextDomId);
            const currObj = bubbleArray[currentIdx];
            bubbleArray[currentIdx] = bubbleArray[nextIdx];
            bubbleArray[nextIdx] = currObj;
            addToSwapping(currElem, nextElem);
            const currElemLeft = currElem.style.left;
            currElem.style.left = nextElem.style.left;
            nextElem.style.left = currElemLeft;
            currentIdx++;
            swapped = true;
            checking = true;
          }
        }
        bubbleSortLoop();
      }, speedInMiliSecond);
    }

    bubbleSortLoop();
  }

  return (
    <div className="bubbleSort">
      <Header />

      {isTutorialText && (
        <div className="tutorialText">
          <button
            className="button skipTutorial"
            onClick={() => setIsTutorialText(false)}
          >
            Skip Tutorial
          </button>
          <div className="tutorialText__text">
            {currentDs && currentDs.tutorialText}
          </div>
        </div>
      )}

      {isTutorialVideo && (
        <div className="tutorialVideo">
          {/* <iframe width="420" height="315" src="https://www.youtube.com/embed/tgbNymZ7vqY">
      </iframe> */}
          <button
            className="button skipTutorial"
            onClick={() => setIsTutorialVideo(false)}
          >
            Skip Tutorial Video
          </button>
          <iframe
            width="853"
            height="480"
            src={currentDs.tutorialVideoUrl}
            title="How Dijkstra&#39;s Algorithm Works"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;"
            allowfullscreen
          ></iframe>
        </div>
      )}

      {!isTutorialText && !isTutorialVideo && (
        <div className="visualize">
          <div className="stageAndInfo">
            <div className="info container">
              <h1 className="title">Bubble Sort Algorithm</h1>
              <button
                className="button button-outline"
                onClick={() => setIsTutorialText(true)}
              >
                <div className="button-text">Show Tutorial</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-info-circle icon"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </button>
              <button
                className="button button-outline"
                onClick={() => setIsTutorialVideo(true)}
              >
                <div className="button-text">Play Tutorial Video</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-play-circle icon"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                </svg>
              </button>
            </div>
            <div className="bubbleSortStage">
              <div className="bubbleNodes">
                {items.map((item, idx) => {
                  const radius = 2;
                  const offset = 0.8;
                  const pushLeft = (totalItems * (radius + offset)) / 2;
                  const leftPos = (radius + offset) * idx - pushLeft;
                  return (
                    <BubbleSortNode
                      value={item}
                      idx={idx}
                      key={idx}
                      leftPos={leftPos}
                      radius={radius}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="configurator">
            {/* <button className='button' onClick={() => setIsTutorialText(true)}>Show Tutorial</button>
        <button className='button' onClick={() => setIsTutorialVideo(true)}>Play Tutorial Video</button> */}

            <form className="createBubbleSortForm" onSubmit={createItems}>
              <label className="formlabel">Item Count</label>
              <input
                type="number"
                placeholder="Item Count"
                min="2"
                max="30"
                name="itemCount"
              />

              <button type="submit" className="button">
                Create List
              </button>
            </form>

            <form className="startBubbleSortForm" onSubmit={startBubbleSort}>
              <label className="formlabel">
                Speed (In Mili Second, Default=1000)
              </label>
              <input
                type="number"
                placeholder="Speed (In Mili Second)"
                min="100"
                max="5000"
                onChange={(e) =>
                  setspeedInMiliSecond(parseInt(e.target.value, 10))
                }
              />
              <button className="button" type="submit">
                Start Bubble Sort
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
      )}
    </div>
  );
};

export default BubbleSort;
