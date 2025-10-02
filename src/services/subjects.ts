import { api } from "@/lib/api";

export interface Subject {
  id?: string;
  _id?: string;
  subject: string;
  category: string;
  description: string;
  numberOfClasses: number;
  professorId: string;
  professor?: { id?: string; _id?: string; name: string; lastName: string; email?: string };
  averageRating?: number;
  ratingCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Top clases (ordenadas en frontend)
export async function listTopRatedClasses(limit = 5) {
  const all = await listSubjects();
  return all
    .filter(c => typeof c.averageRating === "number")
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, limit);
}

// ✅ GET /subjects
export async function listSubjects() {
  const res = await api.get<{ status: string; data: { subjects: Subject[] } }>("/subjects");
  console.log("📥 [listSubjects] Respuesta cruda:", res);
  return res.data?.subjects || [];
}

// ✅ POST /subjects
export async function createSubject(payload: {
  subject: string;
  category: string;
  description: string;
  professorId: string;
}) {
  const body = {
    subject: payload.subject,
    category: payload.category,
    description: payload.description,
    professorId: payload.professorId,
    numberOfClasses: 0, // obligatorio para el backend
  };

  console.log("📤 [createSubject] Body final que se enviará:", body);

  const res = await api.post<{ status: string; data: { subject: Subject } }>("/subjects", body);

  console.log("✅ [createSubject] Respuesta cruda:", res);

  return res.data.subject;
}

// ✅ DELETE /subjects/:id
export async function deleteSubject(id: string) {
  console.log("🗑️ [deleteSubject] Eliminando subject con id:", id);
  return api.del<{ status: string }>(`/subjects/${id}`);
}
