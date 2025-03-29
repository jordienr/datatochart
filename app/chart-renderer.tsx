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

export default function ChartRenderer({ data, chartType }: ChartRendererProps) {
  const dataKeys = getDataKeys(data);
  const categoricalColumns = getCategoricalColumns(data);
  const numericColumns = getNumericColumns(data);

  const [xAxis, setXAxis] = useState<string>(
    categoricalColumns[0] || dataKeys[0]
  );
  const [yAxis, setYAxis] = useState<string>(numericColumns[0] || dataKeys[1]);

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

  const chartColor = `hsl(var(--chart-1))`;

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 20, left: 20, bottom: 60 },
    };

    switch (chartType) {
      case "bar":
        return (
          <ChartContainer config={chartConfig} className="h-full">
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
              <Bar dataKey={yAxis} fill={chartColor} radius={4} name={yAxis} />
            </BarChart>
          </ChartContainer>
        );
      case "line":
        return (
          <ChartContainer config={chartConfig} className="h-full">
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
              <Line
                type="monotone"
                dataKey={yAxis}
                stroke={chartColor}
                strokeWidth={2}
                name={yAxis}
                dot={{ r: 4, strokeWidth: 1 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        );
      case "pie":
        return (
          <ChartContainer config={chartConfig} className="h-full">
            <PieChart {...commonProps}>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey={yAxis}
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
          </ChartContainer>
        );
      case "area":
        return (
          <ChartContainer config={chartConfig} className="h-full">
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
              <Area
                type="monotone"
                dataKey={yAxis}
                stroke={chartColor}
                fill={chartColor}
                fillOpacity={0.3}
                name={yAxis}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
        );
      default:
        return <div>Select a chart type</div>;
    }
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">
            X-Axis / Category
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
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">
            Y-Axis / Value
          </label>
          <div className="relative">
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background appearance-none pr-10"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
            >
              {numericColumns.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2 h-4 w-4 opacity-50" />
          </div>
        </div>
      </div>
      <div className="h-[calc(100%-4rem)]">{renderChart()}</div>
    </div>
  );
}
