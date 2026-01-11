import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ConceptGraph as ConceptGraphType } from '../types';

interface ConceptGraphProps {
  data: ConceptGraphType;
}

export const ConceptGraph: React.FC<ConceptGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 400;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height);

    // Prepare data copies to avoid mutating props
    const nodes = data.nodes.map(d => ({ ...d }));
    const links = data.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(nodes)
      .join("g");

    node.append("circle")
      .attr("r", 15)
      .attr("fill", (d) => d3.schemeTableau10[d.group % 10]);

    node.append("text")
      .text(d => d.id)
      .attr("x", 18)
      .attr("y", 5)
      .attr("fill", "#334155")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("stroke", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div ref={containerRef} className="w-full border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-sm">
      <div className="bg-white px-4 py-2 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Concept Map</h3>
      </div>
      <svg ref={svgRef} className="w-full h-[400px] cursor-grab active:cursor-grabbing"></svg>
    </div>
  );
};
