import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { getViews } from "@/services/metrics";

interface Props {
  period: string;
}

const TotalViews: React.FC<Props> = ({ period }) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await getViews(period);
      setTotal((res.data || []).length);
    };
    load();
  }, [period]);

  return (
    <div className="bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col items-center justify-center">
      <Eye className="text-indigo-400 mb-2" size={32} />
      <h3 className="text-sm font-medium text-gray-400">Total Views</h3>
      <p className="text-3xl font-bold text-indigo-400">{total}</p>
    </div>
  );
};

export default TotalViews;
