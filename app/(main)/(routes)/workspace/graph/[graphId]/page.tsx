"use client";

import { Graph } from "@/components/graph";
import { NavbarGraph } from "@/app/(main)/_components/navbar-graph";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as React from 'react'


interface GraphIdPageProps {
  params: {
    graphId: Id<"graphs">;
  };
};

const GraphIdPage = ({
  params
}: GraphIdPageProps) => {

  const target = React.useRef(null);

  const graph = useQuery(api.graphs.getById, {
    graphId: params.graphId
  });
  const update = useMutation(api.graphs.update);

  const graphData = graph ?? {
    _id: "",
    _creationTime: 0,
    nodes: [],
    links: [],
    title: "",
    userId: ""
  };

  const onSearch = (query: string) => {
    update({
      id: graphData._id as Id<"graphs">,
      nodes: [
        {"id": "Myriel", "group": 1},
        {"id": "Napoleon", "group": 1},
        {"id": "Mlle.Baptistine", "group": 1}
      ],
      links: []
    })
  }
  
  console.log(graph);

  return (
    <>
      <NavbarGraph 
        onSearch={onSearch}
      />
      <div className="border-4 mx-auto" ref={target}>
        {!(graph==undefined) && (<Graph
          target={target}
          graph={graph as Doc<"graphs">}
        />)}
      </div>
    </>
  )
};

export default GraphIdPage;