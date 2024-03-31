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

      const selectedNodeColour = "rgba(33, 41, 34, 1)";
      const normalNodeColour = "rgba(62, 98, 89, 1)";
      const whiteTextColour = "247, 255, 246";
      const blackTextColour = "0, 0, 0";
      const searchNodeColour = "rgba(1, 22, 56, 1)";

      const label = name;
      const fontSize = 14 / globalScale;
      const zoom = 7.0;
      const searchNodeGroup = -1;

      if (node === selectedNode) {
        ctx.fillStyle = selectedNodeColour;
      } else if (node.group === searchNodeGroup) {
        ctx.fillStyle = searchNodeColour;
      } else {
        ctx.fillStyle = normalNodeColour;
      }

      const nodeSize = sourceCounts.get(node.id) || 1; 

      circle(ctx, x, y, 3 + Math.log(nodeSize));
      ctx.fill();

      ctx.font = `${fontSize}px Tahoma`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let currentColor = theme === 'dark' ? whiteTextColour : blackTextColour;
      let fontOpacity = (globalScale > zoom && node.group !== searchNodeGroup) || node.group === searchNodeGroup ? 1 : 0;

      ctx.fillStyle = `rgba(${currentColor}, ${fontOpacity})`;
      ctx.fillText(label + "", x, y);

    },
    [selectedNode, theme]
  );

    const AVOID_BOTTOM_SCROLLBAR = 10;
    const AVOID_SIDE_SCROLLBAR = 10;

  return (
    <ForceGraph2D
      width={width-AVOID_BOTTOM_SCROLLBAR}
      height={windowHeight-AVOID_SIDE_SCROLLBAR}
      // d3VelocityDecay={0.8}
      // d3AlphaDecay={0.04}
      // d3VelocityDecay={0.85}
      graphData={{nodes: nodes, links: links}}
      linkColor={
        () => theme === 'dark'  ? 'white' : 
              theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
      }
      nodeCanvasObject={(node, ctx, globalScale) => {
        nodePaint(node as any, "red", ctx, node, globalScale, sourceCounts)
      }}   
      onNodeClick={(node) => {setSelectedNode(node as any)}}
    />
  );
};
