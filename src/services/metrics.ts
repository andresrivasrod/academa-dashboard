const MUX_BASE =
  import.meta.env.VITE_MUX_PROXY_URL || "http://localhost:4000";

// 🔹 Devuelve los "video-views" crudos desde el proxy
export async function getViews(period: string = "30d") {
  const res = await fetch(`${MUX_BASE}/metrics/views?period=${period}`);
  if (!res.ok) throw new Error("Error fetching views");
  return res.json();
}

// 🔹 Total de views en el periodo
export async function getTotalViews(period: string = "30d") {
  const data = await getViews(period);
  return data?.data?.length || 0;
}

// 🔹 Tiempo promedio de visualización en segundos
export async function getAverageWatchTime(period: string = "30d") {
  const data = await getViews(period);
  const views = data?.data || [];

  const durations: number[] = views
    .map((v: any) => {
      if (!v.view_start || !v.view_end) return null;
      const start = new Date(v.view_start).getTime();
      const end = new Date(v.view_end).getTime();
      return (end - start) / 1000; // segundos
    })
    .filter((d: number | null) => d !== null);

  if (durations.length === 0) return 0;

  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  return Math.round(avg);
}

// 🔹 Agrupar views por día (para gráficos)
export async function getViewsByPeriod(period: string = "30d") {
  const data = await getViews(period);
  const views = data?.data || [];

  const grouped: Record<string, number> = {};

  views.forEach((v: any) => {
    const day = v.view_start ? v.view_start.split("T")[0] : "unknown";
    grouped[day] = (grouped[day] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, count]) => ({
    date,
    count,
  }));
}
