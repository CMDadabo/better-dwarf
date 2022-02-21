import React, { useEffect } from "react";
import * as d3 from "d3";

import ForceGraph from "./ForceGraph";
import { Link, Node } from "../types";

interface NetworkGraphProps {
  data: {
    nodes: Node[];
    links: Link[];
  };
  showNames: boolean;
}

export default function NetworkGraph({ data, showNames }: NetworkGraphProps) {
  function makeChart({ nodes, links }: { nodes: Node[]; links: Link[] }) {
    document.querySelector("#network-graph").replaceChildren(
      ForceGraph({ nodes, links }, {
        nodeId: (d: Node) => d.id,
        nodeTitle: (d: Node) =>
          `${d.name}${
            d.family_head_name ? `\nFamily Head: ${d.family_head_name}` : ""
          }`,
        nodeRadius: (d: Node) =>
          Math.sqrt(
            links.filter((l: Link) => l.source === d.id || l.target === d.id)
              .length
          ) * 3,
        nodeGroup: (d: Node) => d.family_head_id,
        linkStrokeWidth: (l: Link) => (l.strength / 100) * 2,
        linkStrength: 0.2,
        width: window.innerWidth,
        height: window.innerHeight,
        colors: (i: number) => d3.quantize(d3.interpolatePuOr, i),
        showNodeLabels: showNames,
      } as any)
    );
  }

  useEffect(() => {
    makeChart(data);
  }, [data, showNames]);

  return <div id="network-graph" />;
}
