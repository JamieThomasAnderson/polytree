import Graph from 'react-graph-vis';
import React, { FC } from 'react';

interface NewGraphProps {
  graph: object;
}

export const NewGraph: FC<NewGraphProps> = ({ graph }) => {

  const options = {
      layout: {
        hierarchical: false
      },
      edges: {
        color: "red"
      },
      height: "500px"
    };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
      console.log(edges);
      console.log(nodes);
    }
  };

  return (
    <Graph 
      graph={{ nodes: graph.nodes, edges: graph.edges }}
      options={options}
      events={events}
    />
  )
}