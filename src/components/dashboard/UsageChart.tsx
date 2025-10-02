import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { getViews } from "@/services/metrics";

interface Props {
  period: string;
}

const UsageChart: React.FC<Props> = ({ period }) => {
  const [data, setData] = useState<any[]>([]);
  const [raw, setRaw] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await getViews(period);
      setRaw(res);

      const buckets = new Map<string, number>();
      (res.data || []).forEach((row: any) => {
        const start = row.view_start || row.view_end;
        if (!start) return;
        const day = new Date(start).toISOString().slice(0, 10);
        buckets.set(day, (buckets.get(day) || 0) + 1);
      });

      const parsed = Array.from(buckets.entries())
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([date, views]) => ({ date, views }));

      setData(parsed);
    };
    load();
  }, [period]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Video Views</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#4F46E5" />
        </LineChart>
      </ResponsiveContainer>
      
    </div>
  );
};

export default UsageChart;
