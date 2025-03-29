"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
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
    const demoCSV = `product,sales,month,category
iPhone 14,2450,January,Smartphones
Samsung S23,1850,January,Smartphones
MacBook Pro,980,January,Laptops
Dell XPS,720,January,Laptops
AirPods Pro,3200,January,Accessories
iPhone 14,2680,February,Smartphones
Samsung S23,2100,February,Smartphones
MacBook Pro,1150,February,Laptops
Dell XPS,840,February,Laptops
AirPods Pro,2900,February,Accessories
iPhone 14,2890,March,Smartphones
Samsung S23,2340,March,Smartphones
MacBook Pro,1280,March,Laptops
Dell XPS,960,March,Laptops
AirPods Pro,3400,March,Accessories`;

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
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
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
                <CardContent>
                  <div className="h-[300px] sm:h-[400px] w-full">
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
