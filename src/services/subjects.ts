import { api } from "@/lib/api";

export interface Subject {
  id?: string;
  _id?: string;
  subject: string;
  category: string;
  description: string;
  numberOfClasses: number;
  professorId: string;
  professor?: {
    id?: string;
    _id?: string;
    name: string;
    lastName: string;
    email?: string;
  };
  averageRating?: number;
  ratingCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 🔹 Top clases (usa listSubjects y ordena en frontend)
export async function listTopRatedClasses(limit = 5): Promise<Subject[]> {
  const all = await listSubjects();
  return all
    .filter((c) => typeof c.averageRating === "number")
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, limit);
}

// 🔹 GET /subjects (puede recibir filtros como category, professor, q, etc.)
export async function listSubjects(params?: {
  q?: string;
  category?: string;
  professor?: string;
  page?: number;
  limit?: number;
}): Promise<Subject[]> {
  const res = await api.get<{ status: string; data: { subjects: Subject[] } }>(
    "/subjects",
    params
  );

  console.log("📥 [listSubjects] Respuesta cruda:", res);

  return res?.data?.subjects || [];
}

// 🔹 POST /subjects (crear clase)
export async function createSubject(payload: {
  subject: string;
  category: string;
  description: string;
  professorId: string;
}): Promise<Subject> {
  const body = {
    subject: payload.subject,
    category: payload.category,
    description: payload.description,
    professorId: payload.professorId,
    numberOfClasses: 1, // ⚡ el backend NO acepta 0
  };

  console.log("📤 [createSubject] Body final que se enviará:", body);

  const res = await api.post<{ status: string; data: { subject: Subject } }>(
    "/subjects",
    body
  );

  console.log("✅ [createSubject] Respuesta cruda:", res);

  return res.data.subject;
}

// 🔹 DELETE /subjects/:id
export async function deleteSubject(id: string) {
  console.log("🗑️ [deleteSubject] Eliminando subject con id:", id);
  return api.del<{ status: string }>(`/subjects/${id}`);
}
