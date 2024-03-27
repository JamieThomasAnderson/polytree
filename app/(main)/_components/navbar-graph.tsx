"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";


import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { TitleGraph } from "./title-graph";
import { Menu } from "./menu";
import { Search } from "./search";
import { useMediaQuery } from "usehooks-ts";

interface NavbarGraphProps {
  onSearch: (query: string) => void,
};

export const NavbarGraph = ({onSearch} : NavbarGraphProps) => {

  const isMobile = useMediaQuery("(max-width: 768px)");
  const params = useParams();

  const graph = useQuery(api.graphs.getById, {
    graphId: params.graphId as Id<"graphs">,
  });

  if (graph === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <TitleGraph.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (graph === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        <div className="flex items-center justify-between w-full">
          {!isMobile && (<TitleGraph initialData={graph}/>)}
          <div className="flex items-center gap-x-2">
          </div>
            <Search 
              onSearch={onSearch}
            />
         </div>
      </nav>
    </>
  )
}