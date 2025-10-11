import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getViews } from "@/services/metrics";

interface Props {
  period: string;
}

const AverageWatchTime: React.FC<Props> = ({ period }) => {
  const [avgSeconds, setAvgSeconds] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await getViews(period);
      const data = res.data || [];

      let totalDuration = 0;
      let count = 0;

      data.forEach((row: any) => {
        if (row.view_start && row.view_end) {
          const start = new Date(row.view_start).getTime();
          const end = new Date(row.view_end).getTime();
          const diff = (end - start) / 1000; // segundos
          if (diff > 0) {
            totalDuration += diff;
            count++;
          }
        }
      });

      setAvgSeconds(count > 0 ? totalDuration / count : 0);
    };
    load();
  }, [period]);

  const minutes = Math.floor(avgSeconds / 60);
  const seconds = Math.floor(avgSeconds % 60);

  return (
    <div className="bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col items-center justify-center">
      <Clock className="text-green-400 mb-2" size={32} />
      <h3 className="text-sm font-medium text-gray-400">Tiempo promedio de visualización</h3>
      <p className="text-3xl font-bold text-green-400">
        {minutes}m {seconds}s
      </p>
    </div>
  );
};

export default AverageWatchTime;
