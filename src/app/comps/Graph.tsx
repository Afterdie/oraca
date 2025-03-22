import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  XAxis,
  CartesianGrid,
  AreaChart,
  BarChart,
  LineChart,
  Area,
  Bar,
  Line,
  LabelList,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Pie,
  PieChart,
} from "recharts";
import { RowData } from "@/utils/sqlEngine";

export interface GraphProps {
  chartData: RowData[]; // Fixed typo from "charData"
}

//this needs to get the right color somehow
const baseHSL = "hsl(30, 50%, 40%)";

const generateChartConfig = (data: RowData[]) => {
  if (data.length === 0) return { xKey: "", yKeys: [], config: {} };

  const keys = Object.keys(data[0]);
  const xKey = keys[0]; // first key is X-axis
  const yKeys = keys.slice(1); // remaining keys are Y-axis values

  const match = baseHSL.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
  if (!match) throw new Error("Invalid HSL format");

  let [_, h, s, l] = match.map(Number);

  const chartConfig = yKeys.reduce<
    Record<string, { label: string; color: string }>
  >((acc, key, index) => {
    const shadeOffset = (index - yKeys.length / 2) * 10; // Increase or decrease contrast
    const newL = Math.min(80, Math.max(20, l + shadeOffset)); // Clamp lightness

    acc[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: `hsl(${h}, ${s}%, ${newL}%)`,
    };

    return acc;
  }, {});

  return { xKey, yKeys, config: chartConfig };
};

const AreaGraph = ({ chartData }: GraphProps) => {
  const { xKey, yKeys, config } = generateChartConfig(chartData);

  return (
    <ChartContainer config={config}>
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        {yKeys.map((key) => (
          <Area
            key={key}
            dataKey={key}
            type="natural"
            fill={config[key]?.color}
            fillOpacity={0.4}
            stroke={config[key]?.color}
            stackId="a"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
};

const BarGraph = ({ chartData }: GraphProps) => {
  const { xKey, yKeys, config } = generateChartConfig(chartData);
  return (
    <ChartContainer config={config}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        {yKeys.map((key) => (
          <Bar key={key} dataKey={key} fill={config[key]?.color} radius={4} />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

const LineGraph = ({ chartData }: GraphProps) => {
  const { xKey, yKeys, config } = generateChartConfig(chartData);
  return (
    <ChartContainer config={config}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        {yKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="natural"
            stroke={config[key]?.color}
            strokeWidth={2}
            dot={{
              fill: config[key]?.color,
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        ))}
      </LineChart>
    </ChartContainer>
  );
};

const RadialGraph = ({ chartData }: GraphProps) => {
  const { xKey, yKeys, config } = generateChartConfig(chartData);
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadarChart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarAngleAxis dataKey={xKey} />
        <PolarGrid />
        {yKeys.map((key) => (
          <Radar dataKey={key} fill={config[key]?.color} fillOpacity={0.6} />
        ))}
      </RadarChart>
    </ChartContainer>
  );
};

const PieGraph = ({ chartData }: GraphProps) => {
  const addShadedColors = (data: RowData[]): RowData[] => {
    const match = baseHSL.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
    if (!match) throw new Error("Invalid HSL format");

    let [_, h, s, l] = match.map(Number);

    return data.map((entry, index) => {
      const shadeOffset = (index - data.length / 2) * 8; // Adjust for contrast
      const newL = Math.min(80, Math.max(20, l + shadeOffset)); // Clamp lightness

      return {
        ...entry,
        fill: `hsl(${h}, ${s}%, ${newL}%)`,
      };
    });
  };

  const { xKey, yKeys, config } = generateChartConfig(chartData);
  const processedData = addShadedColors(chartData);
  //need to process the data as well here
  return (
    <ChartContainer
      config={config}
      className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={processedData} dataKey={yKeys[0]} label nameKey={xKey} />
      </PieChart>
    </ChartContainer>
  );
};
export { AreaGraph, BarGraph, LineGraph, RadialGraph, PieGraph };
