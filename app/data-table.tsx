import { getDataKeys } from "./utils";

interface DataTableProps {
  data: any[];
}

export default function DataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  const keys = getDataKeys(data);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            {keys.map((key) => (
              <th key={key} className="px-4 py-2 text-left text-sm font-medium">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}
            >
              {keys.map((key) => (
                <td
                  key={`${rowIndex}-${key}`}
                  className="border-t px-4 py-2 text-sm"
                >
                  {row[key]?.toString() || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
