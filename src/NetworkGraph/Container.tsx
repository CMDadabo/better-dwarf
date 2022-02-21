import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import NetworkGraph from "./NetworkGraph";
import GraphControls from "./GraphControls";
import readDwarves from "../api/readDwarves";
import { Citizen, HFLink, HFLinkType, Link, Node } from "../types";

export default function Container() {
  const [showNames, setShowNames] = useState(false);
  const [data, setData] = useState({ nodes: [], links: [] });

  const controlProps = {
    showNames,
    setShowNames,
  };

  const graphProps = {
    showNames,
    data,
  };

  useEffect(() => {
    readDwarves().then((res) => {
      const processedDwarves: { [id: number]: string } = {};
      const links: Link[] = [];
      const nodeDict: { [id: number]: Node } = {};

      res.forEach((d: Citizen) => {
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

      setData(onlyCitizensAndDeities);
    });
  }, []);

  return (
    <Grid container sx={{ p: 2 }}>
      <Grid xs={10}>
        <NetworkGraph {...graphProps} />
      </Grid>
      <Grid xs={2}>
        <GraphControls {...controlProps} />
      </Grid>
    </Grid>
  );
}
