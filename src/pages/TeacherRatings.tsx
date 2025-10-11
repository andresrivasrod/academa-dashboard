// src/pages/TeacherRatings.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeacherById } from "@/services/teachers";
import { getSubjectRatings, Rating } from "@/services/ratings";
import { Subject, listSubjects } from "@/services/subjects";

interface CombinedRating extends Rating {
  subjectName?: string;
}

const TeacherRatings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [teacherName, setTeacherName] = useState<string>("Desconocido");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [ratings, setRatings] = useState<CombinedRating[]>([]);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (teacherId: string) => {
    try {
      // ✅ 1. Obtener info del profesor
      const teacher = await getTeacherById(teacherId);
      if (teacher) {
        setTeacherName(
          `${teacher.name || ""} ${teacher.lastName || ""}`.trim() || "Desconocido"
        );
      }

      // ✅ 2. Obtener subjects del profesor
      const allSubjects = await listSubjects({ professor: teacherId });
      setSubjects(allSubjects);

      // ✅ 3. Obtener ratings de cada subject
      let allRatings: CombinedRating[] = [];
      for (const subj of allSubjects) {
        try {
          const res = await getSubjectRatings(subj._id || subj.id!);
          const subjectRatings = res.map((r) => ({
            ...r,
            subjectName: subj.subject,
          }));
          allRatings = [...allRatings, ...subjectRatings];
        } catch (err) {
          console.error(`❌ Error obteniendo ratings de la clase ${subj._id}`, err);
        }
      }

      // ✅ 4. Ordenar ratings por fecha (descendente)
      const sorted = allRatings.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRatings(sorted);
    } catch (err) {
      console.error("❌ Error cargando datos del profesor:", err);
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
              <CardTitle>Comentarios al profesor {teacherName}</CardTitle>
              <p className="text-sm text-gray-400">
                Clases dictadas:{" "}
                {subjects.length > 0
                  ? subjects.map((s) => s.subject).join(", ")
                  : "Ninguna"}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {ratings.length === 0 ? (
                <div className="text-gray-400">No hay comentarios aún.</div>
              ) : (
                ratings.map((r) => (
                  <div
                    key={r._id}
                    className="p-3 rounded bg-gray-900 border border-gray-700 flex justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {r.subjectName || "Clase desconocida"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-gray-300 mt-1">
                        {r.comment || "Sin comentario"}
                      </p>
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      ⭐ {r.score}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherRatings;
