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
  setNode: any;
};

interface NodePaintProps {
  
}

export const Graph = ({target, nodes, links, setNode}: GraphIdPageProps) => {

  const { theme, setTheme } = useTheme();
  const [width, height] = useSize(target);
  const [windowWidth, windowHeight] = useWindowSize();
  const [sourceCounts, setSourceCounts] = useState(new Map<string, number>());
  const [selectedNode, setSelectedNode] = useState(null);

  // options
  const [velocityDecay, setVelocityDecay] = useState(0.4);
  const [alphaDecay, setAlphaDecay] = useState(0.0228);
  const [alphaMin, setAlphaMin] = useState(0);
  const [selectedNodeColour, setSelectedNodeColour] = useState("rgba(33, 41, 34, 1)");
  const [paused, setPaused] = useState(false);
  const [colourStrength, setColourStrength] = useState(100);


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

  const nodeColour = (chunk: number, mode: string) => {
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
  

    const r = Math.floor(pseudoRandom(chunk + 1) * colourStrength);
    const g = Math.floor(pseudoRandom(chunk + 2) * colourStrength);
    const b = Math.floor(pseudoRandom(chunk + 3) * colourStrength);


    if (mode === 'select') {
      const darkenFactor = 0.5;
      const darkenedColor = `rgba(${Math.floor(r * darkenFactor)}, ${Math.floor(g * darkenFactor)}, ${Math.floor(b * darkenFactor)}, 1)`;
      return darkenedColor;
    }

    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  const nodePaint = useCallback(({ name, x, y, size }: { name: string, x: number, y: number, size: number}, color: any, ctx: any, node: any, globalScale: number, sourceCounts: Map<string, number>) => {
      // NODE
      const whiteTextColour = "247, 255, 246";
      const blackTextColour = "0, 0, 0";

      const label = name;
      const fontSize = 14 / globalScale;
      const zoom = 7.0;
      const searchNodeGroup = -1;
      const nodeSize = sourceCounts.get(node.id) || 1;
      

      if (selectedNode === node) {
        ctx.fillStyle = nodeColour(node.group, 'select');
      } else {
        ctx.fillStyle = nodeColour(node.group, 'none');
      }

      circle(ctx, x, y, 3 + Math.log(nodeSize));
      ctx.fill();

      if (node.name > 50) {
        node.name = node.name.substring(0, 50) + "...";
      }
      ctx.font = `bold ${fontSize}px Arial`;
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
      nodeAutoColorBy="group"
      d3VelocityDecay={velocityDecay}
      d3AlphaDecay={alphaDecay}
      d3AlphaMin={alphaMin}
      graphData={{nodes: nodes, links: links}}
      linkColor={
        () => theme === 'dark'  ? 'white' : 
              theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
      }
      nodeCanvasObject={(node, ctx, globalScale) => {
        nodePaint(node as any, "red", ctx, node, globalScale, sourceCounts)
      }}   
      onNodeClick={(node) => {setSelectedNode(node as any); setNode(node as any)}}
      onBackgroundClick={() => {setSelectedNode(null); setNode(null)}}
    />
  );
};
