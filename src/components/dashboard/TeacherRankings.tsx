import { useEffect, useState } from "react";
import { getTopTeachersByRating, TeacherRating } from "@/services/teachers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TeacherRankings: React.FC<{ period: string }> = ({ period }) => {
  const [teachers, setTeachers] = useState<TeacherRating[]>([]);
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");
  const navigate = useNavigate();

  useEffect(() => {
    loadTopTeachers();
  }, [period]);

  const loadTopTeachers = async () => {
    const res = await getTopTeachersByRating();
    setTeachers(res);
  };

  return (
    <Card className="bg-[#1E2435] text-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Top 5 Teachers by Rating
          <div className="space-x-2">
            <Button
              variant={viewMode === "chart" ? "default" : "outline"}
              onClick={() => setViewMode("chart")}
            >
              Chart
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/teachers")}
            >
              View All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {viewMode === "chart" ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teachers}>
              <XAxis dataKey="teacher" stroke="#ccc" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageRating" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ul className="space-y-2">
            {teachers.map((t) => (
              <li key={t.id} className="flex justify-between">
                <span>{t.teacher}</span>
                <span>{t.averageRating.toFixed(2)} ⭐</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherRankings;
