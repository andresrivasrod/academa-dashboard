
import { api } from "@/lib/api";

export type Role = "student" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface PaginatedUsers {
  users: User[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export async function listUsers(params?: { role?: Role; page?: number; limit?: number }) {
  const res = await api.get<{ status: string; data: PaginatedUsers }>("/users", params);
  return res.data;
}

export async function createUser(payload: { name: string; lastName: string; email: string; role: Role; password?: string; }) {
  const res = await api.post<{ status: string; data: User }>("/users", payload);
  return res.data;
}

export async function updateUser(id: string, payload: Partial<Pick<User, "name"|"lastName"|"role">>) {
  const res = await api.put<{ status: string; data: User }>(`/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: string) {
  const res = await api.del<{ status: string }>(`/users/${id}`);
  return res;
}
