import React, { useEffect, useRef, useState } from 'react'
import Viva from 'vivagraphjs';

import Header from './Header'
// import { useDispatch, useSelector } from 'react-redux';
// import { createGraph, addLink } from '../features/graph/graphSlice';

const Dijkstra = () => {
  const [totalNode, setTotalNode] = useState(-1)
  const [minEdgeCount, setMinEdgeCount] = useState(-1)
  const [maxEdgeCount, setMaxEdgeCount] = useState(-1)
  const [minWeight, setMinWeight] = useState(-1)
  const [maxWeight, setMaxWeight] = useState(-1)
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

  function isConnected (algoGraph, src, dest) {
    const otherList = algoGraph[src];
    for (let node of algoGraph) {
      if (node.nodeIdx === dest) return true;
    }
    return false;
  }

  function getAlgoGraph () {
    const newAlgoGraph = Array(totalNode);
    for (let i = 0; i < totalNode; i++) {
      newAlgoGraph[i] = [];
    }
    for (let nodeIdx = 0; nodeIdx < totalNode; nodeIdx++) {
      const nowList = newAlgoGraph[nodeIdx];
      while(nowList.length < minEdgeCount) {
        const otherNodeIdx = getRandomInt(totalNode);
        if (otherNodeIdx === nodeIdx || isConnected(newAlgoGraph, nodeIdx, otherNodeIdx)) continue;
        // console.log('nodeIdx, otherNodeIdx', nodeIdx, otherNodeIdx)
        const otherList = newAlgoGraph[otherNodeIdx];
        if (otherList.length >= maxEdgeCount || isConnected(newAlgoGraph, otherNodeIdx, nodeIdx)) continue;
        const nowWeight = getRandomArbitrary(minWeight, maxWeight + 1);
        console.log(nowWeight, minWeight, maxWeight);
        nowList.push({nodeIdx: otherNodeIdx, weight: nowWeight});
        otherList.push({nodeIdx: nodeIdx, weight: nowWeight});
      }
    }
    // console.log(newAlgoGraph);

    return newAlgoGraph;
  }

  function getNewVisualGraph(newAlgoGraph) {
    const graph = Viva.Graph.graph();
    const layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength: 200, // Set desired spring length here
      springCoeff: 0.0002,
      dragCoeff: 0.02,
      gravity: -1.2
    })

    const nodeCount = newAlgoGraph.length;

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
      const nowList = newAlgoGraph[nodeIdx];
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

  function getAndRenderVisualGraph(newAlgoGraph) {
    // Create an empty graph
    if (!visualGraph) return getNewVisualGraph(newAlgoGraph);

    const {graph, layout, graphics, renderer} = visualGraph;
    graph.clear();

    const nodeCount = newAlgoGraph.length;

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
      const nowList = newAlgoGraph[nodeIdx];
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

    return {graph, layout, graphics, renderer};

  }

  // useEffect(() => {
  //   if (isInitialized.current) return;
  //   isInitialized.current = true;

  //   const nodeCount = 8;
  //   const minEdgeCount = 2;
  //   const maxEdgeCount = 3;
  //   const minWeight = 5;
  //   const maxWeight = 50;

  //   const newAlgoGraph = createAlgoGraph(nodeCount, minEdgeCount, maxEdgeCount, minWeight, maxWeight);

  //   const newVisualGraph = renderGraph(newAlgoGraph);
  //   setAlgoGraph(newAlgoGraph);
  //   setVisualGraph(newVisualGraph);

  // }, []);

  function createAlgoAndVisualGraph (e) {
    e.preventDefault();

    const newAlgoGraph = getAlgoGraph();
    const newVisualGraph = getAndRenderVisualGraph(newAlgoGraph);
    
    setAlgoGraph(newAlgoGraph);
    setVisualGraph(newVisualGraph);
  }
  
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

  function reset (e) {
    e.preventDefault();
    const {graphics} = visualGraph;
    for (let i = 0; i < totalNode; i++) {
      const nodeUI = graphics.getNodeUI(i);
      // nodeUI.children[0].attr('')
      nodeUI.children[0].attr('fill', 'lightblue');
    }
  }

  function SSSP (e) {
    e.preventDefault();
    // setStartNode(3); // label on the visualization screen is 1 greater than this
    // setEndNode(5); // label on the visualization screen is 1 greater than this
    const { graph, graphics, layout, renderer } = visualGraph;
    console.log(visualGraph);
    const startNodeIdx = startNode-1;
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
        if (src === endNode-1) return;
        console.log('src', src)
        for (const otherNode of algoGraph[src]) {
          const {nodeIdx, weight} = otherNode;
          // console.log('nodeIdx, weight, nowDist, nodeCount', nodeIdx, weight, nowDist, nodeCount)
          if (dist[src] + weight < dist[nodeIdx]) {
            dist[nodeIdx] = dist[src] + weight;
            priorityQueue.push({node: nodeIdx, dist: dist[nodeIdx]});
            console.log('src, nodeIdx', src, nodeIdx)
            let link = graph.getLink(src, nodeIdx);
            if (!link) link = graph.getLink(nodeIdx, src);
            const linkId = link.id;
            console.log('linkId', linkId);
            const linkUI = graphics.getLinkUI(linkId);
            console.log('linkUI', linkUI);
            linkUI.children[0].attr('style', 'stroke: green; stroke-width: 3')
            // console.log('add elem', priorityQueue)
          }
        }
        priorityQueue.sort(compareFn);
        if (priorityQueue.length > 0) { 
          myLoop();
        }
      }, 5000)
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
      <div className="visualize">
        <div className="dijkstraStage" id='graph-container'>

        </div>
        <div className="configurator">
          <form className="createGraphForm" onSubmit={createAlgoAndVisualGraph}>
            <label className='formlabel'>Node Count</label>
            <input type="number" placeholder='Node Count' min='2' max='100' onChange={(e) => setTotalNode(parseInt(e.target.value, 10))}/>
            <label className='formlabel'>Minimum Edge Count</label>
            <input type="number" placeholder='Min Edge Count' min='1' max='99' onChange={(e) => setMinEdgeCount(parseInt(e.target.value, 10))}/>
            <label className='formlabel'>Maximum Edge Count</label>
            <input type="number" placeholder='Max Edge Count' min='1' max='99' onChange={(e) => setMaxEdgeCount(parseInt(e.target.value, 10))}/>
            <label className='formlabel'>Min Weight</label>
            <input type="number" placeholder='Min Weight' min='1' max='99' onChange={(e) => setMinWeight(parseInt(e.target.value, 10))}/>
            <label className='formlabel'>Max Weight</label>
            <input type="number" placeholder='Max Weight' min='1' max='99' onChange={(e) => setMaxWeight(parseInt(e.target.value, 10))}/>
            <button type='submit' className='button' disabled={totalNode===-1 || minEdgeCount===-1 || maxEdgeCount===-1 || minWeight===-1 || maxWeight===-1}>Create Graph</button>
            <button className='button' onClick={reset}>Reset</button>
          </form>

          <form className="startAndEndForm" onSubmit={SSSP}>
            <label className='formlabel'>Start Node</label>
            <input type="number" placeholder='Start Node' min='1' max={`${totalNode}`} onChange={(e) => setStartNode(parseInt(e.target.value, 10))}/>
            <label className='formlabel'>End Node</label>
            <input type="number" placeholder='End Node' min='1' max={`${totalNode}`} onChange={(e) => setEndNode(parseInt(e.target.value, 10))}/>
            <button type='submit' className='button' disabled={startNode===-1 || endNode===-1 || algoGraph===null || visualGraph===null}>Start Dijkstra</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Dijkstra