
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

const StatsCard = ({ title, value, icon, trend, className, valueClassName }: StatsCardProps) => {
  return (
    <Card className={cn("bg-gray-800 border-gray-700", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-1">
          <span className={cn(valueClassName)}>{value}</span>
        </div>
        {trend && (
          <p className={`text-xs flex items-center gap-1 ${
            trend.isPositive ? "text-emerald-500" : "text-red-500"
          }`}>
            <span>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-400">vs last period</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
