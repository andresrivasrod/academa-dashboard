import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { getViews } from "@/services/metrics";

interface Props {
  period: string;
}

const AverageViewsPerDay: React.FC<Props> = ({ period }) => {
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await getViews(period);
      const totalViews = (res.data || []).length;

      // Calcular días según el periodo
      let days = 1;
      if (period.endsWith("d")) {
        days = parseInt(period.replace("d", ""), 10);
      } else if (period.endsWith("h")) {
        const hours = parseInt(period.replace("h", ""), 10);
        days = Math.max(1, hours / 24);
      }

      setAvg(totalViews / days);
    };
    load();
  }, [period]);

  return (
    <div className="bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col items-center justify-center">
      <BarChart3 className="text-yellow-400 mb-2" size={32} />
      <h3 className="text-sm font-medium text-gray-400">Vistas por día</h3>
      <p className="text-3xl font-bold text-yellow-400">{avg.toFixed(1)}</p>
    </div>
  );
};

export default AverageViewsPerDay;
