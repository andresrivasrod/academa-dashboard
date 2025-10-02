import UsageChart from "./UsageChart";
import TotalViews from "./TotalViews";
import AverageWatchTime from "./AverageWatchTime";
import AverageViewsPerDay from "./AverageViewsPerDay";

interface Props {
  period: string;
}

const MetricsOverview: React.FC<Props> = ({ period }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* 🔹 Cards visuales arriba */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalViews period={period} />
        <AverageWatchTime period={period} />
        <AverageViewsPerDay period={period} />
      </div>

      {/* 🔹 Gráfico abajo */}
      <div>
        <UsageChart period={period} />
      </div>
    </div>
  );
};

export default MetricsOverview;
