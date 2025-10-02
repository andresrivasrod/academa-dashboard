// src/services/ratings.ts
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

export async function getRatingsByProfessor(professorId: string): Promise<Rating[]> {
  try {
    // 1. Obtener las clases del profesor
    const subsRes = await api.get<{ status: string; data: { subjects: any[] } }>(
      `/subjects`,
      { professor: professorId }
    );

    const subjects = subsRes.data?.subjects || [];

    // 2. Para cada clase, obtener ratings
    const allRatings: Rating[] = [];
    for (const s of subjects) {
      try {
        const res = await api.get<{ status: string; data: { ratings: Rating[] } }>(
          `/subjects/${s._id}/ratings`
        );
        if (Array.isArray(res.data?.ratings)) {
          allRatings.push(...res.data.ratings);
        }
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
