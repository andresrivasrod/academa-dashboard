// src/pages/AllTeachers.tsx
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { getAllTeachersWithRatings, TeacherRating } from "@/services/teachers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AllTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherRating[]>([]);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const res = await getAllTeachersWithRatings();
      // ⚡ Ordenar de mayor a menor rating
      const sorted = [...res].sort((a, b) => b.averageRating - a.averageRating);
      setTeachers(sorted);
    } catch (err) {
      console.error("Error cargando profesores:", err);
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar />
      <SidebarInset className="bg-gray-900 text-white min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Todos los Profesores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teachers.map((t, i) => (
                <div
                  key={t.id}
                  className="p-3 rounded bg-gray-900 border border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <Link
                      to={`/teachers/${t.id}/ratings`}
                      className="font-semibold text-blue-400 hover:underline"
                    >
                      {i + 1}. {t.teacher}
                    </Link>
                  </div>
                  <div className="text-yellow-400 font-bold text-lg">
                    ⭐ {t.averageRating.toFixed(1)}
                  </div>
                </div>
              ))}
              {teachers.length === 0 && (
                <div className="text-gray-400">No hay profesores registrados.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AllTeachers;
