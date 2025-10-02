// src/services/teachers.ts
import { getAuthToken } from "@/contexts/AuthContext";

export interface TeacherRating {
  id: string;
  teacher: string;
  averageRating: number;
}

export interface Teacher {
  id: string;
  name: string;
  lastName: string;
  email?: string;
  role: string;
}

// 🔹 Obtener TODOS los profesores con su rating promedio
export async function getAllTeachersWithRatings(): Promise<TeacherRating[]> {
  const token = getAuthToken();
  if (!token) return [];

  // 1. Usuarios (profesores)
  const usersRes = await fetch("http://localhost:4000/api/v1/users?limit=1000", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const usersData = await usersRes.json();
  const users: any[] = Array.isArray(usersData?.data?.users) ? usersData.data.users : [];

  const teachers = users.filter((u) => u.role === "teacher");

  // 2. Subjects con ratings
  const ratingsRes = await fetch(
    "http://localhost:4000/api/v1/subjects/top-rated-classes?limit=1000",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const ratingsData = await ratingsRes.json();
  const subjects: any[] = Array.isArray(ratingsData?.data?.subjects)
    ? ratingsData.data.subjects
    : [];

  // 3. Agrupar ratings por profesor
  const ratingBuckets = new Map<string, number[]>();
  subjects.forEach((s: any) => {
    const teacherId = s.professor?._id || s.professor?.id;
    const rating = s.averageRating || 0;
    if (!teacherId) return;
    if (!ratingBuckets.has(teacherId)) ratingBuckets.set(teacherId, []);
    ratingBuckets.get(teacherId)!.push(rating);
  });

  // 4. Combinar teachers con ratings (0 si no aparece)
  return teachers.map((t: any) => {
    const ratings = ratingBuckets.get(t.id) || [];
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return {
      id: t.id,
      teacher: `${t.name} ${t.lastName || ""}`.trim(),
      averageRating: avg,
    };
  });
}

// 🔹 Obtener SOLO el top 5
export async function getTopTeachersByRating(): Promise<TeacherRating[]> {
  const all = await getAllTeachersWithRatings();
  return all.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);
}

// 🔹 Obtener info de un profesor por ID
export async function getTeacherById(id: string): Promise<Teacher> {
  const token = getAuthToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:4000/api/v1/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error obteniendo profesor");
  const data = await res.json();

  // ✅ ahora devolvemos el user correctamente
  const user = data?.data?.user || data?.data || {};
  return {
    id: user._id || user.id,
    name: user.name || "",
    lastName: user.lastName || "",
    email: user.email,
    role: user.role,
  };
}
