import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";

import { ipcRenderer } from "electron";

import ForceGraph from "./ForceGraph";
import { Citizen, HFLink, HFLinkType, Link, Node } from "./types";

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack'
);

function DwarfNetworkChart() {
  const [citizenData, setCitizenData] = useState([]);

  const nodeDict: { [id: number]: Node } = {};

  function makeChart({ nodes, links }: { nodes: Node[]; links: Link[] }) {
    document.querySelector("#chart").appendChild(
      ForceGraph({ nodes, links }, {
        nodeId: (d: Node) => d.id,
        nodeTitle: (d: Node) =>
          `${d.name}${
            d.family_head_name ? `\nFamily Head: ${d.family_head_name}` : ""
          }`,
        nodeRadius: (d: Node) => {
          if (nodeDict[d.id].is_deity) {
            return 10;
          } else {
            return (
              Math.sqrt(
                links.filter(
                  (l: Link) => l.source === d.id || l.target === d.id
                ).length
              ) * 3
            );
          }
        },
        nodeGroup: (d: Node) => d.family_head_id,
        linkStrokeWidth: (l: Link) => (l.strength / 100) * 2,
        width: window.innerWidth,
        height: window.innerHeight,
      } as any)
    );
  }

  function transformData(rawData: Citizen[]) {}

  useEffect(() => {
    (async () => {
      const raw_dwarves = await ipcRenderer.invoke("read-dwarves");

      console.log(raw_dwarves);

      const df_data = JSON.parse(raw_dwarves[1]).data;

      setCitizenData(df_data);

      console.log(df_data);

      const processedDwarves: { [id: number]: string } = {};

      const links: Link[] = [];

      df_data.forEach((d: Citizen) => {
        //   data.forEach((d) => {
        nodeDict[d.id] = {
          ...d,
        };

        d.all_hf_links.forEach((hf_link: HFLink) => {
          if (!processedDwarves[hf_link.id]) {
            links.push({
              source: d.id,
              target: hf_link.id,
              strength: hf_link.strength,
              type: hf_link.type,
            });

            if (!nodeDict[hf_link.id]) {
              nodeDict[hf_link.id] = {
                id: hf_link.id,
                name: hf_link.name,
                is_deity: hf_link.type === HFLinkType.Deity,
              };
            }
          }
        });

        processedDwarves[d.id] = "sure";
      });

      const nodes = Object.values(nodeDict);

      const onlyCitizensAndDeities = {
        nodes: nodes.filter((n) => processedDwarves[n.id] || n.is_deity),
        links: links.filter(
          (link) =>
            (processedDwarves[link.source] && processedDwarves[link.target]) ||
            link.type === HFLinkType.Deity
        ),
      };

      makeChart(onlyCitizensAndDeities);
    })();
  }, []);

  return (
    <>
      {/* <pre>{output}</pre> */}
      <div id="chart" />
    </>
  );
}

function render() {
  ReactDOM.render(
    <>
      <h2>Hello from React!</h2>
      <DwarfNetworkChart />
    </>,
    document.getElementById("react-app")
  );
}

document.addEventListener("DOMContentLoaded", render);
