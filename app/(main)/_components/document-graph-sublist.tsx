"use client";


import { Workflow } from "lucide-react";


import { ItemGraph } from "./item-graph";
import router from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

interface GraphSubListProps {
  graphId?: Id<"graphs">;
}

export const GraphSublist = () => {


  const router = useRouter();
  const graphs = useQuery(api.graphs.getSidebar)

  const onRedirectGraph = (graphId: string) => {
    router.push(`/workspace/graph/${graphId}`);
  };

  if (graphs === undefined) {
    return (
      <>
        <ItemGraph.Skeleton level={0} />
      </>
    );
  };
  return (
    <>
    {graphs.map((graph) => (
      <div key={graph._id}>
        <ItemGraph
          id={graph._id as Id<"graphs">}
          onClick={() => onRedirectGraph(graph._id)}
          label={graph.title}
          icon={Workflow}
        />
      </div>
    ))}
    </>
  )
}

