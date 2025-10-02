import { api } from "@/lib/api";

export interface Rating {
  _id: string;
  subject: string;
  score: number;
  comment?: string;
  createdAt: string;
  student?: {
    _id: string;
    name: string;
    lastName: string;
  };
}

// 🔹 Obtener ratings de un subject específico
export async function getSubjectRatings(subjectId: string): Promise<Rating[]> {
  try {
    const res = await api.get<{ status: string; data: { ratings: Rating[] } }>(
      `/subjects/${subjectId}/ratings`
    );

    return Array.isArray(res.data?.ratings) ? res.data.ratings : [];
  } catch (err) {
    console.error(`Error en getSubjectRatings(${subjectId}):`, err);
    return [];
  }
}

// 🔹 Obtener todos los ratings de TODAS las clases de un profesor
export async function getRatingsByProfessor(professorId: string): Promise<Rating[]> {
  try {
    // 1. Obtener subjects del profesor
    const subsRes = await api.get<{ status: string; data: { subjects: any[] } }>(
      `/subjects`,
      { professor: professorId }
    );
    const subjects = subsRes.data?.subjects || [];

    // 2. Para cada subject, obtener ratings
    const allRatings: Rating[] = [];
    for (const s of subjects) {
      try {
        const ratings = await getSubjectRatings(s._id || s.id);
        allRatings.push(
          ...ratings.map((r) => ({
            ...r,
            subject: s.subject, // 🔑 agregamos nombre de la clase al rating
          }))
        );
      } catch (err) {
        console.error(`Error obteniendo ratings de la clase ${s._id}`, err);
      }
    }

    // 3. Ordenar por fecha descendente
    return allRatings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error("Error en getRatingsByProfessor:", err);
    return [];
  }
}
