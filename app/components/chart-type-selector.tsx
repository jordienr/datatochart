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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
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
              className="flex flex-col items-center text-center rounded-md border-2 border-muted bg-transparent p-3 sm:p-4 hover:bg-stone-100 transition-all hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Icon className="mb-2 h-5 w-5 sm:h-6 sm:w-6" />
              <div className="space-y-1">
                <div className="font-semibold text-sm sm:text-base">
                  {type.label}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
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
