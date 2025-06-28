import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { SectorAllocation } from "@/lib/analyticsData";

interface AllocationChartProps {
  data: SectorAllocation[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7300",
  "#00FF00",
  "#FF00FF",
];

const AllocationChart = ({ data }: AllocationChartProps) => {
  const formatTooltip = (value: any, name: any) => {
    return [`₹${value.toLocaleString()}`, `${name}`];
  };

  const formatLabel = (entry: any) => {
    return `${entry.sector} (${entry.percentage}%)`;
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          Portfolio Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={formatLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sector breakdown */}
        <div className="mt-6 space-y-3">
          {data.map((sector, index) => (
            <div
              key={sector.sector}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{sector.sector}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  ₹{sector.value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {sector.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationChart;
