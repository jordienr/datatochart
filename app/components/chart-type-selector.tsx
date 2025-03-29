import { BarChart2, LineChart, PieChart, AreaChart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ChartTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const chartTypes = [
  {
    value: "bar",
    label: "Bar Chart",
    icon: BarChart2,
    description: "Best for comparing quantities across categories",
  },
  {
    value: "line",
    label: "Line Chart",
    icon: LineChart,
    description: "Ideal for showing trends over time",
  },
  {
    value: "pie",
    label: "Pie Chart",
    icon: PieChart,
    description: "Perfect for showing proportions of a whole",
  },
  {
    value: "area",
    label: "Area Chart",
    icon: AreaChart,
    description: "Great for showing cumulative values over time",
  },
];

export function ChartTypeSelector({
  value,
  onValueChange,
}: ChartTypeSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      {chartTypes.map((type) => {
        const Icon = type.icon;
        return (
          <div key={type.value}>
            <RadioGroupItem
              value={type.value}
              id={type.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={type.value}
              className="flex flex-col justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-stone-100 transition-all hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Icon className="mb-2 h-6 w-6" />
              <div className="">
                <div className="font-semibold">{type.label}</div>
                <div className="text-sm text-muted-foreground">
                  {type.description}
                </div>
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
