import React, { useEffect, useRef, useState } from 'react'
import Viva from 'vivagraphjs';

import Header from './Header'
// import { useDispatch, useSelector } from 'react-redux';
// import { createGraph, addLink } from '../features/graph/graphSlice';

const Dijkstra = () => {
  const [algoGraph, setAlgoGraph] = useState(null)
  const [visualGraph, setVisualGraph] = useState(null)
  const [startNode, setStartNode] = useState(-1)
  const [endNode, setEndNode] = useState(-1)
  const isInitialized = useRef(false);
  
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function createAlgoGraph (nodeCount, minEdgeCount, maxEdgeCount, minWeight, maxWeight) {
    nodeCount = Math.max(2, nodeCount);
    maxEdgeCount = Math.min(maxEdgeCount, nodeCount - 1);
    minEdgeCount = Math.max(1, minEdgeCount);
    const newAlgoGraph = Array.from(Array(nodeCount), () => Array(0).fill(null));
    for (let nodeIdx = 0; nodeIdx < newAlgoGraph.length; nodeIdx++) {
      const nowList = newAlgoGraph[nodeIdx];
      while(nowList.length < minEdgeCount) {
        const otherNodeIdx = getRandomInt(nodeCount);
        if (otherNodeIdx === nodeIdx) continue;
        // console.log('nodeIdx, otherNodeIdx', nodeIdx, otherNodeIdx)
        const otherList = newAlgoGraph[otherNodeIdx];
        if (otherList.length >= maxEdgeCount) continue;
        const nowWeight = getRandomArbitrary(minWeight, maxWeight + 1);
        if (!nowList.includes(otherNodeIdx))  nowList.push({nodeIdx: otherNodeIdx, weight: nowWeight});
        if (!otherList.includes(nodeIdx)) otherList.push({nodeIdx: nodeIdx, weight: nowWeight});
      }
    }

    return newAlgoGraph;
  }

  function renderGraph(algoGraph) {
    // Create an empty graph
    const graph = Viva.Graph.graph();
    const layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength: 200, // Set desired spring length here
      springCoeff: 0.0002,
      dragCoeff: 0.02,
      gravity: -1.2
    })

    const nodeCount = algoGraph.length;

    const edgeAdded = Array.from(Array(nodeCount), () => Array(nodeCount).fill(false));
    for (let i = 0; i < nodeCount; i++) {
      for (let j = 0; j < nodeCount; j++) {
        edgeAdded[i][j] = false;
      }
    }
    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      graph.addNode(nodeIdx, {label: nodeIdx + 1});
    }

    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      const nowList = algoGraph[nodeIdx];
      for (let otherNode of nowList) {
        // console.log('before Continue nodeIdx, otherIdx', nodeIdx, otherIdx)
        const otherIdx = otherNode.nodeIdx;
        if (edgeAdded[nodeIdx][otherIdx]) continue;
        if (edgeAdded[otherIdx][nodeIdx]) continue;
        // console.log('after Continue nodeIdx, otherIdx', nodeIdx, otherIdx)
        graph.addLink(nodeIdx, otherIdx, {weight: otherNode.weight});
        edgeAdded[nodeIdx][otherIdx] = true;
        edgeAdded[otherIdx][nodeIdx] = true;
      }
    }

    // Create SVG graphics for the graph
    const graphics = Viva.Graph.View.svgGraphics();

    // Set up node rendering
    graphics.node((node) => {
      console.log()
      const label = node.data.label;
      const nodeUI = Viva.Graph.svg('g')
        .attr('class', 'node')
        .attr('cursor', 'pointer');

      // Render circle
      nodeUI.append(
        Viva.Graph.svg('circle')
          .attr('r', 15)
          .attr('fill', 'lightblue')
      );

      // Render label
      nodeUI.append(
        Viva.Graph.svg('text')
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .text(label)
      );

      return nodeUI;
    })
    .placeNode(function (nodeUI, pos) {
      nodeUI.children[0].attr('cx', pos.x).attr('cy', pos.y)
      nodeUI.children[1].attr('x', pos.x).attr('y', pos.y)
    })

    // Set up link rendering
    graphics.link((link) => {
      const linkUI = Viva.Graph.svg('g');

      const line = Viva.Graph.svg('line')
        .attr('style', 'stroke: #999; stroke-width: 2')

      linkUI.append(line);

      const text = Viva.Graph.svg('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .text(link.data.weight)

      linkUI.append(text);

      return linkUI;
    })
    .placeLink(function (linkUI, fromPos, toPos) {
      const line = linkUI.children[0];
      const text = linkUI.children[1];
      line.attr('x1', fromPos.x).attr('y1', fromPos.y);
      line.attr('x2', toPos.x).attr('y2', toPos.y);

      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;

      text.attr('x', midX).attr('y', midY);
    });

    // Create the renderer and render the graph
    const renderer = Viva.Graph.View.renderer(graph, {
      graphicsType: 'svg',
      container: document.getElementById('graph-container'),
      graphics: graphics,
      layout: layout
    });

    renderer.run();
    return {graph, layout, graphics, renderer};
  }

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const nodeCount = 8;
    const minEdgeCount = 2;
    const maxEdgeCount = 3;
    const minWeight = 5;
    const maxWeight = 50;

    const newAlgoGraph = createAlgoGraph(nodeCount, minEdgeCount, maxEdgeCount, minWeight, maxWeight);

    const newVisualGraph = renderGraph(newAlgoGraph);
    setAlgoGraph(newAlgoGraph);
    setVisualGraph(newVisualGraph);

  }, []);

  function compareFn (a, b) {
    if (a.dist < b.dist) {
      return -1;
    }
    if (a.dist > b.dist) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

  function processSSSP () {
    setStartNode(3);
    SSSP();
  }

  function delay () {
    setTimeout(()=>{}, 3000);
  }

  function SSSP () {
    // setStartNode(3); // label on the visualization screen is 1 greater than this
    // setEndNode(5); // label on the visualization screen is 1 greater than this
    const { graph, graphics, layout, renderer } = visualGraph;
    const startNodeIdx = 3;
    const links = graph.getLinks(startNodeIdx);
    const node = graph.getNode(startNodeIdx);
    const nodeUI = graphics.getNodeUI(node.id)
    // console.log(nodeUI);
    const priorityQueue = [];
    const addNode = {node: startNodeIdx, dist: 0};
    priorityQueue.push(addNode) // {src, distFromStart}
    // console.log('priorityQueue', priorityQueue)
    const nodeCount = algoGraph.length;
    const processsed = Array(nodeCount).fill(false);
    const INF = 1000000;
    // console.log('nodecount', nodeCount)
    const dist = Array(nodeCount).fill(INF);
    // console.log('processed, dist', processsed, dist)
    dist[startNodeIdx] = 0;
    // console.log(algoGraph)

    function myLoop() {         //  create a loop function
      setTimeout(function() {   //  call a 3s setTimeout when the loop is called
        const top = priorityQueue.shift();
        const src = top.node;
        const nowDist = top.dist;
        console.log('src dist', src, nowDist)
        if (processsed[src]) return;
        processsed[src] = true;
        const nowNodeUI = graphics.getNodeUI(src);
        nowNodeUI.children[0].attr('fill', 'lightgreen');
        // graphics.refresh();
        console.log(nowNodeUI);
        for (const otherNode of algoGraph[src]) {
          const {nodeIdx, weight} = otherNode;
          // console.log('nodeIdx, weight, nowDist, nodeCount', nodeIdx, weight, nowDist, nodeCount)
          if (dist[src] + weight < dist[nodeIdx]) {
            dist[nodeIdx] = dist[src] + weight;
            priorityQueue.push({node: nodeIdx, dist: dist[nodeIdx]});
            // console.log('add elem', priorityQueue)
          }
        }
        priorityQueue.sort(compareFn);                  //  increment the counter
        if (priorityQueue.length > 0) {           //  if the counter < 10, call the loop function
          myLoop();             //  ..  again which will trigger another 
        }                       //  ..  setTimeout()
      }, 3000)
    }
    
    myLoop(); 

    // while (priorityQueue.length > 0) {
    //   // console.log('prorityQueue', priorityQueue)
    //   const top = priorityQueue.shift();
    //   const src = top.node;
    //   const nowDist = top.dist;
    //   console.log('src dist', src, nowDist)
    //   if (processsed[src]) continue;
    //   processsed[src] = true;
    //   const nowNodeUI = graphics.getNodeUI(src);
    //   nowNodeUI.children[0].attr('fill', 'lightgreen');
    //   // graphics.refresh();
    //   console.log(nowNodeUI);
    //   for (const otherNode of algoGraph[src]) {
    //     const {nodeIdx, weight} = otherNode;
    //     // console.log('nodeIdx, weight, nowDist, nodeCount', nodeIdx, weight, nowDist, nodeCount)
    //     if (dist[src] + weight < dist[nodeIdx]) {
    //       dist[nodeIdx] = dist[src] + weight;
    //       priorityQueue.push({node: nodeIdx, dist: dist[nodeIdx]});
    //       // console.log('add elem', priorityQueue)
    //     }
    //   }
    //   priorityQueue.sort(compareFn);
    // }
    console.log(dist);
  }

  return (
    <div className="disjkstra">
      <Header />
      <div className="dijkstraStage" id='graph-container'>

      </div>
      <button className="startSSSP" type='button' onClick={processSSSP}>Start SSSP</button>
    </div>
  )
}

export default Dijkstra