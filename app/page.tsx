"use client";

import { useState } from "react";
import { Fullscreen, Upload } from "lucide-react";
import { motion } from "framer-motion";

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
import ChartRenderer from "./chart-renderer";
import DataTable from "./data-table";
import { parseData } from "./utils";
import { ChartTypeSelector } from "./components/chart-type-selector";

// Add these container variants before the DataVizApp component
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

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
    const demoCSV = `month,revenue,units_sold,avg_price,customer_satisfaction,marketing_spend
January,125000,2800,44.64,4.2,15000
February,142000,3100,45.81,4.3,18000
March,168000,3600,46.67,4.4,22000
April,185000,3900,47.44,4.5,25000
May,210000,4300,48.84,4.3,28000
June,195000,4100,47.56,4.2,24000
July,178000,3800,46.84,4.4,20000
August,192000,4000,48.00,4.6,23000
September,225000,4600,48.91,4.5,30000
October,245000,4900,50.00,4.4,32000
November,268000,5200,51.54,4.3,35000
December,295000,5800,50.86,4.5,40000`;

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
    <main className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-6 max-w-7xl antialiased tracking-tight">
      <header className="mb-24">
        <h1 className="text-lg sm:text-xl mb-2 font-medium text-center">
          datatochart<span className="text-muted-foreground/50">.com</span>
        </h1>
      </header>

      <motion.div
        className="grid gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
              <CardDescription>
                Paste your data in CSV or JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full sm:w-auto">
                  <TabsTrigger value="csv" className="flex-1 sm:flex-none">
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="json" className="flex-1 sm:flex-none">
                    JSON
                  </TabsTrigger>
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

              {error && (
                <p className="text-destructive mt-2 text-sm">{error}</p>
              )}

              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={loadDemoData}
                  className="w-full sm:w-auto"
                >
                  Load Demo Data
                </Button>
                <Button onClick={handleDataSubmit} className="w-full sm:w-auto">
                  <Upload className="mr-2 h-4 w-4" />
                  Process Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {parsedData && parsedData.length > 0 && (
          <>
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Chart Options</CardTitle>
                  <CardDescription>
                    Select chart type and customize visualization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2">
                      Chart Type
                    </label>
                    <ChartTypeSelector
                      value={chartType}
                      onValueChange={(value) => setChartType(value as any)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Visualization</CardTitle>
                    <CardDescription>
                      Your data visualized as a chart
                    </CardDescription>
                  </div>
                  <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Fullscreen className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-0">
                      <DialogHeader className="p-4 sm:p-6">
                        <DialogTitle>Chart Visualization</DialogTitle>
                      </DialogHeader>
                      <div className="h-[calc(95vh-100px)] w-full p-4 sm:p-6">
                        <ChartRenderer
                          data={parsedData}
                          chartType={chartType}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="bg-transparent border-none shadow-none px-0">
                  <div className="h-[500px] w-full">
                    <ChartRenderer data={parsedData} chartType={chartType} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Data Preview</CardTitle>
                  <CardDescription>First 10 rows of your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto w-full">
                    <DataTable data={parsedData.slice(0, 10)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>
    </main>
  );
}
