"use client";
import { RowData } from "@/utils/sqlEngine";

//graph imports
import { AreaGraph, BarGraph, LineGraph, RadialGraph, PieGraph } from "./Graph";

export interface VisualiseBubbleProps {
  graph: string;
  chartData: RowData[];
}
export const VisualiseBubble = ({ graph, chartData }: VisualiseBubbleProps) => {
  const props = { chartData };
  switch (graph) {
    case "area":
      return <AreaGraph {...props} />;
    case "bar":
      return <BarGraph {...props} />;
    case "line":
      return <LineGraph {...props} />;
    case "radial":
      return <RadialGraph {...props} />;
    case "pie":
      return <PieGraph {...props} />;
    default:
      return <div>Unsupported graph type</div>;
  }
};

export default VisualiseBubble;
