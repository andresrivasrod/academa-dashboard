import { useEffect, useState } from "react";

interface Props {
  period: string;
}

const IncidentTracker: React.FC<Props> = ({ period }) => {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    // 🔧 Aquí en vez de filtrar por "from/to", puedes filtrar según el periodo
    // Si tus incidentes son mock data locales:
    import("@/data/store").then((mod) => {
      let data = mod.incidents || [];

      if (period === "7d") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        data = data.filter((i: any) => new Date(i.date) >= cutoff);
      }
      if (period === "30d") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        data = data.filter((i: any) => new Date(i.date) >= cutoff);
      }
      // 24h
      if (period === "24h") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 1);
        data = data.filter((i: any) => new Date(i.date) >= cutoff);
      }

      setIncidents(data);
    });
  }, [period]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Incidents</h3>
      <ul>
        {incidents.map((i, idx) => (
          <li key={idx} className="flex justify-between border-b border-gray-700 py-1">
            <span>{i.title}</span>
            <span className="text-gray-400 text-sm">{i.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncidentTracker;
