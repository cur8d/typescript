import { Card } from "@heroui/react";
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
    <Card className="p-6">
      <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
        <Card.Title className="text-sm font-medium">{title}</Card.Title>
      </Card.Header>
      <Card.Content className="p-0 pt-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 pt-1">
          {trend && <TrendIcon className={`h-4 w-4 ${trendColor}`} />}
          <span className={`text-xs ${trendColor}`}>
            {trendValue} {description}
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
