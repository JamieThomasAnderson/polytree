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

  const graph = useQuery(api.graphs.getById, {
    graphId: params.graphId
  });
  const append = useMutation(api.graphs.append);

  const graphData = graph ?? {
    _id: "",
    _creationTime: 0,
    nodes: [],
    links: [],
    title: "",
    userId: ""
  };

  const onSearch = async (query: string) => {

    if (query == "") {
      return;
    }

    const searchNodeID = uuidv4();
    const searchNode = [
      {
        "name": query, 
        "id": searchNodeID, 
        "group": -1,
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


    const results = await new Promise(resolve => setTimeout(() => resolve(callScholarAPI(query)), 1000))
    const { articles } = results as { articles: any[] };

    const nodeIDs = getNodeIDs(articles);
    const nodes = getNodes(articles, nodeIDs);
    const links = getLinks(articles, searchNodeID, nodeIDs);


    append({
      id: graphData._id as Id<"graphs">,
      nodes: searchNode,
      links: [],
    });

    append({
      id: graphData._id as Id<"graphs">,
      nodes: nodes,
      links: links,
    });
  }
  
  return (
    <>
      <div>
        {!(graph===undefined) && ( 
        <Sidebar 
          onSearch={onSearch}
          articles={graph.nodes as Array<{ name: string, attr: Object, id: string, group: number }>}  
        />)}
      </div>

      <div className="border-4 mx-auto" ref={target}>
        {!(graph==undefined) && (
        <Graph
          target={target}
          nodes={graph.nodes as Array<{ name: string, attr: Object, id: string, group: number }>}
          links={graph.links as Array<{ source: string, target: string }>}
        />)}
      </div>
    </>
  )
};

export default GraphIdPage;