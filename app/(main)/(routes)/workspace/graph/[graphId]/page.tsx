"use client";

import { Graph } from "@/components/graph";
import { Sidebar } from "@/app/(main)/_components/sidebar";

import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { callScholarAPI } from "@/lib/api";
import crypto from 'crypto';
import * as React from 'react'

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

    append({
      id: graphData._id as Id<"graphs">,
      nodes: searchNode,
      links: [],
    });


    const results = await new Promise(resolve => setTimeout(() => resolve(callScholarAPI(query)), 1000))
    const { articles } = results as { articles: any[] };

    const nodeIDs = articles.map(({ title }: { title: string }) => {
      const nodeID = hash(title);
      return nodeID;
    });

    const nodes = articles.map((
    {
      title,
      article,
      authors,
      authorProfile,
      publication,
      excerpt,
      access,
      citedBy,
      citationCount,
      relatedArticles,
      versionHistory

    }: {
      title: string
      article: string
      authors: Array<string>
      authorProfile: string,
      publication: Array<string>,
      excerpt: string,
      access: string,
      citedBy: number,
      citationCount: number,
      relatedArticles: string,
      versionHistory: string
    }, index: number) => {
      return {
      name: title,
      id: nodeIDs[index],
      group: 1,
      attr: {
        article: article,
        authors: authors,
        authorProfile: authorProfile,
        publication: publication,
        excerpt: excerpt,
        access: access,
        citedBy: citedBy,
        citationCount: citationCount,
        relatedArticles: relatedArticles,
        versionHistory: versionHistory
      }
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

  if (graph !== undefined)
    console.log(graph);
  
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