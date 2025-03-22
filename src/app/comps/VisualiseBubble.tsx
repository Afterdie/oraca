"use client";
import { RowData } from "@/utils/sqlEngine";

//graph imports
import { AreaGraph, BarGraph, LineGraph, RadialGraph, PieGraph } from "./Graph";

import { GraphType } from "../page";

export interface VisualiseBubbleProps {
  graph: GraphType;
  chartData: RowData[];
}
export const VisualiseBubble = ({ graph, chartData }: VisualiseBubbleProps) => {
  const props = { chartData };
  switch (graph) {
    case GraphType.AREA:
      return <AreaGraph {...props} />;
    case GraphType.BAR:
      return <BarGraph {...props} />;
    case GraphType.LINE:
      return <LineGraph {...props} />;
    case GraphType.RADIAL:
      return <RadialGraph {...props} />;
    case GraphType.PIE:
      return <PieGraph {...props} />;
    default:
      return <div>Unsupported graph type</div>;
  }
};

export default VisualiseBubble;
