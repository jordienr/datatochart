"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { getCategoricalColumns, getDataKeys, getNumericColumns } from "./utils";

interface ChartRendererProps {
  data: any[];
  chartType: "bar" | "line" | "pie" | "area";
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-background p-3 shadow-md">
        <p className="mb-1 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div
            key={`tooltip-${index}`}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}: </span>
            <span className="font-medium">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

// Add this CSS class helper function if you don't already have it
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export default function ChartRenderer({ data, chartType }: ChartRendererProps) {
  const dataKeys = getDataKeys(data);
  const categoricalColumns = getCategoricalColumns(data);
  const numericColumns = getNumericColumns(data);

  const [xAxis, setXAxis] = useState<string>(
    categoricalColumns[0] || dataKeys[0]
  );
  const [selectedYAxes, setSelectedYAxes] = useState<string[]>([
    numericColumns[0] || dataKeys[1],
  ]);

  const chartConfig = useMemo(() => {
    const config: Record<string, any> = {};
    numericColumns.forEach((column, index) => {
      config[column] = {
        label: column,
        color: `hsl(var(--chart-${(index % 9) + 1}))`,
      };
    });
    return config;
  }, [numericColumns]);

  const handleYAxisToggle = (value: string) => {
    setSelectedYAxes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((y) => y !== value);
      }
      return [...prev, value];
    });
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 20, left: 20, bottom: 60 },
    };

    const ChartWrapper = ({ children }: { children: React.ReactNode }) => {
      return (
        <ChartContainer
          config={chartConfig}
          className="h-full bg-white rounded-lg"
        >
          {children}
        </ChartContainer>
      );
    };

    switch (chartType) {
      case "bar":
        return (
          <ChartWrapper>
            <BarChart {...commonProps}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxis}
                angle={-45}
                textAnchor="end"
                height={60}
                tickMargin={20}
                interval={0}
                minTickGap={50}
              />
              <YAxis width={60} />
              <Tooltip content={<CustomTooltip />} />
              {selectedYAxes.map((yAxis, index) => (
                <Bar
                  key={yAxis}
                  dataKey={yAxis}
                  fill={`hsl(var(--chart-${(index % 9) + 1}))`}
                  radius={4}
                  name={yAxis}
                />
              ))}
            </BarChart>
          </ChartWrapper>
        );
      case "line":
        return (
          <ChartWrapper>
            <LineChart {...commonProps}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxis}
                angle={-45}
                textAnchor="end"
                height={60}
                tickMargin={20}
                interval={0}
                minTickGap={50}
              />
              <YAxis width={60} />
              <Tooltip content={<CustomTooltip />} />
              {selectedYAxes.map((yAxis, index) => (
                <Line
                  key={yAxis}
                  type="monotone"
                  dataKey={yAxis}
                  stroke={`hsl(var(--chart-${(index % 9) + 1}))`}
                  strokeWidth={2}
                  name={yAxis}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ChartWrapper>
        );
      case "area":
        return (
          <ChartWrapper>
            <AreaChart {...commonProps}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxis}
                angle={-45}
                textAnchor="end"
                height={60}
                tickMargin={20}
                interval={0}
                minTickGap={50}
              />
              <YAxis width={60} />
              <Tooltip content={<CustomTooltip />} />
              {selectedYAxes.map((yAxis, index) => (
                <Area
                  key={yAxis}
                  type="monotone"
                  dataKey={yAxis}
                  stroke={`hsl(var(--chart-${(index % 9) + 1}))`}
                  fill={`hsl(var(--chart-${(index % 9) + 1}))`}
                  fillOpacity={0.3}
                  name={yAxis}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ChartWrapper>
        );
      case "pie":
        return (
          <ChartWrapper>
            <PieChart {...commonProps}>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey={selectedYAxes[0]}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(var(--chart-${(index % 9) + 1}))`}
                    name={entry[xAxis]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartWrapper>
        );
      default:
        return <div>Select a chart type</div>;
    }
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex flex-wrap gap-2 px-1">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">
            X-Axis{" "}
            <span className="text-muted-foreground text-xs">Category</span>
          </label>
          <div className="relative">
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background appearance-none pr-10"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
            >
              {dataKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2 h-4 w-4 opacity-50" />
          </div>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            Y-Axis{" "}
            <span className="text-muted-foreground text-xs">
              Values {chartType === "pie" && "(only first value used)"}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {numericColumns.map((key, index) => (
              <button
                key={key}
                onClick={() => handleYAxisToggle(key)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-all",
                  "border border-border",
                  "focus-visible:outline-none focus-visible:ring-none",
                  selectedYAxes.includes(key)
                    ? "bg-background text-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground  border-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: `hsl(var(--chart-${(index % 9) + 1}))`,
                    }}
                  />
                  {key}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-full max-h-[376px]">{renderChart()}</div>
    </div>
  );
}
