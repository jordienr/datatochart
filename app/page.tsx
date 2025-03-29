"use client";

import { useState } from "react";
import { ChevronDown, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import ChartRenderer from "./chart-renderer";
import DataTable from "./data-table";
import { parseData } from "./utils";

export default function DataVizApp() {
  const [rawData, setRawData] = useState("");
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("csv");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "area">(
    "bar"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDataSubmit = () => {
    try {
      if (!rawData.trim()) {
        setError("Please enter some data");
        setParsedData(null);
        return;
      }

      const data = parseData(rawData, activeTab as "csv" | "json");
      setParsedData(data);
      setError(null);
    } catch (err) {
      setError(
        `Error parsing data: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setParsedData(null);
    }
  };

  const loadDemoData = () => {
    const demoCSV = `product,sales,month,category
Widget A,145,January,Electronics
Widget B,98,January,Home
Widget A,165,February,Electronics
Widget B,112,February,Home
Widget A,157,March,Electronics
Widget B,124,March,Home
Widget A,184,April,Electronics
Widget B,138,April,Home
Widget C,56,January,Office
Widget C,68,February,Office
Widget C,79,March,Office
Widget C,92,April,Office
Widget D,43,January,Garden
Widget D,51,February,Garden
Widget D,64,March,Garden
Widget D,75,April,Garden`;

    setRawData(demoCSV);
    setActiveTab("csv");

    // Process the data automatically
    try {
      const data = parseData(demoCSV, "csv");
      setParsedData(data);
      setError(null);
    } catch (err) {
      setError(
        `Error parsing data: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setParsedData(null);
    }
  };

  const chartOptions = [
    { value: "bar", label: "Bar Chart" },
    { value: "line", label: "Line Chart" },
    { value: "pie", label: "Pie Chart" },
    { value: "area", label: "Area Chart" },
  ];

  return (
    <main className="container mx-auto py-6 px-4 md:px-6 max-w-5xl antialiased tracking-tight">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl mb-2 font-medium">
            datatochart<span className="text-muted-foreground/50">.com</span>
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
            <CardDescription>
              Paste your data in CSV or JSON format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="csv">CSV</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="csv">
                <Textarea
                  placeholder="Paste your CSV data here (comma-separated values with header row)
Example:
name,value,category
Product A,42,Electronics
Product B,28,Clothing
Product C,15,Food"
                  className="min-h-[200px] font-mono text-sm"
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="json">
                <Textarea
                  placeholder='Paste your JSON data here (array of objects)
Example:
[
  { "name": "Product A", "value": 42, "category": "Electronics" },
  { "name": "Product B", "value": 28, "category": "Clothing" },
  { "name": "Product C", "value": 15, "category": "Food" }
]'
                  className="min-h-[200px] font-mono text-sm"
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                />
              </TabsContent>
            </Tabs>

            {error && <p className="text-destructive mt-2 text-sm">{error}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={loadDemoData}>
                Load Demo Data
              </Button>
              <Button onClick={handleDataSubmit}>
                <Upload className="mr-2 h-4 w-4" />
                Process Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {parsedData && parsedData.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Chart Options</CardTitle>
                <CardDescription>
                  Select chart type and customize visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium mb-2">
                      Chart Type
                    </label>
                    <div className="relative">
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background appearance-none pr-10"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value as any)}
                      >
                        {chartOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Visualization</CardTitle>
                  <CardDescription>
                    Your data visualized as a chart
                  </CardDescription>
                </div>
                <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                      Fullscreen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Chart Visualization</DialogTitle>
                    </DialogHeader>
                    <div className="h-[calc(90vh-100px)] w-full">
                      <ChartRenderer data={parsedData} chartType={chartType} />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ChartRenderer data={parsedData} chartType={chartType} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>First 10 rows of your data</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable data={parsedData.slice(0, 10)} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
