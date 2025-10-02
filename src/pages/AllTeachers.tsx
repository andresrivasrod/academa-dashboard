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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#1A1F2C]">
        <Sidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Card className="bg-[#1E2435] text-white">
              <CardHeader>
                <CardTitle>Todos los Profesores y su Rating</CardTitle>
              </CardHeader>
              <CardContent>
                {teachers.length === 0 ? (
                  <p className="text-gray-400">No hay profesores registrados.</p>
                ) : (
                  <ul className="space-y-3">
                    {teachers.map((t) => (
                      <li
                        key={t.id}
                        className="flex justify-between border-b border-gray-700 pb-2"
                      >
                        <Link
                          to={`/teachers/${t.id}/ratings`}
                          className="text-blue-400 hover:underline"
                        >
                          {t.teacher}
                        </Link>
                        <span>{t.averageRating.toFixed(2)} ⭐</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AllTeachers;
