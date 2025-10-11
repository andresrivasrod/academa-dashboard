// src/components/TeacherRankings.tsx
import { useEffect, useState } from "react";
import { getTopTeachersByRating, TeacherRating } from "@/services/teachers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TeacherRankings: React.FC<{ period: string }> = ({ period }) => {
  const [teachers, setTeachers] = useState<TeacherRating[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopTeachers();
  }, [period]);

  const loadTopTeachers = async () => {
    const res = await getTopTeachersByRating();
    setTeachers(res);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Mejores Profesores Calificados</CardTitle>
        <Button size="sm" onClick={() => navigate("/teachers")}>
          Ver Todos
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {teachers.map((t, i) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-2 rounded bg-gray-900 border border-gray-700"
          >
            <span className="text-white font-medium">
              {i + 1}. {t.teacher}
            </span>
            <span className="text-yellow-400">⭐ {t.averageRating.toFixed(1)}</span>
          </div>
        ))}
        {teachers.length === 0 && <div className="text-gray-400">No se encontraron profesores.</div>}
      </CardContent>
    </Card>
  );
};

export default TeacherRankings;
