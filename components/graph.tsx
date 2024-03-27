"use client";

import { Doc } from '@/convex/_generated/dataModel';
import useSize from '@react-hook/size';
import { useWindowSize } from '@react-hook/window-size';
import { useTheme } from 'next-themes';

import dynamic from 'next/dynamic';


const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d'),
  { ssr: false }
);

interface GraphIdPageProps {
  target: any;
  graph: Doc<"graphs">;
};

export const Graph = ({target, graph}: GraphIdPageProps) => {

  const { theme, setTheme } = useTheme();
  const [width, height] = useSize(target);
  const [windowWidth, windowHeight] = useWindowSize();


  const data = {
    "nodes": graph.nodes || [],
    "links": graph.links || []
  };

  return (
    <ForceGraph2D
      width={width}
      height={windowHeight}
      graphData={data || {}}
      linkColor={() => theme === 'dark' ? 'white' : theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'}
    />
  )
}