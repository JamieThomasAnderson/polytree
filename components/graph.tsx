"use client";

import { Doc } from '@/convex/_generated/dataModel';
import useSize from '@react-hook/size';
import { useWindowSize } from '@react-hook/window-size';
import { useTheme } from 'next-themes';
import React, { useCallback, useEffect, useState } from 'react'

import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d'),
  { ssr: false }
);

interface GraphIdPageProps {
  target: any;
  nodes: Array<{ name: string, attr: Object, id: string, group: number }>;
  links: Array<{ source: string, target: string }>;
};

export const Graph = ({target, nodes, links}: GraphIdPageProps) => {

  const { theme, setTheme } = useTheme();
  const [width, height] = useSize(target);
  const [windowWidth, windowHeight] = useWindowSize();

  const [sourceCounts, setSourceCounts] = useState(new Map<string, number>());
  const [selectedNode, setSelectedNode] = useState(null);


  useEffect(() => {
    const newSourceCounts = new Map<string, number>();
    links.map((link: { source: string, target: string }) => {
      const count = newSourceCounts.get(link.source) || 0;
      newSourceCounts.set(link.source, count + 1);
    });
    setSourceCounts(newSourceCounts);
  }, [links]);

  const circle = (ctx: any, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  const nodePaint = useCallback(
    ({ name, x, y, size }: { name: string, x: number, y: number, size: number}, color: any, ctx: any, node: any, globalScale: number, sourceCounts: Map<string, number>) => {
      
      // NODE

      if (node === selectedNode) {
        null;
      }

      const nodeSize = sourceCounts.get(node.id) || 1; 

      if (node.group === -1) {
          ctx.fillStyle = `rgba(150, 230, 200, 1)`;  // search node colour
      }

      else {
        ctx.fillStyle = `rgba(173, 216, 230, 1)`;  // node colour
      }
      circle(ctx, x, y, 3 + Math.log(nodeSize));
      ctx.fill();

      // FONT

      const label = name;
      const fontSize = 14 / globalScale;
      const zoom = 7.0;

      ctx.font = `${fontSize}px Tahoma`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let fontOpacity = 0;
      if (globalScale > zoom && node.group >= 1) {
        fontOpacity = 1;
      }

      else if (node.group === -1) {
        fontOpacity = 1;
      }

      else {
        fontOpacity = 0;
      }

      ctx.fillStyle = `rgba(0, 0, 0, ${fontOpacity})`;  // node label colour
      ctx.fillText(label + "", x, y);

    },
    [selectedNode]
  );

    const AVOID_BOTTOM_SCROLLBAR = 10;
    const AVOID_SIDE_SCROLLBAR = 10;

  return (
    <ForceGraph2D
      width={width-AVOID_BOTTOM_SCROLLBAR}
      height={windowHeight-AVOID_SIDE_SCROLLBAR}
      // d3VelocityDecay={0.8}
      d3AlphaDecay={0.04}
      d3VelocityDecay={0.85}
      linkDirectionalArrowLength={2}
      graphData={{nodes: nodes, links: links}}
      linkColor={
        () => theme === 'dark'  ? 'white' : 
              theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
      }
      nodeCanvasObject={(node, ctx, globalScale) => {
        nodePaint(node as any, "red", ctx, node, globalScale, sourceCounts)
      }}   
      onNodeClick={() => {}}
    />
  );
};
