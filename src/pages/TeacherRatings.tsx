// src/pages/TeacherRatings.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRatingsByProfessor, Rating } from "@/services/ratings";

const TeacherRatings: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // profesorId
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRatings(id);
    }
  }, [id]);

  const loadRatings = async (profId: string) => {
    setLoading(true);
    const res = await getRatingsByProfessor(profId);
    setRatings(res);
    setLoading(false);
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
                <CardTitle>Comentarios del Profesor</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-400">Cargando...</p>
                ) : ratings.length === 0 ? (
                  <p className="text-gray-400">Este profesor aún no tiene comentarios.</p>
                ) : (
                  <ul className="space-y-3">
                    {ratings.map((r) => (
                      <li
                        key={r._id}
                        className="border-b border-gray-700 pb-2"
                      >
                        <div className="text-sm text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()} • ⭐ {r.score}
                        </div>
                        {r.comment && (
                          <div className="text-white mt-1">{r.comment}</div>
                        )}
                        {!r.comment && (
                          <div className="text-gray-500 mt-1 italic">Sin comentario</div>
                        )}
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

export default TeacherRatings;
