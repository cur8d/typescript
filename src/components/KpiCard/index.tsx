import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function KpiCard({ title, value, description, trend, trendValue }: KpiCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      <div className="p-0 pt-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 pt-1">
          {trend && <TrendIcon className={`h-4 w-4 ${trendColor}`} />}
          <span className={`text-xs ${trendColor}`}>
            {trendValue} {description}
          </span>
        </div>
      </div>
    </div>
  );
}
