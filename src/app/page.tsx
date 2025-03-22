import Link from "next/link";
import { VisualiseBubble, VisualiseBubbleProps } from "./comps/VisualiseBubble";
export enum GraphType {
  BAR = "bar",
  LINE = "line",
  RADIAL = "radial",
  AREA = "area",
  PIE = "pie",
}
export default function Page() {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80, tablet: 50 },
    { month: "February", desktop: 305, mobile: 200, tablet: 90 },
    { month: "March", desktop: 237, mobile: 120, tablet: 70 },
    { month: "April", desktop: 73, mobile: 190, tablet: 40 },
    { month: "May", desktop: 209, mobile: 130, tablet: 60 },
    { month: "June", desktop: 214, mobile: 140, tablet: 55 },
  ];

  const props: VisualiseBubbleProps = {
    graph: GraphType.BAR,
    chartData: chartData,
  };

  return (
    <div>
      <VisualiseBubble {...props} />
      <Link href="/playground">go</Link>
    </div>
  );
}
