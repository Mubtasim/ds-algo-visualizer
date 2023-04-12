import React, { useEffect, useRef } from 'react'
import Viva from 'vivagraphjs';

import Header from './Header'

const Dijkstra = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    const graph = Viva.Graph.graph();
    graph.addLink(1,2);
    graph.addLink(3,4);
    // Add nodes and edges to the graph

    // Create a graphics object to render the graph in the container element
    const graphics = Viva.Graph.View.webglGraphics();
    const renderer = Viva.Graph.View.renderer(graph, {
      graphics: graphics,
      container: document.getElementById('graphContainer'),
      layout: Viva.Graph.Layout.forceDirected(graph, {
        springLength: 100,
        springCoeff: 0.0008,
        dragCoeff: 0.02,
        gravity: -1.2
      })
    });

    // Run the layout algorithm and start rendering the graph
    renderer.run();
  }, []);

  return (
    <div className="disjkstra">
      <Header />
      <div className="dijkstraStage" id='graphContainer'>
        {/* {
          grid.map((el, idx) => <Node key={idx} idx={idx}/>)
        } */}

      </div>
    </div>
  )
}

export default Dijkstra