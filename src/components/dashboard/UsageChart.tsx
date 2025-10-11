// src/components/UsageChart.tsx
import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { getViews } from "@/services/metrics";

interface Props {
  period: string;
}

const UsageChart: React.FC<Props> = ({ period }) => {
  const [data, setData] = useState<any[]>([]);
  const [raw, setRaw] = useState<any>(null);

  // 🔹 Genera rango completo de fechas
  const generateDateRange = (start: Date, end: Date): string[] => {
    const dates: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

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

      // 🔹 Detectar rango de fechas (usa timeframe si viene en respuesta)
      let startDate: Date;
      let endDate: Date;

      if (res.timeframe?.length === 2) {
        startDate = new Date(res.timeframe[0] * 1000);
        endDate = new Date(res.timeframe[1] * 1000);
      } else {
        const dates = Array.from(buckets.keys()).sort();
        startDate = new Date(dates[0]);
        endDate = new Date(dates[dates.length - 1]);
      }

      const allDates = generateDateRange(startDate, endDate);

      // 🔹 Construir dataset con todas las fechas
      const parsed = allDates.map((date) => ({
        date,
        views: buckets.get(date) || 0,
      }));

      setData(parsed);
    };
    load();
  }, [period]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Visualizaciones</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;
              const date = new Date(label);
              return (
                <div className="bg-gray-900 text-white p-2 rounded border border-gray-700">
                  <p className="text-sm font-semibold">
                     {date.toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p>{`Visualizaciones: ${payload[0].value}`}</p>
                </div>
              );
            }}
          />

          <Line type="monotone" dataKey="views" stroke="#4F46E5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
