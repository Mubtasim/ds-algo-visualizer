import React, { useEffect, useRef, useState } from 'react'
import Viva from 'vivagraphjs';

import Header from './Header'
// import { useDispatch, useSelector } from 'react-redux';
// import { createGraph, addLink } from '../features/graph/graphSlice';

const Dijkstra = () => {
  const isInitialized = useRef(false);
  const [algoGraph, setAlgoGraph] = useState(null)

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

  }

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const newAlgoGraph = createAlgoGraph(10, 2, 3, 5, 50);

    renderGraph(newAlgoGraph);

    setAlgoGraph(newAlgoGraph);


  }, []);

  return (
    <div className="disjkstra">
      <Header />
      <div className="dijkstraStage" id='graph-container'>

      </div>
    </div>
  )
}

export default Dijkstra