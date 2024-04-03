"use client";

import { Graph } from "@/components/graph";
import { Sidebar } from "@/app/(main)/_components/sidebar";

import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { callScholarAPI, getLinks, getNodeIDs, getNodes } from "@/lib/api";
import { v4 as uuidv4 } from 'uuid';
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

  const [chunk, setChunk] = React.useState(1);
  const [node, setNode] = React.useState(null);

  const graph = useQuery(api.graphs.getById, {
    graphId: params.graphId
  });
  const append = useMutation(api.graphs.append);
  const removeID = useMutation(api.graphs.removeID);

  const graphData = graph ?? {
    _id: "",
    _creationTime: 0,
    nodes: [],
    links: [],
    title: "",
    userId: ""
  };

  const onDelete = async (id: number) => {

    setNode(null);

    await removeID({
      id: graphData._id as Id<"graphs">,
      nodeID: id.toString()
    });

  }

  const onSearch = async (query: string) => {

    setChunk(Math.max(...(graphData.nodes ?? []).map(node => node.group)));

    if (query == "") {
      return;
    }

    const searchNodeID = uuidv4();
    const searchNode = [
      {
        "name": query, 
        "id": searchNodeID, 
        "group": chunk,
        "attr": {
          "article": "",
          "authors": [],
          "authorProfile": "",
          "publication": [],
          "excerpt": "",
          "access": "",
          "citedBy": 0,
          "citationCount": 0,
          "relatedArticles": "",
          "versionHistory": ""
        }
      }
    ];

    append({
      id: graphData._id as Id<"graphs">,
      nodes: searchNode,
      links: []
    })


    const results = await new Promise(resolve => setTimeout(() => resolve(callScholarAPI(query)), 1000))
    const { articles } = results as { articles: any[] };

    const nodeIDs = getNodeIDs(articles);
    const nodes = getNodes(articles, nodeIDs, chunk);
    const links = getLinks(articles, searchNodeID, nodeIDs);

    append({
      id: graphData._id as Id<"graphs">,
      nodes: nodes,
      links: links,
    });

    setChunk(chunk + 1);
  }
  
  return (
    <>
      <div>
        {!(graph===undefined) && ( 
        <Sidebar 
          onDelete={onDelete}
          onSearch={onSearch}
          articles={graph.nodes as Array<{ name: string, attr: Object, id: string, group: number }>}
          node={node}  
        />)}
      </div>

      <div className="border-4 mx-auto" ref={target}>
        {!(graph==undefined) && (
        <Graph
          target={target}
          nodes={graph.nodes as Array<{ name: string, attr: Object, id: string, group: number }>}
          links={graph.links as Array<{ source: string, target: string }>}
          setNode={setNode}
        />)}
      </div>
    </>
  )
};

export default GraphIdPage;