import React, { useState } from "react";
import Viva from "vivagraphjs";

import Header from "./Header";
import Incompleted from "./Incompleted";
import Completed from "./completed";
import { useSelector } from "react-redux";

const Dijkstra = () => {
  const [totalNode, setTotalNode] = useState(-1);
  const [minEdgeCount, setMinEdgeCount] = useState(-1);
  const [maxEdgeCount, setMaxEdgeCount] = useState(-1);
  const [minWeight, setMinWeight] = useState(-1);
  const [maxWeight, setMaxWeight] = useState(-1);
  const [algoGraph, setAlgoGraph] = useState(null);
  const [visualGraph, setVisualGraph] = useState(null);
  const [startNode, setStartNode] = useState(-1);
  const [endNode, setEndNode] = useState(-1);
  const [speedInMiliSec, setSpeedInMiliSec] = useState(100);
  const [isTutorialText, setIsTutorialText] = useState(false);
  const [isTutorialVideo, setIsTutorialVideo] = useState(false);

  const userData = useSelector((state) => state.authentication.userData);
  const isAuthenticated = useSelector(
    (state) => state.authentication.isAuthenticated
  );
  const currentDs = useSelector((state) => state.dsAndAlgo.currentDs);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function isConnected(algoGraph, src, dest) {
    const otherList = algoGraph[src];
    for (let node of otherList) {
      if (node.nodeIdx === dest) return true;
    }
    return false;
  }

  function getAlgoGraph() {
    const newAlgoGraph = Array(totalNode);

    for (let i = 0; i < totalNode; i++) {
      newAlgoGraph[i] = [];
    }

    for (let nodeIdx = 0; nodeIdx < totalNode; nodeIdx++) {
      const nowList = newAlgoGraph[nodeIdx];
      while (nowList.length < minEdgeCount) {
        const otherNodeIdx = getRandomInt(totalNode);
        if (
          otherNodeIdx === nodeIdx ||
          isConnected(newAlgoGraph, nodeIdx, otherNodeIdx)
        )
          continue;
        const otherList = newAlgoGraph[otherNodeIdx];
        if (
          otherList.length >= maxEdgeCount ||
          isConnected(newAlgoGraph, otherNodeIdx, nodeIdx)
        )
          continue;
        const nowWeight = getRandomArbitrary(minWeight, maxWeight + 1);
        nowList.push({ nodeIdx: otherNodeIdx, weight: nowWeight });
        otherList.push({ nodeIdx: nodeIdx, weight: nowWeight });
      }
    }

    return newAlgoGraph;
  }

  function getNewVisualGraph(newAlgoGraph) {
    const graph = Viva.Graph.graph();
    const layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength: 200, // Set desired spring length here
      springCoeff: 0.0002,
      dragCoeff: 0.02,
      gravity: -1.2,
    });

    const nodeCount = newAlgoGraph.length;

    const edgeAdded = Array.from(Array(nodeCount), () =>
      Array(nodeCount).fill(false)
    );
    for (let i = 0; i < nodeCount; i++) {
      for (let j = 0; j < nodeCount; j++) {
        edgeAdded[i][j] = false;
      }
    }

    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      graph.addNode(nodeIdx, { label: nodeIdx + 1 });
    }

    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      const nowList = newAlgoGraph[nodeIdx];
      for (let otherNode of nowList) {
        const otherIdx = otherNode.nodeIdx;
        if (edgeAdded[nodeIdx][otherIdx]) continue;
        if (edgeAdded[otherIdx][nodeIdx]) continue;
        graph.addLink(nodeIdx, otherIdx, { weight: otherNode.weight });
        edgeAdded[nodeIdx][otherIdx] = true;
        edgeAdded[otherIdx][nodeIdx] = true;
      }
    }

    // Create SVG graphics for the graph
    const graphics = Viva.Graph.View.svgGraphics();

    // Set up node rendering
    graphics
      .node((node) => {
        console.log();
        const label = node.data.label;
        const nodeUI = Viva.Graph.svg("g")
          .attr("class", "node")
          .attr("cursor", "pointer");

        // Render circle
        nodeUI.append(
          Viva.Graph.svg("circle")
            .attr("r", 15)
            // .attr('fill', 'lightblue')
            .attr("style", "fill: lightblue;")
        );

        // Render label
        nodeUI.append(
          Viva.Graph.svg("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text(label)
        );

        // Render Dist
        const dist = Viva.Graph.svg("text")
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          // .attr('fill', 'green')
          .attr("style", "fill: green;")
          .text("");

        nodeUI.append(dist);

        return nodeUI;
      })
      .placeNode(function (nodeUI, pos) {
        nodeUI.children[0].attr("cx", pos.x).attr("cy", pos.y);
        nodeUI.children[1].attr("x", pos.x).attr("y", pos.y);
        nodeUI.children[2].attr("x", pos.x - 10).attr("y", pos.y - 10);
      });

    // Set up link rendering
    graphics
      .link((link) => {
        const linkUI = Viva.Graph.svg("g");

        const line = Viva.Graph.svg("line").attr(
          "style",
          "stroke: #999; stroke-width: 2"
        );

        linkUI.append(line);

        const text = Viva.Graph.svg("text")
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .text(link.data.weight);

        linkUI.append(text);

        return linkUI;
      })
      .placeLink(function (linkUI, fromPos, toPos) {
        const line = linkUI.children[0];
        const text = linkUI.children[1];
        line.attr("x1", fromPos.x).attr("y1", fromPos.y);
        line.attr("x2", toPos.x).attr("y2", toPos.y);

        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;

        text.attr("x", midX).attr("y", midY);
      });

    // Create the renderer and render the graph
    const renderer = Viva.Graph.View.renderer(graph, {
      graphicsType: "svg",
      container: document.getElementById("graph-container"),
      graphics: graphics,
      layout: layout,
    });

    renderer.run();
    return { graph, layout, graphics, renderer };
  }

  function getAndRenderVisualGraph(newAlgoGraph) {
    if (!visualGraph) return getNewVisualGraph(newAlgoGraph);

    const { graph, layout, graphics, renderer } = visualGraph;
    graph.clear();

    const nodeCount = newAlgoGraph.length;

    const edgeAdded = Array.from(Array(nodeCount), () =>
      Array(nodeCount).fill(false)
    );
    for (let i = 0; i < nodeCount; i++) {
      for (let j = 0; j < nodeCount; j++) {
        edgeAdded[i][j] = false;
      }
    }

    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      graph.addNode(nodeIdx, { label: nodeIdx + 1 });
    }

    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      const nowList = newAlgoGraph[nodeIdx];
      for (let otherNode of nowList) {
        const otherIdx = otherNode.nodeIdx;
        if (edgeAdded[nodeIdx][otherIdx]) continue;
        if (edgeAdded[otherIdx][nodeIdx]) continue;
        graph.addLink(nodeIdx, otherIdx, { weight: otherNode.weight });
        edgeAdded[nodeIdx][otherIdx] = true;
        edgeAdded[otherIdx][nodeIdx] = true;
      }
    }

    return { graph, layout, graphics, renderer };
  }

  function createAlgoAndVisualGraph(e) {
    e.preventDefault();

    const newAlgoGraph = getAlgoGraph();
    const newVisualGraph = getAndRenderVisualGraph(newAlgoGraph);

    setAlgoGraph(newAlgoGraph);
    setVisualGraph(newVisualGraph);
  }

  function compareFn(a, b) {
    if (a.dist < b.dist) {
      return -1;
    }

    if (a.dist > b.dist) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

  function reset(e) {
    e.preventDefault();
    const { graph, graphics } = visualGraph;

    for (let i = 0; i < totalNode; i++) {
      const nodeUI = graphics.getNodeUI(i);
      // nodeUI.children[0].attr('fill', 'lightblue');
      nodeUI.children[0].attr("style", "fill: lightblue;");
      nodeUI.children[2].text("");
      const links = graph.getLinks(i);
      for (let link of links) {
        const linkUI = graphics.getLinkUI(link.id);
        linkUI.children[0].attr("style", "stroke: #999; stroke-width: 2");
      }
    }
  }

  function SSSP(e) {
    e.preventDefault();
    const { graph, graphics } = visualGraph;
    const nodeCount = algoGraph.length;
    const startNodeIdx = startNode - 1;

    const priorityQueue = [];
    const addNode = { node: startNodeIdx, from: -1, dist: 0 };
    priorityQueue.push(addNode);

    const processsed = Array(nodeCount).fill(false);
    const INF = 1000000;
    const dist = Array(nodeCount).fill(INF);
    dist[startNodeIdx] = 0;
    const fromNodes = Array(nodeCount).fill(-1);

    function markPath() {
      let nowNodeIdx = endNode - 1;

      while (nowNodeIdx !== -1) {
        const nowNodeUI = graphics.getNodeUI(nowNodeIdx);
        // nowNodeUI.children[0].attr('fill', 'pink');
        nowNodeUI.children[0].attr("style", "fill: pink");
        let fromNodeIdx = fromNodes[nowNodeIdx];

        if (fromNodeIdx !== -1) {
          let link = graph.getLink(nowNodeIdx, fromNodeIdx);
          if (!link) link = graph.getLink(fromNodeIdx, nowNodeIdx);
          const linkId = link.id;
          const linkUI = graphics.getLinkUI(linkId);
          linkUI.children[0].attr("style", "stroke: pink; stroke-width: 5");
        }

        nowNodeIdx = fromNodeIdx;
      }
    }

    function traversingLoop() {
      setTimeout(function () {
        const top = priorityQueue.shift();
        const src = top.node;
        const nowDist = top.dist;
        const from = top.from;

        if (!processsed[src]) {
          processsed[src] = true;
          const nowNodeUI = graphics.getNodeUI(src);
          // nowNodeUI.children[0].attr('fill', 'lightgreen');
          nowNodeUI.children[0].attr("style", "fill: lightgreen");
          nowNodeUI.children[2].text(nowDist);

          if (from !== -1) {
            let link = graph.getLink(src, from);
            if (!link) link = graph.getLink(from, src);
            const linkId = link.id;
            const linkUI = graphics.getLinkUI(linkId);
            linkUI.children[0].attr("style", "stroke: green; stroke-width: 3");
          }

          for (const otherNode of algoGraph[src]) {
            const { nodeIdx, weight } = otherNode;
            if (dist[src] + weight < dist[nodeIdx]) {
              dist[nodeIdx] = dist[src] + weight;
              priorityQueue.push({
                node: nodeIdx,
                from: src,
                dist: dist[nodeIdx],
              });
              fromNodes[nodeIdx] = src;
            }
          }

          priorityQueue.sort(compareFn);
        }

        if (priorityQueue.length > 0) {
          traversingLoop();
        } else {
          markPath();
        }
      }, speedInMiliSec);
    }

    traversingLoop();
  }

  return (
    <div className="disjkstra">
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
              <h1 className="title">Dijkstra Algorithm</h1>
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
            <div className="dijkstraStage" id="graph-container"></div>
          </div>
          <div className="configurator">
            {/* <button className='button' onClick={() => setIsTutorialText(true)}>Show Tutorial</button>
              <button className='button' onClick={() => setIsTutorialVideo(true)}>Play Tutorial Video</button> */}

            <form
              className="createGraphForm"
              onSubmit={createAlgoAndVisualGraph}
            >
              <label className="formlabel">Node Count</label>
              <input
                type="number"
                placeholder="Node Count"
                min="2"
                max="100"
                onChange={(e) => setTotalNode(parseInt(e.target.value, 10))}
              />
              <label className="formlabel">Minimum Edge Count Per Node</label>
              <input
                type="number"
                placeholder="Min Edge Count"
                min="1"
                max="99"
                onChange={(e) => setMinEdgeCount(parseInt(e.target.value, 10))}
              />
              <label className="formlabel">Maximum Edge Count Per Node</label>
              <input
                type="number"
                placeholder="Max Edge Count"
                min="1"
                max="99"
                onChange={(e) => setMaxEdgeCount(parseInt(e.target.value, 10))}
              />
              <label className="formlabel">Min Weight</label>
              <input
                type="number"
                placeholder="Min Weight"
                min="1"
                max="99"
                onChange={(e) => setMinWeight(parseInt(e.target.value, 10))}
              />
              <label className="formlabel">Max Weight</label>
              <input
                type="number"
                placeholder="Max Weight"
                min="1"
                max="99"
                onChange={(e) => setMaxWeight(parseInt(e.target.value, 10))}
              />
              <button
                type="submit"
                className="button"
                disabled={
                  totalNode === -1 ||
                  minEdgeCount === -1 ||
                  maxEdgeCount === -1 ||
                  minWeight === -1 ||
                  maxWeight === -1
                }
              >
                Create Graph
              </button>
              <button className="button" onClick={reset}>
                Reset
              </button>
            </form>

            <form className="startAndEndForm" onSubmit={SSSP}>
              <label className="formlabel">Start Node</label>
              <input
                type="number"
                placeholder="Start Node"
                min="1"
                max={`${totalNode}`}
                onChange={(e) => setStartNode(parseInt(e.target.value, 10))}
              />
              <label className="formlabel">End Node</label>
              <input
                type="number"
                placeholder="End Node"
                min="1"
                max={`${totalNode}`}
                onChange={(e) => setEndNode(parseInt(e.target.value, 10))}
              />
              <label className="formlabel">
                Speed (In Mili Second, Default=100)
              </label>
              <input
                type="number"
                placeholder="Speed (In Mili Second)"
                min="100"
                max="5000"
                onChange={(e) =>
                  setSpeedInMiliSec(parseInt(e.target.value, 10))
                }
              />
              <button
                type="submit"
                className="button"
                disabled={
                  startNode === -1 ||
                  endNode === -1 ||
                  algoGraph === null ||
                  visualGraph === null
                }
              >
                Start Dijkstra
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

export default Dijkstra;
