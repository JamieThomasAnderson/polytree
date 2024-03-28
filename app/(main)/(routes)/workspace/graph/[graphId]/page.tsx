"use client";

import { Graph } from "@/components/graph";
import { Sidebar } from "@/app/(main)/_components/sidebar";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import crypto from 'crypto';
import * as React from 'react'

const URL = 'https://scholar-api2.p.rapidapi.com/search';

interface GraphIdPageProps {
  params: {
    graphId: Id<"graphs">;
  };
};

const hash = (str: string) => {
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

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

    const searchNodeID = hash(query);
    const searchNode = [{"name": query, "id": searchNodeID, "group": -1}];

    append({
      id: graphData._id as Id<"graphs">,
      nodes: searchNode,
      links: [],
    });

    const fullURL = `${URL}?q=${query}`;

    const callScholarAPI = async (query: string) => {
      try {
        const response = await fetch(
            fullURL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-rapidapi-key': '19cc737024msh60fef5315e88d61p19f58fjsn1e2192b5f5ce',
              'x-rapidapi-host': 'scholar-api2.p.rapidapi.com',
            }
          });
        
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        return await response.json();

      }

      catch (error) {
        return error;
      }
    }

    const results = await callScholarAPI(query);
    const { articles } = results;

    const nodeIDs = articles.map(({ title }: { title: string }) => {
      const nodeID = hash(title);
      return nodeID;
    });

    const nodes = articles.map(({ title }: { title: string }, index: number) => {
      return {
      name: title,
      id: nodeIDs[index],
      group: 1
      };
    });


    const links = articles.map(({ title }: { title: string }, index: number) => ({
      source: searchNodeID,
      target: nodeIDs[index],
      value: 1
    }));


    append({
      id: graphData._id as Id<"graphs">,
      nodes: nodes,
      links: links,
    });
  }

  ///

  
  ///

  
  return (
    <>
      <div>
        <Sidebar />
      </div>

      <div className="border-4 mx-auto" ref={target}>
        {!(graph==undefined) && (
        <Graph
          target={target}
          nodes={graph.nodes as Array<{ name: string, id: string, group: number }>}
          links={graph.links as Array<{ source: string, target: string }>}
        />)}
      </div>
    </>
  )
};

export default GraphIdPage;